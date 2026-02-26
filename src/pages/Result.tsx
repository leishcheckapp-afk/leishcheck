import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Button } from '@/components/ui/button';
import { MapPin, BookOpen, RotateCcw } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

export default function Result() {
  const navigate = useNavigate();
  const { result, resetTriagem, audioEnabled } = useLeishCheckStore();

  useEffect(() => {
    if (result && audioEnabled) {
      speakText(`Resultado: ${result.title}. ${result.description}. ${result.orientation}`);
    }
  }, [result, audioEnabled]);

  if (!result) {
    navigate('/');
    return null;
  }

  const colorMap = {
    low: { ring: 'border-success', bg: 'bg-success', text: 'text-success' },
    medium: { ring: 'border-warning', bg: 'bg-warning', text: 'text-warning' },
    high: { ring: 'border-danger', bg: 'bg-danger', text: 'text-danger' },
  };
  const colors = colorMap[result.level];

  const handleRetry = () => {
    resetTriagem();
    navigate('/');
  };

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Score circle */}
        <div className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 ${colors.ring} bg-card shadow-lg`}>
          <span className={`text-4xl font-bold ${colors.text}`}>{result.percentage}%</span>
          <span className="text-xs text-muted-foreground">de risco</span>
        </div>

        <h1 className={`text-2xl font-bold ${colors.text}`}>{result.title}</h1>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-base leading-relaxed text-card-foreground">{result.description}</p>
          <hr className="my-4 border-border" />
          <p className="text-sm leading-relaxed text-muted-foreground">{result.orientation}</p>
        </div>

        <div className="flex w-full flex-col gap-3">
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
        </div>

        <div className="rounded-xl bg-warning/10 p-4 text-center">
          <p className="text-sm font-medium text-warning-foreground">
            ⚠️ Apenas um profissional de saúde pode confirmar o diagnóstico.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
