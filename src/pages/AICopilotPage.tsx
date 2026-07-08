import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, Trash2, Plus, MessageSquare, Zap, Clock } from 'lucide-react';
import type { ChatMessage, Conversation } from '../types';
import { AI_QUICK_PROMPTS, AI_MOCK_RESPONSES } from '../data/phcData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import clsx from 'clsx';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getAIResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('critical') || lower.includes('alert')) return AI_MOCK_RESPONSES['critical'];
  if (lower.includes('medicine') || lower.includes('stock') || lower.includes('supply')) return AI_MOCK_RESPONSES['medicine'];
  if (lower.includes('vaccination') || lower.includes('vaccine') || lower.includes('coverage')) return AI_MOCK_RESPONSES['vaccination'];
  if (lower.includes('outbreak') || lower.includes('risk') || lower.includes('disease') || lower.includes('high')) return AI_MOCK_RESPONSES['outbreak'];
  if (lower.includes('realloc') || lower.includes('resource') || lower.includes('deploy') || lower.includes('suggest') || lower.includes('improve')) return AI_MOCK_RESPONSES['reallocation'];
  return AI_MOCK_RESPONSES['default'];
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              style={{ animation: `bounceDot 1.4s ease-in-out ${i * 0.16}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 leading-relaxed text-sm">
      {lines.map((line, i) => {
        if (line.includes('|') && line.startsWith('|')) {
          const cells = line.split('|').filter((c) => c.trim());
          if (cells.every((c) => /^[-:]+$/.test(c.trim()))) return null;
          return (
            <div key={i} className="flex gap-3 text-xs border-b border-gray-100 dark:border-gray-700 py-1">
              {cells.map((cell, j) => (
                <span key={j} className={clsx('flex-1', j === 0 ? 'font-semibold' : '')}>
                  {renderInline(cell.trim())}
                </span>
              ))}
            </div>
          );
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <p key={i} className="flex gap-2">
              <span className="text-blue-500 shrink-0">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </p>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          return <p key={i} className="pl-1">{renderInline(line)}</p>;
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={clsx('flex items-end gap-3 animate-fade-in', isUser ? 'flex-row-reverse' : '')}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[75%] px-4 py-3 rounded-2xl shadow-sm',
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
        )}
      >
        {isUser
          ? <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          : <MarkdownText text={msg.content} />
        }
        <p className={clsx(
          'text-[10px] mt-1.5 tabular-nums',
          isUser ? 'text-blue-200 text-right' : 'text-gray-400 dark:text-gray-500'
        )}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function newConversation(): Conversation {
  return {
    id: generateId(),
    title: 'New Conversation',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function AICopilotPage() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('healthos-conversations', []);
  const [activeId, setActiveId] = useLocalStorage<string | null>('healthos-active-conversation', null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length, isTyping]);

  const startNew = useCallback(() => {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setInput('');
  }, [setConversations, setActiveId]);

  useEffect(() => {
    if (conversations.length === 0) {
      startNew();
    } else if (!activeId || !conversations.find((c) => c.id === activeId)) {
      setActiveId(conversations[0].id);
    }
  }, []); // eslint-disable-line

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: trimmed, timestamp: new Date() };
    const title = trimmed.length > 38 ? trimmed.slice(0, 38) + '…' : trimmed;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, title: c.messages.length === 0 ? title : c.title, messages: [...c.messages, userMsg], updatedAt: new Date() }
          : c
      )
    );
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1200));

    const aiMsg: ChatMessage = { id: generateId(), role: 'assistant', content: getAIResponse(trimmed), timestamp: new Date() };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() } : c
      )
    );
    setIsTyping(false);
  }, [activeId, isTyping, setConversations]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        if (next.length > 0) setActiveId(next[0].id);
        else { const fresh = newConversation(); setActiveId(fresh.id); return [fresh]; }
      }
      return next;
    });
  };

  const hasMessages = (activeConversation?.messages.length ?? 0) > 0;

  return (
    <div className="flex h-full">
      {/* Conversation History Sidebar */}
      <div className="w-60 bg-gray-900 dark:bg-gray-950 text-white flex flex-col shrink-0 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-sm text-white">Conversations</h2>
          </div>
          <button
            onClick={startNew}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm py-2 rounded-xl transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-8">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={clsx(
                  'group flex items-start gap-2 px-3 py-2.5 cursor-pointer mx-2 rounded-xl mb-0.5 transition-colors',
                  conv.id === activeId ? 'bg-gray-700' : 'hover:bg-gray-800'
                )}
                onClick={() => setActiveId(conv.id)}
              >
                <MessageSquare className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 truncate font-medium">{conv.title}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(conv.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all shrink-0 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-800 text-[10px] text-gray-600 text-center">
          Saved in browser storage
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 min-w-0">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">HealthOS AI Copilot</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">District Health Intelligence Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!hasMessages && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">HealthOS AI Copilot</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm">
                  Your intelligent health management assistant for Kanpur District.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 justify-center mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  Quick Prompts
                </p>
                {AI_QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2.5 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeConversation?.messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts strip when chat started */}
        {hasMessages && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            <Zap className="w-4 h-4 text-yellow-500 shrink-0 self-center" />
            {AI_QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={isTyping}
                className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1.5 whitespace-nowrap transition-colors disabled:opacity-40 shrink-0"
              >
                {p.length > 38 ? p.slice(0, 38) + '…' : p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shrink-0">
          <div className="flex items-end gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:border-blue-400 dark:focus-within:border-blue-600 focus-within:bg-white dark:focus-within:bg-gray-800/80 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isTyping}
              placeholder="Ask about PHC status, alerts, resources…"
              className="flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none max-h-32"
              style={{ minHeight: '24px' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
