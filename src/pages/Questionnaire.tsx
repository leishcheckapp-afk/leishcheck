import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { questions } from '@/data/questions';
import { ArrowLeft, Check, X } from 'lucide-react';
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
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 hover-lift"
            aria-label="Voltar para a pergunta anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {currentQuestion + 1}
              </span>
              <span className="text-xs text-muted-foreground">{questions.length} perguntas</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(152 56% 34%), hsl(152 38% 50%))' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={prefersReduced ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: -30 }}
            transition={{ duration: dur }}
            className="glass-card flex flex-col items-center gap-6 p-8 text-center"
          >
            <div className="icon-circle h-16 w-16">
              <span className="text-3xl" role="img" aria-hidden="true">{q.icon}</span>
            </div>
            <p className="text-xl font-semibold leading-relaxed text-card-foreground">
              {q.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          <motion.button
            onClick={() => handleAnswer(true)}
            className={`flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl text-xl font-bold transition-colors ${
              currentAnswer?.answer === true
                ? 'bg-success text-success-foreground ring-4 ring-success/30'
                : 'glass-card text-success hover:bg-success/10'
            }`}
            aria-label="Sim"
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Check className="h-6 w-6" /> Sim
          </motion.button>
          <motion.button
            onClick={() => handleAnswer(false)}
            className={`flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl text-xl font-bold transition-colors ${
              currentAnswer?.answer === false
                ? 'bg-danger text-danger-foreground ring-4 ring-danger/30'
                : 'glass-card text-danger hover:bg-danger/10'
            }`}
            aria-label="Não"
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <X className="h-6 w-6" /> Não
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
}
