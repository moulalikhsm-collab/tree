export interface PlantRecommendation {
  name: string;
  type: 'vegetable' | 'fruit' | 'flower' | 'medicinal' | 'tree';
  suitabilityScore: number;
  suitabilityReason: string;
  soilType: string;
  soilPreparation: string;
  fertilizers: string[];
  wateringDailyMl: number;
  wateringWeeklyLiters: number;
  wateringInstructions: string;
  climateSuitability: {
    tempRange: string;
    humidityRange: string;
    warning?: string;
  };
  growthDurationDays: number;
  sowingSeason: string;
}

export interface GrowthPrediction {
  plantName: string;
  factors: {
    soilQuality: string;
    waterSupply: string;
    climate: string;
  };
  stages: {
    stage: string;
    durationDays: number;
    description: string;
    progressPercentage: number;
  }[];
  expectedYield: string;
  estimatedHarvestDate: string;
  growthChartData: {
    day: number;
    heightCm: number;
    healthScore: number;
  }[];
}

export interface DiseaseResult {
  diseaseName: string;
  healthy: boolean;
  confidence: number;
  symptoms: string[];
  preventiveMeasures: string[];
  treatments: string[];
  affectedAreaDescription?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PlantTracker {
  id: string;
  name: string;
  type: string;
  datePlanted: string;
  stage: string;
  wateringReminder: string;
  healthScore: number;
}

export interface WeatherInfo {
  temp: number;
  humidity: number;
  condition: string;
  location: string;
  forecast: { day: string; temp: number; condition: string }[];
}
