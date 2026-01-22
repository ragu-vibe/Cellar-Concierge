# API Reference

This document details all APIs used by Cellar Concierge, including internal Next.js routes and external service integrations.

---

## Internal API Routes

These are Next.js API routes that handle requests from the frontend.

### Chat API

#### `POST /api/chat`

Main chat endpoint for AI-powered conversations.

**Request**:
```typescript
{
  message: string;
  context: {
    member: {
      name: string;
      motives: Record<string, number>;  // e.g., { investment: 0.8, discovery: 0.3 }
      constraints: {
        maxPrice: number;
        avoidRegions: string[];
        drinkWindowFocus: string;
      };
    };
    portfolio: Array<{
      name: string;
      region: string;
      vintage: number;
      bottles: number;
      purchasePrice: number;
      indicativeValue: number;
    }>;
    plan: {
      status: string;
      budget: number;
      items: Array<{
        name: string;
        price: number;
        quantity: number;
      }>;
    };
  };
}
```

**Response**:
```typescript
{
  response: string;
  sources?: Array<{
    document_name: string;
    chunk_text: string;
    score: number;
  }>;
}
```

**Behavior**:
- If Ragu credentials configured → uses Ragu AI
- If no credentials → returns mock responses

---

### BBR Integration Routes

These routes wrap BBR backend services. Currently return mock data.

#### `GET /api/bbr/inventory`

Fetch wine inventory.

**Response**:
```typescript
{
  wines: Array<{
    id: string;
    name: string;
    producer: string;
    region: string;
    country: string;
    grapes: string[];
    vintage: number;
    price_gbp: number;
    availability: number;
    scarcity_level: 'Low' | 'Medium' | 'High' | 'Ultra';
    critic_signal: number;
    drink_window_start: number;
    drink_window_end: number;
    tags: string[];
    image: string;
  }>;
}
```

---

#### `GET /api/bbr/portfolio?memberId={id}`

Fetch client's wine holdings.

**Query Parameters**:
- `memberId` (required): Client identifier

**Response**:
```typescript
{
  holdings: Array<{
    id: string;
    skuId: string;
    name: string;
    region: string;
    vintage: number;
    bottles: number;
    drinkWindow: {
      start: string;  // ISO date
      end: string;
    };
    indicativeValue: number;
    purchasePrice: number;
    tags: string[];
  }>;
}
```

---

#### `GET /api/bbr/allocations?memberId={id}`

Fetch exclusive allocations available to client.

**Query Parameters**:
- `memberId` (required): Client identifier

**Response**:
```typescript
{
  allocations: Array<{
    id: string;
    wine: {
      name: string;
      producer: string;
      vintage: number;
      region: string;
    };
    allocation: number;      // bottles allocated
    price_gbp: number;
    expires: string;         // ISO date
    notes: string;
  }>;
}
```

---

#### `POST /api/bbr/createDraftOrder`

Create a purchase order draft.

**Request**:
```typescript
{
  memberId: string;
  items: Array<{
    id: string;       // wine/SKU id
    quantity: number;
  }>;
}
```

**Response**:
```typescript
{
  orderId: string;
  status: 'draft';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price_gbp: number;
    subtotal: number;
  }>;
  total: number;
}
```

---

#### `POST /api/bbr/submitForAMReview`

Submit a plan for Account Manager review.

**Request**:
```typescript
{
  planId: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  plan: {
    id: string;
    status: 'pending_review';
    submittedAt: string;
  };
}
```

---

#### `POST /api/bbr/approvePlan`

Account Manager approves a client plan.

**Request**:
```typescript
{
  planId: string;
  amNote: string;
  edits?: Array<{
    action: 'add' | 'remove' | 'substitute';
    wineId: string;
    newWineId?: string;
    reason?: string;
  }>;
}
```

**Response**:
```typescript
{
  success: boolean;
  plan: {
    id: string;
    status: 'approved';
    approvedAt: string;
    amNote: string;
  };
}
```

---

#### `POST /api/bbr/createSellIntent`

Submit a wine for resale.

**Request**:
```typescript
{
  memberId: string;
  bottleId: string;
  details: {
    timeframe: string;     // e.g., "Within 1 month"
    targetPrice: number;
    reason: string;
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  sellIntent: {
    id: string;
    status: 'submitted';
    createdAt: string;
  };
}
```

---

