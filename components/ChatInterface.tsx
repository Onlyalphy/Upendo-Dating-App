import React, { useState, useEffect, useRef } from 'react';
import { MatchProfile, Message, UserProfile } from '../types';

interface ChatInterfaceProps {
  user: UserProfile;
  match: MatchProfile;
  messages: Message[];
  onSendMessage: (text: string, matchId: string) => void;
  onBack: () => void;
  messageCount: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, match, messages, onSendMessage, onBack, messageCount }) => {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Basic heuristic: if the last message is from 'me', the other person is 'typing' (handled by parent AI handler visually?)
  // Let's just show 'typing...' if the last message was ours and it's been less than 5 seconds, or just wait for the message to appear.
  // For better UX, we can use a local state that resets when new message arrives.
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId === 'me') {
        setIsTyping(true);
    } else {
        setIsTyping(false);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, match.id);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white p-3 shadow-sm flex items-center space-x-3 z-10">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
        <div className="relative">
            <img src={match.imageUrl} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
            {match.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
        </div>
        <div>
            <h3 className="text-sm font-bold text-slate-900">{match.name}</h3>
            <p className="text-xs text-slate-500">{match.isOnline ? 'Active now' : 'Offline'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
             <div className="text-center mt-10 opacity-50">
                <p className="text-xs">You matched with {match.name}!</p>
                <p className="text-xs">Say hello securely.</p>
             </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                isMe 
                ? 'bg-rose-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {isTyping && (
             <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 border-t border-slate-200">
        <div className="flex items-center space-x-2">
            <input 
                type="text" 
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
            </button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
             <p className="text-[10px] text-slate-400">
                End-to-end encrypted
            </p>
            <p className={`text-[10px] font-bold ${messageCount >= 5 ? 'text-red-500' : 'text-slate-400'}`}>
                {messageCount}/5 Free Msg
            </p>
        </div>
       
      </div>
    </div>
  );
};

export default ChatInterface;