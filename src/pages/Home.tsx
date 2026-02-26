import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { useEffect } from 'react';
import { BookOpen, History, Stethoscope, ShieldCheck, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLeishCheck from '@/assets/logo-leishcheck.png';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Home() {
  const { audioEnabled, checkConsentValid, darkMode, toggleDarkMode } = useLeishCheckStore();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (audioEnabled) {
      speakText('Bem-vindo ao LeishCheck. Cuide da sua saúde. Simples, rápido e gratuito. Toque em Iniciar Triagem para começar.');
    }
  }, [audioEnabled]);

  const handleStart = () => {
    if (checkConsentValid()) {
      navigate('/dados');
    } else {
      navigate('/consentimento');
    }
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.12 },
    },
  };

  const item = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-6">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'hsl(var(--card) / 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {darkMode ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
      </button>

      <motion.div
        className="flex flex-col items-center gap-10 text-center max-w-sm"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="flex h-28 w-28 items-center justify-center rounded-3xl overflow-hidden glow-green">
          <img src={logoLeishCheck} alt="Logo LeishCheck" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-gradient">LeishCheck</h1>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">v1.0</span>
          <p className="mt-2 text-base tracking-wide text-muted-foreground">
            Cuide da sua saúde.<br />Simples, rápido e gratuito.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex w-full flex-col gap-4">
          <motion.button
            onClick={handleStart}
            className="gradient-btn flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-semibold"
            aria-label="Iniciar triagem de leishmaniose"
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
          >
            <Stethoscope className="h-5 w-5" />
            Iniciar Triagem
          </motion.button>

          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button
              onClick={() => navigate('/educacao')}
              variant="secondary"
              className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift"
              aria-label="Acessar material educativo"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Material Educativo
            </Button>
          </motion.div>

          <motion.div whileTap={prefersReduced ? {} : { scale: 0.97 }}>
            <Button
              onClick={() => navigate('/historico')}
              variant="outline"
              className="glass-card h-14 w-full rounded-2xl text-lg font-semibold border-border/30 hover-lift"
              aria-label="Ver histórico de triagens"
            >
              <History className="mr-2 h-5 w-5" />
              Histórico
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <p>Esta ferramenta não substitui consulta médica presencial.</p>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
