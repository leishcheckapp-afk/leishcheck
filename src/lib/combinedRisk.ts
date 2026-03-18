import { PredictionResult } from './modelManager';
import { MAX_SCORE } from '@/data/questions';

export interface CombinedRiskResult {
  // Questionário
  questionnaireScore: number;  // 0-10
  questionnairePercentage: number;  // 0-100
  questionnaireRiskLevel: 'low' | 'medium' | 'high';
  
  // IA
  aiPrediction: PredictionResult | null;
  
  // Combinado
  combinedPercentage: number;  // 0-100
  combinedRiskLevel: 'low' | 'medium' | 'high';
  
  // Metadados
  hasImage: boolean;
  wasOffline: boolean;
  modelVersion: string | null;
}

// Pesos para cálculo combinado
const WEIGHTS = {
  QUESTIONNAIRE: 0.55,  // 55% peso do questionário
  AI: 0.45              // 45% peso da IA
};

/**
 * Calcula o nível de risco baseado na porcentagem
 */
function getRiskLevel(percentage: number): 'low' | 'medium' | 'high' {
  if (percentage < 30) return 'low';
  if (percentage < 60) return 'medium';
  return 'high';
}

/**
 * Calcula porcentagem do questionário (0-100)
 */
export function calculateQuestionnairePercentage(score: number, maxScore: number = MAX_SCORE): number {
  return Math.min(100, Math.round((score / maxScore) * 100));
}

/**
 * Converte predição da IA em score 0-100
 */
function aiPredictionToScore(prediction: PredictionResult): number {
  // Se predição é leishmaniose, usar a confiança diretamente
  // Se predição é não-leishmaniose, inverter (1 - confiança)
  const score = prediction.label === 'leishmaniose'
    ? prediction.confidence * 100
    : (1 - prediction.confidence) * 100;
  
  return Math.round(score);
}

/**
 * Calcula risco combinado (questionário + IA)
 */
export function calculateCombinedRisk(
  questionnaireScore: number,
  aiPrediction: PredictionResult | null,
  wasOffline: boolean = false,
  modelVersion: string | null = null
): CombinedRiskResult {
  
  // Calcular porcentagem do questionário
  const questionnairePercentage = calculateQuestionnairePercentage(questionnaireScore);
  const questionnaireRiskLevel = getRiskLevel(questionnairePercentage);

  // Se não há imagem, retornar apenas score do questionário
  if (!aiPrediction) {
    return {
      questionnaireScore,
      questionnairePercentage,
      questionnaireRiskLevel,
      aiPrediction: null,
      combinedPercentage: questionnairePercentage,
      combinedRiskLevel: questionnaireRiskLevel,
      hasImage: false,
      wasOffline,
      modelVersion
    };
  }

  // Calcular score da IA
  const aiScore = aiPredictionToScore(aiPrediction);

  // Calcular score combinado (média ponderada)
  const combinedPercentage = Math.round(
    questionnairePercentage * WEIGHTS.QUESTIONNAIRE +
    aiScore * WEIGHTS.AI
  );

  const combinedRiskLevel = getRiskLevel(combinedPercentage);

  return {
    questionnaireScore,
    questionnairePercentage,
    questionnaireRiskLevel,
    aiPrediction,
    combinedPercentage,
    combinedRiskLevel,
    hasImage: true,
    wasOffline,
    modelVersion
  };
}

/**
 * Gera recomendações baseadas no nível de risco
 */
export function getRecommendations(
  riskLevel: 'low' | 'medium' | 'high',
  hasImage: boolean,
  t: (key: string) => string
): string[] {
  const recommendations: string[] = [];

  switch (riskLevel) {
    case 'low':
      recommendations.push(t('result.recommendations.low.1'));
      recommendations.push(t('result.recommendations.low.2'));
      if (hasImage) {
        recommendations.push(t('result.recommendations.low.3'));
      }
      break;

    case 'medium':
      recommendations.push(t('result.recommendations.medium.1'));
      recommendations.push(t('result.recommendations.medium.2'));
      recommendations.push(t('result.recommendations.medium.3'));
      if (hasImage) {
        recommendations.push(t('result.recommendations.medium.4'));
      }
      break;

    case 'high':
      recommendations.push(t('result.recommendations.high.1'));
      recommendations.push(t('result.recommendations.high.2'));
      recommendations.push(t('result.recommendations.high.3'));
      recommendations.push(t('result.recommendations.high.4'));
      break;
  }

  return recommendations;
}

/**
 * Retorna cor do badge baseada no nível de risco
 */
export function getRiskColor(riskLevel: 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
}

/**
 * Retorna ícone baseado no nível de risco
 */
export function getRiskIcon(riskLevel: 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return '✅';
    case 'medium':
      return '⚠️';
    case 'high':
      return '🚨';
  }
}
