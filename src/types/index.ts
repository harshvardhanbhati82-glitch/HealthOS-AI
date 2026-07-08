export interface PHC {
  id: string;
  name: string;
  lat: number;
  lng: number;
  doctors: number;
  patientsToday: number;
  medicineStock: 'Good' | 'Low' | 'Critical';
  medicineStockPercent: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  equipment: EquipmentItem[];
  vaccinations: VaccinationItem[];
  aiRecommendation: string;
  block: string;
  beds: number;
  activeCases: number;
}

export interface EquipmentItem {
  name: string;
  status: 'Operational' | 'Under Repair' | 'Non-Functional';
  lastChecked: string;
}

export interface VaccinationItem {
  name: string;
  target: number;
  achieved: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictionCard {
  id: string;
  title: string;
  description: string;
  riskScore: number;
  confidence: number;
  recommendedAction: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  category: 'disease' | 'resource' | 'vaccination' | 'emergency';
  affectedAreas: string[];
}

export interface ReportData {
  id: string;
  phcName: string;
  block: string;
  doctors: number;
  patients: number;
  medicineStock: string;
  riskLevel: string;
  vaccinations: number;
  activeCases: number;
  date: string;
}

export interface DashboardStats {
  totalPHCs: number;
  activeDoctors: number;
  patientsToday: number;
  criticalAlerts: number;
  vaccinationRate: number;
  medicineStockHealth: number;
}
