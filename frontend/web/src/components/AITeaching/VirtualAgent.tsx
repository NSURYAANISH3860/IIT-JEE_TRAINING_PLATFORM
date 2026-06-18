import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Volume2, Loader, Zap, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface VirtualAgentProps {
  subject: string;
  topic: string;
  sessionId: string;
  onClose: () => void;
}

const VirtualAgent: React.FC<VirtualAgentProps> = ({
  subject,
  topic,
  sessionId,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: `🎓 **Welcome to AI Tutor!**\n\nI'm here to help you master **${topic}** in **${subject}**!\n\n**What can I help you with?**\n✅ Concept explanations\n✅ Step-by-step solutions\n✅ Real-world examples\n✅ Quick clarifications\n\nFeel free to ask any question!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // Auto-expanded
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [comprehensionLevel, setComprehensionLevel] = useState(40);
  const [sessionStartTime] = useState(Date.now());
  const [sessionFeedback, setSessionFeedback] = useState<'positive' | 'negative' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // Simulate comprehension increase with each message
    setComprehensionLevel(prev => Math.min(100, prev + Math.random() * 20));

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `http://localhost:8000/api/videos/ai-teaching/sessions/${sessionId}/message`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_message: inputValue })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: data.ai_response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(
        `http://localhost:8000/api/videos/ai-teaching/sessions/${sessionId}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            comprehension_level: comprehensionLevel,
            session_rating: sessionFeedback === 'positive' ? 5 : sessionFeedback === 'negative' ? 2 : 3
          })
        }
      );
    } catch (error) {
      console.error('Error completing session:', error);
    }
    onClose();
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000 / 60);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-96 right-8 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl hover:shadow-2xl transition transform hover:scale-110 flex items-center space-x-2 group relative"
          title="Open AI Teaching Assistant"
        >
          <Zap size={24} className="text-yellow-300" />
          <span className="hidden group-hover:inline text-sm font-semibold max-w-xs whitespace-nowrap">
            AI Tutor
          </span>
          <div className="absolute animate-pulse top-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl flex flex-col h-full max-h-[90vh] overflow-hidden border-2 border-blue-200 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <Zap size={20} className="text-yellow-300 animate-pulse" />
            <h3 className="font-bold text-lg">AI Tutor</h3>
          </div>
          <p className="text-xs text-blue-100">{topic} • {subject} • {sessionDuration}m</p>
        </div>
        <button
          onClick={() => {
            handleCompleteSession();
            setIsExpanded(false);
          }}
          className="text-white hover:bg-blue-500 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2 gap-2">
                <p className={`text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {message.sender === 'ai' && (
                  <button
                    onClick={() => handleCopyMessage(message.content, message.id)}
                    className={`p-1 rounded transition ${
                      copiedId === message.id
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Copy message"
                  >
                    {copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none flex items-center space-x-2 shadow-sm">
              <Loader size={16} className="animate-spin text-blue-600" />
              <span className="text-sm">AI is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Comprehension and Feedback */}
      <div className="px-4 py-3 bg-gray-100 border-t border-gray-200 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-700">Understanding:</span>
            <span className={`font-bold ${
              comprehensionLevel < 33 ? 'text-red-600' :
              comprehensionLevel < 66 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {Math.round(comprehensionLevel)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              comprehensionLevel < 33 ? 'bg-red-500' :
              comprehensionLevel < 66 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${comprehensionLevel}%` }}
          />
        </div>

        {/* Session Feedback */}
        {messages.length > 2 && (
          <div className="flex items-center justify-center space-x-2 pt-2">
            <span className="text-xs text-gray-600 font-semibold">Helpful?</span>
            <button
              onClick={() => setSessionFeedback(sessionFeedback === 'positive' ? null : 'positive')}
              className={`p-1 rounded transition ${
                sessionFeedback === 'positive'
                  ? 'bg-green-500 text-white scale-110'
                  : 'text-gray-500 hover:text-green-500 hover:scale-105'
              }`}
              title="Yes, this helped"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => setSessionFeedback(sessionFeedback === 'negative' ? null : 'negative')}
              className={`p-1 rounded transition ${
                sessionFeedback === 'negative'
                  ? 'bg-red-500 text-white scale-110'
                  : 'text-gray-500 hover:text-red-500 hover:scale-105'
              }`}
              title="Need more help"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex space-x-2 bg-white flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about the topic..."
          disabled={loading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 text-sm"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition flex items-center font-semibold hover:shadow-md"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default VirtualAgent;