import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'system';
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! 👋 Je suis l\'assistant virtuel Trackzer. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickReplies: QuickReply[] = [
    { id: '1', text: '🔍 Rechercher un téléphone', action: 'search' },
    { id: '2', text: '📱 Signaler un vol', action: 'report' },
    { id: '3', text: '❓ Comment ça marche ?', action: 'help' },
    { id: '4', text: '📞 Contacter le support', action: 'contact' }
  ];

  const botResponses: Record<string, string[]> = {
    search: [
      'Pour rechercher un téléphone, vous avez besoin du numéro IMEI (15 chiffres).',
      'Tapez *#06# sur votre téléphone pour obtenir l\'IMEI.',
      'Rendez-vous dans la section "Recherche" pour commencer.'
    ],
    report: [
      'Pour signaler un téléphone volé ou perdu :',
      '1. Préparez votre numéro IMEI',
      '2. Notez le lieu et l\'heure de l\'incident',
      '3. Utilisez notre formulaire de signalement sécurisé'
    ],
    help: [
      'Trackzer utilise l\'IA pour tracer les téléphones perdus ou volés.',
      'Notre système analyse les signalements et aide à la récupération.',
      'Nous couvrons tout le Cameroun avec une précision GPS avancée.'
    ],
    contact: [
      'Vous pouvez nous contacter :',
      '📧 Email: contact@trackzer.cm',
      '📞 Téléphone: +237 6XX XXX XXX',
      '🕒 Support 24/7 disponible'
    ],
    default: [
      'Je comprends votre question. Laissez-moi vous aider !',
      'Pour une assistance personnalisée, contactez notre équipe support.',
      'Vous pouvez aussi consulter notre centre d\'aide.'
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'quick-reply' | 'system' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'bot' && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, 'user');
    setInputText('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getBotResponse(inputText);
      addMessage(response, 'bot');
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('imei') || message.includes('recherche')) {
      return botResponses.search[Math.floor(Math.random() * botResponses.search.length)];
    } else if (message.includes('vol') || message.includes('perdu') || message.includes('signaler')) {
      return botResponses.report[Math.floor(Math.random() * botResponses.report.length)];
    } else if (message.includes('aide') || message.includes('comment') || message.includes('marche')) {
      return botResponses.help[Math.floor(Math.random() * botResponses.help.length)];
    } else if (message.includes('contact') || message.includes('support') || message.includes('téléphone')) {
      return botResponses.contact[Math.floor(Math.random() * botResponses.contact.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  const handleQuickReply = (action: string, text: string) => {
    addMessage(text, 'user', 'quick-reply');
    
    setIsTyping(true);
    setTimeout(() => {
      const responses = botResponses[action] || botResponses.default;
      responses.forEach((response, index) => {
        setTimeout(() => {
          addMessage(response, 'bot');
          if (index === responses.length - 1) {
            setIsTyping(false);
          }
        }, (index + 1) * 800);
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full p-4 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Besoin d'aide ? Chattez avec nous !
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Assistant Trackzer</h3>
              <div className="flex items-center text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                En ligne
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                        : 'bg-gray-200'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <p className="text-sm text-gray-600 mb-3">Réponses rapides :</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.action, reply.text)}
                      className="text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors duration-200"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-cyan-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};