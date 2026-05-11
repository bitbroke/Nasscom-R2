# 🏛️ 4-Agent Council — On-Prem AI Ticket Automation

> Privacy-first, multi-agent AI system for intelligent ticket routing, classification, and resolution. Powered by a 4-Agent "Council" architecture with on-premise ONNX inference and optional cloud LLM synthesis.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎯 Problem Statement

Enterprise helpdesks handle thousands of daily tickets containing sensitive PII that gets exposed to third-party platforms. Engineers waste 60–70% of their time on repetitive L1 issues.

## ✨ Solution: The 4-Agent Council

```
① Rate Limiting (Upstash Redis)
         ↓
┌─────────────────────────────────────┐
│ 🛡️ Agent 1: ANALYSER (Bouncer)     │
│ • BERT NER + Regex PII scrubbing   │
│ • 384-dim embedding generation      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 📚 Agent 2: MANAGER COUNCIL (Lib)  │
│ • Hybrid Search (semantic+lexical) │
│ • Majority-vote category bid        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ ⚖️ Agent 3: TRIAGE DECIDER (Judge) │
│ • ONNX Random Forest inference      │
│ • ≥70% + agree → APPROVED          │
│ • Otherwise → ESCALATE             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ ✍️ Agent 4: SYNTHESIS (Writer)      │
│ • Skill DAG runbook from DB         │
│ • Cloud: Groq Llama 3.3 formatting │
│ • Air-Gapped: Raw runbook output    │
└─────────────────────────────────────┘
```

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion, Shadcn UI |
| Backend | Next.js API Routes, 4-Agent Council Pipeline |
| ML | @xenova/transformers (NER + Embeddings), onnxruntime-web (RF) |
| Database | Supabase PostgreSQL + pgvector + tsvector (hybrid search) |
| AI/LLM | Groq Cloud (Llama 3.3 70B) — optional, supports air-gapped |
| Security | Upstash Redis (Rate Limiting), Local BERT NER (PII) |

## 🚀 Getting Started

```bash
git clone https://github.com/bitbroke/Nasscom-R2.git
cd Nasscom-R2 && npm install
cp .env.example .env.local  # Edit with your keys
```

### Database Setup
Run in Supabase SQL Editor: `supabase/schema.sql` then `supabase/seed_skills.sql`

### Data Pipeline
```bash
node scripts/prepare_dataset.mjs       # Filter Kaggle → English
pip install scikit-learn skl2onnx sentence-transformers pandas
python scripts/train_rf.py              # Train ONNX model
node scripts/seed_data.mjs              # Seed into Supabase
```

### Run
```bash
npm run dev    # http://localhost:3000
npm run build  # Production build
npm test       # Unit tests
```

## 📁 Structure

```
├── app/page.tsx                  # Submission portal (4-agent UI)
├── app/admin/page.tsx            # Admin triage dashboard
├── app/api/process-ticket/       # 4-Agent Council API
├── lib/agents/                   # Analyser, Council, Triage, Synthesis
├── lib/ml.ts                     # NER, Embedding, ONNX singletons
├── scripts/                      # Data prep, training, seeding
├── supabase/                     # Schema + seed SQL
└── public/models/                # ONNX model + class map
```

## 🔐 Security
- **Zero-Trust**: PII redacted locally before any external call
- **Dual-Layer**: BERT NER + Regex redaction
- **On-Prem ONNX**: No cloud dependency for classification
- **Rate Limiting**: 5 req/min per IP
- **Air-Gapped Mode**: Full operation without internet

## 🏆 NASSCOM Hackathon 2026
Built for the NASSCOM AI Hackathon — Intelligent Ticket Routing + Enterprise Knowledge Assistant.
