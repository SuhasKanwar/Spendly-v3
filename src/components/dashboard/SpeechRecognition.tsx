import React, { useState, useEffect } from "react";
import { Mic, StopCircle } from "lucide-react";

interface SpeechRecognitionProps {
  onResult: (text: string) => void;
  onStart?: () => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ onResult, onStart }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);

  useEffect(() => {
    const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    const recog = new SpeechRecognitionImpl();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-US";
    // @ts-ignore
    recog.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResult(transcript);
    };
    recog.onend = () => setListening(false);
    setRecognition(recog);
  }, [onResult]);

  const startListening = () => {
    if (!recognition || listening) return;
    if (onStart) onStart();
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition || !listening) return;
    recognition.stop();
    setListening(false);
  };

  return (
    <button 
      type="button" 
      onMouseDown={startListening} 
      onMouseUp={stopListening} 
      onMouseLeave={stopListening}
      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
      title="Hold to speak, release to stop"
    >
      {listening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export default SpeechRecognition;