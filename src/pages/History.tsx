import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions } from '@/lib/db';
import { Clock, ChevronRight, Stethoscope } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from 'react-i18next';

interface SessionRecord { id?: number; date: string; userData: any; answers: any[]; result: { percentage: number; level: string; title: string }; hasImage: boolean; }

const levelStyles = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-danger/10 text-danger border-danger/20',
};

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  useEffect(() => { getSessions().then((d) => { setSessions(d as SessionRecord[]); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader title={t('history.title')} icon={Clock} backTo="/" />
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : sessions.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-4 py-12 text-center p-8">
            <div className="icon-circle h-20 w-20"><Clock className="h-10 w-10 text-primary" /></div>
            <p className="text-lg font-medium text-muted-foreground">{t('history.empty')}</p>
            <button onClick={() => navigate('/consentimento')} className="gradient-btn rounded-2xl px-8 py-3 text-base font-semibold"><Stethoscope className="mr-2 h-5 w-5 inline" /> {t('history.startNow')}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((s, i) => {
              const date = new Date(s.date);
              const styles = levelStyles[s.result.level as keyof typeof levelStyles] || levelStyles.low;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => navigate(`/historico/${s.id}`)}
                  className="glass-card flex w-full items-center gap-4 p-4 text-left hover-lift"
                  initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${styles}`}><span className="text-lg font-bold">{s.result.percentage}%</span></div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{s.result.title}</p>
                    <p className="text-xs text-muted-foreground">{date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
