interface TrekResponse {
  response: string;
  query: string;
  status: 'success';
  metadata?: {
    response_time: number;
    tokens_used: number;
    model: string;
  };
}

interface HealthResponse {
  status: 'healthy';
  sherpa_available: boolean;
  message: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

const SHERPA_API_BASE_URL = 'http://localhost:5000';

export class SherpaApiService {
  private static baseUrl = SHERPA_API_BASE_URL;

  /**
   * Check if the Sherpa AI API is healthy and available
   */
  static async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Unable to connect to Sherpa AI service');
    }
  }

  /**
   * Send a trekking query to Sherpa AI and get recommendations
   */
  static async getTrekRecommendation(query: string): Promise<TrekResponse> {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    try {
      const response = await fetch(`${this.baseUrl}/trek`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.message || errorData.error || 'Unknown error occurred');
      }

      return data as TrekResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new Error('Unable to get recommendation from Sherpa AI');
    }
  }

  /**
   * Utility method to check if the service is available
   */
  static async isServiceAvailable(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.status === 'healthy' && health.sherpa_available;
    } catch {
      return false;
    }
  }
}

// Export types for use in components
export type { TrekResponse, HealthResponse, ErrorResponse };