import { Biomarker, BiomarkerStatus } from '../types/report';

/**
 * Clean & normalize extracted PDF text
 */
export function cleanExtractedText(rawText: string): string {
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Extracts biomarkers from medical text using clinical pattern matching
 */
export function parseBiomarkersFromText(text: string): {
  biomarkers: Biomarker[];
  labName: string;
  reportDate: string;
  overallRisk: 'Low' | 'Moderate' | 'High';
} {
  const normalizedText = cleanExtractedText(text);
  const biomarkers: Biomarker[] = [];

  // Extract Lab Name
  let labName = 'Metropolitan Diagnostics Laboratory';
  const labMatch = normalizedText.match(/(?:Laboratory|Diagnostic|Lab|Hospital|Clinic|Center)\b[^\n]*/i);
  if (labMatch) {
    labName = labMatch[0].trim();
  }

  // Extract Date
  let reportDate = new Date().toISOString().split('T')[0];
  const dateMatch = normalizedText.match(/\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|[A-Z][a-z]{2,8}\s+\d{1,2},\s+\d{4})\b/);
  if (dateMatch) {
    reportDate = dateMatch[0];
  }

  // Define clinical extraction patterns
  const rules = [
    {
      id: 'fasting_glucose',
      name: 'Fasting Blood Glucose',
      regex: /(?:Fasting\s+(?:Blood\s+)?Glucose|Fasting\s+Sugar|FBS)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL|mmol\/L)?/i,
      unit: 'mg/dL',
      category: 'Metabolic' as const,
      minNormal: 70,
      maxNormal: 99,
      maxWarning: 125,
      refRange: '70 - 99 mg/dL',
      description: 'Primary indicator of blood sugar levels after fasting.',
    },
    {
      id: 'hba1c',
      name: 'HbA1c (Glycated Hemoglobin)',
      regex: /(?:HbA1c|Glycated\s+Hemoglobin|A1C)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*%?/i,
      unit: '%',
      category: 'Metabolic' as const,
      minNormal: 4.0,
      maxNormal: 5.6,
      maxWarning: 6.4,
      refRange: '< 5.7 %',
      description: 'Average blood sugar levels over the past 2 to 3 months.',
    },
    {
      id: 'total_cholesterol',
      name: 'Total Cholesterol',
      regex: /(?:Total\s+Cholesterol|Cholesterol,\s+Total)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL)?/i,
      unit: 'mg/dL',
      category: 'Lipid' as const,
      minNormal: 120,
      maxNormal: 199,
      maxWarning: 239,
      refRange: '< 200 mg/dL',
      description: 'Overall amount of cholesterol present in the blood.',
    },
    {
      id: 'hdl_cholesterol',
      name: 'HDL Cholesterol (Good)',
      regex: /(?:HDL\s+Cholesterol|HDL|High\s+Density\s+Lipoprotein)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL)?/i,
      unit: 'mg/dL',
      category: 'Lipid' as const,
      minNormal: 40,
      maxNormal: 80,
      maxWarning: 39,
      refRange: '> 40 mg/dL',
      description: 'High-density lipoprotein protects against cardiovascular disease.',
    },
    {
      id: 'ldl_cholesterol',
      name: 'LDL Cholesterol (Bad)',
      regex: /(?:LDL\s+Cholesterol|LDL|Low\s+Density\s+Lipoprotein)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL)?/i,
      unit: 'mg/dL',
      category: 'Lipid' as const,
      minNormal: 50,
      maxNormal: 99,
      maxWarning: 129,
      refRange: '< 100 mg/dL',
      description: 'Low-density lipoprotein can contribute to arterial plaque buildup.',
    },
    {
      id: 'triglycerides',
      name: 'Triglycerides',
      regex: /(?:Triglycerides|TG)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL)?/i,
      unit: 'mg/dL',
      category: 'Lipid' as const,
      minNormal: 50,
      maxNormal: 149,
      maxWarning: 199,
      refRange: '< 150 mg/dL',
      description: 'Type of fat found in the blood; elevated levels increase heart disease risk.',
    },
    {
      id: 'hemoglobin',
      name: 'Hemoglobin (Hb)',
      regex: /(?:Hemoglobin|Hb|HGB)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(g\/dL)?/i,
      unit: 'g/dL',
      category: 'Hematology' as const,
      minNormal: 13.0,
      maxNormal: 17.5,
      maxWarning: 18.5,
      refRange: '13.0 - 17.5 g/dL',
      description: 'Iron-containing protein in red blood cells that transports oxygen.',
    },
    {
      id: 'wbc',
      name: 'White Blood Cell Count (WBC)',
      regex: /(?:WBC|White\s+Blood\s+Cell|Leukocytes)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(x10\^3\/uL|k\/uL|\/uL)?/i,
      unit: '10^3/µL',
      category: 'Hematology' as const,
      minNormal: 4.5,
      maxNormal: 11.0,
      maxWarning: 14.0,
      refRange: '4.5 - 11.0 10^3/µL',
      description: 'Immune cells that fight infection and illness.',
    },
    {
      id: 'platelets',
      name: 'Platelet Count',
      regex: /(?:Platelets|Platelet\s+Count|PLT)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(x10\^3\/uL|k\/uL|\/uL)?/i,
      unit: '10^3/µL',
      category: 'Hematology' as const,
      minNormal: 150,
      maxNormal: 450,
      maxWarning: 500,
      refRange: '150 - 450 10^3/µL',
      description: 'Blood cells essential for blood clotting and wound healing.',
    },
    {
      id: 'tsh',
      name: 'Thyroid Stimulating Hormone (TSH)',
      regex: /(?:TSH|Thyroid\s+Stimulating\s+Hormone)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(uIU\/mL|mIU\/L)?/i,
      unit: 'uIU/mL',
      category: 'Endocrine' as const,
      minNormal: 0.4,
      maxNormal: 4.0,
      maxWarning: 6.5,
      refRange: '0.40 - 4.00 uIU/mL',
      description: 'Hormone produced by pituitary gland controlling thyroid activity.',
    },
    {
      id: 'vitamin_d',
      name: 'Vitamin D (25-OH)',
      regex: /(?:Vitamin\s+D|25-OH\s+Vitamin\s+D|Vit\s+D)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(ng\/mL)?/i,
      unit: 'ng/mL',
      category: 'Endocrine' as const,
      minNormal: 30,
      maxNormal: 100,
      maxWarning: 29,
      refRange: '30 - 100 ng/mL',
      description: 'Essential for bone health, immune function, and calcium absorption.',
    },
    {
      id: 'vitamin_b12',
      name: 'Vitamin B12',
      regex: /(?:Vitamin\s+B12|Vit\s+B12|Cobalamin)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(pg\/mL)?/i,
      unit: 'pg/mL',
      category: 'Endocrine' as const,
      minNormal: 200,
      maxNormal: 900,
      maxWarning: 199,
      refRange: '200 - 900 pg/mL',
      description: 'Crucial for nerve tissue health, brain function, and red blood cell production.',
    },
    {
      id: 'creatinine',
      name: 'Serum Creatinine',
      regex: /(?:Creatinine|Serum\s+Creatinine)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(mg\/dL)?/i,
      unit: 'mg/dL',
      category: 'Renal' as const,
      minNormal: 0.6,
      maxNormal: 1.2,
      maxWarning: 1.8,
      refRange: '0.6 - 1.2 mg/dL',
      description: 'Waste product filtered by kidneys; key indicator of renal function.',
    },
  ];

  let criticalCount = 0;
  let warningCount = 0;

  rules.forEach((rule) => {
    const match = normalizedText.match(rule.regex);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      let status: BiomarkerStatus = 'normal';

      if (val < rule.minNormal || val > rule.maxWarning) {
        status = 'critical';
        criticalCount++;
      } else if (val > rule.maxNormal || (rule.id === 'hdl_cholesterol' && val < rule.minNormal)) {
        status = 'warning';
        warningCount++;
      }

      biomarkers.push({
        id: rule.id,
        name: rule.name,
        value: val,
        unit: rule.unit,
        referenceRange: rule.refRange,
        status,
        category: rule.category,
        description: rule.description,
      });
    }
  });

  // Calculate Overall Risk Level
  let overallRisk: 'Low' | 'Moderate' | 'High' = 'Low';
  if (criticalCount > 0) {
    overallRisk = 'High';
  } else if (warningCount >= 2) {
    overallRisk = 'Moderate';
  }

  return {
    biomarkers,
    labName,
    reportDate,
    overallRisk,
  };
}

