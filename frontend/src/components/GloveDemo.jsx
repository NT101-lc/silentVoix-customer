import { useCallback, useEffect, useState } from 'react';
import { visualAssets } from '../data/content';

const predictionFlow = [
  {
    id: 'hello',
    sign: { en: 'Hello', vi: 'Xin chào' },
    phrase: { en: 'Hello, how can I help you?', vi: 'Xin chào, tôi có thể hỗ trợ gì?' },
    confidence: 94,
    feedback: { en: 'Palm angle is clear. Keep the wrist steady.', vi: 'Góc bàn tay rõ. Giữ cổ tay ổn định.' },
    intent: 'Greeting'
  },
  {
    id: 'need-help',
    sign: { en: 'Need Help', vi: 'Cần hỗ trợ' },
    phrase: { en: 'I need help with my order.', vi: 'Tôi cần hỗ trợ về đơn hàng.' },
    confidence: 91,
    feedback: { en: 'Finger bend matches the target pattern.', vi: 'Độ cong ngón tay khớp mẫu mục tiêu.' },
    intent: 'Support'
  },
  {
    id: 'thank-you',
    sign: { en: 'Thank You', vi: 'Cảm ơn' },
    phrase: { en: 'Thank you for waiting.', vi: 'Cảm ơn quý khách đã chờ.' },
    confidence: 96,
    feedback: { en: 'Motion speed is smooth enough for customer service.', vi: 'Tốc độ chuyển động mượt cho bối cảnh chăm sóc khách hàng.' },
    intent: 'Closing'
  },
  {
    id: 'pay',
    sign: { en: 'Pay', vi: 'Thanh toán' },
    phrase: { en: 'You can pay at the counter.', vi: 'Quý khách có thể thanh toán tại quầy.' },
    confidence: 89,
    feedback: { en: 'Wrist rotation is slightly low. Raise the palm two centimeters.', vi: 'Xoay cổ tay hơi thấp. Nâng bàn tay lên hai centimet.' },
    intent: 'Payment'
  }
];

const labels = {
  en: {
    title: 'Sign Glove AI Control Center',
    sub: 'Try a gesture and hear the support phrase.',
    connected: 'Connected',
    model: 'Ready',
    latency: 'Fast',
    samples: 'Phrases',
    liveTitle: 'Glove Translation',
    liveSub: 'The glove turns signs into speech.',
    startLive: 'Start Live Demo',
    stopLive: 'Stop Live Demo',
    predictNext: 'Predict Next',
    speak: 'Speak',
    reset: 'Reset',
    confidence: 'Confidence',
    modelState: 'Model State',
    listening: 'Listening',
    conversation: 'Spoken Phrases',
    conversationSub: 'Recent phrases appear here.',
    noMessages: 'Press Start Live Demo or Predict Next.',
    coach: 'Quick Phrases',
    emergency: 'Tap a phrase',
    emergencySub: 'Speak common support lines instantly.'
  },
  vi: {
    title: 'Demo AI Sign Glove',
    sub: 'Thử một cử chỉ và nghe câu hỗ trợ được phát ra.',
    connected: 'Đã Kết Nối',
    model: 'Sẵn Sàng',
    latency: 'Nhanh',
    samples: 'Câu Nói',
    liveTitle: 'Dịch Cử Chỉ',
    liveSub: 'Găng tay chuyển sign thành giọng nói.',
    startLive: 'Chạy Demo Live',
    stopLive: 'Dừng Demo Live',
    predictNext: 'Dự Đoán Tiếp',
    speak: 'Đọc Lên',
    reset: 'Reset',
    confidence: 'Độ tin cậy',
    modelState: 'Trạng thái model',
    listening: 'Đang lắng nghe',
    conversation: 'Câu Đã Phát',
    conversationSub: 'Các câu gần đây sẽ hiện tại đây.',
    noMessages: 'Bấm Chạy Demo Live hoặc Dự Đoán Tiếp.',
    coach: 'Câu Nhanh',
    emergency: 'Chạm để phát',
    emergencySub: 'Phát nhanh các câu hỗ trợ thường dùng.'
  }
};

