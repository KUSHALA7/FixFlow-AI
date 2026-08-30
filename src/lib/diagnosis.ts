export type ApplianceType = 'Washing Machine' | 'Refrigerator' | 'Air Conditioner' | 'Television' | 'Other';

export interface DiagnosisResult {
  likelyIssue: string;
  confidence: number;
  possibleCauses: string[];
  recommendedAction: string;
  possibleParts: string[];
  estimatedCostRange: string;
}

export interface WorkflowState {
  appliance: ApplianceType | null;
  complaint: string;
  isAnalyzing: boolean;
  diagnosis: DiagnosisResult | null;
  partsDecision: PartsDecision | null;
  bookingDetails: any | null; // Added for new booking flow
  repairStatus: string | null; // Added for new booking flow
}

export type PartsDecision = 'customer' | 'technician' | 'inspection';

export const DIAGNOSIS_RULES: Record<ApplianceType, { triggers: string[], result: DiagnosisResult }[]> = {
  'Washing Machine': [
    {
      triggers: ['grinding', 'spin', 'not spinning', 'noise'],
      result: {
        likelyIssue: 'Worn or Broken Drive Belt / Motor Coupling',
        confidence: 85,
        possibleCauses: ['Drive belt has snapped or stretched', 'Motor coupling is broken', 'Drum bearings are worn out'],
        recommendedAction: 'Inspect drive belt and motor coupling for wear or breakage. Check drum for smooth rotation.',
        possibleParts: ['Drive Belt', 'Motor Coupling', 'Drum Bearing Kit'],
        estimatedCostRange: '$80 - $250'
      }
    },
    {
      triggers: ['leak', 'water', 'draining', 'not draining'],
      result: {
        likelyIssue: 'Clogged Drain Pump or Faulty Hose',
        confidence: 90,
        possibleCauses: ['Blockage in drain pump filter', 'Kinked or damaged drain hose', 'Failed drain pump motor'],
        recommendedAction: 'Clean drain pump filter. Check hoses for leaks or kinks. Test pump motor continuity.',
        possibleParts: ['Drain Pump', 'Drain Hose', 'Tub Seal'],
        estimatedCostRange: '$75 - $180'
      }
    }
  ],
  'Refrigerator': [
    {
      triggers: ['running', 'not cold', 'warm', 'cooling'],
      result: {
        likelyIssue: 'Evaporator Coils Frosted Over / Defrost System Failure',
        confidence: 80,
        possibleCauses: ['Defrost heater failed', 'Defrost thermostat faulty', 'Defrost control board issue', 'Condenser coils dirty'],
        recommendedAction: 'Check evaporator coils for excessive frost. Test defrost heater and thermostat for continuity. Clean condenser coils.',
        possibleParts: ['Defrost Heater', 'Defrost Thermostat', 'Defrost Control Board'],
        estimatedCostRange: '$120 - $300'
      }
    },
    {
      triggers: ['noise', 'loud', 'buzzing', 'clicking'],
      result: {
        likelyIssue: 'Failing Compressor or Condenser Fan Motor',
        confidence: 75,
        possibleCauses: ['Compressor start relay failure', 'Condenser fan motor bearings worn', 'Compressor internal failure'],
        recommendedAction: 'Inspect condenser fan motor for smooth operation. Test compressor start relay and capacitor.',
        possibleParts: ['Start Relay', 'Condenser Fan Motor', 'Run Capacitor'],
        estimatedCostRange: '$50 - $400'
      }
    }
  ],
  'Air Conditioner': [
    {
      triggers: ['running', 'not cooling', 'warm air', 'blowing warm'],
      result: {
        likelyIssue: 'Refrigerant Leak or Dirty Condenser Coils',
        confidence: 85,
        possibleCauses: ['Low refrigerant charge due to leak', 'Extremely dirty condenser coils', 'Failing compressor'],
        recommendedAction: 'Clean condenser coils thoroughly. Check for refrigerant leaks using detector. Assess compressor operation.',
        possibleParts: ['Refrigerant (Recharge)', 'Filter Drier', 'Capacitor'],
        estimatedCostRange: '$150 - $500'
      }
    },
    {
       triggers: ['won\'t turn on', 'no power', 'dead'],
       result: {
         likelyIssue: 'Tripped Breaker or Blown Fuse / Capacitor',
         confidence: 90,
         possibleCauses: ['Tripped circuit breaker', 'Blown fuse on control board', 'Failed dual run capacitor'],
         recommendedAction: 'Check main breaker panel. Inspect control board for blown fuses. Test capacitor with multimeter.',
         possibleParts: ['Dual Run Capacitor', 'Control Board Fuse'],
         estimatedCostRange: '$80 - $200'
       }
    }
  ],
  'Television': [
    {
      triggers: ['won\'t turn on', 'dead', 'no power', 'blinking light'],
      result: {
        likelyIssue: 'Power Supply Board Failure',
        confidence: 90,
        possibleCauses: ['Blown capacitors on power board', 'Failed diodes or transformers', 'Main board fault preventing power on'],
        recommendedAction: 'Inspect power supply board for bulging capacitors or burn marks. Test standby voltage output.',
        possibleParts: ['Power Supply Board', 'Capacitor Kit'],
        estimatedCostRange: '$100 - $300'
      }
    },
    {
      triggers: ['no picture', 'sound but no picture', 'black screen', 'dark screen'],
      result: {
        likelyIssue: 'LED Backlight Failure',
        confidence: 85,
        possibleCauses: ['One or more LED strips burned out', 'LED driver board failure', 'T-Con board issue (less likely if backlight is truly off)'],
        recommendedAction: 'Perform flashlight test on screen. If image is faintly visible, inspect LED strips and driver voltage.',
        possibleParts: ['LED Backlight Strips', 'LED Driver Board'],
        estimatedCostRange: '$150 - $400'
      }
    }
  ],
  'Other': []
};

const FALLBACK_DIAGNOSIS: DiagnosisResult = {
  likelyIssue: 'Diagnosis Requires Inspection',
  confidence: 40,
  possibleCauses: ['Multiple potential root causes based on symptoms', 'Symptoms too general for specific prediction'],
  recommendedAction: 'A technician must perform a full diagnostic inspection to isolate the fault.',
  possibleParts: ['To be determined after inspection'],
  estimatedCostRange: 'TBD (Diagnostic Fee usually $80-$120)'
};

export function analyzeComplaint(appliance: ApplianceType, complaint: string): DiagnosisResult {
  const normalizedComplaint = complaint.toLowerCase();
  
  if (DIAGNOSIS_RULES[appliance]) {
    for (const rule of DIAGNOSIS_RULES[appliance]) {
      // Check if any trigger word is in the complaint
      if (rule.triggers.some(trigger => normalizedComplaint.includes(trigger))) {
        return rule.result;
      }
    }
  }

  return FALLBACK_DIAGNOSIS;
}

export function calculateReadinessScore(appliance: ApplianceType | null, complaint: string): number {
  let score = 0;
  if (appliance) score += 40;
  
  const wordCount = complaint.trim().split(/\s+/).length;
  if (wordCount > 5) score += 20;
  if (wordCount > 15) score += 20;
  if (wordCount > 25) score += 20;

  return Math.min(score, 100);
}
