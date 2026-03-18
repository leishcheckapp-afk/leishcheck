import { CombinedRiskResult } from './combinedRisk';

interface DiagnosisLog {
  id?: string;
  session_id: string;
  questionnaire_score: number;
  questionnaire_percentage: number;
  questionnaire_risk_level: string;
  ai_prediction?: string;
  ai_confidence?: number;
  ai_processing_time_ms?: number;
  combined_risk_level: string;
  combined_percentage: number;
  model_version?: string;
  was_offline: boolean;
  user_data: any;
  answers: any;
  created_at: string;
}

const PENDING_LOGS_KEY = 'leishcheck-pending-logs';

/**
 * Salva log de diagnóstico (online ou offline)
 */
export async function saveDiagnosisLog(
  result: CombinedRiskResult,
  userData: any,
  answers: any,
  sessionId: string = crypto.randomUUID()
): Promise<void> {
  const log: DiagnosisLog = {
    session_id: sessionId,
    questionnaire_score: result.questionnaireScore,
    questionnaire_percentage: result.questionnairePercentage,
    questionnaire_risk_level: result.questionnaireRiskLevel,
    ai_prediction: result.aiPrediction?.label,
    ai_confidence: result.aiPrediction?.confidence,
    ai_processing_time_ms: result.aiPrediction?.processingTimeMs,
    combined_risk_level: result.combinedRiskLevel,
    combined_percentage: result.combinedPercentage,
    model_version: result.modelVersion,
    was_offline: result.wasOffline,
    user_data: userData,
    answers: answers,
    created_at: new Date().toISOString()
  };

  if (navigator.onLine) {
    try {
      await saveToSupabase(log);
      console.log('✅ Log salvo no Supabase');
    } catch (error) {
      console.error('❌ Erro ao salvar no Supabase:', error);
      // Salvar offline como fallback
      savePendingLog(log);
    }
  } else {
    // Salvar offline
    savePendingLog(log);
    console.log('📱 Log salvo offline');
  }
}

/**
 * Salva log no Supabase
 */
async function saveToSupabase(log: DiagnosisLog): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/diagnosis_logs`,
    {
      method: 'POST',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(log)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}

/**
 * Salva log pendente no localStorage
 */
function savePendingLog(log: DiagnosisLog): void {
  try {
    const pending = getPendingLogs();
    pending.push(log);
    localStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Erro ao salvar log pendente:', error);
  }
}

/**
 * Recupera logs pendentes do localStorage
 */
function getPendingLogs(): DiagnosisLog[] {
  try {
    const stored = localStorage.getItem(PENDING_LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Sincroniza logs pendentes quando voltar online
 */
export async function syncPendingLogs(): Promise<void> {
  if (!navigator.onLine) return;

  const pending = getPendingLogs();
  if (pending.length === 0) return;

  console.log(`🔄 Sincronizando ${pending.length} logs pendentes...`);

  const synced: DiagnosisLog[] = [];
  const failed: DiagnosisLog[] = [];

  for (const log of pending) {
    try {
      await saveToSupabase(log);
      synced.push(log);
    } catch (error) {
      console.error('Erro ao sincronizar log:', error);
      failed.push(log);
    }
  }

  // Atualizar localStorage apenas com logs que falharam
  localStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(failed));

  if (synced.length > 0) {
    console.log(`✅ ${synced.length} logs sincronizados com sucesso`);
  }
  
  if (failed.length > 0) {
    console.log(`❌ ${failed.length} logs falharam na sincronização`);
  }
}

/**
 * Retorna número de logs pendentes
 */
export function getPendingLogsCount(): number {
  return getPendingLogs().length;
}

/**
 * Limpa todos os logs pendentes (usar com cuidado)
 */
export function clearPendingLogs(): void {
  localStorage.removeItem(PENDING_LOGS_KEY);
  console.log('🗑️ Logs pendentes limpos');
}

// Auto-sync quando voltar online
window.addEventListener('online', () => {
  console.log('🌐 Conexão restaurada, sincronizando...');
  syncPendingLogs();
});

// Sync inicial se já estiver online
if (navigator.onLine) {
  // Delay para não bloquear o carregamento inicial
  setTimeout(syncPendingLogs, 2000);
}
