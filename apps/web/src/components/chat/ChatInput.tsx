'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useChatStore } from '@/store/chat';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceProfiles, setVoiceProfiles] = useState<Record<string, any>>({});
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const status = useChatStore((s) => s.status);
  const messages = useChatStore((s) => s.messages);

  // Text-to-speech com ElevenLabs + fallback Web Speech API
  const speakWithElevenLabs = async (text: string) => {
    try {
      setIsSpeaking(true);
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'trecho de código omitido.')
        .replace(/[#*`_~>]/g, '')
        .slice(0, 500);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        console.warn('TTS API failed, using Web Speech API fallback');
        speakWithWebSpeech(cleanText);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.1; // Mais natural, como apresentador de TV
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        speakWithWebSpeech(cleanText);
      };
      
      audio.play().catch((error) => {
        console.error('Audio play error:', error);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        speakWithWebSpeech(cleanText);
      });
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setIsSpeaking(false);
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'trecho de código omitido.')
        .replace(/[#*`_~>]/g, '')
        .slice(0, 500);
      speakWithWebSpeech(cleanText);
    }
  };

  // Fallback: Web Speech API
  const speakWithWebSpeech = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.2; // Mais rápido e natural
      utterance.pitch = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Web Speech API error:', error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (status === 'idle' && messages.length > 0 && autoSpeak) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant' && last.content) {
        speakWithElevenLabs(last.content);
      }
    }
  }, [status, messages, autoSpeak]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || status !== 'idle') return;
    window.speechSynthesis.cancel();
    sendMessage(trimmed);
    setInput('');
    setAutoSpeak(false); // Desativa fala automática quando usuário digita
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Seu browser não suporta reconhecimento de voz. Use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      const confidence = e.results[0][0].confidence;

      // Captura características básicas da voz
      const voiceData = {
        pitch: Math.random() * 100, // Simulação - em produção usaria análise real
        rate: transcript.split(' ').length / (e.resultEnd - e.resultStart) * 1000,
        volume: Math.random() * 100,
        confidence
      };

      // Identifica o speaker
      const speaker = identifySpeaker(voiceData);
      setCurrentSpeaker(speaker);

      // Comandos especiais para registrar voz
      if (transcript.toLowerCase().includes('minha voz é') || transcript.toLowerCase().includes('registre minha voz')) {
        const nameMatch = transcript.match(/(?:minha voz é|registre minha voz(?: como)?)\s+(.+)/i);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          registerVoice(name, voiceData);
          setInput(`Voz registrada como "${name}"`);
          setIsListening(false);
          return;
        }
      }

      setInput(transcript);
      setIsListening(false);
      setAutoSpeak(true); // Ativa fala automática quando usuário fala
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakLastResponse = () => {
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (lastAssistantMessage?.content) {
      speakWithElevenLabs(lastAssistantMessage.content);
    }
  };

  // Sistema de identificação de voz
  const registerVoice = (name: string, audioData: any) => {
    const voiceProfile = {
      name,
      pitch: audioData.pitch || Math.random() * 100, // Simulação
      rate: audioData.rate || Math.random() * 2,
      volume: audioData.volume || Math.random() * 100,
      timestamp: Date.now()
    };
    setVoiceProfiles(prev => ({ ...prev, [name]: voiceProfile }));
    localStorage.setItem('jarbas_voice_profiles', JSON.stringify({ ...voiceProfiles, [name]: voiceProfile }));
  };

  const identifySpeaker = (audioData: any): string | null => {
    if (Object.keys(voiceProfiles).length === 0) return null;

    let bestMatch = null;
    let bestScore = 0;

    Object.entries(voiceProfiles).forEach(([name, profile]: [string, any]) => {
      let score = 0;
      const pitchDiff = Math.abs((profile.pitch || 50) - (audioData.pitch || 50));
      const rateDiff = Math.abs((profile.rate || 1) - (audioData.rate || 1));
      const volumeDiff = Math.abs((profile.volume || 50) - (audioData.volume || 50));

      // Calcula similaridade (menor diferença = maior score)
      score = 100 - (pitchDiff + rateDiff * 50 + volumeDiff);

      if (score > bestScore && score > 60) { // Threshold de 60%
        bestMatch = name;
        bestScore = score;
      }
    });

    return bestMatch;
  };

  // Carrega perfis salvos
  useEffect(() => {
    const saved = localStorage.getItem('jarbas_voice_profiles');
    if (saved) {
      setVoiceProfiles(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={isListening ? `🎤 Ouvindo${currentSpeaker ? ` (${currentSpeaker})` : ''}...` : status === 'idle' ? 'Fale com o JARBAS...' : 'Processando...'}
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

      {/* Botão toggle fala automática */}
      <button
        onClick={() => setAutoSpeak(!autoSpeak)}
        className={`px-3 py-3 rounded-lg border text-sm font-mono transition-all ${
          autoSpeak
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
        }`}
        title={autoSpeak ? 'Fala automática ativada' : 'Fala automática desativada'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* Botão de voz */}
      <button
        onClick={isSpeaking ? stopSpeaking : isListening ? toggleListening : speakLastResponse}
        disabled={status !== 'idle'}
        className={`px-4 py-3 rounded-lg border text-sm font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          isListening
            ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
            : isSpeaking
            ? 'bg-jarbas-accent/20 border-jarbas-accent/50 text-jarbas-accent animate-pulse'
            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
        }`}
        title={isListening ? 'Parar gravação' : isSpeaking ? 'Parar fala' : 'Ouvir resposta'}
      >
        {isListening ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : isSpeaking ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m0 0a5 5 0 01-7.072 0M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
          </svg>
        )}
      </button>

      {/* Botão enviar */}
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || status !== 'idle'}
        className="px-5 py-3 rounded-lg bg-jarbas-primary/10 border border-jarbas-primary/30 text-jarbas-primary text-sm font-mono uppercase tracking-wider hover:bg-jarbas-primary/20 hover:shadow-neon disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
}