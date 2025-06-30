// Helper functions for audio recording and speech recognition

// Define the SpeechRecognition types that might be missing
export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// Initialize speech recognition if browser supports it
export const initSpeechRecognition = (): SpeechRecognition | null => {
  if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      return recognition;
    }
  }
  return null;
};

// Play audio from base64 string and return a Promise that resolves when audio finishes playing
export const playAudio = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      
      audio.onended = () => {
        resolve();
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        reject(error);
      };
      
      // Some browsers might not trigger onended reliably, so we also set a timeout
      audio.onloadedmetadata = () => {
        // Add a small buffer to the duration to ensure onended has a chance to fire
        setTimeout(() => {
          resolve();
        }, (audio.duration * 1000) + 500);
      };
      
      const playPromise = audio.play();
      
      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Audio play promise error:', error);
          reject(error);
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      reject(error);
    }
  });
};

// Create an audio context variable at the module level
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentMediaSource: MediaSource | null = null;

// Play audio from a ReadableStream using MediaSource API
export const playAudioStream = async (audioStream: ReadableStream<Uint8Array>): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Stop any currently playing audio
      stopAudioPlayback();
      
      const mediaSource = new MediaSource();
      const audio = new Audio();
      audio.src = URL.createObjectURL(mediaSource);
      
      // Store references for stopping later
      currentAudioElement = audio;
      currentMediaSource = mediaSource;
      
      let sourceBuffer: SourceBuffer | null = null;

      mediaSource.addEventListener('sourceopen', async () => {
        sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        const reader = audioStream.getReader();
        const appendNextChunk = async () => {
          const { value, done } = await reader.read();
          if (done) {
            if (mediaSource.readyState === 'open') {
              mediaSource.endOfStream();
            }
            return;
          }
          if (value && sourceBuffer && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(value);
          }
          if (sourceBuffer) {
            sourceBuffer.addEventListener('updateend', appendNextChunk, { once: true });
          }
        };
        appendNextChunk();
      });

      audio.onended = () => {
        resolve();
      };
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        reject(error);
      };
      audio.play().catch((error) => {
        console.error('Audio play promise error:', error);
        reject(error);
      });
    } catch (error) {
      console.error('Error playing audio stream:', error);
      reject(error);
    }
  });
};

/**
 * Stops any currently playing audio
 */
export function stopAudioPlayback(): void {
  // Stop audio element if it exists
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.src = '';
      currentAudioElement = null;
    } catch (error) {
      console.error("Error stopping audio element:", error);
    }
  }
  
  // Clean up MediaSource if it exists
  if (currentMediaSource) {
    try {
      if (currentMediaSource.readyState === 'open') {
        currentMediaSource.endOfStream();
      }
      currentMediaSource = null;
    } catch (error) {
      console.error("Error cleaning up MediaSource:", error);
    }
  }
  
  // Stop AudioBufferSourceNode if it exists
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource = null;
    } catch (error) {
      console.error("Error stopping audio source:", error);
    }
  }
}

// Helper function to convert text to speech using our API (now returns a ReadableStream)
export const textToSpeech = async (text: string): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    console.log(`[DEEPGRAM] Converting text to speech, length: ${text.length} characters`);
    console.log(`[DEEPGRAM] Text preview: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    const startTime = Date.now();
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const requestDuration = Date.now() - startTime;
    console.log(`[DEEPGRAM] Response received in ${requestDuration}ms with status: ${response.status}`);

    if (!response.ok || !response.body) {
      console.error(`[DEEPGRAM] Error: API returned status ${response.status}`);
      if (!response.body) {
        console.error('[DEEPGRAM] No response body received');
      }
      throw new Error('Failed to convert text to speech');
    }

    console.log('[DEEPGRAM] Successfully received audio stream');
    return response.body;
  } catch (error) {
    console.error('[DEEPGRAM] Error converting text to speech:', error);
    return null;
  }
}; 