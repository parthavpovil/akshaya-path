# SaarthiAI — Backend API Documentation

Autonomous Government Scheme Document Processing System.

**Base URL:** `http://localhost:8000`

---

## Quick Start

```bash
# 1. Install dependencies
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env   # Set DATABASE_URL, OPENROUTER_API_KEY

# 3. Seed the database
python seed_db.py         # Citizens, employees, doc types, requirements
python seed_policies.py   # Policy documents for RAG compliance

# 4. Start the server
make backend
# or: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Architecture Overview

```
Frontend  →  FastAPI Backend  →  Tesseract Lambda (OCR)
                  ↓                      ↓ (webhook)
            PostgreSQL + pgvector   ←────┘
                  ↓
            Bedrock / OpenRouter (LLM)
                  ↓
            Compliance Report
```

### Processing Flow

```
1. User selects scheme → GET /api/v1/document-types
2. Get required docs   → GET /api/v1/requirements/by-type/{id}
3. Upload documents    → POST /api/v1/documents/upload (each file)
4. OCR completes       → POST /api/v1/documents/webhook (auto callback)
5. Submit request      → POST /api/v1/submit
   ├── Vault: checks existing OCR data
   ├── Department: fetches missing docs from other depts
   ├── Eligibility: deterministic rule check
   └── Compliance: RAG cross-check against policy laws
