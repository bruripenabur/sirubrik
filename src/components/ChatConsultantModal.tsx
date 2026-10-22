import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { ChatMessage, CourseIdentity, EvaluationComponent } from '../types';

interface ChatConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: CourseIdentity;
  components: EvaluationComponent[];
}

export const ChatConsultantModal: React.FC<ChatConsultantModalProps> = ({
  isOpen,
  onClose,
  identity,
  components,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: `Halo Bapak/Ibu Dosen! Saya Konsultan Kurikulum OBE & Assessment Specialist Universitas Pattimura. Saya siap membantu Anda mendiskusikan perumusan indikator KKO Taksonomi Bloom, keselarasan CPL-CPMK-Sub CPMK, pemenuhan Pasal 47 (minimal 50% Kasus/Proyek), atau penguatan substansi PIP "Bina Mulia ke Lautan". Ada yang ingin didiskusikan?`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            identity,
            componentsCount: components.length,
            componentsSummary: components.map((c) => `${c.name} (${c.weight}%)`),
          },
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Terima kasih atas pertanyaannya. Berdasarkan Peraturan Rektor Unpatti No. 12 Tahun 2026 dan Taksonomi Bloom, sangat disarankan menggunakan KKO terukur pada level analisis (C4) atau evaluasi (C5) untuk tugas berbasis kasus, serta mengaitkan fenomena laut-pulau Maluku agar selaras PIP Bina Mulia ke Lautan.';

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: replyText,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          text: 'Mohon maaf terjadi kendala jaringan. Pastikan Anda tetap mengacu pada Pasal 47: Case Method + PjBL minimal 50%, serta deskriptor rubrik bergradasi jelas.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <span>Konsultan OBE Unpatti</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-300">
                Pakar Evaluasi Pendidikan Tinggi &amp; Kurikulum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion Quick Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('Bagaimana contoh KKO Taksonomi Bloom C5 untuk studi kasus kelautan?')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 shrink-0 transition"
          >
            💡 Contoh KKO Bloom C5
          </button>
          <button
            onClick={() => handleSend('Jelaskan aturan bobot 50% Pasal 47 Perrek 12/2026.')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 shrink-0 transition"
          >
            ⚖️ Aturan Pasal 47
          </button>
          <button
            onClick={() => handleSend('Bagaimana merumuskan instrumen berbasis kearifan lokal Sasi Laut Maluku?')}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 shrink-0 transition"
          >
            🌊 Sasi Laut &amp; PIP-BMK
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Konsultan sedang mengetik respon telaah...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan rekomendasi evaluasi atau rubrik..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
