import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Camera, Image, SkipForward, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/AnimatedPage';

export default function ImageUpload() {
  const navigate = useNavigate();
  const { setImage, imageBase64, calculateResult, audioEnabled } = useLeishCheckStore();
  const [preview, setPreview] = useState<string | null>(imageBase64);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioEnabled) {
      speakText('Se desejar, tire uma foto da lesão ou selecione uma imagem da galeria. Você também pode pular esta etapa.');
    }
  }, [audioEnabled]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    calculateResult();
    navigate('/resultado');
  };

  const handleSkip = () => {
    setImage(null);
    calculateResult();
    navigate('/resultado');
  };

  const handleRetake = () => {
    setPreview(null);
    setImage(null);
  };

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Foto da Lesão</h1>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Camera className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Se possível, tire uma foto da ferida para melhor orientação. Este passo é opcional.
          </p>
        </div>

        {preview ? (
          <div className="flex flex-col gap-4">
            <img
              src={preview}
              alt="Foto da lesão capturada pelo usuário"
              className="w-full rounded-2xl border border-border object-cover shadow-sm"
              style={{ maxHeight: 300 }}
            />
            <div className="flex gap-3">
              <Button onClick={handleContinue} className="h-14 flex-1 rounded-2xl text-lg font-semibold">
                Usar esta foto
              </Button>
              <Button onClick={handleRetake} variant="secondary" className="h-14 flex-1 rounded-2xl text-lg font-semibold">
                Tirar outra
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="h-14 w-full rounded-2xl text-lg font-semibold"
              aria-label="Tirar foto com a câmera"
            >
              <Camera className="mr-2 h-5 w-5" /> Tirar Foto
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="h-14 w-full rounded-2xl text-lg font-semibold"
              aria-label="Selecionar foto da galeria"
            >
              <Image className="mr-2 h-5 w-5" /> Escolher da Galeria
            </Button>
          </div>
        )}

        {!preview && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="h-12 w-full rounded-2xl text-muted-foreground"
            aria-label="Pular etapa de envio de imagem"
          >
            <SkipForward className="mr-2 h-4 w-4" /> Pular esta etapa
          </Button>
        )}
      </div>
    </AnimatedPage>
  );
}
