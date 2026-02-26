import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Button } from '@/components/ui/button';
import { MapPin, BookOpen, RotateCcw } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

const CIRCLE_RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function Result() {
  const navigate = useNavigate();
  const { result, resetTriagem, audioEnabled } = useLeishCheckStore();
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (result && audioEnabled) {
      speakText(`Resultado: ${result.title}. ${result.description}. ${result.orientation}`);
    }
  }, [result, audioEnabled]);

  useEffect(() => {
    if (!result) return;
    let start = 0;
    const target = result.percentage;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setDisplayPercent(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [result]);

  if (!result) {
    navigate('/');
    return null;
  }

  const colorMap = {
    low: { stroke: 'hsl(var(--success))', text: 'text-success', bg: 'bg-success/10' },
    medium: { stroke: 'hsl(var(--warning))', text: 'text-warning', bg: 'bg-warning/10' },
    high: { stroke: 'hsl(var(--danger))', text: 'text-danger', bg: 'bg-danger/10' },
  };
  const colors = colorMap[result.level];
  const strokeDashoffset = CIRCUMFERENCE - (result.percentage / 100) * CIRCUMFERENCE;

  const handleRetry = () => {
    resetTriagem();
    navigate('/');
  };

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Animated Score Circle */}
        <div className="relative flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-4xl font-bold ${colors.text}`}>{displayPercent}%</span>
            <span className="text-xs text-muted-foreground">de risco</span>
          </div>
        </div>

        <motion.h1
          className={`text-2xl font-bold ${colors.text}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {result.title}
        </motion.h1>

        <motion.div
          className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <p className="text-base leading-relaxed text-card-foreground">{result.description}</p>
          <hr className="my-4 border-border" />
          <p className="text-sm leading-relaxed text-muted-foreground">{result.orientation}</p>
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={() => window.open('https://www.google.com/maps/search/UBS+perto+de+mim', '_blank')}
            className="h-14 w-full rounded-2xl text-lg font-semibold"
            aria-label="Ver unidade básica de saúde mais próxima"
          >
            <MapPin className="mr-2 h-5 w-5" /> 📍 Ver UBS mais próxima
          </Button>

          <Button
            onClick={() => navigate('/educacao')}
            variant="secondary"
            className="h-14 w-full rounded-2xl text-lg font-semibold"
            aria-label="Acessar material educativo"
          >
            <BookOpen className="mr-2 h-5 w-5" /> 📚 Saiba mais
          </Button>

          <Button
            onClick={handleRetry}
            variant="ghost"
            className="h-12 w-full rounded-2xl text-muted-foreground"
            aria-label="Refazer triagem"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> 🔄 Refazer Triagem
          </Button>
        </motion.div>

        <motion.div
          className="rounded-xl bg-warning/10 p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-sm font-medium text-warning-foreground">
            ⚠️ Apenas um profissional de saúde pode confirmar o diagnóstico.
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
