import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { questions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Questionnaire() {
  const navigate = useNavigate();
  const { currentQuestion, answers, setAnswer, nextQuestion, prevQuestion, audioEnabled } = useLeishCheckStore();
  const prefersReduced = useReducedMotion();

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers.find((a) => a.questionIndex === currentQuestion);

  useEffect(() => {
    if (audioEnabled) {
      speakText(q.audioText);
    }
  }, [currentQuestion, audioEnabled, q.audioText]);

  const handleAnswer = (answer: boolean) => {
    setAnswer(currentQuestion, answer);
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      navigate('/imagem');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      prevQuestion();
    } else {
      navigate('/dados');
    }
  };

  const dur = prefersReduced ? 0 : 0.3;

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            aria-label="Voltar para a pergunta anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
            <Progress value={progress} className="mt-1 h-2" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={prefersReduced ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: -30 }}
            transition={{ duration: dur }}
            className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
          >
            <span className="text-5xl" role="img" aria-hidden="true">{q.icon}</span>
            <p className="text-xl font-semibold leading-relaxed text-card-foreground">
              {q.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          <Button
            onClick={() => handleAnswer(true)}
            className={`h-16 flex-1 rounded-2xl text-xl font-bold shadow-md transition-all ${
              currentAnswer?.answer === true ? 'ring-4 ring-primary/50' : ''
            }`}
            aria-label="Sim"
          >
            ✅ Sim
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            variant="secondary"
            className={`h-16 flex-1 rounded-2xl text-xl font-bold shadow-md transition-all ${
              currentAnswer?.answer === false ? 'ring-4 ring-primary/50' : ''
            }`}
            aria-label="Não"
          >
            ❌ Não
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
