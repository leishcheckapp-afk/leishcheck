import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSessionById } from '@/lib/db';
import { questions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { FileDown, Check, X, ClipboardList } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import type { DbSession } from '@/lib/db';
import { useTranslation } from 'react-i18next';

const levelBadge = { low: 'bg-success/15 text-success border-success/30', medium: 'bg-warning/15 text-warning border-warning/30', high: 'bg-danger/15 text-danger border-danger/30' };

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<DbSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => { if (!id) return; getSessionById(Number(id)).then((s) => { setSession(s || null); setLoading(false); }).catch(() => setLoading(false)); }, [id]);

  if (loading) return <AnimatedPage className="gradient-bg flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></AnimatedPage>;
  if (!session) return <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4 gap-4"><p className="text-lg text-muted-foreground">{t('history.notFound')}</p><Button onClick={() => navigate('/historico')} variant="outline" className="rounded-2xl">{t('nav.back')}</Button></AnimatedPage>;

  const date = new Date(session.date);
  const badge = levelBadge[session.result.level as keyof typeof levelBadge] || levelBadge.low;

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader
          title={t('history.detailTitle')}
          subtitle={`${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
          icon={ClipboardList}
          backTo="/historico"
        />
        <div className="glass-card flex items-center gap-4 p-5">
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-bold ${badge.split(' ')[1]}`}>{session.result.percentage}%</span>
            <span className="text-xs text-muted-foreground">{t('result.riskLabel')}</span>
          </div>
          <div className="flex-1">
            <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${badge}`}>{session.result.title}</span>
            <p className="text-sm text-muted-foreground mt-1">{session.result.orientation}</p>
          </div>
        </div>
        {session.userData && (session.userData.age || session.userData.gender || session.userData.city) && (
          <div className="glass-card p-4">
            <h2 className="text-sm font-bold text-foreground mb-2">{t('history.patientData')}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {session.userData.age && <span className="rounded-full bg-muted px-3 py-1">{t('userData.age')}: {session.userData.age}</span>}
              {session.userData.gender && <span className="rounded-full bg-muted px-3 py-1">{t('userData.gender')}: {session.userData.gender}</span>}
              {session.userData.city && <span className="rounded-full bg-muted px-3 py-1">{session.userData.city}</span>}
              {session.userData.state && <span className="rounded-full bg-muted px-3 py-1">{session.userData.state}</span>}
            </div>
          </div>
        )}
        <div className="glass-card p-4">
          <h2 className="text-sm font-bold text-foreground mb-3">{t('history.answers')}</h2>
          <div className="flex flex-col">
            {questions.map((q, i) => {
              const answer = session.answers.find(a => a.questionIndex === i);
              const answered = answer?.answer;
              return (
                <div key={i} className={`flex items-center gap-3 py-3 px-2 rounded-lg ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${answered ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>{answered ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</div>
                  <p className="flex-1 text-sm text-card-foreground">{t(`questionnaire.q${i + 1}`)}</p>
                  <span className={`text-xs font-semibold ${answered ? 'text-success' : 'text-danger'}`}>{answered ? t('questionnaire.yes') : t('questionnaire.no')}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Button onClick={() => { import('@/lib/generatePDF').then(({ generateResultPDF }) => { generateResultPDF(session.result, session.answers, session.userData); }); }} variant="outline" className="glass-card h-14 w-full rounded-2xl text-lg font-semibold hover-lift">
          <FileDown className="mr-2 h-5 w-5" /> {t('result.downloadPDF')}
        </Button>
      </div>
    </AnimatedPage>
  );
}
