import { useCallback, useEffect, useMemo, useState } from 'react';
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

const calibrationSteps = [
  { en: 'Open palm baseline', vi: 'Mở bàn tay làm mốc' },
  { en: 'Closed fist baseline', vi: 'Nắm tay làm mốc' },
  { en: 'Wrist rotation range', vi: 'Đo biên xoay cổ tay' },
  { en: 'Ready profile', vi: 'Hồ sơ sẵn sàng' }
];

const labels = {
  en: {
    title: 'Sign Glove AI Control Center',
    sub: 'Glove sensors, AI prediction, speech output, and training data.',
    connected: 'Glove Connected',
    model: 'Model Ready',
    latency: 'Latency',
    samples: 'Training Samples',
    calibration: 'Glove Calibration',
    calibrationSub: 'Quick profile setup.',
    startCalibration: 'Start Calibration',
    calibrated: 'Calibrated',
    liveTitle: 'Live Prediction',
    liveSub: 'Real-time sign output.',
    startLive: 'Start Live Demo',
    stopLive: 'Stop Live Demo',
    predictNext: 'Predict Next',
    speak: 'Speak',
    reset: 'Reset',
    confidence: 'Confidence',
    modelState: 'Model State',
    listening: 'Listening',
    sensorTitle: 'Sensor Stream',
    conversation: 'Conversation Mode',
    conversationSub: 'Signs become spoken support.',
    noMessages: 'Predictions will appear here during the demo.',
    training: 'Collect Training Data',
    trainingSub: 'Record samples per user.',
    label: 'Label',
    record: 'Record 3s Sample',
    coach: 'AI Coach Feedback',
    emergency: 'Service Shortcuts',
    emergencySub: 'Fast customer support signs.'
  },
  vi: {
    title: 'Trung Tâm AI Sign Glove',
    sub: 'Cảm biến găng tay, AI dự đoán, phát giọng nói và dữ liệu training.',
    connected: 'Găng Tay Đã Kết Nối',
    model: 'Model Sẵn Sàng',
    latency: 'Độ trễ',
    samples: 'Mẫu Training',
    calibration: 'Căn Chỉnh Găng Tay',
    calibrationSub: 'Tạo nhanh hồ sơ.',
    startCalibration: 'Bắt Đầu Căn Chỉnh',
    calibrated: 'Đã Căn Chỉnh',
    liveTitle: 'Dự Đoán Trực Tiếp',
    liveSub: 'Kết quả sign theo thời gian thực.',
    startLive: 'Chạy Demo Live',
    stopLive: 'Dừng Demo Live',
    predictNext: 'Dự Đoán Tiếp',
    speak: 'Đọc Lên',
    reset: 'Reset',
    confidence: 'Độ tin cậy',
    modelState: 'Trạng thái model',
    listening: 'Đang lắng nghe',
    sensorTitle: 'Dòng Cảm Biến',
    conversation: 'Chế Độ Hội Thoại',
    conversationSub: 'Sign thành câu nói hỗ trợ.',
    noMessages: 'Các dự đoán sẽ hiện ở đây khi demo.',
    training: 'Thu Dữ Liệu Training',
    trainingSub: 'Ghi mẫu theo từng người dùng.',
    label: 'Nhãn',
    record: 'Ghi Mẫu 3s',
    coach: 'Phản Hồi AI Coach',
    emergency: 'Shortcut Dịch Vụ',
    emergencySub: 'Sign nhanh cho hỗ trợ khách.'
  }
};

