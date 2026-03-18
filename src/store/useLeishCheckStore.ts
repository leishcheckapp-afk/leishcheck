import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData, QuestionAnswer, RiskResult, RiskLevel, AIAnalysis } from '@/types/leishcheck';
import { questions, MAX_SCORE } from '@/data/questions';
import { saveSession } from '@/lib/db';
import { CombinedRiskResult, calculateCombinedRisk } from '@/lib/combinedRisk';
import { PredictionResult } from '@/lib/modelManager';
import { saveDiagnosisLog } from '@/lib/syncManager';

interface LeishCheckState {
  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

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
  result: CombinedRiskResult | null;
  calculateResult: (aiPrediction?: PredictionResult) => CombinedRiskResult;

  // Reset
  resetTriagem: () => void;
}

function calculateQuestionnaireScore(answers: QuestionAnswer[]): number {
  return answers.reduce((sum, a) => {
    if (a.answer) return sum + questions[a.questionIndex].weight;
    return sum;
  }, 0);
}

function applyDarkClass(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useLeishCheckStore = create<LeishCheckState>()(
  persist(
    (set, get) => ({
      audioEnabled: false,
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          applyDarkClass(next);
          return { darkMode: next };
        }),

      consentGiven: false,
      consentDate: null,
      setConsent: (given) =>
        set({ consentGiven: given, consentDate: given ? new Date().toISOString() : null }),
      checkConsentValid: () => {
        const { consentGiven, consentDate } = get();
        if (!consentGiven || !consentDate) return false;
        const diff = Date.now() - new Date(consentDate).getTime();
        return diff < 90 * 24 * 60 * 60 * 1000;
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
      calculateResult: (aiPrediction?: PredictionResult) => {
        const state = get();
        const questionnaireScore = calculateQuestionnaireScore(state.answers);
        const result = calculateCombinedRisk(
          questionnaireScore,
          aiPrediction || null,
          !navigator.onLine,
          aiPrediction ? localStorage.getItem('leishcheck-model-version') : null
        );
        set({ result });

        // Save to new diagnosis_logs table
        saveDiagnosisLog(result, state.userData, state.answers).catch(console.error);

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
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          applyDarkClass(state.darkMode);
        }
      },
    }
  )
);
