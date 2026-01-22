import { NextRequest, NextResponse } from 'next/server';
import { RaguClient } from '@/lib/ragu/raguClient';

// Types for the chat context
interface ChatContext {
  member: {
    name: string;
    motives: Record<string, number>;
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
}

// Mock responses for demo mode
// Used as fallback when Ragu API is unavailable
const generateMockResponse = (message: string, context: ChatContext): string => {
  const lowerMessage = message.toLowerCase();

  // Portfolio questions
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('cellar') || lowerMessage.includes('collection')) {
    const totalBottles = context.portfolio?.reduce((sum, item) => sum + item.bottles, 0) || 18;
    const totalValue = context.portfolio?.reduce((sum, item) => sum + item.indicativeValue, 0) || 4230;
    const regions = [...new Set(context.portfolio?.map(item => item.region) || ['Bordeaux', 'Burgundy', 'Rhône'])];

    return `Your cellar currently holds ${totalBottles} bottles across ${regions.length} regions: ${regions.slice(0, 3).join(', ')}${regions.length > 3 ? ` and ${regions.length - 3} more` : ''}.\n\nIndicative portfolio value is £${totalValue.toLocaleString()}. The market has been particularly strong for Burgundy and left-bank Bordeaux recently.\n\nWould you like me to suggest ways to diversify or identify bottles approaching their optimal drinking window?`;
  }

  // Plan questions
  if (lowerMessage.includes('plan') || lowerMessage.includes('month') || lowerMessage.includes('recommendation') || lowerMessage.includes('buy')) {
    const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long' });
    return `For your ${currentMonth} allocation, I'm focusing on your investment-forward profile while ensuring you have some bottles ready to enjoy.\n\nMy top picks this month:\n• **Château Léoville-Barton 2018** (£85) - Strong appreciation potential, Saint-Julien is performing well\n• **Domaine de la Côte de Beaune 2021** (£62) - Entry point to a rising Burgundy producer\n• **Luis Seabra Xisto Ilimitado 2020** (£38) - Excellent value, Douro discovery\n\nThis leaves £65 of your £250 budget. Want me to suggest how to allocate the remainder?`;
  }

  // Investment questions
  if (lowerMessage.includes('invest') || lowerMessage.includes('value') || lowerMessage.includes('appreciation') || lowerMessage.includes('sell')) {
    return `Based on current market trends and your portfolio composition:\n\n**Strong performers to hold:**\n• Your 2019 Burgundies are appreciating at 8-12% annually\n• The 2018 Bordeaux vintages continue to climb post en primeur\n\n**Potential exit candidates:**\n• If you're looking to realize gains, your Châteauneuf-du-Pape 2017 has reached near-peak pricing\n\n**Watch list:**\n• The 2022 vintage is showing exceptional quality signals - consider allocating more here\n\nShall I analyze specific bottles in your cellar for sale timing?`;
  }

  // Taste/drinking questions
  if (lowerMessage.includes('drink') || lowerMessage.includes('taste') || lowerMessage.includes('ready') || lowerMessage.includes('dinner')) {
    return `Looking at your cellar and upcoming drink windows:\n\n**Ready now:**\n• Rhône 2018s are drinking beautifully\n• Your New Zealand Pinot Noir 2020 is at peak\n\n**Hold for 2-3 more years:**\n• The Barolo needs time\n• Your 2019 Bordeaux is still tight\n\n**Special occasion picks:**\n• For entertaining, I'd recommend the Champagne you picked up last spring - impressive but not ostentatious\n\nPlanning something specific? I can suggest pairings.`;
  }

  // BBR inventory / stock questions
  if (lowerMessage.includes('stock') || lowerMessage.includes('inventory') || lowerMessage.includes('available') || lowerMessage.includes('bbr')) {
    return `I have access to the full BBR inventory. Based on your profile, here are some highlights from current stock:\n\n**New Arrivals:**\n• 2021 Burgundy whites are landing - exceptional vintage for Meursault and Puligny\n• 2019 Barolo - some excellent producers at reasonable prices\n\n**Limited Allocation:**\n• Domaine de la Romanée-Conti 2021 - speak with your AM if interested\n• Screaming Eagle 2019 - allocated bottles remaining\n\n**Value Picks:**\n• Portuguese reds under £30 showing incredible quality\n• Languedoc 2020s for everyday drinking\n\nWhat style or region interests you most?`;
  }

  // Greeting or general
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm your Cellar Concierge, here to help you make the most of your £250 monthly allocation and manage your growing collection.\n\nI can help you with:\n• **This month's plan** - reviewing recommendations and alternatives\n• **Portfolio analysis** - value tracking, drink windows, and gaps\n• **Market insights** - what's appreciating, what's drinking well\n• **Selling** - identifying exit opportunities\n\nWhat would you like to explore?`;
  }

  // Default helpful response
  return `That's an interesting question. Based on your collector profile (investment-forward with a balanced approach to drinking stock), I'd suggest considering:\n\n1. Your current allocation leans 60% investment / 40% drinking stock\n2. The market is particularly favorable for 2022 Burgundy right now\n3. Your portfolio could use more representation from Italy\n\nWould you like me to dive deeper into any of these areas, or is there something specific about your cellar you'd like to discuss?`;
};

// Create Ragu client if credentials are available
function createRaguClient(): RaguClient | null {
  const apiKey = process.env.RAGU_API_KEY;
  const assistantId = process.env.RAGU_ASSISTANT_ID;

  if (!apiKey || !assistantId) {
    return null;
  }

  return new RaguClient({
    apiKey,
    assistantId,
    baseUrl: process.env.RAGU_BASE_URL || 'https://sdk.ragu.ai',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Try to use the real Ragu API
    const raguClient = createRaguClient();

    if (raguClient) {
      try {
        console.log('Using Ragu API for chat...');
        const result = await raguClient.chat({
          message,
          cellarContext: {
            portfolio: context?.portfolio,
            motives: context?.member?.motives,
            constraints: context?.member?.constraints,
            currentPlan: context?.plan,
          },
        });

        return NextResponse.json({
          response: result.response,
          sources: result.sources,
          mode: 'ragu',
        });
      } catch (error) {
        console.error('Ragu API call failed, falling back to mock:', error);
        // Fall through to mock response
      }
    }

    // Fallback to mock responses
    console.log('Using mock responses for chat...');
    // Simulate a small delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = generateMockResponse(message, context);
    return NextResponse.json({ response, mode: 'mock' });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
