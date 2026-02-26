import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Shield, ChevronDown, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';

export default function Consent() {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDeclineMessage, setShowDeclineMessage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setConsent, audioEnabled } = useLeishCheckStore();
  const { t } = useTranslation();

  useEffect(() => { if (audioEnabled) speakText(t('audio.consent')); }, [audioEnabled, t]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) setScrolledToEnd(true);
  }, []);

  if (showDeclineMessage) {
    return (
      <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="glass-card w-full max-w-md flex flex-col items-center gap-6 p-8 text-center">
          <div className="icon-circle h-20 w-20"><HeartHandshake className="h-10 w-10 text-primary" /></div>
          <h2 className="text-xl font-bold text-foreground">{t('consent.declineTitle')}</h2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('consent.declineMessage')}</p>
          <div className="flex w-full flex-col gap-3">
            <button onClick={() => navigate('/')} className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold">{t('consent.backHome')}</button>
            <Button onClick={() => setShowDeclineMessage(false)} variant="ghost" className="h-12 w-full rounded-2xl text-muted-foreground">{t('consent.reconsider')}</Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        <PageHeader title={t('consent.title')} subtitle={t('consent.subtitle') !== 'consent.subtitle' ? t('consent.subtitle') : undefined} icon={Shield} backTo="/" />
        <div ref={scrollRef} onScroll={handleScroll} className="glass-card h-64 overflow-y-auto p-5 text-sm leading-relaxed text-card-foreground">
          <pre className="whitespace-pre-wrap font-sans">{t('consent.term')}</pre>
        </div>
        {!scrolledToEnd && (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <p className="text-xs">{t('consent.scrollHint')}</p>
            <ChevronDown className="h-5 w-5 animate-bounce-down" />
          </div>
        )}
        <div className="flex items-start gap-3 glass-card p-4">
          <Checkbox id="consent" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} disabled={!scrolledToEnd} className="mt-0.5 h-6 w-6" />
          <label htmlFor="consent" className={`text-sm font-medium ${scrolledToEnd ? 'text-foreground' : 'text-muted-foreground'}`}>{t('consent.checkbox')}</label>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => { setConsent(true); navigate('/dados'); }} disabled={!agreed} className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none">{t('consent.accept')}</button>
          <Button onClick={() => setShowDeclineMessage(true)} variant="ghost" className="h-12 w-full rounded-2xl text-muted-foreground">{t('consent.decline')}</Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" /><p>{t('app.disclaimer')}</p>
        </div>
      </div>
    </AnimatedPage>
  );
}
