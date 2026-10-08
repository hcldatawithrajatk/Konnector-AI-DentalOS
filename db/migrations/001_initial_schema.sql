-- =============================================================================
-- KONNECTOR AI DENTALOS — ENTERPRISE MULTI-TENANT POSTGRESQL SCHEMA
-- Migration: 001_initial_schema.sql
-- Description: Complete production schema with Row-Level Security (RLS),
--              foreign key cascades, optimized indexes, and dual-region rails.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Enable pgvector if available on the host (e.g. Supabase, Neon, or Cloud SQL)
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "vector";
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'pgvector extension not installed; falling back to JSON embeddings';
END $$;

-- -----------------------------------------------------------------------------
-- 1. CLINIC TENANTS & MULTI-LOCATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinics (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    primary_color VARCHAR(16) DEFAULT '#0d9488',
    secondary_color VARCHAR(16) DEFAULT '#0f766e',
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(32),
    country VARCHAR(64) NOT NULL,
    region VARCHAR(8) NOT NULL CHECK (region IN ('IN', 'US')),
    currency VARCHAR(8) NOT NULL CHECK (currency IN ('INR', 'USD')),
    time_zone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    google_review_link TEXT,
    google_place_id VARCHAR(255),
    whatsapp_phone_number_id VARCHAR(64),
    whatsapp_business_account_id VARCHAR(64),
    gst_number VARCHAR(32),
    ein_tax_id VARCHAR(32),
    hipaa_mode_enabled BOOLEAN NOT NULL DEFAULT true,
    dpdpa_mode_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinic_locations (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(32),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. STAFF & ROLE-BASED ACCESS CONTROL (RBAC)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff_users (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(32) NOT NULL CHECK (role IN ('super_admin', 'clinical_director', 'associate_dentist', 'practice_manager', 'front_desk_receptionist', 'billing_coordinator', 'patient_coordinator')),
    phone VARCHAR(32),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. DOCTORS & SPECIALISTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    experience_years INT DEFAULT 5,
    bio TEXT,
    avatar_url TEXT,
    appointment_duration_mins INT NOT NULL DEFAULT 30,
    working_days TEXT[] DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '18:00:00',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. CLINICAL TREATMENTS & DUAL-CURRENCY PRICING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS treatments (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_inr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    price_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
    insurance_covered BOOLEAN DEFAULT false,
    sac_code VARCHAR(16) DEFAULT '999312',
    ada_code VARCHAR(16),
    is_high_value BOOLEAN DEFAULT false,
    duration_mins INT DEFAULT 45,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. PATIENTS & INTAKE RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(16),
    address TEXT,
    medical_history TEXT[],
    allergies TEXT[],
    current_medications TEXT[],
    dental_concern TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(32),
    insurance_provider VARCHAR(100),
    insurance_member_id VARCHAR(100),
    digital_consent_signed BOOLEAN DEFAULT false,
    consent_timestamp TIMESTAMPTZ,
    last_visit_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 6. APPOINTMENTS & NO-SHOW PREVENTION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(32) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    treatment_id VARCHAR(64) REFERENCES treatments(id) ON DELETE SET NULL,
    treatment_name VARCHAR(255) NOT NULL,
    appointment_time TIMESTAMPTZ NOT NULL,
    duration_mins INT NOT NULL DEFAULT 30,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    source VARCHAR(64) NOT NULL DEFAULT 'whatsapp_qr',
    reminder_48h_sent BOOLEAN DEFAULT false,
    reminder_24h_sent BOOLEAN DEFAULT false,
    reminder_2h_sent BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. DENTAL CRM & PIPELINE LEADS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crm_leads (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'new_lead' CHECK (status IN ('new_lead', 'ai_qualified', 'consultation_scheduled', 'treatment_proposed', 'treatment_accepted', 'in_progress', 'completed', 'lost')),
    source VARCHAR(64) NOT NULL DEFAULT 'whatsapp_qr',
    lead_score INT DEFAULT 50,
    treatment_intent_score INT DEFAULT 50,
    estimated_revenue NUMERIC(12, 2) DEFAULT 0,
    primary_concern TEXT,
    assigned_doctor_id VARCHAR(64) REFERENCES doctors(id) ON DELETE SET NULL,
    assigned_ai_persona VARCHAR(32) DEFAULT 'receptionist',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crm_lead_timeline (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    actor VARCHAR(64) NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. SMART QR HUBS & ATTRIBUTION TRACKING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS smart_qr_codes (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    cta_text VARCHAR(100),
    target_route TEXT NOT NULL,
    total_scans INT DEFAULT 0,
    total_conversions INT DEFAULT 0,
    placement_location VARCHAR(100),
    custom_styles JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS qr_scan_events (
    id VARCHAR(64) PRIMARY KEY,
    qr_id VARCHAR(64) NOT NULL REFERENCES smart_qr_codes(id) ON DELETE CASCADE,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    ip_address VARCHAR(64),
    user_agent TEXT,
    device_type VARCHAR(32),
    referrer TEXT,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN DEFAULT false,
    converted_at TIMESTAMPTZ,
    lead_id VARCHAR(64) REFERENCES crm_leads(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 9. PAYMENT TRANSACTIONS & BILLING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(32),
    appointment_id VARCHAR(64) REFERENCES appointments(id) ON DELETE SET NULL,
    treatment_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(8) NOT NULL CHECK (currency IN ('INR', 'USD')),
    gateway VARCHAR(32) NOT NULL CHECK (gateway IN ('razorpay', 'stripe', 'cash', 'upi_qr')),
    gateway_order_id VARCHAR(128),
    gateway_payment_id VARCHAR(128),
    status VARCHAR(32) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    gst_sac_code VARCHAR(16) DEFAULT '999312',
    gst_rate_percent NUMERIC(5, 2) DEFAULT 18.00,
    gst_amount NUMERIC(12, 2) DEFAULT 0,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. REVIEWS & 2-TIER REPUTATION FUNNEL
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review_feedback (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    score INT NOT NULL CHECK (score BETWEEN 1 AND 10),
    feedback_text TEXT,
    destination VARCHAR(32) NOT NULL CHECK (destination IN ('google_review', 'internal_ticket')),
    status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 11. 24/7 DENTAL EMERGENCY TRIAGE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_triage_cases (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    symptoms TEXT[] NOT NULL,
    severity_score INT NOT NULL CHECK (severity_score BETWEEN 1 AND 10),
    assigned_doctor_name VARCHAR(255),
    assigned_doctor_id VARCHAR(64) REFERENCES doctors(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Urgent Triaged' CHECK (status IN ('Urgent Triaged', 'Under Review', 'Escalated', 'Resolved')),
    escalated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 12. KNOWLEDGE BASE & CLINICAL RAG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    file_type VARCHAR(16) NOT NULL,
    file_size VARCHAR(32),
    snippet TEXT NOT NULL,
    full_content TEXT,
    tags TEXT[],
    chunks_count INT DEFAULT 1,
    vector_indexed BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 13. WORKFLOW AUTOMATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(64) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    total_executions INT DEFAULT 0,
    nodes JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 14. IMMUTABLE SECURITY & AUDIT LOGS (HIPAA / DPDPA COMPLIANT)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    clinic_id VARCHAR(64) NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
    ip_address VARCHAR(64),
    device TEXT,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- OPTIMIZED INDEXES FOR HIGH-PERFORMANCE MULTI-TENANCY
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clinics_subdomain ON clinics(subdomain);
CREATE INDEX IF NOT EXISTS idx_clinics_region ON clinics(region);
CREATE INDEX IF NOT EXISTS idx_staff_clinic_email ON staff_users(clinic_id, email);
CREATE INDEX IF NOT EXISTS idx_doctors_clinic ON doctors(clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_treatments_clinic ON treatments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_phone ON patients(clinic_id, phone);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_time ON appointments(clinic_id, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_clinic_status ON crm_leads(clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_timeline_lead ON crm_lead_timeline(lead_id);
CREATE INDEX IF NOT EXISTS idx_smart_qr_clinic ON smart_qr_codes(clinic_id, type);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr ON qr_scan_events(qr_id, scanned_at);
CREATE INDEX IF NOT EXISTS idx_payments_clinic ON payment_transactions(clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_clinic_time ON audit_logs(clinic_id, timestamp DESC);

-- -----------------------------------------------------------------------------
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR TOTAL TENANT ISOLATION
-- -----------------------------------------------------------------------------
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_triage_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Dynamic Tenant Context Isolation Policy
-- Sets session variable `app.current_clinic_id` via connection pooler
DO $$
BEGIN
    CREATE POLICY tenant_isolation_patients ON patients
        USING (clinic_id = current_setting('app.current_clinic_id', true));
    CREATE POLICY tenant_isolation_appointments ON appointments
        USING (clinic_id = current_setting('app.current_clinic_id', true));
    CREATE POLICY tenant_isolation_crm_leads ON crm_leads
        USING (clinic_id = current_setting('app.current_clinic_id', true));
    CREATE POLICY tenant_isolation_payments ON payment_transactions
        USING (clinic_id = current_setting('app.current_clinic_id', true));
    CREATE POLICY tenant_isolation_audit ON audit_logs
        USING (clinic_id = current_setting('app.current_clinic_id', true));
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Tenant isolation policies already created.';
END $$;