### Ragu AI Helper Routes

These routes provide additional AI functionality.

#### `POST /api/ragu/generatePlan`

Generate an AI-recommended monthly plan.

**Request**:
```typescript
{
  memberId: string;
  profile: UserCellarProfile;  // See data models doc
  budget: number;
  month: string;
}
```

**Response**:
```typescript
{
  plan: {
    items: Array<{
      wineId: string;
      name: string;
      quantity: number;
      price: number;
      reason: string;
    }>;
    totalValue: number;
    objectives: string[];
  };
}
```

---

#### `POST /api/ragu/recommendSubstitutes`

Get substitute recommendations for a wine.

**Request**:
```typescript
{
  wineId: string;
  reason: 'out_of_stock' | 'price' | 'preference';
  profile: UserCellarProfile;
}
```

**Response**:
```typescript
{
  substitutes: Array<{
    wineId: string;
    name: string;
    price: number;
    similarity: number;
    reason: string;
  }>;
}
```

---

#### `POST /api/ragu/summarizeForAM`

Generate a summary of client plan for AM review.

**Request**:
```typescript
{
  planId: string;
  profile: UserCellarProfile;
}
```

**Response**:
```typescript
{
  summary: {
    clientName: string;
    strategyAlignment: string;
    keySelections: string[];
    concerns: string[];
    recommendations: string[];
  };
}
```

---

## External APIs

### Ragu AI API

**Base URL**: `https://sdk.ragu.ai` (configurable via `RAGU_BASE_URL`)

**Authentication**: `X-API-TOKEN` header with `RAGU_API_KEY`

#### `POST /v2/chat/messages`

Send a chat message to the Ragu assistant.

**Request**:
```typescript
{
  user_prompt: string;
  assistant_uuid: string;  // RAGU_ASSISTANT_ID
  user_id: string;
}
```

**Response**:
```typescript
{
  response: string;
  sources?: Array<{
    document_name: string;
    chunk_text: string;
    score: number;
  }>;
}
```

---

#### `POST /v2/search`

Search the knowledge base via RAG.

**Request**:
```typescript
{
  query: string;
  assistant_uuid: string;
  top_k: number;
}
```

**Response**:
```typescript
{
  results: Array<{
    document_name: string;
    chunk_text: string;
    score: number;
    metadata?: Record<string, unknown>;
  }>;
}
```

---

#### `GET /v2/documents?assistant_uuid={id}`

List documents in the knowledge base.

**Response**:
```typescript
{
  documents: Array<{
    id: string;
    name: string;
    created_at: string;
    status: string;
  }>;
}
```

---

#### `GET /health`

Health check endpoint.

**Response**: `200 OK` if healthy

---

### BBR Backend APIs (Production - Not Yet Integrated)

These endpoints will need to be implemented by BBR's backend team.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/inventory` | GET | Wine catalog with availability |
| `/portfolio/{memberId}` | GET | Client holdings |
| `/allocations/{memberId}` | GET | Exclusive allocations |
| `/orders/draft` | POST | Create draft order |
| `/plans/{id}/submit` | POST | Submit for AM review |
| `/plans/{id}/approve` | POST | AM approval |
| `/sell-intents` | POST | Create sell request |
| `/members/{id}` | GET | Member profile |
| `/members/{id}/preferences` | PUT | Update preferences |

---

### Third-Party APIs (Future Integration)

#### Wine Valuation
- **Liv-ex** - Fine wine exchange pricing
- **Wine-Searcher Pro** - Market prices

#### Critic Scores
- **Wine-Searcher API** - Aggregated scores
- **CellarTracker** - Community reviews

#### Delivery
- **DPD/Parcelforce** - Standard delivery
- **Specialized wine couriers** - Temperature-controlled

---

## Environment Variables

```bash
# Ragu AI
RAGU_API_KEY=your_api_key
RAGU_ASSISTANT_ID=your_assistant_id
RAGU_BASE_URL=https://sdk.ragu.ai

# BBR APIs (future)
BBR_API_BASE_URL=https://api.bbr.com
BBR_API_KEY=your_bbr_api_key

# Auth (future)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Feature flags
NEXT_PUBLIC_USE_LIVE_API=true
```

---

## Error Handling

All API routes follow consistent error responses:

```typescript
{
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}
```

**HTTP Status Codes**:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Internal server error
- `503` - Service unavailable (external API down)
