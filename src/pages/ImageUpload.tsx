import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { Camera, Image, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';

export default function ImageUpload() {
  const navigate = useNavigate();
  const { setImage, imageBase64, calculateResult, audioEnabled } = useLeishCheckStore();
  const [preview, setPreview] = useState<string | null>(imageBase64);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => { if (audioEnabled) speakText(t('audio.imageUpload')); }, [audioEnabled, t]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { const b = reader.result as string; setPreview(b); setImage(b); };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader title={t('imageUpload.title')} subtitle={t('imageUpload.description')} icon={Camera} backTo="/questionario" />
        {preview ? (
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl glow-green"><img src={preview} alt="Lesion photo" className="w-full object-cover" style={{ maxHeight: 300 }} /></div>
            <div className="flex gap-3">
              <button onClick={() => { calculateResult(); navigate('/resultado'); }} className="gradient-btn h-14 flex-1 rounded-2xl text-lg font-semibold">{t('imageUpload.usePhoto')}</button>
              <Button onClick={() => { setPreview(null); setImage(null); }} variant="secondary" className="glass-card h-14 flex-1 rounded-2xl text-lg font-semibold hover-lift">{t('imageUpload.retake')}</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button onClick={() => cameraInputRef.current?.click()} className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10 hover:border-primary/50">
              <div className="icon-circle h-14 w-14"><Camera className="h-7 w-7 text-primary" /></div>
              <span className="text-sm font-medium text-primary">{t('imageUpload.takePhoto')}</span>
            </button>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="glass-card h-14 w-full rounded-2xl text-lg font-semibold hover-lift"><Image className="mr-2 h-5 w-5" /> {t('imageUpload.chooseGallery')}</Button>
          </div>
        )}
        {!preview && (
          <Button onClick={() => { setImage(null); calculateResult(); navigate('/resultado'); }} variant="ghost" className="h-12 w-full rounded-2xl text-muted-foreground"><SkipForward className="mr-2 h-4 w-4" /> {t('imageUpload.skip')}</Button>
        )}
      </div>
    </AnimatedPage>
  );
}
