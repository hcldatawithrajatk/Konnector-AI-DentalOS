# Konnector AI DentalOS — GCP Cloud Deployment Guide (Lean MVP & Enterprise)

This guide documents the **Minimum-Cost Lean MVP Architecture** designed specifically to host **10 to 100 dental practices at \$5 – \$25 / month**, alongside the BigQuery vs PostgreSQL analysis and the future enterprise scaling path.

---

## 💰 1. Lean MVP Architecture (10 to 100 Clinics: \$5 – \$25 / Month)

To launch an initial MVP without incurring massive cloud bills before achieving product-market fit, all expensive enterprise overhead (Load Balancers, VPC Connectors, dedicated Redis VMs, and standalone Vector Search endpoints) has been eliminated in favor of high-performance serverless components:

```mermaid
flowchart TD
    subgraph Clients["Omnichannel Access"]
        Staff["Clinic Staff Dashboard\n(Desktop & Tablet Web)"]
        Patient["Patients & Walk-ins\n(Mobile Portals: Intake, Pay, Review)"]
        WhatsApp["Meta WhatsApp Cloud API\n(Inbound / Outbound Webhooks)"]
    end

    subgraph LeanGCP["Google Cloud Platform — Lean Serverless Tier"]
        CloudRun["Cloud Run (Scale-to-Zero)\n• Next.js 14 App Router + Node.js 20\n• Min: 0 instances, Max: 5 instances\n• CPU: 1 vCPU, RAM: 1 GiB\n• CPU throttled when idle ($0 idle cost)\n• Free Tier: 2M requests/mo free\n• Cost: $0 - $5/mo"]
        
        CustomDomain["Cloud Run Custom Domain Mapping\n• care.konnectordental.app\n• Google-Managed Auto-Renewing SSL\n• Cost: $0/mo (Replaces $18/mo Load Balancer)"]
        
        SecretMgr["Secret Manager\n• Encrypted environment credentials\n• Free Tier: 6 secret versions free\n• Cost: $0/mo"]
        
        GCS["Cloud Storage (GCS)\n• Clinic logos & printable QR posters\n• Free Tier: 5 GB storage free\n• Cost: $0/mo"]
    end

    subgraph DataAI["Lean Data & AI Tier (Zero Fixed Overhead)"]
        DB[("Serverless PostgreSQL (Neon / Supabase)\nor Cloud SQL Micro (db-f1-micro)\n• 0.5 GB to 10 GB storage\n• Embedded pgvector for clinical RAG\n• Replaces $45/mo Vertex Index\n• Cost: $0 - $12/mo")]
        
        Cache[("In-Memory LRU Cache / Upstash Serverless Redis\n• Rate-limiting & session cache\n• Free Tier: 10,000 commands/day\n• Replaces $35/mo Memorystore VM\n• Cost: $0/mo")]
        
        Gemini["Google Gemini 2.5 Flash API\n• Aria, Vikram, Maya, Marcus reasoning\n• Pay-per-token: $0.075 / 1M input tokens\n• Cost: $2 - $5/mo"]
    end

    %% Connections
    Staff --> CustomDomain
    Patient --> CustomDomain
    WhatsApp --> CustomDomain

    CustomDomain --> CloudRun
    CloudRun --> DB
    CloudRun --> Cache
    CloudRun --> Gemini
    CloudRun --> SecretMgr
    CloudRun --> GCS
```

### 💵 Lean MVP Monthly Cost Breakdown (10 to 100 Clinics)

