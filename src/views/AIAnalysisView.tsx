import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ResultsGraph } from '../components/ResultsGraph';
import { HarmonicGraph } from '../components/HarmonicGraph';
import { useAssessment } from '../contexts/AssessmentContext';
import { getAIAnalysis } from '../services/analysis';
import { useResults } from '../contexts/ResultsContext';
import { auth } from '../lib/firebase';
import { checkCoachAIAccess } from '../lib/auth';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

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

export function AIAnalysisView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { scores, harmonicScores, setScores, setHarmonicScores, formatDataForAI } = useAssessment();
  const { getResults } = useResults();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadResults = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const targetUserId = searchParams.get('userId') || auth.currentUser.uid;
        
        // If accessing as coach, verify permissions
        if (targetUserId !== auth.currentUser.uid) {
          const hasAccess = await checkCoachAIAccess(auth.currentUser.uid);
          if (!hasAccess) {
            setError('You do not have access to AI analysis');
            setIsInitializing(false);
            return;
          }
        }

        if (!scores || !harmonicScores) {
          const results = await getResults(targetUserId, auth.currentUser.uid);
          if (results) {
            setScores(results.scores);
            setHarmonicScores(results.harmonicScores);
          } else {
            navigate('/results');
          }
        }
      } catch (error) {
        console.error('Error loading results:', error);
        setError('Failed to load assessment results');
      } finally {
        setIsInitializing(false);
      }
    };

    loadResults();
  }, [scores, harmonicScores, getResults, setScores, setHarmonicScores, navigate, searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      const formattedPrompt = formatDataForAI(content);
      const response = await getAIAnalysis(formattedPrompt);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
    }
  };

  const handleButtonClick = (query: string) => {
    if (!isLoading) {
      sendMessage(query);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white">Loading results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">{error}</h1>
            <p className="text-white/80 mb-4">Please contact your coach for assistance</p>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
            >
              Back to Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!scores || !harmonicScores) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">No Assessment Results Found</h1>
            <p className="text-white/80">Please complete the assessment first to get AI analysis</p>
          </div>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:scale-105 transition-all"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/results" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </Link>

        {/* Modified Header with Logo */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Brain className="w-12 h-12 text-white" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">AI Analysis Report</h1>
            <p className="text-white/80">Get detailed insights about your assessment results</p>
          </div>
        </div>

        {/* Results Graphs - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass-effect rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Characteristic Profile
            </h2>
            <div className="h-[300px] overflow-y-auto custom-scrollbar">
              <ResultsGraph scores={scores} compact={true} />
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Harmonic Scale Profile
            </h2>
            <div className="h-[300px] overflow-y-auto custom-scrollbar">
              <HarmonicGraph scores={harmonicScores} compact={true} />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="glass-effect rounded-3xl p-6 mb-6">
          <div className="h-[500px] overflow-y-auto custom-scrollbar mb-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
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
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-white/60">Human Insights AI is analyzing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your results..."
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

        {/* Analysis Buttons */}
        <div className="glass-effect rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysisButtons.map(button => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.query)}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
                  transition-all disabled:opacity-50 text-sm"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}