// Removed unused interface - backend handles ZeptoMail structure

interface ZeptoMailResponse {
  data?: Array<{
    code: string;
    additional_info: Array<{
      message_id: string;
    }>;
  }>;
  message?: string;
  error?: string;
}

interface RegistrationEmailData {
  eventName: string;
  customerName: string;
  customerEmail: string;
}

export class ZeptoMailService {
  // Use local backend server for development, Vercel API for production
  private static readonly BACKEND_EMAIL_API = import.meta.env.MODE === 'development'
    ? 'http://localhost:3001'
    : window.location.origin; // Uses same domain as frontend in production

  /**
   * Send registration confirmation email using ZeptoMail template
   */
  static async sendRegistrationEmail(data: RegistrationEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailPayload = {
        eventName: data.eventName,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
      };

      console.log('📧 Sending registration email via backend API:', {
        to: data.customerEmail,
        eventName: data.eventName,
        customerName: data.customerName,
        api: this.BACKEND_EMAIL_API,
      });

      const response = await fetch(`${this.BACKEND_EMAIL_API}/api/send-registration-email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Backend email API error:', {
          status: response.status,
          data: responseData,
        });
        return {
          success: false,
          error: responseData.error || responseData.message || `HTTP ${response.status}`,
        };
      }

      console.log('✅ Registration email sent successfully via backend:', {
        to: data.customerEmail,
        response: responseData,
      });

      return {
        success: responseData.success || true,
        messageId: responseData.messageId || responseData.data?.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending registration email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Send test email to verify template and configuration
   */
  static async sendTestEmail(testEmail: string = 'rajvaidhyag@gmail.com'): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendRegistrationEmail({
      eventName: 'Test Event - Hampta Pass Trek',
      customerName: 'Test User',
      customerEmail: testEmail,
    });
  }
}

export type { RegistrationEmailData, ZeptoMailResponse };