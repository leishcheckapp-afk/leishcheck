import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { useEffect } from 'react';
import { BookOpen, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLeishCheck from '@/assets/logo-leishcheck.png';
import AnimatedPage from '@/components/AnimatedPage';

export default function Home() {
  const { audioEnabled, checkConsentValid } = useLeishCheckStore();
  const navigate = useNavigate();

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

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-sm">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
          <img src={logoLeishCheck} alt="Logo LeishCheck" className="h-full w-full object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-primary">LeishCheck</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Cuide da sua saúde.<br />Simples, rápido e gratuito.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Button
            onClick={handleStart}
            className="h-14 w-full rounded-2xl text-lg font-semibold shadow-md"
            aria-label="Iniciar triagem de leishmaniose"
          >
            🩺 Iniciar Triagem
          </Button>

          <Button
            onClick={() => navigate('/educacao')}
            variant="secondary"
            className="h-14 w-full rounded-2xl text-lg font-semibold"
            aria-label="Acessar material educativo"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            📚 Material Educativo
          </Button>

          <Button
            onClick={() => navigate('/historico')}
            variant="outline"
            className="h-14 w-full rounded-2xl text-lg font-semibold"
            aria-label="Ver histórico de triagens"
          >
            <History className="mr-2 h-5 w-5" />
            📋 Histórico
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Esta ferramenta não substitui consulta médica presencial.
        </p>
      </div>
    </AnimatedPage>
  );
}
