
import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { MOCK_DISPUTES, MOCK_USER } from '../constants';

interface MediationRoomScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
}

const MediationRoomScreen: React.FC<MediationRoomScreenProps> = ({ onNavigate, disputeId }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Blockchain session initialized. Witness nodes active.', type: 'system', time: '10:00' },
    { id: 2, sender: 'Mediator (Land Officer)', text: 'Welcome Jean-Claude and Neighbor X. Let’s review the boundary marker at UPI 1/02/03/04/555.', type: 'mediator', time: '10:02' },
    { id: 3, sender: 'Neighbor X', text: 'I believe the fence was moved 2 meters south during the road construction.', type: 'party', time: '10:05' },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const dispute = MOCK_DISPUTES.find(d => d.id === disputeId) || MOCK_DISPUTES[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: MOCK_USER.name,
      text: inputText,
      type: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulating mediator response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'Mediator (Land Officer)',
        text: 'Noted. I am pulling the 2018 satellite survey data to compare.',
        type: 'mediator',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('dispute-detail')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined dark:text-white">close</span>
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold dark:text-white">Mediation Room</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Case {dispute.id}</p>
        </div>
        <div className="size-10 flex items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <span className="material-symbols-outlined material-symbols-filled text-sm">lock</span>
        </div>
      </header>

      {/* Live Video/Presence Mock */}
      <div className="bg-slate-900 h-40 shrink-0 relative flex overflow-hidden">
        <div className="flex-1 border-r border-white/10 relative group">
          <img src="https://picsum.photos/200/200?1" className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[10px] font-bold text-white backdrop-blur-md">Land Officer (Live)</div>
        </div>
        <div className="flex-1 relative group">
          <img src={MOCK_USER.avatar} className="w-full h-full object-cover opacity-60" alt="" />
          <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[10px] font-bold text-white backdrop-blur-md">You</div>
        </div>
        <div className="flex-1 relative group bg-slate-800 flex items-center justify-center">
           <span className="material-symbols-outlined text-white/20 text-4xl">person_off</span>
           <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-0.5 rounded text-[10px] font-bold text-white backdrop-blur-md">Neighbor X</div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Live Session</span>
        </div>
      </div>

      {/* Chat Messages */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar bg-slate-50 dark:bg-background-dark/50"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
              msg.type === 'system' ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-center w-full max-w-none text-[10px] font-bold uppercase tracking-widest' :
              msg.type === 'mediator' ? 'bg-primary/10 border border-primary/20 dark:bg-primary/5 text-slate-800 dark:text-slate-200' :
              msg.type === 'user' ? 'bg-primary text-white' :
              'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
            }`}>
              {msg.type !== 'system' && (
                <p className={`text-[8px] font-extrabold uppercase mb-1 ${msg.type === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                  {msg.sender}
                </p>
              )}
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
            </div>
            {msg.type !== 'system' && <span className="text-[8px] text-slate-400 mt-1 px-1">{msg.time}</span>}
          </div>
        ))}
      </main>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 pb-8">
        <div className="flex gap-2 items-center bg-slate-50 dark:bg-background-dark rounded-2xl p-2 border border-slate-100 dark:border-slate-700">
          <button className="size-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="State your claim..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium dark:text-white placeholder:text-slate-400"
          />
          <button 
            onClick={handleSendMessage}
            className={`size-10 rounded-xl flex items-center justify-center transition-all ${inputText ? 'bg-primary text-white scale-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 scale-90'}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="mt-3 flex justify-center items-center gap-1.5 opacity-50">
          <span className="material-symbols-outlined text-[12px] text-primary">security</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted & Blockchain Logged</p>
        </div>
      </div>
    </div>
  );
};

export default MediationRoomScreen;
