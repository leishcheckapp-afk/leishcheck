import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

interface SessionRecord {
  id?: number;
  date: string;
  userData: any;
  answers: any[];
  result: { percentage: number; level: string; title: string };
  hasImage: boolean;
}

const levelColors = {
  low: 'bg-success/10 text-success border-success/30',
  medium: 'bg-warning/10 text-warning border-warning/30',
  high: 'bg-danger/10 text-danger border-danger/30',
};

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data as SessionRecord[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Histórico de Triagens</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma triagem realizada ainda</p>
            <Button onClick={() => navigate('/consentimento')} className="rounded-2xl">
              Iniciar Triagem
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((s) => {
              const date = new Date(s.date);
              const colors = levelColors[s.result.level as keyof typeof levelColors] || levelColors.low;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${colors}`}>
                    <span className="text-lg font-bold">{s.result.percentage}%</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{s.result.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