6. Track progress      → WS /ws/progress/{tracking_id}
```

---

## Health Check

### `GET /health`

```json
// Response 200
{ "status": "healthy", "service": "SaarthiAI" }
```

---

## Submit & Processing

### `POST /api/v1/submit`

The main endpoint. Runs the full processing pipeline: vault analysis → department fetch → eligibility check → RAG compliance assessment.

**Request:**
```json
{
  "aadhar_number": "123456789012",
  "document_request_type": "identity"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `aadhar_number` | string | 12-digit Aadhar number |
| `document_request_type` | string | Document type slug (`identity`, `blueprint`, `income`, `medical`) |

**Response 200:**
```json
{
  "tracking_id": 6,
  "status": "in_review",
  "message": "Document request submitted and processed successfully.",
  "compliance_report": {
    "Aadhar Card": {
      "compliant": true,
      "status": "compliant",
      "notes": "The document contains a valid Aadhar card with all required fields..."
    }
  }
}
```

**Response 404:** Citizen not found.

---

## Document Upload & OCR

### `POST /api/v1/documents/upload`

Uploads a file to the Tesseract Lambda OCR service. Creates a `Document` record with status `processing`. The OCR result arrives asynchronously via the webhook.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | The document file (PDF, image) |
| `citizen_aadhar` | string | 12-digit Aadhar number |
| `requirement_id` | integer | Requirement ID from `/requirements` |

**Response 200 (new upload):**
```json
{
  "already_exists": false,
  "document_id": 5,
  "job_id": "abc123",
  "s3_url": "https://s3.amazonaws.com/...",
  "status": "processing",
  "message": "File uploaded. OCR in progress. Await webhook callback."
}
```

**Response 200 (already processed):**
```json
{
  "already_exists": true,
  "job_id": "abc123",
  "file_url": "https://s3.amazonaws.com/...",
  "status": "completed",
  "message": "'Aadhar Card' already uploaded and processed for this citizen."
}
```

---

### `POST /api/v1/documents/webhook`

Called by the Tesseract Lambda when OCR completes. **Not called by the frontend.**

**Request:**
```json
{
  "job_id": "abc123",
  "status": "success",
  "ocr_text": "Name: Priya Nair\nAadhar: 1234 5678 9012\n...",
  "s3_key": "uploads/abc123.pdf"
}
```

**Response 200:**
```json
{
  "status": "received",
  "job_id": "abc123",
  "document_id": 5,
  "message": "Document 'Aadhar Card' updated to 'completed'."
}
```

---

### `GET /api/v1/documents/status/{job_id}`

Check OCR processing status.

**Response 200:**
```json
{
  "job_id": "abc123",
  "document_id": 5,
  "document_name": "Aadhar Card",
  "status": "completed",
  "file_url": "https://s3.amazonaws.com/...",
  "ocr_summary": {
    "Aadhar Card": {
      "doc_type": "identity",
      "raw_text": "Name: Priya Nair...",
      "summary_lines": ["Name: Priya Nair", "..."],
      "char_count": 245
    }
  }
}
```

| `status` values | Description |
|-----------------|-------------|
| `processing` | OCR in progress |
| `completed` | OCR done, `ocr_summary` available |
| `failed` | OCR failed |

---

### `GET /api/v1/documents/citizen/{citizen_aadhar}`

Get all documents for a citizen.

**Response 200:**
```json
[
  {
    "id": 5,
    "requirement_id": 1,
    "document_name": "Aadhar Card",
    "job_id": "abc123",
    "file_url": "https://s3.amazonaws.com/...",
    "status": "completed",
    "has_ocr": true
  }
]
```

---

## Document Types & Requirements (Admin)

### `GET /api/v1/document-types`

List all available document types (schemes).

**Response 200:**
```json
[
  { "id": 1, "name": "Identity Document", "slug": "identity", "description": "Proof of Identity" },
  { "id": 2, "name": "Building Blueprint", "slug": "blueprint", "description": "Architectural drawings" }
]
```

### `POST /api/v1/document-types`

**Request:**
```json
{ "name": "Tax Clearance", "slug": "tax", "description": "Tax compliance proof" }
```

**Response 200:**
```json
{ "id": 5, "name": "Tax Clearance", "slug": "tax" }
```

### `DELETE /api/v1/document-types/{dt_id}`

**Response 200:**
```json
{ "deleted": 5 }
```

---

### `GET /api/v1/requirements`

List all requirements across all document types.

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Aadhar Card",
    "ocr_mode": "tesseract",
    "is_mandatory": true,
    "document_type_id": 1,
    "document_type_name": "Identity Document",
    "document_type_slug": "identity"
  }
]
```

### `GET /api/v1/requirements/by-type/{document_type_id}`

Get requirements for a specific document type.

**Response 200:**
```json
[
  { "id": 1, "name": "Aadhar Card", "ocr_mode": "tesseract", "is_mandatory": true }
]
```

### `POST /api/v1/requirements`

**Request:**
```json
{
  "document_type_id": 1,
  "name": "Voter ID",
  "ocr_mode": "tesseract",
  "is_mandatory": false
}
```

| `ocr_mode` values | Description |
|-------------------|-------------|
| `tesseract` | Standard OCR via Tesseract Lambda |
| `llm_vision` | Vision model via Amazon Bedrock (for blueprints, images) |

**Response 200:**
```json
{ "id": 5, "name": "Voter ID" }
```

### `DELETE /api/v1/requirements/{req_id}`

**Response 200:**
```json
{ "deleted": 5 }
```

---

## Tracking

### `GET /api/v1/tracking`

List all submission tracking records.

**Response 200:**
```json
[
  {
    "id": 1,
    "citizen_id": 1,
    "employee_id": null,
    "document_request_type": "identity",
    "status": "in_review",
    "remarks": null,
    "created_at": "2026-02-28 01:00:00",
    "updated_at": "2026-02-28 01:05:00"
  }
]
```

### `PATCH /api/v1/tracking/{tracking_id}/status`

Update tracking status (used by employees to approve/reject).

**Request:**
```json
{
  "status": "approved",
  "remarks": "All documents verified.",
  "employee_id": 1
}
```

All fields are optional — only provided fields are updated.

**Response 200:**
```json
{ "tracking_id": 1, "status": "approved" }
```

| `status` values | Description |
|-----------------|-------------|
| `pending` | Initial state |
| `in_review` | Processing complete, awaiting employee review |
| `approved` | Employee approved |
| `rejected` | Employee rejected |

---

## Citizens & Employees

### `GET /api/v1/citizens`

**Response 200:**
```json
[
  { "id": 1, "name": "Priya Nair", "aadhar_number": "123456789012", "district": "Trivandrum" }
]
```

### `GET /api/v1/employees`

Returns active employees only.

**Response 200:**
```json
[
  { "id": 1, "name": "Anitha Krishnan", "department": "Revenue", "position": "Senior Officer", "email": "anitha.k@gov.in" }
]
```

---

## Vision Analysis (Bedrock)

### `POST /api/v1/vision/analyze-blueprint`

Analyzes a building blueprint using Amazon Bedrock vision model (Llama 4 Maverick).

**Request:**
```json
{
  "document_id": 5,
  "prompt": "Analyze this blueprint and verify structural compliance."
}
```

**Response 200:**
```json
{
  "is_blueprint_valid": true,
  "dimensions_found": "12m x 8m plot, 3-bedroom layout",
  "structural_components_found": ["RCC columns", "Load-bearing walls", "Staircase"],
  "compliance_issues": [],
  "overall_conclusion": "Blueprint meets KMBR 2019 requirements.",
  "confidence_score": 0.92
}
```

---

## Department Services

Internal APIs that simulate inter-department communication. Called automatically by the department agent during submit.

### `POST /api/v1/departments/revenue/generate-document`

**Request:**
```json
{ "citizen_id": "1", "document_type": "income_certificate" }
```

Valid types: `income_certificate`, `caste_certificate`

### `POST /api/v1/departments/tax/generate-document`

Valid types: `tax_clearance`, `pan_validation`

### `POST /api/v1/departments/land/generate-document`

Valid types: `property_ownership`, `land_record`

**Response 200 (all departments):**
```json
{
  "status": "success",
  "document_id": "REV-A1B2C3D4",
  "issued_at": "2026-02-28T03:00:00+00:00",
  "hash_signature": "hash_REV-A1B2C3D4"
}
```

---

## RAG Chat (Apply screen)

### `WS /api/v1/rag/ws`

Used by the Apply chat screen. Client sends JSON messages; server responds with a single JSON object containing the assistant reply.

**Connection:** `ws://localhost:8000/api/v1/rag/ws`

