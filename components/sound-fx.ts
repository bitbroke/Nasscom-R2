"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * Lightweight sound FX via Web Audio API.
 * No external files needed — generates tones programmatically.
 */
export function useSoundFX() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  /** Bit-crushed startup chime (Windows XP inspired) */
  const playStartup = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square"; // bit-crushed feel
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch { /* silently fail */ }
  }, [getCtx]);

  /** Soft keyboard click */
  const playKeyClick = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1200 + Math.random() * 400;
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch { /* silently fail */ }
  }, [getCtx]);

  /** Sparkle/boop sound for resolution */
  const playSparkle = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.25);
      });
    } catch { /* silently fail */ }
  }, [getCtx]);

  /** Angry buzz for enraged */
  const playAngry = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 150;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch { /* silently fail */ }
  }, [getCtx]);

  /** Achievement fanfare */
  const playAchievement = useCallback(() => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      [659.25, 783.99, 987.77, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.3);
      });
    } catch { /* silently fail */ }
  }, [getCtx]);

  const setEnabled = useCallback((v: boolean) => { enabledRef.current = v; }, []);

  useEffect(() => {
    return () => { ctxRef.current?.close(); };
  }, []);

  return { playStartup, playKeyClick, playSparkle, playAngry, playAchievement, setEnabled };
}
