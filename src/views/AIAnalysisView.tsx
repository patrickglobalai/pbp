import { Font, StyleSheet } from "@react-pdf/renderer";
import { collection, getDocs, query, where } from "firebase/firestore";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Brain, Pencil, Send, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HarmonicGraph } from "../components/HarmonicGraph";
import { ResultsGraph } from "../components/ResultsGraph";
import { useAssessment } from "../contexts/AssessmentContext";
import { useResults } from "../contexts/ResultsContext";
import { checkCoachAIAccess } from "../lib/auth";
import { auth, db } from "../lib/firebase";
import { getAIAnalysis } from "../services/analysis";
import { Coach } from "../types/auth";
import { DB_URL } from "../utils/functions";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const analysisButtons = [
  {
    id: "intro",
    label: "Intro to Report",
    query:
      "Summarize my assessment results, highlighting key insights and themes. Provide a clear overview of my traits, Harmonic Scale position, and areas for personal and professional growth.",
  },
  {
    id: "traits",
    label: "Trait Insights",
    query:
      "Analyze all 12 traits in the Being, Doing, and Having categories. Provide insights into each trait, highlighting my scores, how they reflect my current behaviors, and their impact on my daily actions. Identify the most notable traits in each category (high-performing or requiring attention) and explain their role in shaping my personal and professional dynamics.",
  },
  {
    id: "harmonic",
    label: "Harmonic Scale",
    query:
      "Explain my position on the Harmonic Scale. How does my emotional expression influence my traits and behaviors? Provide examples of how this interaction impacts my decision-making, relationships, and daily actions",
  },
  {
    id: "strengths",
    label: "Key Strengths",
    query:
      "Identify my strongest traits and explain how I can use them to overcome challenges and achieve success. Offer examples of how these strengths can be applied in both personal and professional settings.",
  },
  {
    id: "breakthrough",
    label: "Breakthrough Insights",
    query:
      "Break down my Critical, Development, and Growth Zones. Highlight which traits need immediate focus, which ones have potential for steady improvement, and which traits can be leveraged for maximum success.",
  },
  {
    id: "professional",
    label: "Professional Insights",
    query:
      "Analyze how my traits manifest in professional contexts, including leadership, teamwork, communication, adaptability, and problem-solving. Provide actionable strategies to enhance my effectiveness in the workplace.",
  },
  {
    id: "relationships",
    label: "Relationship Insights",
    query:
      "Provide insights into how my traits and Harmonic Scale position influence my relationships. Offer strategies to improve communication, build trust, and strengthen personal and professional connections.",
  },
  {
    id: "recommendations",
    label: "Action Steps",
    query:
      "Based on my assessment, provide clear and specific action steps I can take to improve my traits, elevate my Harmonic Scale position, and achieve my personal and professional goals. Include both short-term and long-term recommendations.",
  },
];

// Register the font
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.woff2",
    },
  ],
});

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Helvetica",
  },
  content: {
    fontFamily: "Helvetica",
  },
});