**Client sends (JSON):**
```json
{ "query": "What documents do I need for identity scheme?", "scheme_id": "identity" }
```

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | User message (required). |
| `scheme_id` | string | Optional document type slug for scheme-specific context. |

**Server responds (JSON):**
```json
{ "reply": "For the identity scheme you typically need..." }
```

The backend uses the policy vector DB (when available) for RAG context and OpenRouter LLM to generate the reply.

---

## WebSocket — Real-time Progress

### `WS /ws/progress/{tracking_id}`

Connect **before** calling `POST /submit`. Receives real-time events as the pipeline processes.

**Connection:** `ws://localhost:8000/ws/progress/{tracking_id}`

> **Note:** The `tracking_id` is created by the submit endpoint, so the frontend should predict the next ID or connect after the submit begins and poll any missed events.

**Messages received (JSON):**
```json
{ "stage": "identity",    "message": "Request initiated." }
{ "stage": "vault",       "message": "Vault: Checking 'Aadhar Card'..." }
{ "stage": "vault",       "message": "Vault: 'Aadhar Card' already processed ✔" }
{ "stage": "department",  "message": "Fetching 2 document(s) from departments..." }
{ "stage": "eligibility", "message": "Eligibility: Passed ✔" }
{ "stage": "compliance",  "message": "Compliance assessment complete ✔" }
{ "stage": "done",        "message": "Request processed successfully.", "data": { "tracking_id": 6, "status": "in_review" } }
```

| Stage | Description |
|-------|-------------|
| `identity` | Citizen verified, request created |
| `vault` | Checking/uploading documents, OCR |
| `department` | Fetching missing docs from other departments |
| `eligibility` | Deterministic rule validation |
| `compliance` | RAG cross-check against policy laws |
| `done` | Pipeline complete |

**To disconnect cleanly:**
```json
{ "action": "close" }
```

---

## Error Responses

All errors follow this format:

```json
{ "detail": "Error message describing what went wrong." }
```

| HTTP Code | Meaning |
|-----------|---------|
| `400` | Bad request / invalid input |
| `404` | Resource not found (citizen, document, requirement) |
| `500` | Internal server error |
| `502` | Upstream service error (Tesseract Lambda) |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (async: `postgresql+asyncpg://...`) |
| `OPENROUTER_API_KEY` | ✅ | API key for OpenRouter LLM (compliance assessment) |
| `LLM_MODEL` | ❌ | LLM model name (default: `openrouter/auto`) |
| `AWS_ACCESS_KEY_ID` | ❌ | For Bedrock vision analysis |
| `AWS_SECRET_ACCESS_KEY` | ❌ | For Bedrock vision analysis |
| `AWS_REGION` | ❌ | AWS region (default: `us-east-1`) |