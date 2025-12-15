export interface RentDetails {
  currentRent: number;
  marketRent: number;
  area: string;
  unitType: string;
  bedrooms: string;
  // New fields
  expiryDate?: string; // ISO date string
  noticeDate?: string; // ISO date string
  hasValuation: boolean;
  valuationAmount?: number;
  tenantFlipFlop: boolean; // Tenant declined then accepted
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface CalculationResult {
  isEligible: boolean;
  increasePercentage: number;
  maxIncreaseAmount: number;
  newMaxRent: number;
  
  // Logic explanation
  reason: string;
  whyResult: string; // "Why this result happened"
  
  // Notice Validation
  isNoticeValid: boolean;
  noticeDays: number;
  noticeMessage: string;

  // Valuation context
  valuationUsed: boolean;

  // Advisory
  riskLevel: RiskLevel;
  riskReason: string;
  rdcExpectation: string;
  plainEnglishSummary: string;
  
  // Edge cases
  edgeCaseWarning?: string;
}

export interface AiAdvice {
  nextSteps: string[];
  marketContext: string;
}

export enum UnitType {
  APARTMENT = 'Apartment',
  VILLA = 'Villa'
}