export function AIAnalysisView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    scores,
    harmonicScores,
    setScores,
    setHarmonicScores,
    formatDataForAI,
  } = useAssessment();
  const { getResults } = useResults();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [editingMessage, setEditingMessage] = useState<number | null>(null);

  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);

  const exportChatHistory = async () => {
    if (!chatHistoryRef.current) {
      console.error("Chat history element not found.");
      alert("Chat history is not available for export.");
      return;
    }

    // Apply the gradient background to the chat history element
    chatHistoryRef.current.style.background =
      "linear-gradient(-45deg, #0ea5e9, #6366f1, #8b5cf6, #0ea5e9)";
    chatHistoryRef.current.style.backgroundSize = "400% 400%";
    chatHistoryRef.current.style.padding = "10px";

    try {
      // Use html2canvas to capture the chat history as an image
      const canvas = await html2canvas(chatHistoryRef.current, {
        backgroundColor: null, // Ensures transparent background
        scale: 2, // Increase scale for better quality
      });

      chatHistoryRef.current.style.background = "transparent";
      chatHistoryRef.current.style.backgroundSize = "100% 100%";
      chatHistoryRef.current.style.padding = "0";

      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      // Calculate the width and height of the image
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save("chat-history.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to export chat history");
    }
  };

  const printChatHistory = () => {
    const printWindow = window.open("", "_blank", "height=400,width=600");
    const html = chatHistoryRef.current?.innerHTML;
    printWindow?.document.write(
      `<html><head>    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      <style>
        body {
          background: linear-gradient(-45deg, #0ea5e9, #6366f1, #8b5cf6, #0ea5e9);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }
        .chat-history {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 20px;
        }
      </style>
    </head>
    <body class="p-4">
    <h1 class="text-3xl font-bold text-white mb-1">
    Chat History
    </h1>
    <div class="chat-history p-4">
    ${html}
    </div>
    </body></html>`
    );
    printWindow?.document.close();
    printWindow?.print();
  };
  useEffect(() => {
    console.log("currentCoach", currentCoach);
  }, [currentCoach]);

  useEffect(() => {
    const loadResults = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      try {
        const targetUserId = searchParams.get("userId") || auth.currentUser.uid;

        // If accessing as coach, verify permissions
        if (targetUserId !== auth.currentUser.uid) {
          const hasAccess = await checkCoachAIAccess(auth.currentUser.uid);

          const coachQuery = query(
            collection(db, DB_URL.coaches),
            where("userId", "==", auth.currentUser.uid)
          );
          const coachSnapshot = await getDocs(coachQuery);

          if (coachSnapshot.docs.length > 0) {
            const coach = coachSnapshot.docs.map((doc) =>
              doc.data()
            )[0] as Coach;
            setCurrentCoach(coach);
          }

          setHasAccess(hasAccess);
          if (!hasAccess) {
            setError("You do not have access to AI analysis");
            setIsInitializing(false);
            return;
          }
        } else {
          setHasAccess(true);
        }

        if (!scores || !harmonicScores) {
          const results = await getResults(targetUserId);
          if (results) {
            setScores(results.scores);
            setHarmonicScores(results.harmonicScores);
          } else {
            navigate("/results");
          }
        }
      } catch (error) {
        console.error("Error loading results:", error);
        setError("Failed to load assessment results");
      } finally {
        setIsInitializing(false);
      }
    };

    loadResults();
  }, [
    scores,
    harmonicScores,
    getResults,
    setScores,
    setHarmonicScores,
    navigate,
    searchParams,
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (isLoading || !hasAccess) return;

    try {
      setIsLoading(true);

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");

      const formattedPrompt = formatDataForAI(content);
      const response = await getAIAnalysis(formattedPrompt);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading && hasAccess) {
      sendMessage(inputMessage);
    }
  };

  const handleButtonClick = (query: string) => {
    if (!isLoading && hasAccess) {
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

  if (error || !hasAccess) {
    return (
      <div className="min-h-screen ai-gradient-bg py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-1">
              {error || "Access Denied"}
            </h1>
            <p className="text-white/80 mb-4">
              Please contact your coach for assistance
            </p>
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
            <h1 className="text-3xl font-bold text-white mb-1">
              No Assessment Results Found
            </h1>
            <p className="text-white/80">
              Please complete the assessment first to get AI analysis
            </p>
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
            <h1 className="text-3xl font-bold text-white mb-1">
              AI Analysis Report
            </h1>
            <p className="text-white/80">
              Get detailed insights about your assessment results
            </p>
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
        <div
          className="glass-effect rounded-3xl p-6 mb-6"
          onClick={(e) => {
            const buttonOrInput = (e.target as HTMLElement).closest(
              "button, input"
            );

            if (!buttonOrInput) {
              setEditingMessage(null);
            }
          }}
        >
          <div
            ref={chatHistoryRef}
            className="h-[500px] overflow-y-auto custom-scrollbar mb-4"
          >
            {messages.map((message, index) =>
              editingMessage === index ? (
                <div>
                  <input
                    key={message.id}
                    type="text"
                    value={message.content}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 
                focus:border-white/40 focus:outline-none"
                    onChange={(e) =>
                      setMessages((prev) =>
                        prev.map((m, i) =>
                          i === index ? { ...m, content: e.target.value } : m
                        )
                      )
                    }
                  />
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`inline-block max-w-[80%] px-6 py-3 rounded-2xl relative ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <button
                        id={`message-${message.id}`}
                        className={`absolute p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                          message.sender === "user"
                            ? "-bottom-2 -left-2"
                            : "-bottom-2 -right-2"
                        }
                            print:hidden 
                          `}
                        onClick={() => setEditingMessage(index)}
                      >
                        <Pencil className="w-3 h-3 text-white" />
                      </button>
                      {message.sender === "user" ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-xl font-bold mb-3">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-bold mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-bold mb-2">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-4 last:mb-0">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold text-white">
                                {children}
                              </strong>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc ml-6 mb-4">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal ml-6 mb-4">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="mb-1">{children}</li>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
            {isLoading && (
              <div className="text-white/60">
                Human Insights AI is analyzing...
              </div>
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
              disabled={isLoading || !hasAccess}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim() || !hasAccess}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-medium hover:scale-105 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Export Chat History
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => exportChatHistory()}
              className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
                  transition-all disabled:opacity-50 text-sm"
            >
              Export Chat History
            </button>

            {/* print chat history */}
            <button
              onClick={() => printChatHistory()}
              className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
                  transition-all disabled:opacity-50 text-sm"
            >
              Print As It Is
            </button>
          </div>
        </div>

        {/* Analysis Buttons */}
        <div className="glass-effect rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysisButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.query)}
                disabled={isLoading || !hasAccess}
                className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 
                  transition-all disabled:opacity-50 text-sm"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* a green to dark green gradient button */}
        <div className="glass-effect rounded-3xl p-6 flex justify-center my-6">
          <a
            href={
              currentCoach?.affiliationLink?.startsWith("http")
                ? currentCoach?.affiliationLink
                : "https://" + currentCoach?.affiliationLink
            }
            target="_blank"
            rel="noopener noreferrer"
            className="px-32 py-5 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white hover:bg-green-700 transition-all disabled:opacity-50 text-sm max-w-full font-bold"
          >
            {currentCoach?.affiliationButtonText || "Get Personalized Report"}
          </a>
        </div>
      </div>
    </div>
  );
}
