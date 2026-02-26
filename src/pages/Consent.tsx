import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AnimatedPage from '@/components/AnimatedPage';

const CONSENT_TEXT = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

Esta ferramenta, denominada LeishCheck, é um aplicativo de triagem de risco para Leishmaniose Cutânea, desenvolvido exclusivamente para fins educativos e de orientação preliminar.

IMPORTANTE: O LeishCheck NÃO realiza diagnóstico médico. Os resultados apresentados são baseados em um questionário de avaliação de risco e não substituem, em hipótese alguma, a avaliação presencial por um profissional de saúde qualificado.

COLETA DE DADOS:
• As informações fornecidas (idade, gênero, localização e respostas ao questionário) são armazenadas APENAS no seu dispositivo (localStorage).
• Nenhum dado pessoal é enviado para servidores externos.
• As imagens capturadas permanecem exclusivamente no seu aparelho.

SEUS DIREITOS (conforme a LGPD - Lei 13.709/2018):
• Você pode revogar este consentimento a qualquer momento.
• Você pode solicitar a exclusão dos seus dados limpando os dados do aplicativo.
• Seus dados não são compartilhados com terceiros.

LIMITAÇÕES:
• Este aplicativo é uma ferramenta auxiliar de triagem e não substitui consulta médica.
• Em caso de suspeita de leishmaniose, procure imediatamente uma Unidade Básica de Saúde (UBS).
• O tratamento para leishmaniose é gratuito pelo Sistema Único de Saúde (SUS).

Ao aceitar este termo, você declara que compreendeu as informações acima e consente com o uso dos seus dados conforme descrito.`;

export default function Consent() {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
    navigate('/');
  };

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
