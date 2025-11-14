-- المرحلة 1 النهائية: حذف جدول whatsapp_messages بعد نجاح Migration

-- أولاً: حذف الـ view المؤقت
DROP VIEW IF EXISTS whatsapp_messages_view;

-- ثانياً: حذف جدول whatsapp_messages
-- ملاحظة: جميع البيانات تم نقلها إلى message_logs
DROP TABLE IF EXISTS whatsapp_messages;

-- إضافة index لتحسين الأداء على message_logs
CREATE INDEX IF NOT EXISTS idx_message_logs_type ON message_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_message_logs_recipient ON message_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_message_logs_request_id ON message_logs(request_id) WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_message_logs_external_id ON message_logs(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_message_logs_created_at ON message_logs(created_at DESC);

-- إضافة comment على الجدول الموحد
COMMENT ON TABLE message_logs IS 'جدول موحد لجميع الرسائل (SMS, WhatsApp, Email) - تم دمج whatsapp_messages هنا';