function GloveDemo({ lang }) {
  const text = labels[lang] || labels.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [sensorTick, setSensorTick] = useState(0);
  const [messages, setMessages] = useState([]);
  const activePrediction = predictionFlow[activeIndex];

  const addMessage = useCallback((prediction) => {
    setMessages((current) => [
      {
        id: `${prediction.id}-${Date.now()}`,
        sign: prediction.sign[lang],
        phrase: prediction.phrase[lang],
        confidence: prediction.confidence
      },
      ...current
    ].slice(0, 5));
  }, [lang]);

  const speak = useCallback((value) => {
    if (!value || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  useEffect(() => {
    if (!isLive) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSensorTick((current) => current + 1);
      setActiveIndex((current) => {
        const next = (current + 1) % predictionFlow.length;
        const nextPrediction = predictionFlow[next];
        addMessage(nextPrediction);
        speak(nextPrediction.phrase[lang]);
        return next;
      });
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [addMessage, isLive, lang, speak]);

  function predictNext() {
    const nextIndex = (activeIndex + 1) % predictionFlow.length;
    const nextPrediction = predictionFlow[nextIndex];
    setActiveIndex(nextIndex);
    setSensorTick((current) => current + 1);
    addMessage(nextPrediction);
    speak(nextPrediction.phrase[lang]);
  }

  function toggleLiveDemo() {
    const nextValue = !isLive;
    setIsLive(nextValue);
    if (nextValue) {
      addMessage(activePrediction);
      speak(activePrediction.phrase[lang]);
    }
  }

  return (
    <section className="glove-page">
      <div className="glove-hero panel">
        <div>
          <span className="eyebrow">SilentVoix Assistive Demo</span>
          <h1>{text.title}</h1>
          <p>{text.sub}</p>
        </div>
        <div className="glove-product-shot" aria-hidden="true">
          <img src={visualAssets.glove} alt="" />
          <div className="glove-sensor-chip chip-one">Flex</div>
          <div className="glove-sensor-chip chip-two">IMU</div>
        </div>
        <div className="glove-stats">
          <StatusCard label={text.connected} value="OK" tone="online" />
          <StatusCard label={text.model} value="AI" tone="ready" />
          <StatusCard label={text.latency} value="38ms" tone="fast" />
          <StatusCard label={text.samples} value="4" tone="sample" />
        </div>
      </div>

      <div className="glove-grid simplified">
        <article className="panel live-panel">
          <div className="section-head">
            <h2>{text.liveTitle}</h2>
            <p>{text.liveSub}</p>
          </div>
          <div
            className={`prediction-card ${activePrediction.confidence > 90 ? 'success' : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {activePrediction.confidence > 90 && (
              <>
                <div className="success-badge">Perfect!</div>
                <div className="success-glow" />
              </>
            )}
            <span className="model-state">{text.modelState}: {isLive ? text.listening : 'Idle'}</span>
            <strong>{activePrediction.sign[lang]}</strong>
            <p>{activePrediction.phrase[lang]}</p>
            <div className="confidence-row">
              <span>{text.confidence}</span>
              <b>{activePrediction.confidence}%</b>
            </div>
            <div className="confidence-meter">
              <span style={{ width: `${activePrediction.confidence}%` }} />
            </div>
          </div>
          <div className="glove-actions">
            <button className="action" onClick={toggleLiveDemo}>
              {isLive ? text.stopLive : text.startLive}
            </button>
            <button className="action ghost" onClick={predictNext}>{text.predictNext}</button>
            <button className="action ghost" onClick={() => speak(activePrediction.phrase[lang])}>{text.speak}</button>
            <button className="action ghost" onClick={() => setMessages([])}>{text.reset}</button>
          </div>
        </article>

        <article className="panel conversation-panel">
          <div className="section-head">
            <h2>{text.conversation}</h2>
            <p>{text.conversationSub}</p>
          </div>
          <div className="conversation-list" aria-live="polite">
            {messages.length ? (
              messages.map((message) => (
                <div key={message.id} className="conversation-item">
                  <span>{message.sign} - {message.confidence}%</span>
                  <p>{message.phrase}</p>
                </div>
              ))
            ) : (
              <p className="empty-state">{text.noMessages}</p>
            )}
          </div>
        </article>

        <article className="panel coach-panel">
          <div className="section-head">
            <h2>{text.coach}</h2>
            <p>{activePrediction.feedback[lang]}</p>
          </div>
          <div className="shortcut-grid">
            <div>
              <span>{text.emergency}</span>
              <p>{text.emergencySub}</p>
            </div>
            {predictionFlow.map((prediction) => (
              <button key={prediction.id} className="shortcut-button" onClick={() => speak(prediction.phrase[lang])}>
                <strong>{prediction.sign[lang]}</strong>
                <span>{prediction.intent}</span>
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function StatusCard({ label, value, tone }) {
  return (
    <div className={`status-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default GloveDemo;
