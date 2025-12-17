import React from 'react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-in zoom-in-95">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
            </div>
          <h3 className="text-xl font-bold text-slate-900">You've hit your limit!</h3>
          <p className="text-sm text-slate-500 mt-2">
            You have used your 5 free introductory messages. To continue chatting securely with verified singles, please upgrade to Premium.
          </p>
          
          <div className="mt-6 space-y-3">
             <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-rose-800">Weekly Pass</span>
                <span className="font-bold text-rose-900">Ksh 150</span>
             </div>
             <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex justify-between items-center ring-2 ring-rose-500 relative">
                 <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">MOST POPULAR</div>
                <span className="font-semibold text-rose-800">Monthly Pass</span>
                <span className="font-bold text-rose-900">Ksh 500</span>
             </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-rose-700 transition">
              Upgrade Now (M-Pesa)
            </button>
            <button onClick={onClose} className="mt-3 text-sm text-slate-500 hover:text-slate-700">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;