/**
 * Generates sample medical PDF report text for demonstration
 */
export function getSampleMedicalReportText(): string {
  return `
METROPOLITAN DIAGNOSTICS & CLINICAL LABORATORY
Patient: Alex Mercer | Age: 36 | Gender: Male
Date of Collection: 2026-07-25 | Ref Doctor: Dr. Sarah Jenkins, MD

COMPLETE BLOOD COUNT & METABOLIC PANEL

TEST NAME                      RESULT      UNIT         REFERENCE INTERVAL
-------------------------------------------------------------------------
Fasting Blood Glucose          118.0       mg/dL        70.0 - 99.0      [HIGH]
HbA1c (Glycated Hemoglobin)     6.2         %            < 5.7            [ELEVATED]
Total Cholesterol               215.0       mg/dL        120.0 - 199.0    [HIGH]
HDL Cholesterol (Good)          38.0        mg/dL        > 40.0           [LOW]
LDL Cholesterol (Bad)           142.0       mg/dL        < 100.0          [HIGH]
Triglycerides                   175.0       mg/dL        < 150.0          [HIGH]
Hemoglobin (Hb)                 14.8        g/dL         13.0 - 17.5      [NORMAL]
White Blood Cell Count (WBC)    7.2         10^3/uL      4.5 - 11.0       [NORMAL]
Platelet Count                  240.0       10^3/uL      150.0 - 450.0    [NORMAL]
Thyroid Stimulating Hormone     2.4         uIU/mL       0.40 - 4.00      [NORMAL]
Vitamin D (25-OH)               22.0        ng/dL        30.0 - 100.0     [DEFICIENT]
Vitamin B12                     410.0       pg/mL        200.0 - 900.0    [NORMAL]
Serum Creatinine                0.95        mg/dL        0.60 - 1.20      [NORMAL]

NOTES & IMPRESSIONS:
Patient shows signs of Impaired Fasting Glucose (Pre-diabetes risk) alongside Mild Dyslipidemia.
Vitamin D deficiency noted. Lifestyle modifications, dietary review, and follow-up in 90 days recommended.
`;
}
