import React, { useState, useRef, useEffect } from 'react';
import { type ChatMessage } from '../types';
import { askINA } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatbot-history');
      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Could not load chat history from localStorage", error);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chatbot-history', JSON.stringify(messages));
    } catch (error) {
      console.error("Could not save chat history to localStorage", error);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (isLoading) return;

    // Enhanced validation
    if (input.trim() === '') {
        setInputError(true);
        setTimeout(() => setInputError(false), 820); // Corresponds to the shake animation duration
        return;
    }

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await askINA(input);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const toggleChat = () => {
      setIsOpen(!isOpen);
      if (!isOpen && messages.length === 0) {
          setMessages([{sender: 'ai', text: 'Halo! Saya INA, asisten AI Anda. Ada yang bisa saya bantu terkait UMKM atau layanan publik di Tangsel?'}]);
      }
  }

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none z-50"
        aria-label="Buka Chat"
      >
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transform transition-all duration-300 origin-bottom-right scale-100">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined">smart_toy</span>
              <h3 className="font-bold text-lg">INA - AI Agent Tangsel</h3>
            </div>
            <button onClick={toggleChat} className="hover:text-gray-200">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                </div>
              </div>
            ))}
             {isLoading && (
                <div className="flex justify-start mb-4">
                    <div className="bg-gray-200 text-gray-800 rounded-2xl p-3 rounded-bl-none">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={inputError ? "Pesan tidak boleh kosong!" : "Ketik pesan Anda..."}
                className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  inputError
                    ? 'border-red-500 animate-shake placeholder-red-500'
                    : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;