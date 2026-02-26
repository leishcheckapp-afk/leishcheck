import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AnimatedPage from '@/components/AnimatedPage';

const CONSENT_TEXT = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

Ao continuar, você concorda voluntariamente em fornecer informações pessoais e de saúde para uso exclusivo nesta ferramenta de triagem de risco para Leishmaniose Tegumentar.

OS DADOS UTILIZADOS INCLUEM:
• Idade, gênero e localização geográfica aproximada;
• Respostas ao questionário de sinais e sintomas;
• Imagens opcionais de lesões cutâneas (capturadas pela câmera do dispositivo).

FINALIDADE:
Esses dados serão utilizados exclusivamente para calcular uma estimativa de risco de Leishmaniose Tegumentar e fornecer orientações preliminares de saúde. Esta ferramenta NÃO realiza diagnóstico médico.

PRIVACIDADE E SEGURANÇA:
• Os dados são armazenados APENAS localmente no seu dispositivo (IndexedDB/localStorage).
• Nenhum dado pessoal é enviado para servidores externos.
• As imagens capturadas permanecem exclusivamente no seu aparelho.
• Nenhum dado é compartilhado com terceiros.

SEUS DIREITOS (conforme a LGPD — Lei 13.709/2018):
• Você pode revogar este consentimento a qualquer momento nas configurações do aplicativo.
• Você pode solicitar a exclusão dos seus dados limpando os dados do aplicativo.
• Você tem direito ao acesso, correção e eliminação dos seus dados pessoais.

DECLARAÇÃO:
Declaro que li e compreendi as informações acima, e que aceito voluntariamente participar da triagem, ciente de que posso desistir a qualquer momento sem qualquer prejuízo.

IMPORTANTE:
• Este aplicativo é uma ferramenta auxiliar de triagem e NÃO substitui consulta médica presencial.
• Em caso de suspeita de leishmaniose, procure imediatamente uma Unidade Básica de Saúde (UBS).
• O tratamento para leishmaniose é gratuito pelo Sistema Único de Saúde (SUS).`;

export default function Consent() {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showDeclineMessage, setShowDeclineMessage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setConsent, audioEnabled } = useLeishCheckStore();

  useEffect(() => {
    if (audioEnabled) {
      speakText('Sua privacidade é importante. Por favor, leia o termo de consentimento abaixo e role até o final para continuar.');
    }
  }, [audioEnabled]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    if (atBottom) setScrolledToEnd(true);
  }, []);

  const handleAccept = () => {
    setConsent(true);
    navigate('/dados');
  };

  const handleDecline = () => {
    setShowDeclineMessage(true);
  };

  if (showDeclineMessage) {
    return (
      <AnimatedPage className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Entendemos sua decisão</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Sem o consentimento, não é possível realizar a triagem. Você pode voltar quando quiser.
          </p>
          <div className="flex w-full flex-col gap-3">
            <Button
              onClick={() => navigate('/')}
              className="h-14 w-full rounded-2xl text-lg font-semibold"
            >
              Voltar ao Início
            </Button>
            <Button
              onClick={() => setShowDeclineMessage(false)}
              variant="ghost"
              className="h-12 w-full rounded-2xl text-muted-foreground"
            >
              Reconsiderar
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-trust">
            <Shield className="h-8 w-8 text-trust-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sua privacidade é importante</h1>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-64 overflow-y-auto rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-card-foreground"
        >
          <pre className="whitespace-pre-wrap font-sans">{CONSENT_TEXT}</pre>
        </div>

        {!scrolledToEnd && (
          <p className="text-center text-xs text-muted-foreground">
            ↓ Role até o final para continuar
          </p>
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            disabled={!scrolledToEnd}
            className="mt-0.5 h-6 w-6"
            aria-label="Li e concordo com o termo de consentimento"
          />
          <label htmlFor="consent" className={`text-sm ${scrolledToEnd ? 'text-foreground' : 'text-muted-foreground'}`}>
            Li e concordo com o termo de consentimento
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAccept}
            disabled={!agreed}
            className="h-14 w-full rounded-2xl text-lg font-semibold"
          >
            Aceitar e Continuar
          </Button>
          <Button
            onClick={handleDecline}
            variant="ghost"
            className="h-12 w-full rounded-2xl text-muted-foreground"
          >
            Não aceito
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          ⚠️ Esta ferramenta não substitui consulta médica presencial.
        </p>
      </div>
    </AnimatedPage>
  );
}
