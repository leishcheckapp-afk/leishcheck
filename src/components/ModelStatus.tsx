import { useModelLoader } from '@/hooks/useModelLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Download, Loader2, Brain, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ModelStatus() {
  const { status, updateModel } = useModelLoader();
  const { t } = useTranslation();
  const isOnline = navigator.onLine;

  if (status.isLoading) {
    return (
      <Badge variant="outline" className="gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        {t('model.loading')}
      </Badge>
    );
  }

  if (status.error) {
    return (
      <Badge variant="destructive" className="gap-2">
        <AlertCircle className="h-3 w-3" />
        {t('model.error')}
      </Badge>
    );
  }

  if (!status.isLoaded) {
    return (
      <Badge variant="secondary" className="gap-2">
        <Brain className="h-3 w-3" />
        {t('model.notLoaded')}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Status Online/Offline */}
      <Badge variant={isOnline ? 'default' : 'secondary'} className="gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            {t('model.online')}
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            {t('model.offline')}
          </>
        )}
      </Badge>

      {/* Versão do Modelo */}
      {status.metadata && (
        <Badge variant="outline" className="gap-2">
          <Brain className="h-3 w-3" />
          v{status.metadata.version}
        </Badge>
      )}

      {/* Botão de Atualização */}
      {status.hasUpdate && isOnline && (
        <Button
          size="sm"
          variant="outline"
          onClick={updateModel}
          className="gap-2"
        >
          <Download className="h-3 w-3" />
          {t('model.update')}
        </Button>
      )}
    </div>
  );
}

export function ModelMetadataCard() {
  const { status } = useModelLoader();
  const { t } = useTranslation();

  if (!status.metadata) return null;

  const { metadata } = status;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{t('model.info.title')}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">{t('model.info.version')}</p>
          <p className="font-medium">v{metadata.version}</p>
        </div>

        <div>
          <p className="text-muted-foreground">{t('model.info.accuracy')}</p>
          <p className="font-medium">{(metadata.accuracy * 100).toFixed(1)}%</p>
        </div>

        <div>
          <p className="text-muted-foreground">{t('model.info.precision')}</p>
          <p className="font-medium">{(metadata.precision * 100).toFixed(1)}%</p>
        </div>

        <div>
          <p className="text-muted-foreground">{t('model.info.recall')}</p>
          <p className="font-medium">{(metadata.recall * 100).toFixed(1)}%</p>
        </div>

        <div className="col-span-2">
          <p className="text-muted-foreground">{t('model.info.trainedImages')}</p>
          <p className="font-medium">{metadata.totalImagesTrained.toLocaleString('pt-BR')}</p>
        </div>

        <div className="col-span-2">
          <p className="text-muted-foreground">{t('model.info.createdAt')}</p>
          <p className="font-medium">
            {new Date(metadata.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
