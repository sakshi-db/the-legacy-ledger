import { useCallback, useEffect, useRef, useState } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  duration: number;
  levels: number[];
  start: () => void;
  stop: () => void;
  error: string | null;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [levels, setLevels] = useState<number[]>(Array(24).fill(0.2));
  const [error, setError] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const fallbackRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const bars = 24;
      const slice = Math.floor(data.length / bars);
      const next: number[] = [];
      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < slice; j++) sum += data[i * slice + j];
        next.push(Math.max(0.15, (sum / slice) / 255));
      }
      setLevels(next);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 250);
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // Fallback: simulated recording (no mic permission)
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 250);
      fallbackRef.current = window.setInterval(() => {
        setLevels(Array.from({ length: 24 }, () => 0.2 + Math.random() * 0.7));
      }, 120);
    }
  }, [tick]);

  const stop = useCallback(() => {
    setIsRecording(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (fallbackRef.current) clearInterval(fallbackRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setLevels(Array(24).fill(0.2));
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (fallbackRef.current) clearInterval(fallbackRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return { isRecording, duration, levels, start, stop, error };
}
