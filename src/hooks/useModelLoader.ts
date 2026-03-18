import { useState, useEffect } from 'react';
import { modelManager, ModelMetadata } from '@/lib/modelManager';

export interface ModelStatus {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  metadata: ModelMetadata | null;
  hasUpdate: boolean;
}

export function useModelLoader() {
  const [status, setStatus] = useState<ModelStatus>({
    isLoaded: false,
    isLoading: false,
    error: null,
    metadata: null,
    hasUpdate: false
  });

  // Carregar modelo ao montar componente
  useEffect(() => {
    loadModel();
    checkForUpdates();
  }, []);

  const loadModel = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await modelManager.loadModel();
      const metadata = modelManager.getMetadata();
      
      setStatus({
        isLoaded: true,
        isLoading: false,
        error: null,
        metadata,
        hasUpdate: false
      });
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  };

  const checkForUpdates = async () => {
    try {
      const hasUpdate = await modelManager.checkForUpdates();
      setStatus(prev => ({ ...prev, hasUpdate }));
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  };

  const updateModel = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await modelManager.updateModel();
      const metadata = modelManager.getMetadata();
      
      setStatus({
        isLoaded: true,
        isLoading: false,
        error: null,
        metadata,
        hasUpdate: false
      });
    } catch (error) {
      console.error('Erro ao atualizar modelo:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar'
      }));
    }
  };

  const clearCache = async () => {
    try {
      await modelManager.clearCache();
      setStatus({
        isLoaded: false,
        isLoading: false,
        error: null,
        metadata: null,
        hasUpdate: false
      });
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  };

  return {
    status,
    loadModel,
    updateModel,
    clearCache,
    checkForUpdates
  };
}
