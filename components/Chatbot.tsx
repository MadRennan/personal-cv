
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { useLanguage } from '../hooks/useLanguage';
import { Skill, Experience, Project } from '../types';

const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104 9.75 3.104 5 7.204M19 14.5c0 1.664-1.336 3-3 3s-3-1.336-3-3m0 0c0-1.664-1.336-3-3-3s-3 1.336-3 3m12 0v9.566c0 .597-.237 1.17-.659 1.591L14.25 20.25h-4.5l-2.091-2.091c-.422-.422-.659-.994-.659-1.591V14.5" />
    </svg>
);

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const createSystemInstruction = (t: (key: string, replacements?: Record<string, string>) => any, mode: 'assistant' | 'interviewer') => {
  const skills: Skill[] = t('skills.items');
  const experiences: Experience[] = t('experience.items');
  const projects: Omit<Project, 'imageUrl' | 'liveUrl' | 'repoUrl'>[] = t('projects.items');

  const cvContext = `
**SKILLS:**
${skills.map(s => `- ${s.name} (${t(`skills.categories.${s.category}`)})`).join('\n')}

**EXPERIENCE:**
${experiences.map(e => `
- Role: ${e.role} at ${e.company} (${e.period})
  - ${e.description.join('\n  - ')}
`).join('')}

**PROJECTS:**
${projects.map(p => `
- Title: ${p.title}
  - Description: ${p.description}
  - Technologies: ${p.tags.join(', ')}
`).join('')}
`;
  const instructionKey = mode === 'interviewer' ? 'chatbot.interviewerSystemInstruction' : 'chatbot.systemInstruction';
  return t(instructionKey, { cvContext });
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, t, translations } = useLanguage();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (Object.keys(translations).length === 0 || !isOpen) return;

    setIsLoading(true);
    setMessages([]);

    if (process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const instruction = createSystemInstruction(t, isInterviewMode ? 'interviewer' : 'assistant');
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: instruction },
        });
        const initialMessage = isInterviewMode ? t('chatbot.interviewInitialMessage') : t('chatbot.initialMessage');
        setMessages([{ sender: 'bot', text: initialMessage }]);
      } catch (error) {
        console.error("Failed to initialize chatbot:", error);
        setMessages([{ sender: 'bot', text: t('chatbot.errorConnect') }]);
      }
    } else {
       setMessages([{ sender: 'bot', text: t('chatbot.errorApiKey') }]);
    }
    setIsLoading(false);
  }, [language, translations, t, isInterviewMode, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300); // Allow open animation to finish
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (document.activeElement === inputRef.current) {
        toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleStartInterview = () => {
    setIsInterviewMode(true);
  };

  const handleExitInterview = () => {
    setIsInterviewMode(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      const botMessage: Message = { text: response.text, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot send message error:", error);
      const errorMessage: Message = { text: t('chatbot.errorSend'), sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const renderBotMessage = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
      <>
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
        )}
      </>
    );
  };
  
  if (!t('chatbot.header')) return null;

  return (
    <>
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={isInterviewMode ? t('chatbot.interviewHeader') : t('chatbot.header')}
        className={`fixed bottom-20 right-4 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] z-40 flex flex-col rounded-xl shadow-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 transform origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        
        <header className={`relative flex items-center justify-between p-4 border-b flex-shrink-0 transition-colors duration-300 ${isInterviewMode ? 'border-b-rose-500/50' : 'border-b-neutral-200 dark:border-b-neutral-800'}`}>
           <div className="relative h-6 w-48 overflow-hidden">
             <h3 className={`absolute inset-0 font-bold font-heading text-lg text-neutral-800 dark:text-neutral-100 transition-all duration-300 ease-in-out ${isInterviewMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
               {t('chatbot.header')}
             </h3>
             <h3 className={`absolute inset-0 font-bold font-heading text-lg text-rose-600 dark:text-rose-400 transition-all duration-300 ease-in-out ${isInterviewMode ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
               {t('chatbot.interviewHeader')}
             </h3>
           </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors" aria-label={t('projects.drawer.closeAriaLabel')}>
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <div key={isInterviewMode ? 'interview' : 'assistant'} className="flex-grow p-4 overflow-y-auto animate-fade-in" style={{animationDuration: '400ms'}}>
          <div className="flex flex-col space-y-4" aria-live="polite">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-none'}`}>
                  {msg.sender === 'bot' ? renderBotMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="flex items-center space-x-2.5 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-neutral-200 dark:bg-neutral-800 rounded-bl-none shadow-sm">
                      <BotIcon className="w-6 h-6 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                      <span className="italic text-neutral-500 dark:text-neutral-400">{t('chatbot.thinking')}</span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0 space-y-3">
          {!isLoading && messages.length > 0 && (
            <div className="flex justify-center animate-fade-in" style={{animationDelay: '200ms'}}>
              {!isInterviewMode ? (
                  <button onClick={handleStartInterview} className="px-4 py-2 text-sm font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-all transform hover:scale-105 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-neutral-950">
                      {t('chatbot.startInterview')}
                  </button>
              ) : (
                  <button onClick={handleExitInterview} className="px-4 py-2 text-sm font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 rounded-full hover:bg-rose-200 dark:hover:bg-rose-800 transition-all transform hover:scale-105 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500 dark:focus-visible:ring-offset-neutral-950">
                      {t('chatbot.exitInterview')}
                  </button>
              )}
            </div>
          )}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full p-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatbot.placeholder')}
              className="flex-grow bg-transparent px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
              aria-label={t('chatbot.placeholder')}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-2 rounded-full bg-primary-600 text-white disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-800 focus:ring-primary-500 transition-all"
              aria-label={t('hero.button')}
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-all duration-300 transform hover:scale-110 active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-neutral-950"
        aria-label="Toggle chatbot"
        aria-expanded={isOpen}
        aria-controls="chatbot-window"
      >
        <div className="relative w-7 h-7 flex items-center justify-center overflow-hidden">
            <ChatIcon className={`absolute transition-all duration-300 ${isOpen ? 'transform -rotate-45 scale-0 opacity-0' : 'transform rotate-0 scale-100 opacity-100'}`} />
            <CloseIcon className={`absolute transition-all duration-300 ${isOpen ? 'transform rotate-0 scale-100 opacity-100' : 'transform rotate-45 scale-0 opacity-0'}`} />
        </div>
      </button>
    </>
  );
};

export default Chatbot;
