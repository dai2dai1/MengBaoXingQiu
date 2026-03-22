import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { parseVoiceCommand } from '../utils/voiceParser';

export default function VoiceFAB() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef(null);
  const { childrenData, addPoints, deductPoints } = useAppContext();

  const startVoice = () => {
    // webkitSpeechRecognition is available in most Chromium-based browsers on Android as well as Chrome desktop.
    // iOS Safari has partial or no support depending on the OS version unless enabled in experimental features via Settings.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('您的浏览器不支持语音输入能力');
      return;
    }

    setFeedback('😊 正在聆听请说话...');
    setIsRecording(true);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      setIsRecording(false);
      setIsProcessing(true);
      const text = event.results[0][0].transcript;
      setFeedback(`👀 识别到: "${text}"`);
      
      const result = parseVoiceCommand(text, childrenData);
      
      setTimeout(() => {
        if (result.success) {
          const diff = result.parsedText !== text ? `\n(谐音纠正: ${text} → ${result.parsedText})` : '';
          if (result.action === 'add') {
             addPoints(result.child.id, result.value, result.reason);
             setFeedback(`✅ 已给 ${result.child.name} 加 ${result.value} 分`);
          } else {
             deductPoints(result.child.id, result.value, result.reason);
             setFeedback(`✅ 已给 ${result.child.name} 扣 ${result.value} 分`);
          }
        } else {
          setFeedback(`❌ ${result.error}`);
        }
        setIsProcessing(false);
        
        setTimeout(() => setFeedback(''), 4000);
      }, 500);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      setIsProcessing(false);
      setFeedback('识别失败，请重试');
      setTimeout(() => setFeedback(''), 3000);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <>
      {feedback && (
        <div style={{
          position: 'fixed', bottom: '110px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(25, 25, 25, 0.85)', color: 'white', padding: '12px 24px',
          borderRadius: '24px', zIndex: 1000, whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s'
        }}>
          {feedback}
        </div>
      )}
      
      <button 
        onClick={isRecording ? stopVoice : startVoice}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '50%',
          transform: 'translateX(50%)',
          width: '70px',
          height: '70px',
          borderRadius: '35px',
          background: isRecording ? '#ef4444' : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          border: 'none',
          boxShadow: isRecording ? '0 0 20px #ef4444' : '0 10px 30px rgba(99, 102, 241, 0.4)',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {isProcessing ? <Loader2 className="spin" size={32} /> : 
         isRecording ? <MicOff size={32} /> : <Mic size={32} />}
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
