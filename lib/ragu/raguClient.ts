/**
 * Ragu SDK Client for Cellar Concierge
 *
 * Integrates with the Ragu RAG pipeline for AI-powered wine recommendations
 * and chat functionality. The BBR inventory has been pre-loaded into Ragu.
 */

// Types
export interface RaguConfig {
  apiKey: string;
  assistantId: string;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  userId?: string;
  cellarContext?: {
    portfolio?: Array<{
      name: string;
      region: string;
      vintage: number;
      bottles: number;
      purchasePrice: number;
      indicativeValue: number;
    }>;
    motives?: Record<string, number>;
    constraints?: {
      maxPrice: number;
      avoidRegions: string[];
      drinkWindowFocus: string;
    };
    currentPlan?: {
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

export interface ChatResponse {
  response: string;
  sources?: Array<{
    document_name: string;
    chunk_text: string;
    score: number;
  }>;
}

export interface SearchResult {
  document_name: string;
  chunk_text: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: string;
  name: string;
  created_at: string;
  status: string;
}

/**
 * Ragu SDK Client
 *
 * Connects to Ragu's RAG API for chat and search functionality.
 * The assistant has access to the full BBR wine inventory via Strands.
 */
export class RaguClient {
  private apiKey: string;
  private assistantId: string;
  private baseUrl: string;

  constructor(config: RaguConfig) {
    this.apiKey = config.apiKey;
    this.assistantId = config.assistantId;
    this.baseUrl = config.baseUrl || 'https://sdk.ragu.ai';
  }

  /**
   * Send a chat message to the Ragu assistant
   * The assistant has access to BBR inventory via RAG
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    // Build context-enhanced prompt
    let enhancedPrompt = request.message;

    // Add cellar context if provided
    if (request.cellarContext) {
      const contextParts: string[] = [];

      if (request.cellarContext.portfolio && request.cellarContext.portfolio.length > 0) {
        const portfolioSummary = request.cellarContext.portfolio
          .slice(0, 5)
          .map(w => `${w.name} (${w.vintage}, ${w.bottles} bottles, £${w.indicativeValue})`)
          .join(', ');
        contextParts.push(`[User's cellar includes: ${portfolioSummary}]`);
      }

      if (request.cellarContext.motives) {
        const topMotives = Object.entries(request.cellarContext.motives)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([k]) => k);
        contextParts.push(`[User priorities: ${topMotives.join(', ')}]`);
      }

      if (request.cellarContext.constraints) {
        const { maxPrice, avoidRegions, drinkWindowFocus } = request.cellarContext.constraints;
        const constraintParts = [];
        if (maxPrice) constraintParts.push(`max £${maxPrice} per bottle`);
        if (avoidRegions?.length) constraintParts.push(`avoiding ${avoidRegions.join(', ')}`);
        if (drinkWindowFocus) constraintParts.push(`focus: ${drinkWindowFocus}`);
        if (constraintParts.length) {
          contextParts.push(`[Constraints: ${constraintParts.join('; ')}]`);
        }
      }

      if (request.cellarContext.currentPlan) {
        const { budget, items, status } = request.cellarContext.currentPlan;
        const spent = items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0;
        contextParts.push(`[Current plan: ${status}, £${spent}/£${budget} allocated]`);
      }

      if (contextParts.length > 0) {
        enhancedPrompt = `${contextParts.join(' ')}\n\nUser question: ${request.message}`;
      }
    }

    const response = await fetch(`${this.baseUrl}/v2/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': this.apiKey,
      },
      body: JSON.stringify({
        user_prompt: enhancedPrompt,
        assistant_uuid: this.assistantId,
        user_id: request.userId || 'cellar-concierge-demo',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ragu API error:', response.status, errorText);
      throw new Error(`Ragu API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract response from Ragu format
    // The API returns { response: string, sources?: [...] }
    return {
      response: data.response || data.message || data.content || 'I apologize, I could not generate a response.',
      sources: data.sources || data.retrieved_chunks || [],
    };
  }

  /**
   * Search the BBR inventory via RAG
   */
  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    const response = await fetch(`${this.baseUrl}/v2/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': this.apiKey,
      },
      body: JSON.stringify({
        query,
        assistant_uuid: this.assistantId,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ragu search error:', response.status, errorText);
      throw new Error(`Ragu search error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || data.chunks || [];
  }

  /**
   * List documents in the assistant's knowledge base
   */
  async listDocuments(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/v2/documents?assistant_uuid=${this.assistantId}`, {
      method: 'GET',
      headers: {
        'X-API-TOKEN': this.apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ragu documents error:', response.status, errorText);
      throw new Error(`Ragu documents error: ${response.status}`);
    }

    const data = await response.json();
    return data.documents || data.data || [];
  }

  /**
   * Health check for the Ragu API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'X-API-TOKEN': this.apiKey,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance for app-wide use
let raguClientInstance: RaguClient | null = null;

/**
 * Get or create the Ragu client instance
 * Uses environment variables for configuration
 */
export function getRaguClient(): RaguClient | null {
  if (raguClientInstance) {
    return raguClientInstance;
  }

  const apiKey = process.env.RAGU_API_KEY;
  const assistantId = process.env.RAGU_ASSISTANT_ID;

  if (!apiKey || !assistantId) {
    console.warn('Ragu API credentials not configured. Using mock mode.');
    return null;
  }

  raguClientInstance = new RaguClient({
    apiKey,
    assistantId,
    baseUrl: process.env.RAGU_BASE_URL || 'https://sdk.ragu.ai',
  });

  return raguClientInstance;
}

// Legacy exports for backwards compatibility
import { PlanInput } from '@/lib/ai/simulatedAi';

export async function generatePlan(input: PlanInput) {
  const response = await fetch('/api/ragu/generatePlan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function summarizeForAM(input: PlanInput) {
  const response = await fetch('/api/ragu/summarizeForAM', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function recommendSubstitutes(input: PlanInput) {
  const response = await fetch('/api/ragu/recommendSubstitutes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return response.json();
}
