import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { questions } from '@/data/questions';
import { ArrowLeft, Check, X, Stethoscope } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

export default function Questionnaire() {
  const navigate = useNavigate();
  const { currentQuestion, answers, setAnswer, nextQuestion, prevQuestion, audioEnabled } = useLeishCheckStore();
  const prefersReduced = useReducedMotion();
  const { t } = useTranslation();

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers.find((a) => a.questionIndex === currentQuestion);
  const questionText = t(`questionnaire.q${currentQuestion + 1}`);

  useEffect(() => {
    if (audioEnabled) {
      speakText(`${t('questionnaire.audioPrefix', { number: currentQuestion + 1 })} ${questionText}`);
    }
  }, [currentQuestion, audioEnabled, questionText, t]);

  const handleAnswer = (answer: boolean) => {
    setAnswer(currentQuestion, answer);
    if (currentQuestion < questions.length - 1) nextQuestion();
    else navigate('/imagem');
  };

  const handleBack = () => { if (currentQuestion > 0) prevQuestion(); else navigate('/dados'); };
  const dur = prefersReduced ? 0 : 0.3;

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="glass-card flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover-lift" aria-label={t('nav.back')}>
              <ArrowLeft className="h-5 w-5 text-primary" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary shrink-0" />
                <h1 className="text-2xl font-bold text-gradient truncate">{t('questionnaire.title')}</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t('questionnaire.questionOf', { current: currentQuestion + 1, total: questions.length }) !== `questionnaire.questionOf`
                  ? t('questionnaire.questionOf', { current: currentQuestion + 1, total: questions.length })
                  : `${currentQuestion + 1} de ${questions.length}`}
              </p>
            </div>
          </div>
          <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          {/* Progress bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(152 56% 34%), hsl(152 38% 50%))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
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
            style={{ boxShadow: '0 16px 48px -12px hsl(152 56% 34% / 0.12)' }}
          >
            <div className="icon-circle h-16 w-16"><span className="text-3xl" role="img" aria-hidden="true">{q.icon}</span></div>
            <p className="text-xl font-semibold leading-relaxed text-card-foreground">{questionText}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          <motion.button
            onClick={() => handleAnswer(true)}
            className={`flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl text-xl font-bold transition-all ${currentAnswer?.answer === true ? 'bg-success text-success-foreground ring-4 ring-success/30 shadow-lg' : 'glass-card text-success hover:bg-success/10'}`}
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Check className="h-6 w-6" /> {t('questionnaire.yes')}
          </motion.button>
          <motion.button
            onClick={() => handleAnswer(false)}
            className={`flex h-16 flex-1 items-center justify-center gap-2 rounded-2xl text-xl font-bold transition-all ${currentAnswer?.answer === false ? 'bg-danger text-danger-foreground ring-4 ring-danger/30 shadow-lg' : 'glass-card text-danger hover:bg-danger/10'}`}
            whileTap={prefersReduced ? {} : { scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <X className="h-6 w-6" /> {t('questionnaire.no')}
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
}
