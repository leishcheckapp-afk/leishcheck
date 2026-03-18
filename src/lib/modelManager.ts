import * as tf from '@tensorflow/tfjs';

const MODEL_STORAGE_KEY = 'leishcheck-model';
const MODEL_VERSION_KEY = 'leishcheck-model-version';
const MODEL_METADATA_KEY = 'leishcheck-model-metadata';

export interface ModelMetadata {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  totalImagesTrained: number;
  createdAt: string;
}

export interface PredictionResult {
  label: 'leishmaniose' | 'nao_leishmaniose';
  confidence: number;
  probabilities: {
    leishmaniose: number;
    nao_leishmaniose: number;
  };
  processingTimeMs: number;
}

export class ModelManager {
  private model: tf.GraphModel | null = null;
  private metadata: ModelMetadata | null = null;
  private isLoading = false;

  /**
   * Carrega o modelo TensorFlow.js
   * Prioridade: IndexedDB (cache local) → Supabase Storage (online)
   */
  async loadModel(): Promise<tf.GraphModel> {
    if (this.model) return this.model;
    if (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.loadModel();
    }

    this.isLoading = true;

    try {
      // 1. Tentar carregar do cache local (IndexedDB)
      try {
        console.log('🔍 Tentando carregar modelo do cache local...');
        this.model = await tf.loadGraphModel(`indexeddb://${MODEL_STORAGE_KEY}`);
        
        const metadataStr = localStorage.getItem(MODEL_METADATA_KEY);
        if (metadataStr) {
          this.metadata = JSON.parse(metadataStr);
        }
        
        console.log('✅ Modelo carregado do cache local');
        return this.model;
      } catch {
        console.log('⚠️ Modelo não encontrado no cache local');
      }

      // 2. Se online, baixar do Supabase Storage
      if (!navigator.onLine) {
        throw new Error('Modelo não disponível offline. Conecte-se à internet para baixar.');
      }

      console.log('🌐 Baixando modelo do Supabase...');
      const activeModel = await this.getActiveModelInfo();
      
      if (!activeModel) {
        throw new Error('Nenhum modelo ativo encontrado no Supabase');
      }

      const modelUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/leish-models/${activeModel.storage_path}`;
      
      console.log(`📥 Baixando modelo v${activeModel.version}...`);
      this.model = await tf.loadGraphModel(modelUrl);

      // GraphModel suporta save para IndexedDB
      try {
        await this.model.save(`indexeddb://${MODEL_STORAGE_KEY}`);
        console.log('💾 Modelo salvo no cache local');
      } catch (saveError) {
        // Cache falhou mas modelo está na memória — continua funcionando
        console.warn('⚠️ Não foi possível salvar no cache:', saveError);
      }
      
      localStorage.setItem(MODEL_VERSION_KEY, activeModel.version);
      
      this.metadata = {
        version: activeModel.version,
        accuracy: activeModel.accuracy,
        precision: activeModel.precision_leish,
        recall: activeModel.recall_leish,
        totalImagesTrained: activeModel.total_images_trained,
        createdAt: activeModel.created_at
      };
      localStorage.setItem(MODEL_METADATA_KEY, JSON.stringify(this.metadata));

      console.log('✅ Modelo baixado e salvo no cache');
      return this.model;

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Faz predição em uma imagem
   */
  async predict(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult> {
    const startTime = performance.now();

    if (!this.model) {
      await this.loadModel();
    }

    // Pré-processar imagem: [1, 224, 224, 3] normalizado [0, 1]
    const tensor = tf.browser
      .fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .div(255.0) as tf.Tensor4D;

    // GraphModel usa execute() — retorna tensor diretamente
    const prediction = this.model!.execute(tensor) as tf.Tensor;
    const probabilities = await prediction.data();
    
    tensor.dispose();
    prediction.dispose();

    const processingTimeMs = Math.round(performance.now() - startTime);

    // Output: [prob_leishmaniose, prob_nao_leishmaniose]
    const [probLeish, probNaoLeish] = Array.from(probabilities);

    return {
      label: probLeish > probNaoLeish ? 'leishmaniose' : 'nao_leishmaniose',
      confidence: Math.max(probLeish, probNaoLeish),
      probabilities: {
        leishmaniose: probLeish,
        nao_leishmaniose: probNaoLeish
      },
      processingTimeMs
    };
  }

  /**
   * Busca informações do modelo ativo no Supabase
   */
  private async getActiveModelInfo(): Promise<any> {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/model_versions?is_active=eq.true&select=*`,
      {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar informações do modelo');
    }

    const models = await response.json();
    return models[0] || null;
  }

  /**
   * Retorna metadados do modelo carregado
   */
  getMetadata(): ModelMetadata | null {
    return this.metadata;
  }

  /**
   * Verifica se há nova versão disponível
   */
  async checkForUpdates(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      const activeModel = await this.getActiveModelInfo();
      const currentVersion = localStorage.getItem(MODEL_VERSION_KEY);
      
      return activeModel && activeModel.version !== currentVersion;
    } catch {
      return false;
    }
  }

  /**
   * Limpa cache do modelo
   */
  async clearCache(): Promise<void> {
    try {
      await tf.io.removeModel(`indexeddb://${MODEL_STORAGE_KEY}`);
      localStorage.removeItem(MODEL_VERSION_KEY);
      localStorage.removeItem(MODEL_METADATA_KEY);
      this.model = null;
      this.metadata = null;
      console.log('✅ Cache do modelo limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  /**
   * Força download de nova versão
   */
  async updateModel(): Promise<void> {
    await this.clearCache();
    await this.loadModel();
  }
}

// Singleton
export const modelManager = new ModelManager();
