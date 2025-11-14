import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendMessageParams {
  to: string;
  message: string;
  type?: 'sms' | 'whatsapp';
  requestId?: string;
  templateId?: string;
  variables?: Record<string, string>;
  media_url?: string;
}

/**
 * Hook موحد لإرسال رسائل SMS و WhatsApp عبر Twilio
 * 
 * @example
 * // إرسال SMS
 * const { sendSMS } = useTwilioMessages();
 * await sendSMS('+201234567890', 'مرحباً');
 * 
 * @example
 * // إرسال WhatsApp
 * const { sendWhatsApp } = useTwilioMessages();
 * await sendWhatsApp('+201234567890', 'مرحباً', 'request-id');
 * 
 * @example
 * // إرسال WhatsApp بقالب
 * const { sendWhatsAppTemplate } = useTwilioMessages();
 * await sendWhatsAppTemplate('+201234567890', 'template-id', { name: 'أحمد' });
 */

export function useTwilioMessages() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (params: SendMessageParams) => {
    try {
      setLoading(true);

      // Get session for authenticated requests (optional)
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('send-twilio-message', {
        body: params,
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`,
        } : {}
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'فشل في إرسال الرسالة');
      }

      toast({
        title: 'تم إرسال الرسالة',
        description: `تم إرسال ${params.type === 'whatsapp' ? 'رسالة WhatsApp' : 'رسالة نصية'} بنجاح`,
      });

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'خطأ في إرسال الرسالة',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * إرسال رسالة SMS نصية
   */
  const sendSMS = async (to: string, message: string, requestId?: string) => {
    return sendMessage({ to, message, type: 'sms', requestId });
  };

  /**
   * إرسال رسالة WhatsApp
   */
  const sendWhatsApp = async (to: string, message: string, requestId?: string, media_url?: string) => {
    return sendMessage({ to, message, type: 'whatsapp', requestId, media_url });
  };

  /**
   * إرسال رسالة WhatsApp باستخدام قالب معتمد
   */

  const sendWhatsAppTemplate = async (
    to: string,
    templateId: string,
    variables: Record<string, string>,
    requestId?: string
  ) => {
    return sendMessage({
      to,
      message: '', // سيتم استخدام القالب
      type: 'whatsapp',
      templateId,
      variables,
      requestId
    });
  };

  /**
   * إرسال إشعار صيانة موحد
   */
  const sendMaintenanceNotification = async (
    requestId: string,
    phone: string,
    type: 'created' | 'assigned' | 'in_progress' | 'completed',
    preferredMethod: 'sms' | 'whatsapp' = 'sms'
  ) => {
    const messages = {
      created: 'تم استلام طلب الصيانة الخاص بك. سيتم التواصل معك قريباً.',
      assigned: 'تم تعيين فني لطلب الصيانة الخاص بك.',
      in_progress: 'الفني في طريقه إليك الآن.',
      completed: 'تم إكمال طلب الصيانة بنجاح. شكراً لثقتك بنا.'
    };

    return sendMessage({
      to: phone,
      message: messages[type],
      type: preferredMethod,
      requestId
    });
  };

  return {
    sendMessage,
    sendSMS,
    sendWhatsApp,
    sendWhatsAppTemplate,
    sendMaintenanceNotification,
    loading,
    isSending: loading, // backward compatibility
  };
}
