import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { useEffect } from 'react';
import { BookOpen, History, Stethoscope, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLeishCheck from '@/assets/logo-leishcheck.png';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { audioEnabled, checkConsentValid } = useLeishCheckStore();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const { t } = useTranslation();

  useEffect(() => {
    if (audioEnabled) speakText(t('audio.home'));
  }, [audioEnabled, t]);

  const handleStart = () => {
    if (checkConsentValid()) navigate('/dados');
    else navigate('/consentimento');
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: prefersReduced ? 0 : 0.12 } } };
  const item = { hidden: prefersReduced ? {} : { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div className="flex flex-col items-center gap-10 text-center max-w-sm" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="flex h-28 w-28 items-center justify-center rounded-3xl overflow-hidden glow-green">
          <img src={logoLeishCheck} alt="Logo LeishCheck" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-gradient">{t('app.name')}</h1>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">{t('app.version')}</span>
          <p className="mt-2 text-base tracking-wide text-muted-foreground whitespace-pre-line">{t('app.tagline')}</p>
        </motion.div>

        <motion.div variants={item} className="flex w-full flex-col gap-4">
          <motion.button onClick={handleStart} className="gradient-btn flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold" whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Stethoscope className="h-5 w-5" /> {t('nav.start')}
          </motion.button>
          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button onClick={() => navigate('/educacao')} variant="secondary" className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift">
              <BookOpen className="mr-2 h-5 w-5" /> {t('nav.education')}
            </Button>
          </motion.div>
          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button onClick={() => navigate('/historico')} variant="outline" className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift">
              <History className="mr-2 h-5 w-5" /> {t('nav.history')}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <p>{t('app.disclaimer')}</p>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
