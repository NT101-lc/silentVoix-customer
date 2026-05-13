import { useCallback, useEffect, useMemo, useState } from 'react';

const predictionFlow = [
  {
    id: 'hello',
    sign: { en: 'Hello', vi: 'Xin chao' },
    phrase: { en: 'Hello, how can I help you?', vi: 'Xin chao, toi co the ho tro gi?' },
    confidence: 94,
    feedback: { en: 'Palm angle is clear. Keep the wrist steady.', vi: 'Goc ban tay ro. Giu co tay on dinh.' },
    intent: 'Greeting'
  },
  {
    id: 'need-help',
    sign: { en: 'Need Help', vi: 'Can ho tro' },
    phrase: { en: 'I need help with my order.', vi: 'Toi can ho tro ve don hang.' },
    confidence: 91,
    feedback: { en: 'Finger bend matches the target pattern.', vi: 'Do cong ngon tay khop mau muc tieu.' },
    intent: 'Support'
  },
  {
    id: 'thank-you',
    sign: { en: 'Thank You', vi: 'Cam on' },
    phrase: { en: 'Thank you for waiting.', vi: 'Cam on quy khach da cho.' },
    confidence: 96,
    feedback: { en: 'Motion speed is smooth enough for customer service.', vi: 'Toc do chuyen dong muot cho boi canh cham soc khach hang.' },
    intent: 'Closing'
  },
  {
    id: 'pay',
    sign: { en: 'Pay', vi: 'Thanh toan' },
    phrase: { en: 'You can pay at the counter.', vi: 'Quy khach co the thanh toan tai quay.' },
    confidence: 89,
    feedback: { en: 'Wrist rotation is slightly low. Raise the palm two centimeters.', vi: 'Xoay co tay hoi thap. Nang ban tay len hai centimet.' },
    intent: 'Payment'
  }
];

const calibrationSteps = [
  { en: 'Open palm baseline', vi: 'Mo ban tay lam moc' },
  { en: 'Closed fist baseline', vi: 'Nam tay lam moc' },
  { en: 'Wrist rotation range', vi: 'Do bien xoay co tay' },
  { en: 'Ready profile', vi: 'Ho so san sang' }
];

const labels = {
  en: {
    title: 'Sign Glove AI Control Center',
    sub: 'Competition demo for glove sensors, AI prediction, speech output, and data capture.',
    connected: 'Glove Connected',
    model: 'Model Ready',
    latency: 'Latency',
    samples: 'Training Samples',
    calibration: 'Glove Calibration',
    calibrationSub: 'Create a quick user profile before running predictions.',
    startCalibration: 'Start Calibration',
    calibrated: 'Calibrated',
    liveTitle: 'Live Prediction',
    liveSub: 'Mock sensor stream shaped like the real glove pipeline.',
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
    conversationSub: 'Detected signs become customer-service speech.',
    noMessages: 'Predictions will appear here during the demo.',
    training: 'Collect Training Data',
    trainingSub: 'Record mock samples to show how the model improves per user.',
    label: 'Label',
    record: 'Record 3s Sample',
    coach: 'AI Coach Feedback',
    emergency: 'Service Shortcuts',
    emergencySub: 'High-priority signs for real customer support.'
  },
  vi: {
    title: 'Trung Tam AI Sign Glove',
    sub: 'Demo thi cho cam bien gang tay, AI du doan, phat giong noi va thu du lieu.',
    connected: 'Gang Tay Da Ket Noi',
    model: 'Model San Sang',
    latency: 'Do tre',
    samples: 'Mau Training',
    calibration: 'Can Chinh Gang Tay',
    calibrationSub: 'Tao nhanh ho so nguoi dung truoc khi du doan.',
    startCalibration: 'Bat Dau Can Chinh',
    calibrated: 'Da Can Chinh',
    liveTitle: 'Du Doan Truc Tiep',
    liveSub: 'Sensor stream mock theo pipeline gang tay that.',
    startLive: 'Chay Demo Live',
    stopLive: 'Dung Demo Live',
    predictNext: 'Du Doan Tiep',
    speak: 'Doc Len',
    reset: 'Reset',
    confidence: 'Do tin cay',
    modelState: 'Trang thai model',
    listening: 'Dang lang nghe',
    sensorTitle: 'Dong Cam Bien',
    conversation: 'Che Do Hoi Thoai',
    conversationSub: 'Sign duoc nhan dien se thanh cau noi cham soc khach hang.',
    noMessages: 'Cac du doan se hien o day khi demo.',
    training: 'Thu Du Lieu Training',
    trainingSub: 'Ghi mau mock de cho thay model co the cai thien theo nguoi dung.',
    label: 'Nhan',
    record: 'Ghi Mau 3s',
    coach: 'Phan Hoi AI Coach',
    emergency: 'Shortcut Dich Vu',
    emergencySub: 'Cac sign uu tien cao cho ho tro khach hang.'
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
          <div className="prediction-card">
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
