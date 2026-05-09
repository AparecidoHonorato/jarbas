'use client';

import { useState, useRef, KeyboardEvent, useEffect, useCallback } from 'react';
import { useChatStore } from '@/store/chat';

const WAKE_WORDS = ['jarbas', 'jarvas', 'jarbs', 'hey jarbas', 'oi jarbas'];
const USER_NAME = 'senhor';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isWakeListening, setIsWakeListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordActive, setWakeWordActive] = useState(false);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const wakeRecognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSpeakingRef = useRef(false);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const status = useChatStore((s) => s.status);
  const messages = useChatStore((s) => s.messages);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, []);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'trecho de código omitido.')
        .replace(/[#*`_~>]/g, '')
        .slice(0, 800);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 0.85;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        isSpeakingRef.current = true;
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const startCommandListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e: any) => {
      // Para de falar quando usuário fala
      if (isSpeakingRef.current) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }
      const transcript = e.results[0][0].transcript;
      setIsListening(false);
      useChatStore.getState().sendMessage(transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }, []);

  const startWakeWordListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      // Para de falar quando usuário fala
      if (isSpeakingRef.current) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        isSpeakingRef.current = false;
      }

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.toLowerCase().trim();
        if (WAKE_WORDS.some((w) => transcript.includes(w))) {
          rec.stop();
          setIsWakeListening(false);
          speak(`Sim, ${USER_NAME}. Como posso ajudar?`).then(() => {
            startCommandListening();
          });
          return;
        }
      }
    };
    rec.onerror = () => setIsWakeListening(false);
    rec.onend = () => setIsWakeListening(false);

    wakeRecognitionRef.current = rec;
    rec.start();
    setIsWakeListening(true);
  }, [speak, startCommandListening]);

  // Fala resposta do assistente
  useEffect(() => {
    if (status === 'idle' && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && last.content) {
        speak(last.content).then(() => {
          if (wakeWordActive) startWakeWordListening();
        });
      }
    }
  }, [status, messages]);

  // Saudação inicial — só após clique do usuário
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    setWakeWordActive(true);

    const handleFirstClick = () => {
      speak(`JARBAS online, ${USER_NAME}. Todos os sistemas operacionais. Diga meu nome para me ativar.`).then(() => {
        startWakeWordListening();
      });
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      wakeRecognitionRef.current?.stop();
      document.removeEventListener('click', handleFirstClick);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const names = files.map((f) => f.name);
    setAttachedImages((prev) => [...prev, ...names]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (name: string) => {
    setAttachedImages((prev) => prev.filter((n) => n !== name));
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed && attachedImages.length === 0) return;
    if (status !== 'idle') return;
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    const fullMessage = attachedImages.length > 0
      ? `${trimmed} [Imagens anexadas: ${attachedImages.join(', ')}]`
      : trimmed;
    sendMessage(fullMessage);
    setInput('');
    setAttachedImages([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    startCommandListening();
  };

  const toggleWakeWord = () => {
    if (wakeWordActive) {
      wakeRecognitionRef.current?.stop();
      setWakeWordActive(false);
      setIsWakeListening(false);
    } else {
      setWakeWordActive(true);
      startWakeWordListening();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={toggleWakeWord}
          className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
            wakeWordActive ? 'text-jarbas-primary' : 'text-white/20 hover:text-white/40'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${wakeWordActive ? 'bg-jarbas-primary animate-pulse' : 'bg-white/20'}`} />
          {wakeWordActive ? (isWakeListening ? 'Ouvindo wake word...' : 'Wake word ativo') : 'Wake word desativado'}
        </button>

        {isListening && (
          <span className="text-[10px] font-mono text-red-400 animate-pulse">🎤 Ouvindo comando...</span>
        )}

        {isSpeaking && (
          <button onClick={stopSpeaking} className="text-[10px] font-mono text-jarbas-accent animate-pulse hover:text-white transition-colors">
            🔊 Falando... (clique para parar)
          </button>
        )}
      </div>

      {/* Imagens anexadas */}
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachedImages.map((name) => (
            <div key={name} className="flex items-center gap-1 px-2 py-1 bg-jarbas-primary/10 border border-jarbas-primary/20 rounded text-[10px] font-mono text-jarbas-primary">
              <span>🖼️ {name}</span>
              <button onClick={() => removeImage(name)} className="text-white/40 hover:text-white ml-1">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={
              isListening ? '🎤 Ouvindo...' :
              status !== 'idle' ? 'Processando...' :
              'Fale com o JARBAS... (ou diga "JARBAS")'
            }
            rows={1}
            className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-jarbas-primary/40 resize-none font-mono transition-colors"
            disabled={status !== 'idle'}
          />
          {status !== 'idle' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-jarbas-primary/40 border-t-jarbas-primary rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Botão anexar foto */}
        <label className="px-4 py-3 rounded-lg border bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 cursor-pointer transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </label>

        {/* Botão microfone */}
        <button
          onClick={isSpeaking ? stopSpeaking : toggleListening}
          disabled={status !== 'idle'}
          className={`px-4 py-3 rounded-lg border text-sm font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isListening ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' :
            isSpeaking ? 'bg-jarbas-accent/20 border-jarbas-accent/50 text-jarbas-accent animate-pulse' :
            'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
          }`}
        >
          {isListening ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Botão enviar */}
        <button
          onClick={handleSubmit}
          disabled={(!input.trim() && attachedImages.length === 0) || status !== 'idle'}
          className="px-5 py-3 rounded-lg bg-jarbas-primary/10 border border-jarbas-primary/30 text-jarbas-primary text-sm font-mono uppercase tracking-wider hover:bg-jarbas-primary/20 hover:shadow-neon disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}