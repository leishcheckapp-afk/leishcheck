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

  const container = { hidden: {}, show: { transition: { staggerChildren: prefersReduced ? 0 : 0.1 } } };
  const item = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 24, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div className="flex flex-col items-center gap-10 text-center max-w-sm" variants={container} initial="hidden" animate="show">
        <motion.div
          variants={item}
          className="relative flex h-32 w-32 items-center justify-center rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 0 40px hsl(152 56% 34% / 0.3), 0 0 80px hsl(152 56% 34% / 0.1)' }}
        >
          <img src={logoLeishCheck} alt="Logo LeishCheck" className="h-full w-full object-cover" />
          <div className="absolute inset-0 rounded-3xl ring-2 ring-primary/20" />
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-bold text-gradient tracking-tight">{t('app.name')}</h1>
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-medium text-primary/70">{t('app.version')}</span>
          <p className="mt-1 text-base leading-relaxed text-muted-foreground whitespace-pre-line max-w-[280px]">{t('app.tagline')}</p>
        </motion.div>

        <motion.div variants={item} className="flex w-full flex-col gap-3">
          <motion.button
            onClick={handleStart}
            className="gradient-btn flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold"
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
          >
            <Stethoscope className="h-5 w-5" /> {t('nav.start')}
          </motion.button>
          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button onClick={() => navigate('/educacao')} variant="secondary" className="glass-card h-13 w-full rounded-2xl text-base font-semibold border-border/30 hover-lift">
              <BookOpen className="mr-2 h-5 w-5" /> {t('nav.education')}
            </Button>
          </motion.div>
          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button onClick={() => navigate('/historico')} variant="outline" className="glass-card h-13 w-full rounded-2xl text-base font-semibold border-border/30 hover-lift">
              <History className="mr-2 h-5 w-5" /> {t('nav.history')}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <ShieldCheck className="h-3.5 w-3.5" />
          <p>{t('app.disclaimer')}</p>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
