import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAIAnalysis } from '../services/analysis';

export function ChatTest() {
  const [messages, setMessages] = useState<Array<{id: string; content: string; sender: 'user' | 'ai'}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'user' as const
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // Get AI response
      const response = await getAIAnalysis(inputMessage);
      
      // Add AI message
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Brain className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Chat Test</h1>
            <p className="text-white/80">Test the AI Assistant integration</p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-6">
          <div className="h-[500px] overflow-y-auto custom-scrollbar mb-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-[80%] px-6 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.sender === 'user' ? (
                    message.content
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-white/60">AI is thinking...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 
                focus:border-white/40 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}