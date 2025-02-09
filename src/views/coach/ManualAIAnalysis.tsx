import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { getAIAnalysis } from '../../services/analysis';
import ReactMarkdown from 'react-markdown';
import { characteristics } from '../../data/characteristics';
import { harmonicLevels } from '../../data/harmonicLevels';

const analysisButtons = [
  { id: 'intro', label: 'Intro to Report', query: 'Summarize my assessment results, highlighting key insights and themes. Provide a clear overview of my traits, Harmonic Scale position, and areas for personal and professional growth.' },
  { id: 'traits', label: 'Trait Insights', query: 'Analyze all 12 traits in the Being, Doing, and Having categories. Provide insights into each trait, highlighting my scores, how they reflect my current behaviors, and their impact on my daily actions. Identify the most notable traits in each category (high-performing or requiring attention) and explain their role in shaping my personal and professional dynamics.' },
  { id: 'harmonic', label: 'Harmonic Scale', query: 'Explain my position on the Harmonic Scale. How does my emotional expression influence my traits and behaviors? Provide examples of how this interaction impacts my decision-making, relationships, and daily actions' },
  { id: 'strengths', label: 'Key Strengths', query: 'Identify my strongest traits and explain how I can use them to overcome challenges and achieve success. Offer examples of how these strengths can be applied in both personal and professional settings.' },
  { id: 'breakthrough', label: 'Breakthrough Insights', query: 'Break down my Critical, Development, and Growth Zones. Highlight which traits need immediate focus, which ones have potential for steady improvement, and which traits can be leveraged for maximum success.' },
  { id: 'professional', label: 'Professional Insights', query: 'Analyze how my traits manifest in professional contexts, including leadership, teamwork, communication, adaptability, and problem-solving. Provide actionable strategies to enhance my effectiveness in the workplace.' },
  { id: 'relationships', label: 'Relationship Insights', query: 'Provide insights into how my traits and Harmonic Scale position influence my relationships. Offer strategies to improve communication, build trust, and strengthen personal and professional connections.' },
  { id: 'recommendations', label: 'Action Steps', query: 'Based on my assessment, provide clear and specific action steps I can take to improve my traits, elevate my Harmonic Scale position, and achieve my personal and professional goals. Include both short-term and long-term recommendations.' },
];

export function ManualAIAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Array<{id: string; content: string; sender: 'user' | 'ai'}>>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [harmonicScores, setHarmonicScores] = useState<Record<string, number>>({});
  const [inputMessage, setInputMessage] = useState('');

  const formatDataForAI = (prompt: string) => {
    // Format characteristic scores
    const characteristicDetails = characteristics.map(char => {
      const score = scores[char.id] || 0;
      return `${char.name}: ${score}%`;
    }).join('\n');

    // Get dominant harmonic level
    const harmonicEntries = Object.entries(harmonicScores);
    const dominantHarmonic = harmonicEntries.reduce((prev, curr) => 
      (curr[1] > prev[1] ? curr : prev), harmonicEntries[0]);
    const dominantLevel = harmonicLevels.find(level => level.id === parseInt(dominantHarmonic[0]));

    // Format all harmonic scores
    const harmonicDetails = harmonicLevels
      .sort((a, b) => (harmonicScores[b.id] || 0) - (harmonicScores[a.id] || 0))
      .map(level => `${level.name}: ${harmonicScores[level.id] || 0}%`)
      .join('\n');

    return `
Assessment Results:

Characteristics:
${characteristicDetails}

Harmonic Scale:
Dominant Level: ${dominantLevel?.name} (${dominantHarmonic[1]}%)

Detailed Harmonic Levels:
${harmonicDetails}

Based on these results, ${prompt}
`;
  };

  const handleScoreChange = (id: string, value: string, isHarmonic: boolean = false) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    if (isHarmonic) {
      setHarmonicScores(prev => ({ ...prev, [id]: numValue }));
    } else {
      setScores(prev => ({ ...prev, [id]: numValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    await handleAnalyze(inputMessage);
    setInputMessage('');
  };

  const handleAnalyze = async (prompt: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError('');
      
      const userMessage = {
        id: Date.now().toString(),
        content: prompt,
        sender: 'user' as const
      };
      setMessages(prev => [...prev, userMessage]);

      const formattedPrompt = formatDataForAI(prompt);
      const response = await getAIAnalysis(formattedPrompt);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai' as const
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error getting AI analysis:', err);
      setError('Failed to get AI analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/coach" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <Brain className="w-12 h-12 text-white" />
          <div>
            <h1 className="text-3xl font-bold text-white">Manual AI Analysis</h1>
            <p className="text-white/80">Enter scores manually to get AI analysis</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Characteristic Scores</h2>
            <div className="grid gap-4">
              {characteristics.map(char => (
                <div key={char.id} className="flex items-center gap-4">
                  <label className="text-white w-32">{char.name}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[char.id] || ''}
                    onChange={(e) => handleScoreChange(char.id, e.target.value)}
                    className="w-24 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    placeholder="0-100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Harmonic Scores</h2>
            <div className="grid gap-4">
              {harmonicLevels.map(level => (
                <div key={level.id} className="flex items-center gap-4">
                  <label className="text-white w-32">{level.name}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={harmonicScores[level.id] || ''}
                    onChange={(e) => handleScoreChange(level.id, e.target.value, true)}
                    className="w-24 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 
                      focus:border-white/40 focus:outline-none"
                    placeholder="0-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysisButtons.map(button => (
              <button
                key={button.id}
                onClick={() => handleAnalyze(button.query)}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
                  transition-all disabled:opacity-50 text-sm"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">AI Analysis</h2>
          
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
                        h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
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
              <div className="text-white/60">AI is analyzing...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about these results..."
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