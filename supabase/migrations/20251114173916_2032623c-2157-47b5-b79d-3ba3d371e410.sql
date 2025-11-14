-- المرحلة 1: نقل بيانات whatsapp_messages إلى message_logs
-- ملاحظة: هذا migration آمن ولن يحذف البيانات الأصلية حتى نتأكد من نجاح العملية

-- أولاً: نقل جميع رسائل WhatsApp إلى message_logs
INSERT INTO message_logs (
  id,
  request_id,
  recipient,
  message_type,
  message_content,
  provider,
  status,
  external_id,
  sent_at,
  delivered_at,
  error_message,
  created_at,
  updated_at,
  metadata
)
SELECT 
  id,
  request_id,
  recipient_phone as recipient,
  'whatsapp' as message_type,
  message_body as message_content,
  'twilio' as provider,
  status,
  message_sid as external_id,
  created_at as sent_at,
  delivered_at,
  error_message,
  created_at,
  updated_at,
  jsonb_build_object(
    'sender_id', sender_id,
    'media_url', media_url,
    'read_at', read_at,
    'error_code', error_code,
    'migrated_from', 'whatsapp_messages'
  ) as metadata
FROM whatsapp_messages
WHERE NOT EXISTS (
  SELECT 1 FROM message_logs ml 
  WHERE ml.external_id = whatsapp_messages.message_sid
)
ON CONFLICT (id) DO NOTHING;

-- إنشاء view للتوافق مع الأكواد القديمة (مؤقت)
CREATE OR REPLACE VIEW whatsapp_messages_view AS
SELECT 
  id,
  request_id,
  recipient as recipient_phone,
  message_content as message_body,
  external_id as message_sid,
  (metadata->>'sender_id')::uuid as sender_id,
  status,
  sent_at as created_at,
  updated_at,
  delivered_at,
  (metadata->>'read_at')::timestamp with time zone as read_at,
  metadata->>'media_url' as media_url,
  error_message,
  metadata->>'error_code' as error_code
FROM message_logs
WHERE message_type = 'whatsapp';

-- التعليق على الجدول القديم لمنع استخدامه
COMMENT ON TABLE whatsapp_messages IS 'DEPRECATED: تم نقل البيانات إلى message_logs. استخدم message_logs بدلاً من ذلك';
