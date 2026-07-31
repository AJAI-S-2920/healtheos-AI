export type BiomarkerStatus = 'normal' | 'warning' | 'critical';

export interface Biomarker {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: BiomarkerStatus;
  category: 'Metabolic' | 'Lipid' | 'Hematology' | 'Endocrine' | 'Renal' | 'Hepatic' | 'Vitals' | 'Other';
  description?: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  uploadDate: string;
  reportDate: string;
  labName: string;
  patientName?: string;
  overallRisk: 'Low' | 'Moderate' | 'High';
  biomarkers: Biomarker[];
  rawText: string;
  notes?: string;
  status: 'processed' | 'processing' | 'failed';
}

export interface UploadProgressState {
  file: File | null;
  progress: number;
  step: 'idle' | 'uploading' | 'parsing' | 'extracting' | 'storing' | 'completed' | 'error';
  errorMessage?: string;
}
