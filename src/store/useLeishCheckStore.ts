import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData, QuestionAnswer, RiskResult, RiskLevel } from '@/types/leishcheck';
import { questions, MAX_SCORE } from '@/data/questions';
import { saveSession } from '@/lib/db';

interface LeishCheckState {
  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;

  // Consent
  consentGiven: boolean;
  consentDate: string | null;
  setConsent: (given: boolean) => void;
  checkConsentValid: () => boolean;

  // User data
  userData: UserData;
  setUserData: (data: UserData) => void;

  // Questionnaire
  currentQuestion: number;
  answers: QuestionAnswer[];
  setAnswer: (questionIndex: number, answer: boolean) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Image
  imageBase64: string | null;
  setImage: (base64: string | null) => void;

  // Result
  result: RiskResult | null;
  calculateResult: () => RiskResult;

  // Reset
  resetTriagem: () => void;
}

function calculateRisk(answers: QuestionAnswer[]): RiskResult {
  const score = answers.reduce((sum, a) => {
    if (a.answer) return sum + questions[a.questionIndex].weight;
    return sum;
  }, 0);

  const percentage = Math.round((score / MAX_SCORE) * 100);

  let level: RiskLevel;
  let title: string;
  let description: string;
  let orientation: string;

  if (percentage <= 30) {
    level = 'low';
    title = 'RISCO BAIXO';
    description = 'Sinais pouco sugestivos de leishmaniose cutânea.';
    orientation = 'Sinais pouco sugestivos. Monitorar. Procurar UBS se piorar.';
  } else if (percentage <= 60) {
    level = 'medium';
    title = 'RISCO MODERADO';
    description = 'Sinais moderados para leishmaniose cutânea.';
    orientation = 'Sinais moderados. Recomendado consulta médica breve.';
  } else {
    level = 'high';
    title = 'RISCO ELEVADO';
    description = 'Sinais fortemente sugestivos de leishmaniose cutânea.';
    orientation = 'Sinais fortemente sugestivos. Procure UBS urgentemente.';
  }

  return { score, percentage, level, title, description, orientation };
}

export const useLeishCheckStore = create<LeishCheckState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

      consentGiven: false,
      consentDate: null,
      setConsent: (given) =>
        set({ consentGiven: given, consentDate: given ? new Date().toISOString() : null }),
      checkConsentValid: () => {
        const { consentGiven, consentDate } = get();
        if (!consentGiven || !consentDate) return false;
        const diff = Date.now() - new Date(consentDate).getTime();
        return diff < 90 * 24 * 60 * 60 * 1000; // 90 days
      },

      userData: {},
      setUserData: (data) => set({ userData: data }),

      currentQuestion: 0,
      answers: [],
      setAnswer: (questionIndex, answer) =>
        set((s) => {
          const filtered = s.answers.filter((a) => a.questionIndex !== questionIndex);
          return { answers: [...filtered, { questionIndex, answer }] };
        }),
      goToQuestion: (index) => set({ currentQuestion: index }),
      nextQuestion: () => set((s) => ({ currentQuestion: Math.min(s.currentQuestion + 1, questions.length - 1) })),
      prevQuestion: () => set((s) => ({ currentQuestion: Math.max(s.currentQuestion - 1, 0) })),

      imageBase64: null,
      setImage: (base64) => set({ imageBase64: base64 }),

      result: null,
      calculateResult: () => {
        const state = get();
        const result = calculateRisk(state.answers);
        set({ result });

        // Persist session to IndexedDB
        saveSession({
          date: new Date().toISOString(),
          userData: state.userData,
          answers: state.answers,
          result,
          hasImage: !!state.imageBase64,
        }).catch(console.error);

        return result;
      },

      resetTriagem: () =>
        set({
          userData: {},
          currentQuestion: 0,
          answers: [],
          imageBase64: null,
          result: null,
        }),
    }),
    {
      name: 'leishcheck-storage',
      partialize: (state) => ({
        audioEnabled: state.audioEnabled,
        consentGiven: state.consentGiven,
        consentDate: state.consentDate,
      }),
    }
  )
);
