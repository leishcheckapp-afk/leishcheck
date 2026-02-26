import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Volume2, Shield, Bug, BookOpen } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

export default function Education() {
  const navigate = useNavigate();
  const { audioEnabled } = useLeishCheckStore();
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  useEffect(() => { if (audioEnabled) speakText(t('audio.education')); }, [audioEnabled, t]);
  const speakSection = (text: string) => { if (audioEnabled) speakText(text); };

  const phases = [
    { key: 'phase1', color: 'border-l-warning' },
    { key: 'phase2', color: 'border-l-danger' },
    { key: 'phase3', color: 'border-l-destructive' },
  ];

  const item = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };
  const container = { hidden: {}, show: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } } };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <motion.div className="w-full max-w-md flex flex-col gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader title={t('education.title')} icon={BookOpen} backTo="/" />
        </motion.div>

        <motion.div variants={item} className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="icon-circle h-10 w-10"><Bug className="h-5 w-5 text-primary" /></div><h2 className="text-lg font-bold text-foreground">{t('education.mosquitoTitle')}</h2></div>
            {audioEnabled && <button onClick={() => speakSection(`${t('education.mosquitoTitle')}. ${t('education.mosquitoText')}. ${t('education.preventionText')}`)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover-lift"><Volume2 className="h-5 w-5 text-primary" /></button>}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('education.mosquitoText')}</p>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div><p className="text-sm font-semibold text-foreground">{t('education.prevention')}</p><p className="mt-1 text-sm text-muted-foreground">{t('education.preventionText')}</p></div>
          </div>
        </motion.div>

        <motion.h2 variants={item} className="text-xl font-bold text-foreground">{t('education.phasesTitle')}</motion.h2>

        {phases.map((phase, i) => (
          <motion.div key={i} variants={item} className={`glass-card p-6 border-l-4 ${phase.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-primary-foreground" style={{ background: 'linear-gradient(135deg, hsl(152 56% 34%), hsl(152 38% 50%))' }}>{i + 1}</span>
                <h3 className="text-base font-semibold text-foreground">{t(`education.${phase.key}`)}</h3>
              </div>
              {audioEnabled && <button onClick={() => speakSection(`${t(`education.${phase.key}`)}. ${t(`education.${phase.key}Desc`)}`)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover-lift"><Volume2 className="h-5 w-5 text-primary" /></button>}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`education.${phase.key}Desc`)}</p>
          </motion.div>
        ))}

        <motion.div variants={item} className="glass-card flex items-center gap-3 p-4">
          <Shield className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm font-medium text-muted-foreground">{t('education.warning')}</p>
        </motion.div>

        <motion.div variants={item}>
          <button onClick={() => navigate('/')} className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold">{t('education.backHome')}</button>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