| Service | Lean MVP Configuration | Monthly Cost | Enterprise Equivalent |
| :--- | :--- | :---: | :---: |
| **Compute** | **Cloud Run** (0 min instances, 1 vCPU, 1 GiB RAM, CPU allocated during requests) | **\$0 – \$5** | ~\$35/mo |
| **Database** | **Serverless PostgreSQL (Neon / Supabase)** with `pgvector` or **Cloud SQL Micro** | **\$0 – \$12** | ~\$145/mo |
| **Vector DB** | **`pgvector` inside PostgreSQL** (Eliminates dedicated Vector Endpoint) | **\$0** | ~\$45/mo |
| **Cache & Queue** | **In-memory cache** or **Upstash Serverless Redis** (10,000 commands/day free) | **\$0** | ~\$35/mo |
| **Ingress & SSL** | **Cloud Run Direct Custom Domain Mapping** (Free Google-managed SSL) | **\$0** | ~\$18/mo (LB) |
| **VPC Connector** | **Direct HTTPS / SSL Peering** (Eliminates Serverless VPC Connector) | **\$0** | ~\$14/mo |
| **AI Reasoning** | **Google Gemini 2.5 Flash** (via Google AI Studio or Vertex API pay-as-you-go) | **\$2 – \$6** | ~\$25/mo |
| **Compliance** | **Standard TLS 1.3 + AES-256 + DPDPA/HIPAA-ready digital consent** | **\$0** | ~\$50/mo (BAA/KMS) |
| **Total Monthly Bill** | **Full-fledged SaaS supporting 10 to 100 clinics** | **~\$5 – \$25 / mo** | **~\$367 / mo** |

---

## 🔍 2. Architectural Analysis: Can We Use BigQuery (BQ) in Place of PostgreSQL?

A common question when optimizing GCP costs is: *Can we replace PostgreSQL with BigQuery since BigQuery has a generous free tier (10 GB storage and 1 TB queries free per month)?*

### Detailed Technical Verdict: **NO — BigQuery Cannot Replace PostgreSQL as the Primary Application Database.**

Here is the exact engineering breakdown why:

### 1. Latency Profile (The User Experience Killer)
- **PostgreSQL / Cloud SQL / Neon:** **5ms – 25ms** per query.
- **BigQuery:** **1,000ms – 3,500ms** (1 to 3.5 seconds) per query.
- **Impact on DentalOS:** BigQuery is an OLAP (Online Analytical Processing) columnar engine designed for big data scans across millions of rows. It spends 1 to 2 seconds just provisioning distributed compute worker slots before executing a query. In an interactive web application:
  - Loading an appointment schedule would take 3+ seconds.
  - WhatsApp webhooks (which require a fast `200 OK` response under 5 seconds) would experience timeouts and message delivery drops.

### 2. High-Frequency Single-Row Updates & Deletes (Mutations)
- Web apps frequently mutate single rows: e.g. marking an appointment `confirmed`, dragging a CRM lead to `Accepted`, updating patient intake notes, or incrementing an invoice balance.
- BigQuery enforces strict rate limits on `UPDATE`, `DELETE`, and `MERGE` statements per table per day. Mutating individual rows creates metadata churn in BigQuery and frequently throws concurrency quota errors.

### 3. ACID Transactions & Row-Level Locking
- When two patients attempt to book the same dentist operatory chair at 10:00 AM simultaneously, PostgreSQL uses row-level locking (`SELECT FOR UPDATE`) to prevent double-booking.
- BigQuery does not support transactional row-level locking for interactive concurrent web users.

### 4. Vector Search (`pgvector`)
- PostgreSQL supports the native `pgvector` extension, allowing you to store embeddings and run semantic similarity searches for your Clinical RAG Knowledge Base in the **same database at \$0 extra cost**.
- BigQuery requires complex Vector Search setups that incur additional per-query scanning fees.

