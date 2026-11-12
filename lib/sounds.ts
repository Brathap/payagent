// Studio-Grade Fintech Tactile Audio Engine & Neural Speech Synthesis
// Zero-dependency, single shared AudioContext, studio neural audio fallback

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Fintech tactile UI sound synthesizer
export function playSound(type: 'click' | 'success' | 'alert' | 'agent') {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    if (type === 'click') {
      // Soft high-end sine micro-tap (1100Hz -> 550Hz, 35ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } else if (type === 'agent') {
      // Elegant futuristic dual-tone chime (F#5 740Hz + B5 987Hz)
      [739.99, 987.77].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const st = ctx.currentTime + i * 0.04;
        gain.gain.setValueAtTime(0.04, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.12);
      });
    } else if (type === 'success') {
      // Warm 4-chord fintech settlement chime (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.32);
      });
    } else if (type === 'alert') {
      // Gentle warning ping (587Hz -> 440Hz warm sine)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // Graceful fallback
  }
}

// Active voice audio track tracker
let activeVoiceAudio: HTMLAudioElement | null = null;

export function stopVoice() {
  if (typeof window === 'undefined') return;
  try {
    if (activeVoiceAudio) {
      activeVoiceAudio.pause();
      activeVoiceAudio.currentTime = 0;
      activeVoiceAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}

// Fast mapping of known prompts to crystal-clear neural MP3 files
function getPreRecordedAudioUrl(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('welcome') || t.includes('meet payagent')) {
    return '/audio/welcome.mp3';
  }
  if (t.includes('aeroglide') || t.includes('arbitrat') || t.includes('travel pack') || t.includes('backpack')) {
    return '/audio/agent_arbitration.mp3';
  }
  if (t.includes('dispute') || t.includes('304') || t.includes('chargeback') || t.includes('resolution center')) {
    return '/audio/dispute_defense.mp3';
  }
  if (t.includes('capture') || t.includes('authorized') || t.includes('order placed') || t.includes('orders v2')) {
    return '/audio/order_captured.mp3';
  }
  if (t.includes('bidding') || t.includes('rfq') || t.includes('ecosupply') || t.includes('concession')) {
    return '/audio/bidding_rebate.mp3';
  }
  if (t.includes('mandate') || t.includes('ceiling clamp') || t.includes('budget')) {
    return '/audio/mandate_updated.mp3';
  }
  if (t.includes('receipt') || t.includes('ocr') || t.includes('invoice')) {
    return '/audio/receipt_scanned.mp3';
  }
  return null;
}

// High-fidelity neural voice playback
export function speakVoice(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  stopVoice();

  const cleanText = text.replace(/[*_#`~]/g, '').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  // 1. Check for pre-recorded crystal-clear neural audio
  const preRecordedUrl = getPreRecordedAudioUrl(cleanText);
  if (preRecordedUrl) {
    try {
      const audio = new Audio(preRecordedUrl);
      activeVoiceAudio = audio;
      audio.onended = () => {
        activeVoiceAudio = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        fallbackToDynamicTts(cleanText, onEnd);
      };
      audio.play().catch(() => {
        fallbackToDynamicTts(cleanText, onEnd);
      });
      return;
    } catch {
      fallbackToDynamicTts(cleanText, onEnd);
      return;
    }
  }

  // 2. Stream dynamic natural speech from server TTS route
  fallbackToDynamicTts(cleanText, onEnd);
}

function fallbackToDynamicTts(cleanText: string, onEnd?: () => void) {
  try {
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(ttsUrl);
    activeVoiceAudio = audio;
    audio.onended = () => {
      activeVoiceAudio = null;
      if (onEnd) onEnd();
    };
    audio.onerror = () => {
      fallbackToWebSpeech(cleanText, onEnd);
    };
    audio.play().catch(() => {
      fallbackToWebSpeech(cleanText, onEnd);
    });
  } catch {
    fallbackToWebSpeech(cleanText, onEnd);
  }
}

// Fallback to browser Web Speech API only if audio elements fail
function fallbackToWebSpeech(cleanText: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 1.0;
    utter.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Edge'))) ||
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Jenny'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utter.voice = naturalVoice;

    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd;
    }

    window.speechSynthesis.speak(utter);
  } catch {
    if (onEnd) onEnd();
  }
}
