'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Bot, User, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/lib/store/demoStore';
import { cn } from '@/lib/utils';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatOpen = useDemoStore((state) => state.chatOpen);
  const setChatOpen = useDemoStore((state) => state.setChatOpen);
  const chatMessages = useDemoStore((state) => state.chatMessages);
  const addChatMessage = useDemoStore((state) => state.addChatMessage);
  const member = useDemoStore((state) => state.member);
  const accountManager = useDemoStore((state) => state.accountManager);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addChatMessage({ sender: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            member,
            portfolio: useDemoStore.getState().portfolio,
            plan: useDemoStore.getState().plan
          }
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      addChatMessage({ sender: 'ai', content: data.response });
    } catch (error) {
      addChatMessage({
        sender: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bbr-burgundy text-white shadow-lg hover:bg-bbr-burgundy-light transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-slideIn">
      <div className="flex flex-col rounded-2xl border border-border bg-white shadow-soft overflow-hidden h-[32rem] max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-ink-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bbr-burgundy">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Cellar Concierge</p>
              <p className="text-xs text-muted">AI + {accountManager.name}</p>
            </div>
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="rounded-full p-1 hover:bg-ink-100 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 mx-auto mb-3">
                <Wine className="h-6 w-6 text-muted" />
              </div>
              <p className="text-sm text-muted mb-1">Welcome to your Cellar Concierge</p>
              <p className="text-xs text-muted">
                Ask me anything about your portfolio, this month's plan, or wine recommendations.
              </p>
            </div>
          )}

          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender !== 'user' && (
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    message.sender === 'ai' ? 'bg-bbr-burgundy' : 'bg-bbr-gold'
                  )}
                >
                  {message.sender === 'ai' ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              )}
              <div
                className={cn(
                  'chat-bubble',
                  message.sender === 'user'
                    ? 'chat-bubble-user'
                    : message.sender === 'ai'
                    ? 'chat-bubble-ai'
                    : 'chat-bubble-am'
                )}
              >
                {message.sender === 'am' && (
                  <p className="text-xs font-medium text-bbr-gold mb-1">{accountManager.name}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bbr-burgundy">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your cellar..."
              className="flex-1 resize-none rounded-lg border border-border bg-ink-50 px-3 py-2 text-sm placeholder:text-muted focus:border-bbr-burgundy focus:outline-none focus:ring-1 focus:ring-bbr-burgundy"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 bg-bbr-burgundy hover:bg-bbr-burgundy-light"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted mt-2 text-center">
            Powered by Ragu.AI
          </p>
        </div>
      </div>
    </div>
  );
}
