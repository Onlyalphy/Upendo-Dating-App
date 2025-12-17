import React, { useState, useEffect } from 'react';
import { MAX_FREE_MESSAGES } from './constants';
import { MatchProfile, Message, UserProfile, ViewState, ChatSession } from './types';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import PremiumModal from './components/PremiumModal';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.Landing);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeMatch, setActiveMatch] = useState<MatchProfile | null>(null);
  
  // State for messages
  const [chatSessions, setChatSessions] = useState<Record<string, Message[]>>({});
  const [userMessageCount, setUserMessageCount] = useState(0); // Count of messages sent BY USER
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    setView(ViewState.Dashboard);
  };

  const handleChatStart = (match: MatchProfile) => {
    setActiveMatch(match);
    setView(ViewState.Chat);
  };

  const handleSendMessage = (text: string, matchId: string) => {
    // If the sender is 'me', check limits
    // In this simplified function, we treat the call as the user sending, 
    // unless we determine it's a simulated reply.
    // However, the ChatInterface simulates the reply by calling this same function 
    // but the ID logic is handled here.
    
    // NOTE: This function receives text and puts it in the chat.
    // We need to differentiate WHO is sending.
    // For simplicity, ChatInterface calls this for user messages.
    // It also calls it for AI replies, but we'll flag those differently?
    // Actually, let's just make ChatInterface call a prop `onUserSend` vs `onMatchSend`?
    // No, let's keep it simple.
    
    // HACK: To distinguish, we will check if the user triggered it.
    // But since the interface calls it, we assume 'me' unless the caller specifies otherwise.
    // Let's refactor `handleSendMessage` to take a `senderId`.
    
    // Wait, the interface in ChatInterface uses `onSendMessage(text, matchId)`
    // I'll assume that's the USER sending.
    // The AI reply logic is inside ChatInterface, but it needs to update state here.
    // Let's just handle user sending here, and I'll add a separate method for AI reply if needed.
    // Actually, looking at ChatInterface, I implemented a `.then(reply => onSendMessage(reply...))`
    // This counts against the user if I'm not careful.
    
    // FIX: I will modify the ChatInterface to call `onSendMessage` with a sender param.
    // But I can't change the interface defined in `ChatInterface.tsx` easily without editing that file.
    // Let's edit `ChatInterface` to send senderId, or better yet, assume `onSendMessage` 
    // is ONLY for the user, and pass a `onReceiveMessage` prop.
    // Since I can't edit `ChatInterface` again in this thought process easily (I can but it's messy),
    // I will assume the `onSendMessage` is generic. I will inspect the text or context? No.
    
    // Let's just handle it:
    // If message count >= 5 and it's the USER sending, block it.
    
    // To solve the "AI Reply" using the same function issue:
    // I will use a simplified heuristic: The AI logic in ChatInterface is CLIENT SIDE.
    // It calls `onSendMessage`. I'll just change `ChatInterface` to not count against limit 
    // if it's the AI. But `ChatInterface` doesn't know.
    
    // Actually, I'll just increment the counter. If the user hits 5, they can't type anymore.
    // The AI can still reply.
    
    // Let's implement `handleUserMessage` and `handleSystemMessage`.
  };

  const handleUserMessage = (text: string, matchId: string) => {
     if (userMessageCount >= MAX_FREE_MESSAGES) {
        setShowPremiumModal(true);
        return;
     }

     const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        text,
        timestamp: new Date()
     };

     setChatSessions(prev => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), newMessage]
     }));

     setUserMessageCount(prev => prev + 1);

     // Trigger AI reply
     // We need to trigger this inside the component or here.
     // In ChatInterface I put the useEffect for AI reply. 
     // That useEffect calls `onSendMessage`. 
     // I need to update ChatInterface to support distinguishing sender.
     // I will update ChatInterface in the XML below to be robust.
  };

  // Specialized handler for AI responses which don't count against quota
  const handleIncomingMessage = (text: string, matchId: string) => {
      const newMessage: Message = {
        id: Date.now().toString() + '_ai',
        senderId: matchId, // The match is the sender
        text,
        timestamp: new Date()
     };
     
     setChatSessions(prev => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), newMessage]
     }));
  };

  return (
    <>
      {view === ViewState.Landing ? (
         <div className="min-h-screen bg-rose-600 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="mb-6 bg-white p-4 rounded-full shadow-xl">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-rose-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
               </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">Upendo Connect</h1>
            <p className="text-rose-100 mb-8 max-w-xs">Secure, verified dating for Kenyans. Find real connections in your county today.</p>
            <button 
                onClick={() => setView(ViewState.Onboarding)}
                className="w-full max-w-xs bg-white text-rose-600 font-bold py-4 rounded-xl shadow-lg hover:bg-rose-50 transition transform hover:scale-105"
            >
                Get Started
            </button>
            <p className="mt-4 text-xs text-rose-200">By joining, you agree to our Community Guidelines and Safety Policies.</p>
         </div>
      ) : (
        <Layout 
            view={view} 
            onNavigate={setView} 
            showNav={!!user && view !== ViewState.Landing && view !== ViewState.Onboarding}
        >
          {view === ViewState.Onboarding && <Onboarding onComplete={handleOnboardingComplete} />}
          
          {view === ViewState.Dashboard && user && (
            <Dashboard user={user} onChatStart={handleChatStart} />
          )}

          {view === ViewState.Chat && activeMatch && user && (
            <ChatInterface 
                user={user}
                match={activeMatch}
                messages={chatSessions[activeMatch.id] || []}
                onSendMessage={(text) => handleUserMessage(text, activeMatch.id)}
                onBack={() => setView(ViewState.Dashboard)}
                messageCount={userMessageCount}
            />
          )}

          {/* Simple list of chats if no active match selected but on Chat View */}
          {view === ViewState.Chat && !activeMatch && (
              <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
                  {Object.keys(chatSessions).length === 0 ? (
                      <div className="text-center text-slate-500 mt-10">
                          <p>No messages yet.</p>
                          <button onClick={() => setView(ViewState.Dashboard)} className="text-rose-600 font-semibold mt-2">Start matching!</button>
                      </div>
                  ) : (
                      <div className="space-y-2">
                           {/* Ideally we map through sessions and find the match details. For this demo, we might need a lookup map for match profiles. 
                               Skipping complexity: user sees blank list unless they click from dashboard. 
                               Correction: The user usually clicks "Message" on Dashboard. 
                           */}
                           <p className="text-sm text-slate-500 italic">Select a user from Discovery to continue chatting.</p>
                      </div>
                  )}
              </div>
          )}
          
          {view === ViewState.Profile && user && (
              <div className="p-6">
                  <div className="text-center mb-6">
                      <img src={user.avatarUrl} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-rose-100" alt="Profile" />
                      <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                      <div className="inline-flex items-center text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold mt-2">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        ID VERIFIED
                      </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100 space-y-4">
                      <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Location</span>
                          <span className="font-medium text-slate-800">{user.town}, {user.county}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Phone</span>
                          <span className="font-medium text-slate-800">{user.phone}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Free Messages</span>
                          <span className="font-medium text-slate-800">{userMessageCount} / {MAX_FREE_MESSAGES}</span>
                      </div>
                  </div>
                  <button className="w-full mt-6 py-3 border border-rose-600 text-rose-600 rounded-xl font-bold hover:bg-rose-50">
                      Edit Profile
                  </button>
                  <button onClick={() => setView(ViewState.Landing)} className="w-full mt-3 py-3 text-slate-400 font-medium hover:text-slate-600">
                      Log Out
                  </button>
              </div>
          )}

        </Layout>
      )}

      {/* Hidden 'AI' mechanism hook injection to trigger reply via state in App to keep logic centralized */}
      {/* 
        This is a bit tricky with the component split. 
        I'll overwrite the ChatInterface below to include the AI logic that calls a specific prop for AI responses.
      */}
      {view === ViewState.Chat && activeMatch && (
         <AIChatHandler 
            user={user!}
            match={activeMatch}
            messages={chatSessions[activeMatch.id] || []}
            onReceiveMessage={(text) => handleIncomingMessage(text, activeMatch.id)}
         />
      )}

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </>
  );
}

// Helper component to handle side-effects of chat (AI replies) separate from UI
const AIChatHandler = ({ user, match, messages, onReceiveMessage }: { user: UserProfile, match: MatchProfile, messages: Message[], onReceiveMessage: (t: string) => void }) => {
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.senderId === 'me') {
            // User just sent a message. Trigger AI reply.
             const history = messages.map(m => ({
                sender: m.senderId === 'me' ? 'me' : 'them',
                text: m.text
            }));
            
            // Random delay between 2-5 seconds for realism
            const delay = Math.random() * 3000 + 2000;
            
            const timeout = setTimeout(() => {
                import('./services/geminiService').then(service => {
                    service.generateChatReply(user.name, match.name, lastMsg.text, history).then(reply => {
                        onReceiveMessage(reply);
                    });
                });
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [messages, match, user, onReceiveMessage]);
    
    return null;
}

export default App;