function GloveDemo({ lang }) {
  const text = labels[lang] || labels.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const [calibrationIndex, setCalibrationIndex] = useState(-1);
  const [isLive, setIsLive] = useState(false);
  const [sensorTick, setSensorTick] = useState(0);
  const [messages, setMessages] = useState([]);
  const [sampleCount, setSampleCount] = useState(24);
  const [trainingLabel, setTrainingLabel] = useState(predictionFlow[0].id);
  const activePrediction = predictionFlow[activeIndex];
  const isCalibrated = calibrationIndex >= calibrationSteps.length - 1;

  const sensors = useMemo(() => {
    const base = activeIndex * 11 + sensorTick;
    return [
      { name: 'Flex 1', value: 48 + ((base * 7) % 34) },
      { name: 'Flex 2', value: 42 + ((base * 5) % 38) },
      { name: 'Flex 3', value: 36 + ((base * 9) % 42) },
      { name: 'Gyro X', value: 54 + ((base * 6) % 30) },
      { name: 'Gyro Y', value: 46 + ((base * 4) % 36) }
    ];
  }, [activeIndex, sensorTick]);

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

  function startCalibration() {
    setCalibrationIndex(0);
    let nextStep = 0;
    const intervalId = window.setInterval(() => {
      nextStep += 1;
      setCalibrationIndex(nextStep);
      if (nextStep >= calibrationSteps.length - 1) {
        window.clearInterval(intervalId);
      }
    }, 650);
  }

  function predictNext() {
    const nextIndex = (activeIndex + 1) % predictionFlow.length;
    const nextPrediction = predictionFlow[nextIndex];
    setActiveIndex(nextIndex);
    setSensorTick((current) => current + 1);
    addMessage(nextPrediction);
    speak(nextPrediction.phrase[lang]);
  }

  function recordSample() {
    setSampleCount((current) => current + 1);
    setSensorTick((current) => current + 2);
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
          <span className="eyebrow">SilentVoix Hardware Demo</span>
          <h1>{text.title}</h1>
          <p>{text.sub}</p>
        </div>
        <div className="glove-product-shot" aria-hidden="true">
          <img src={visualAssets.glove} alt="" />
          <div className="glove-sensor-chip chip-one">Flex</div>
          <div className="glove-sensor-chip chip-two">IMU</div>
        </div>
        <div className="glove-stats">
          <StatusCard label={text.connected} value="BLE-04" tone="online" />
          <StatusCard label={text.model} value="CNN-LSTM" tone="ready" />
          <StatusCard label={text.latency} value="38ms" tone="fast" />
          <StatusCard label={text.samples} value={String(sampleCount)} tone="sample" />
        </div>
      </div>

      <div className="glove-grid">
        <article className="panel calibration-panel">
          <div className="section-head">
            <h2>{text.calibration}</h2>
            <p>{text.calibrationSub}</p>
          </div>
          <div className="calibration-steps">
            {calibrationSteps.map((step, index) => (
              <div
                key={step.en}
                className={`calibration-step ${index <= calibrationIndex ? 'complete' : ''} ${
                  index === calibrationIndex && !isCalibrated ? 'active' : ''
                }`}
              >
                <span>{index + 1}</span>
                <p>{step[lang]}</p>
              </div>
            ))}
          </div>
          <button className="action" onClick={startCalibration}>
            {isCalibrated ? text.calibrated : text.startCalibration}
          </button>
        </article>

        <article className="panel live-panel">
          <div className="section-head">
            <h2>{text.liveTitle}</h2>
            <p>{text.liveSub}</p>
          </div>
          <div className={`prediction-card ${activePrediction.confidence > 90 ? 'success' : ''}`}>
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

        <article className="panel sensor-panel">
          <div className="section-head">
            <h2>{text.sensorTitle}</h2>
            <p>Flex + IMU telemetry</p>
          </div>
          <div className="sensor-list">
            {sensors.map((sensor) => (
              <div key={sensor.name} className="sensor-row">
                <div>
                  <span>{sensor.name}</span>
                  <b>{sensor.value}</b>
                </div>
                <div className="sensor-meter">
                  <span style={{ width: `${sensor.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel conversation-panel">
          <div className="section-head">
            <h2>{text.conversation}</h2>
            <p>{text.conversationSub}</p>
          </div>
          <div className="conversation-list">
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

        <article className="panel training-panel">
          <div className="section-head">
            <h2>{text.training}</h2>
            <p>{text.trainingSub}</p>
          </div>
          <label className="auth-label">
            {text.label}
            <select value={trainingLabel} onChange={(event) => setTrainingLabel(event.target.value)} className="lang-select">
              {predictionFlow.map((prediction) => (
                <option key={prediction.id} value={prediction.id}>
                  {prediction.sign[lang]}
                </option>
              ))}
            </select>
          </label>
          <button className="action" onClick={recordSample}>{text.record}</button>
          <div className="training-progress">
            <span style={{ width: `${Math.min(100, sampleCount * 2)}%` }} />
          </div>
          <p className="progress-label">{sampleCount} {text.samples}</p>
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
