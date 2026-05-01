import { useState } from 'react';
import { MessageSquare, Star, Copy, Check, X, Sparkles } from 'lucide-react';
import { generateReviewReply } from '../services/gemini';

export default function ReviewReplierWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!reviewText.trim()) return;
    setIsGenerating(true);
    setGeneratedReply('');
    setIsCopied(false);
    
    const reply = await generateReviewReply(reviewText, rating, customerName);
    setGeneratedReply(reply);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (generatedReply) {
      navigator.clipboard.writeText(generatedReply);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-800 text-white/50 hover:text-white hover:bg-slate-700 p-2 rounded-full transition-all text-xs flex items-center gap-2 group shadow-sm border border-slate-700/50"
        title="Admin SEO Tools"
      >
        <Sparkles size={16} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:mr-2">
          SEO Review Replier
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] font-sans">
      <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-light/20 to-transparent pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles size={16} className="text-brand-red" />
          </div>
          <div>
            <h3 className="font-bold text-[15px] leading-tight">AI SEO Replier</h3>
            <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Boost Google Map Ranking</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto bg-slate-50">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-900 leading-relaxed shadow-sm">
          <p className="mb-2 flex items-center gap-1.5 font-bold text-blue-800">
            <Check size={14} /> Automation Server Active
          </p>
          <p className="text-xs text-blue-800/80 mb-2">
            The webhook endpoint is live and listening for new Google Maps reviews:
          </p>
          <code className="bg-white/80 px-2 py-1.5 rounded text-[11px] font-mono text-blue-700 block mb-3 border border-blue-100/50">
            POST /api/webhooks/google-reviews
          </code>
          <div className="text-xs bg-white/60 p-3 rounded-lg border border-blue-100/50">
            <strong className="block mb-1 text-slate-700">Next steps to connect to Google:</strong>
            <ol className="list-decimal pl-4 space-y-1 mt-2 text-slate-600">
              <li>Open Google Cloud Console & enable Business Profile API</li>
              <li>Set your webhook URL to the endpoint above</li>
              <li>Wait, Google will now auto-send new reviews here!</li>
            </ol>
            <p className="mt-3 text-[10px] text-slate-500 italic block border-t border-blue-100/50 pt-2">
              (You can still manually use the tool below to test reply generation)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer Name (Optional)</label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
            <span>Star Rating</span>
            <span className="text-brand-red flex items-center gap-1">{rating} <Star size={10} fill="currentColor"/></span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-lg transition-colors border ${rating >= star ? 'bg-red-50 border-red-100 text-brand-red' : 'bg-white border-slate-200 text-slate-300 hover:text-slate-400'}`}
              >
                <Star size={18} fill={rating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Review Text</label>
          <textarea 
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-3 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            placeholder="Paste the customer's Google Map review here..."
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !reviewText.trim()}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Generating SEO Reply...
            </>
          ) : (
            <>
              <MessageSquare size={16} />
              Generate SEO Reply
            </>
          )}
        </button>

        {generatedReply && (
          <div className="mt-2 bg-white border border-brand-blue/20 rounded-xl p-4 shadow-sm relative animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> Optimized Reply
            </h4>
            <div className="text-sm text-slate-700 leading-relaxed max-h-40 overflow-y-auto pr-2 pb-8">
              {generatedReply}
            </div>
            
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm pt-2 pl-2">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                {isCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Reply</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