### 🎯 The Recommended Approach:
- **Use Serverless PostgreSQL (Neon / Supabase)** or **Cloud SQL Micro** for your live operational web app ($0 – $12/mo).
- **Use BigQuery as a Read-Only Analytics Sink**: Once a night, stream or export your daily appointment and revenue numbers into BigQuery for long-term clinical analytics and reporting (**100% free under BigQuery's 1 TB/month tier**).

---

## 🚀 3. Lean MVP Step-by-Step Deployment (Fast & Ultra-Low-Cost)

Deploy the entire platform on GCP in under 5 minutes without expensive networking overhead:

### Step 1: Set Project & Enable Serverless APIs
```bash
export PROJECT_ID="konnector-dentalos-prod"
export REGION="us-central1"

gcloud config set project $PROJECT_ID

# Enable only the minimal required serverless APIs
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    aiplatform.googleapis.com
```

### Step 2: Configure Secrets in Secret Manager
```bash
# Helper function
store_secret() {
    gcloud secrets create $1 --replication-policy="automatic" --quiet || true
    echo -n "$2" | gcloud secrets versions add $1 --data-file=-
}

# Add your credentials (free tiers)
store_secret "dentalos-database-url" "postgresql://user:password@ep-cool-db.us-east-2.aws.neon.tech/dentalos?sslmode=require"
store_secret "dentalos-gemini-key" "AIzaSy_YOUR_GEMINI_API_KEY"
store_secret "dentalos-whatsapp-token" "EAAG_YOUR_WHATSAPP_TOKEN"
store_secret "dentalos-stripe-secret" "sk_live_YOUR_STRIPE_KEY"
store_secret "dentalos-razorpay-secret" "YOUR_RAZORPAY_SECRET"
```

### Step 3: Build & Deploy Container to Cloud Run (Scale-to-Zero)
```bash
# 1. Build container image via Cloud Build
gcloud builds submit --config=cloudbuild.yaml .

# 2. Deploy to Cloud Run with scale-to-zero ($0 idle cost)
gcloud run deploy konnector-ai-dentalos \
    --image=gcr.io/$PROJECT_ID/konnector-ai-dentalos:latest \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --port=3000 \
    --min-instances=0 \
    --max-instances=5 \
    --memory=1Gi \
    --cpu=1 \
    --concurrency=80 \
    --timeout=120 \
    --set-env-vars="NODE_ENV=production,PORT=3000,NEXT_PUBLIC_APP_URL=https://care.konnectordental.app" \
    --set-secrets="DATABASE_URL=dentalos-database-url:latest,GEMINI_API_KEY=dentalos-gemini-key:latest,WHATSAPP_CLOUD_API_ACCESS_TOKEN=dentalos-whatsapp-token:latest,STRIPE_SECRET_KEY=dentalos-stripe-secret:latest,RAZORPAY_KEY_SECRET=dentalos-razorpay-secret:latest"
```

### Step 4: Map Custom Domain with Free Google SSL (Eliminates \$18/mo Load Balancer)
```bash
# Map your custom domain directly to Cloud Run
gcloud beta run domain-mappings create \
    --service=konnector-ai-dentalos \
    --domain=care.konnectordental.app \
    --region=$REGION

# This outputs DNS CNAME / A records. Add them to your DNS provider (Cloudflare/GoDaddy/Route53).
# Google will automatically provision a free, auto-renewing SSL certificate within 15 minutes!
```

---

## 🛡️ 4. Pragmatic Healthcare Compliance (Zero Added Cost)

Instead of paying for expensive enterprise BAA lock-ins and dedicated HSM key infrastructure:
1. **Encryption in Transit**: Enforced TLS 1.3 HTTPS via Cloud Run.
2. **Encryption at Rest**: Standard AES-256 encryption provided automatically by PostgreSQL and GCP.
3. **Explicit Digital Consent**: Patient intake forms and WhatsApp opt-ins require explicit digital consent checkmarks adhering to India DPDPA 2023 and US healthcare privacy guidelines.
4. **Application Audit Trail**: All clinical record updates and staff logins are recorded in the application's internal `audit_logs` table (viewable at `/settings`), with zero external SIEM/Cloud Logging storage costs.

---

## 📈 5. Future Enterprise Scaling Path (When You Reach 500+ Clinics)

When the business has grown to 500+ clinics and generates recurring SaaS revenue, you can seamlessly upgrade to the enterprise setup:
- Add a **Cloud SQL HA Multi-Zone cluster** for enterprise failover.
- Introduce **Global Cloud Load Balancing** and **Cloud Armor WAF**.
- Provision **Serverless VPC Access** connectors for private internal subnet peering.
- Migrate to **Vertex AI Vector Search endpoints** for datasets exceeding 1,000,000 document chunks.
