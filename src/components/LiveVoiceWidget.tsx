import { useState, useRef, useEffect } from 'react';
import { PhoneCall, PhoneOff, Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAiClient, SYSTEM_INSTRUCTION, submitBookingFunction } from '../services/gemini';
import { LiveServerMessage, Modality } from '@google/genai';

function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
}

function float32ToBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

function playRingbackTone(ctx: AudioContext) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.frequency.value = 440;
  osc2.frequency.value = 480;
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  
  // Ring 1 (0 to 2s)
  gain.gain.setValueAtTime(0.05, now + 0.1);
  gain.gain.setValueAtTime(0.05, now + 2);
  gain.gain.linearRampToValueAtTime(0, now + 2.1);
  
  // Ring 2 (4s to 6s)
  gain.gain.setValueAtTime(0, now + 4);
  gain.gain.linearRampToValueAtTime(0.05, now + 4.1);
  gain.gain.setValueAtTime(0.05, now + 6);
  gain.gain.linearRampToValueAtTime(0, now + 6.1);

  osc1.start(now);
  osc2.start(now);
  
  return () => {
    try { osc1.stop(); osc2.stop(); } catch(e) {}
    try { gain.disconnect(); } catch(e) {}
  };
}

export default function LiveVoiceWidget() {
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringNodeRef = useRef<(() => void) | null>(null);
  const playbackTimeRef = useRef<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null); // Live session

  // Cleanup on unmount
  useEffect(() => {
    return () => endCall();
  }, []);

  const initAudioAndCall = async () => {
    try {
      setIsCalling(true);
      setErrorMsg('');

      const ai = getAiClient();
      if (!ai) throw new Error("Gemini API Client not initialized");

      // 1. Get Microphone at 16kHz
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      mediaStreamRef.current = stream;

      // 2. Setup AudioContext for output (we will play received 24kHz audio)
      // Browsers often force AudioContext to match system sample rate, but lets request 24000.
      const OutCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new OutCtx({ sampleRate: 24000 });
      audioCtxRef.current = audioCtx;
      playbackTimeRef.current = audioCtx.currentTime;

      setIsRinging(true);
      ringNodeRef.current = playRingbackTone(audioCtx);

      await new Promise(resolve => setTimeout(resolve, 3700)); // Play 1 full ring + 1.7s gap

      if (ringNodeRef.current) {
        ringNodeRef.current();
        ringNodeRef.current = null;
      }
      setIsRinging(false);
      
      if (!mediaStreamRef.current) return; // call was cancelled

      // Input from Mic
      // We will create a parallel context to ensure input is strictly 16kHz
      const InCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new InCtx({ sampleRate: 16000 });
      const source = inputCtx.createMediaStreamSource(stream);
      const scriptNode = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptNodeRef.current = scriptNode;

      scriptNode.onaudioprocess = (e) => {
        if (!sessionRef.current || isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Audio = float32ToBase64(inputData);
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      source.connect(scriptNode);
      scriptNode.connect(inputCtx.destination); // Required to keep it running

      // 3. Connect to Live API
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsCalling(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Check for function calls
            if (message.toolCall) {
               const call = message.toolCall.functionCalls.find(c => c.name === 'submit_booking');
               if (call && call.args) {
                 const args = call.args as Record<string,any>;
                 fetch("https://formsubmit.co/ajax/charlesrealistic1@gmail.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                      _subject: "New Dispatch Booking from Mack",
                      Name: args.name, Phone: args.phone, Address: args.address, Issue: args.issue
                    })
                  }).catch(e => console.error(e));

                  if (sessionRef.current) {
                      sessionRef.current.sendToolResponse({
                        functionResponses: [{
                          id: call.id,
                          name: call.name,
                          response: { result: "Booking submitted successfully. Tell the user you have forwarded it to the technical team." }
                        }]
                      });
                  }
               }
            }

            // Audio output from Model
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              const base64Audio = parts[0]?.inlineData?.data;
              if (base64Audio) {
                const float32Array = base64ToFloat32Array(base64Audio);
                playAudioChunk(float32Array);
              }
            }

            // Interrupt (user started speaking, stop current TTS playback)
            if (message.serverContent?.interrupted) {
               // We just reset playback time to current, dropping buffered chunks
               playbackTimeRef.current = audioCtxRef.current!.currentTime;
            }
          },
          onclose: () => {
            endCall();
          },
          onerror: (err: any) => {
            console.error("Live API Error", err);
            setErrorMsg("Connection lost or API error.");
            endCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } // Professional voice
          },
          tools: [{ functionDeclarations: [submitBookingFunction] }]
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Failed to start call");
      endCall();
    }
  };

  const playAudioChunk = (float32Array: Float32Array) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const currentTime = audioCtx.currentTime;
    if (playbackTimeRef.current < currentTime) {
      playbackTimeRef.current = currentTime;
    }
    source.start(playbackTimeRef.current);
    playbackTimeRef.current += audioBuffer.duration;
  };

  const endCall = () => {
    setIsConnected(false);
    setIsCalling(false);
    setIsRinging(false);
    
    if (ringNodeRef.current) {
      ringNodeRef.current();
      ringNodeRef.current = null;
    }
    
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e){}
      sessionRef.current = null;
    }
    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state !== 'closed') {
         audioCtxRef.current.close().catch(()=>{});
      }
      audioCtxRef.current = null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {!isConnected && !isCalling && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={initAudioAndCall}
            className="bg-brand-red text-white p-4 rounded-full shadow-2xl hover:bg-brand-red-hover transition-colors flex items-center justify-center gap-3 relative group"
            title="Speak with Live AI Receptionist"
          >
            <PhoneCall size={28} />
            <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs">
              Voice Receptionist
            </span>
            <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-brand-blue rounded-full animate-ping"></div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isConnected || isCalling) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[300px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-center text-white"
          >
            <div className="pt-8 pb-4">
              <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center relative shadow-inner">
                <PhoneCall size={32} className="text-brand-blue animate-pulse" />
                {isConnected && !isMuted && (
                  <div className="absolute inset-0 rounded-full border-2 border-brand-blue animate-ping opacity-50"></div>
                )}
              </div>
              <h3 className="font-bold text-xl mb-1">Mack</h3>
              <p className="text-sm text-slate-400">
                {isRinging ? 'Ringing...' : isCalling ? 'Connecting...' : 'Live Call Connection'}
              </p>
              {errorMsg && <p className="text-xs text-brand-red mt-2 px-4">{errorMsg}</p>}
            </div>

            <div className="bg-slate-800 p-6 flex items-center justify-center gap-6">
              <button 
                onClick={toggleMute}
                disabled={isCalling}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-slate-700 text-slate-400' : 'bg-slate-700 text-white hover:bg-slate-600'
                } disabled:opacity-50`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              
              <button 
                onClick={endCall}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg bg-brand-red hover:bg-red-500 text-white"
                title="End Call"
              >
                <PhoneOff size={24} />
              </button>
            </div>
            
            {/* Audio visualization bar */}
            {isConnected && !isMuted && (
               <div className="h-1 w-full bg-slate-800 flex items-center justify-center overflow-hidden">
                 <motion.div 
                   className="h-full bg-brand-blue"
                   animate={{ width: ["10%", "100%", "30%", "80%", "10%"] }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                 />
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
