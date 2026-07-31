import axios from 'axios';

// Zoho Catalyst Environment Variables
const CATALYST_PROJECT_ID = import.meta.env.VITE_CATALYST_PROJECT_ID || 'demo_catalyst';
const CATALYST_ENV = import.meta.env.VITE_CATALYST_ENV || 'development';

export interface CatalystResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class CatalystService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.catalyst.zoho.com/baas/v1/project/${CATALYST_PROJECT_ID}/${CATALYST_ENV}`;
  }

  /**
   * Execute Zoho Catalyst Advanced I/O Function
   */
  async executeFunction<T = any>(
    functionName: string,
    payload: Record<string, any> = {},
    headers: Record<string, string> = {}
  ): Promise<CatalystResponse<T>> {
    try {
      const response = await axios.post(`${this.baseUrl}/function/${functionName}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      return {
        status: 'success',
        data: response.data,
      };
    } catch (error: any) {
      console.warn(`[Zoho Catalyst] Function ${functionName} fallback:`, error.message);
      // Fallback response for local development when standalone
      return {
        status: 'error',
        message: error?.response?.data?.message || error.message || 'Catalyst function invocation failed',
      };
    }
  }

  /**
   * Upload File to Zoho Catalyst File Store
   */
  async uploadFile(folderId: string, file: File): Promise<CatalystResponse<{ fileId: string; url: string }>> {
    try {
      const formData = new FormData();
      formData.append('code', file);

      const response = await axios.post(`${this.baseUrl}/folder/${folderId}/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        status: 'success',
        data: response.data,
      };
    } catch (error: any) {
      console.warn('[Zoho Catalyst] Upload file fallback:', error.message);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  /**
   * Fetch Record from Zoho Catalyst Data Store
   */
  async getStoreRecords<T = any>(tableId: string): Promise<CatalystResponse<T[]>> {
    try {
      const response = await axios.get(`${this.baseUrl}/table/${tableId}/row`);
      return {
        status: 'success',
        data: response.data?.data || [],
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }
}

export const catalystService = new CatalystService();
export default catalystService;
