import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { patientData, resourceData, alerts } from '../data/dashboardData';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const suggestedQuestions = [
  'Which PHCs need immediate attention?',
  'Which medicines are running low?',
  "What are today's critical alerts?",
  'Give me district health summary.',
  'Recommend resource redistribution.',
];

export const AICopilot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Hello! I am your AI Health Copilot. How can I assist you with the district health data today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an AI Health Copilot.
You assist users with district health data.
Here is the current dashboard data as JSON:
Patient Data: ${JSON.stringify(patientData)}
Resource Data: ${JSON.stringify(resourceData)}
Alerts: ${JSON.stringify(alerts)}

Use this data to answer the user's questions. Provide structured, clear, and concise answers in Markdown format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentInput,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const responseText = response.text || 'I could not generate a response.';
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', content: responseText },
      ]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'model', content: `**Error:** ${error.message || 'Something went wrong while connecting to the AI.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    // Let user click send, or we can send immediately. Let's just set input for now to let user review.
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-128px)]">
        <div className="bg-white rounded-t-xl border-t border-x border-gray-100 shadow-sm p-6 flex-none">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Health Copilot</h2>
              <p className="text-sm text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white border-x border-gray-100 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-600 ml-3'
                      : 'bg-indigo-100 text-indigo-600 mr-3'
                  }`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`px-5 py-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 bg-indigo-100 text-indigo-600 mr-3">
                  <Bot size={16} />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="text-sm font-medium text-gray-500">Generating response...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm p-4 flex-none">
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(q)}
                className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the district health status..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
