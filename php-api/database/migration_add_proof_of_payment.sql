-- Migration: Add proof of payment fields to payouts table
-- Run this migration to add proof of payment support

ALTER TABLE payouts 
ADD COLUMN IF NOT EXISTS proof_of_payment JSON NULL,
ADD COLUMN IF NOT EXISTS transaction_number VARCHAR(255) NULL AFTER transaction_id;

-- proof_of_payment JSON structure:
-- {
--   "type": "file" | "text",
--   "filePath": "/uploads/payout-proof-xxx.jpg" (if type is file),
--   "text": "Bank transfer details..." (if type is text),
--   "transactionNumber": "TXN123456" (for bank transfers),
--   "uploadedAt": "2025-01-01 12:00:00"
-- }

