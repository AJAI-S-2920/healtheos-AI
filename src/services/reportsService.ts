import { MedicalReport } from '../types/report';
import { parseBiomarkersFromText, getSampleMedicalReportText } from './pdfParser';
import catalystService from './catalyst';

const LOCAL_STORAGE_REPORTS_KEY = 'healthos_medical_reports';

class ReportsService {
  private reports: MedicalReport[] = [];

  constructor() {
    this.initReports();
  }

  private initReports() {
    const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (saved) {
      try {
        this.reports = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn('Failed to parse saved reports', e);
      }
    }

    // Pre-seed with initial realistic sample report
    const sampleText = getSampleMedicalReportText();
    const parsed = parseBiomarkersFromText(sampleText);

    const initialReport: MedicalReport = {
      id: 'report_demo_001',
      userId: 'demo_user_12345',
      fileName: 'Comprehensive_Blood_Panel_July2026.pdf',
      fileSize: 425000,
      uploadDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      reportDate: '2026-07-25',
      labName: parsed.labName,
      patientName: 'Alex Mercer',
      overallRisk: parsed.overallRisk,
      biomarkers: parsed.biomarkers,
      rawText: sampleText,
      notes: 'Patient exhibits pre-diabetes indicators (FBS: 118, HbA1c: 6.2) and elevated LDL cholesterol.',
      status: 'processed',
    };

    this.reports = [initialReport];
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(this.reports));
  }

  /**
   * Get all reports for user
   */
  async getReports(userId?: string): Promise<MedicalReport[]> {
    // Attempt Zoho Catalyst Data Store fetch first
    try {
      const res = await catalystService.getStoreRecords<MedicalReport>('reports');
      if (res.status === 'success' && res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      console.warn('Catalyst data store fetch fallback');
    }

    // Fallback to local persistent state
    if (userId) {
      return this.reports.filter((r) => r.userId === userId || r.userId === 'demo_user_12345');
    }
    return [...this.reports];
  }

  /**
   * Get single report by ID
   */
  async getReportById(id: string): Promise<MedicalReport | null> {
    const reports = await this.getReports();
    return reports.find((r) => r.id === id) || null;
  }

  /**
   * Process & Store new Medical Report
   */
  async processAndStoreReport(
    file: File,
    rawText: string,
    userId: string,
    notes?: string
  ): Promise<MedicalReport> {
    // Parse Biomarkers
    const parsed = parseBiomarkersFromText(rawText);

    // Upload to Catalyst File Store (resilient wrapper)
    let fileUrl: string | undefined = undefined;
    try {
      const uploadRes = await catalystService.uploadFile('medical_reports_folder', file);
      if (uploadRes.status === 'success' && uploadRes.data?.url) {
        fileUrl = uploadRes.data.url;
      }
    } catch (e) {
      console.warn('Catalyst File Store upload fallback');
    }

    const newReport: MedicalReport = {
      id: `report_${Date.now()}`,
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileUrl,
      uploadDate: new Date().toISOString(),
      reportDate: parsed.reportDate,
      labName: parsed.labName,
      patientName: 'User Account',
      overallRisk: parsed.overallRisk,
      biomarkers: parsed.biomarkers,
      rawText,
      notes: notes || 'Extracted via pdf-parse & HealthOS AI Medical Engine',
      status: 'processed',
    };

    this.reports.unshift(newReport);
    this.saveToStorage();
    return newReport;
  }

  /**
   * Delete report
   */
  async deleteReport(id: string): Promise<boolean> {
    this.reports = this.reports.filter((r) => r.id !== id);
    this.saveToStorage();
    return true;
  }
}

export const reportsService = new ReportsService();
export default reportsService;
