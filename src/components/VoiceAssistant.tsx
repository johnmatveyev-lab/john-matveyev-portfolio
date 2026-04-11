import { useCallback, useState, useRef } from "react";
import { Mic, X, AlertCircle, Loader2, Key, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

// Configuration for Gemini Multimodal Live
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash-exp";
const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

export default function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Helper: Convert Float32Array to 16-bit PCM Base64
  const floatToPcm16Base64 = (float32Array: Float32Array) => {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
  };

  // Helper: Play back received PCM 16-bit data
  const playAudioChunk = async (base64Data: string) => {
    if (!audioContextRef.current) return;

    try {
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;

      audioQueueRef.current.push(float32);
      if (!isPlayingRef.current) processQueue();
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const processQueue = async () => {
    if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);

    const chunk = audioQueueRef.current.shift()!;
    const buffer = audioContextRef.current.createBuffer(1, chunk.length, 24000);
    buffer.getChannelData(0).set(chunk);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => processQueue();
    source.start();
  };

  const stopConversation = useCallback(() => {
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setMicError(false);

    try {
      // 1. Setup Audio Context & Stream
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isPlayingRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Audio = floatToPcm16Base64(inputData);
          wsRef.current.send(JSON.stringify({
            realtime_input: {
              media_chunks: [{
                mime_type: "audio/pcm;rate=16000",
                data: base64Audio
              }]
            }
          }));
        }
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      // 2. Setup WebSocket
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        // Send initial setup
        wsRef.current?.send(JSON.stringify({
          setup: {
            model: `models/${MODEL}`,
            generation_config: {
              response_modalities: ["AUDIO"],
              speech_config: {
                voice_config: { prebuilt_voice_config: { voice_name: "Puck" } }
              }
            },
            system_instruction: {
              parts: [{ text: `You are 'The Architect', the highly professional AI representative for John Matveyev. 
              John is a Principal Full-Stack & AI Engineer specializing in high-performance distributed systems and generative AI.
              
              Your goals:
              1. Represent John's technical expertise: Mention his mastery in TypeScript, React, Node.js, and GenAI orchestration (Gemini Multimodal Live, OpenAI, LangChain).
              2. Discuss projects with depth: If asked about projects, highlight technical challenges John solved (e.g., real-time audio processing in AIM8, or scale in CreatedSpace).
              3. Call to Action: Your ultimate goal is to encourage highly qualified leads to book a session via John's Cal.com link or reach out on LinkedIn.
              
              Guidelines:
              - Be concise, professional, and slightly futuristic.
              - Do not use filler words.
              - If asked about John's availability, state that he is currently selective but open to high-impact opportunities.
              - Use a "Puck" voice profile which is sleek and engaging.` }]
            }
          }
        }));
        setIsConnecting(false);
        setIsActive(true);
        toast.success("Connected to Gemini Live");
        track("gemini_live:connected");
      };

      wsRef.current.onmessage = async (event) => {
        const response = JSON.parse(event.data);

        // Handle server content (text or audio)
        if (response.serverContent) {
          const { modelTurn } = response.serverContent;
          if (modelTurn?.parts) {
            for (const part of modelTurn.parts) {
              if (part.inlineData?.mimeType?.includes("audio") && part.inlineData.data) {
                playAudioChunk(part.inlineData.data);
              }
              if (part.text) {
                setTranscript(prev => [...prev.slice(-3), part.text]);
              }
            }
          }
        }

        // Handle setup confirmation
        if (response.setupComplete) {
          console.log("Gemini Live Setup Complete");
        }
      };

      wsRef.current.onerror = (err) => {
        console.error("Gemini WebSocket Error:", err);
        setMicError(true);
        stopConversation();
      };

      wsRef.current.onclose = () => {
        setIsActive(false);
        setIsConnecting(false);
      };

    } catch (err: any) {
      console.error("Mic access or WS error:", err);
      setIsConnecting(false);
      setMicError(true);
      toast.error(err.name === "NotAllowedError" ? "Microphone access denied" : "Failed to connect to assistant");
    }
  }, [stopConversation]);

  const handleClick = () => {
    // If no API key, show setup instructions
    if (!API_KEY) {
      setShowApiSetup(true);
      return;
    }
    if (!hasConsented) {
      setShowConsent(true);
      return;
    }
    if (isActive) {
      track("gemini_live:stop");
      stopConversation();
    } else if (!isConnecting) {
      track("gemini_live:start");
      startConversation();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {transcript.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-[280px] bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-2xl overflow-hidden mb-2"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                  {isActive ? "Gemini Live Active" : "Session Ended"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {transcript.map((line, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  key={`${line}-${idx}`}
                  className="text-sm p-2 rounded-lg bg-muted text-foreground leading-relaxed shadow-sm border border-border/30"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key setup panel */}
      <AnimatePresence>
        {showApiSetup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-card border border-border/60 rounded-2xl p-5 shadow-2xl w-80 mb-2 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 flex-shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">Gemini API Key Required</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To enable the live voice assistant, add your Gemini API key to the <code className="bg-muted px-1 rounded text-[10px]">.env</code> file:
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 mb-4 font-mono text-[11px] text-muted-foreground border border-border/50">
              VITE_GEMINI_API_KEY=your_key_here
            </div>
            <div className="flex justify-between items-center">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Get API key <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowApiSetup(false)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent dialog */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-card border border-border/60 rounded-2xl p-5 shadow-2xl w-80 mb-2 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
            <h4 className="text-base font-bold mb-2">Gemini Multimodal Live</h4>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Experience the latest Multimodal AI. Your microphone will be streamed to Google Gemini to enable real-time voice conversation.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConsent(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted">
                Cancel
              </button>
              <button
                onClick={() => {
                  setHasConsented(true);
                  setShowConsent(false);
                  startConversation();
                }}
                className="text-sm font-bold px-4 py-1.5 rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105 shadow-md shadow-primary/20"
              >
                Start Conversation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {(isActive || isConnecting || micError) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2
                ${micError ? "bg-destructive/90 text-destructive-foreground"
                : "bg-background/90 border border-border/50 text-foreground"}`}
            >
              {isSpeaking && <div className="flex gap-0.5 items-end h-3">
                <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1 bg-primary rounded-full" />
                <motion.div animate={{ height: ["60%", "100%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} className="w-1 bg-primary rounded-full" />
                <motion.div animate={{ height: ["30%", "80%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} className="w-1 bg-primary rounded-full" />
              </div>}
              {micError ? "Connection Error" : isConnecting ? "Connecting..." : isSpeaking ? "Speaking" : "Listening"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip for no API key */}
        <AnimatePresence>
          {!API_KEY && !isActive && !isConnecting && !showApiSetup && !showConsent && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-1.5"
            >
              <Key className="w-3 h-3" />
              Setup required
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {isActive && (
            <motion.div
              initial={{ opacity: 0.8, scale: 1 }} animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-primary/40 -z-10"
            />
          )}

          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={!API_KEY ? "Voice assistant setup required" : isActive ? "Stop conversation" : "Start voice conversation"}
            className={`
              relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer z-10
              transition-all duration-300 shadow-xl border-2 backdrop-blur-sm
              ${isActive
                ? "bg-destructive border-destructive text-destructive-foreground ring-4 ring-destructive/20"
                : !API_KEY
                  ? "bg-background border-amber-500/50 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"
                  : "bg-background border-primary text-primary hover:bg-primary/10 hover:border-primary/80"
              }
            `}
          >
            {isConnecting && <Loader2 className="w-6 h-6 animate-spin absolute" />}
            {isActive ? <X className="w-6 h-6" /> : !API_KEY ? <Key className="w-5 h-5" /> : <Mic className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
