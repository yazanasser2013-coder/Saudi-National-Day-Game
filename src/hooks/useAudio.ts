import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../context/GameContext";
const AUDIO_CONTEXT =
  typeof window !== "undefined"
    ? new (window.AudioContext || (window as any).webkitAudioContext)()
    : null;
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
) {
  if (!AUDIO_CONTEXT) return;
  const oscillator = AUDIO_CONTEXT.createOscillator();
  const gainNode = AUDIO_CONTEXT.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(AUDIO_CONTEXT.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  gainNode.gain.setValueAtTime(volume, AUDIO_CONTEXT.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    AUDIO_CONTEXT.currentTime + duration,
  );
  oscillator.start(AUDIO_CONTEXT.currentTime);
  oscillator.stop(AUDIO_CONTEXT.currentTime + duration);
}
function playSequence(notes: { freq: number; dur: number; delay: number }[]) {
  notes.forEach((note) => {
    setTimeout(() => playTone(note.freq, note.dur), note.delay);
  });
}
export function useAudio() {
  const { state } = useGame();
  const prevPhaseRef = useRef(state.phase);
  const prevStatusRef = useRef(state.gameStatus);
  const prevTimeRemainingRef = useRef(state.timeRemaining);
  const prevCorrectAnswersRef = useRef(state.correctAnswers);
  useEffect(() => {
    if (!state.soundEnabled) return;
    if (state.phase !== prevPhaseRef.current) {
      if (state.phase === 2)
        playSequence([
          { freq: 523, dur: 0.1, delay: 0 },
          { freq: 659, dur: 0.1, delay: 150 },
          { freq: 784, dur: 0.2, delay: 300 },
        ]);
      else if (state.phase === 3)
        playSequence([
          { freq: 200, dur: 0.3, delay: 0 },
          { freq: 150, dur: 0.3, delay: 200 },
          { freq: 100, dur: 0.5, delay: 400 },
        ]);
      prevPhaseRef.current = state.phase;
    }
    if (state.gameStatus !== prevStatusRef.current) {
      if (state.gameStatus === "playing" && prevStatusRef.current === "ready")
        playSequence([
          { freq: 440, dur: 0.1, delay: 0 },
          { freq: 554, dur: 0.1, delay: 100 },
          { freq: 659, dur: 0.2, delay: 200 },
        ]);
      else if (state.gameStatus === "phase-transition")
        playSequence([
          { freq: 300, dur: 0.2, delay: 0 },
          { freq: 250, dur: 0.2, delay: 200 },
          { freq: 200, dur: 0.3, delay: 400 },
        ]);
      else if (state.gameStatus === "final-stage")
        playSequence([
          { freq: 150, dur: 0.4, delay: 0 },
          { freq: 120, dur: 0.4, delay: 300 },
          { freq: 100, dur: 0.6, delay: 600 },
        ]);
      else if (state.gameStatus === "question-20")
        playSequence([
          { freq: 100, dur: 0.3, delay: 0 },
          { freq: 80, dur: 0.3, delay: 200 },
          { freq: 60, dur: 0.5, delay: 400 },
        ]);
      else if (state.gameStatus === "results")
        playSequence([
          { freq: 523, dur: 0.1, delay: 0 },
          { freq: 659, dur: 0.1, delay: 100 },
          { freq: 784, dur: 0.1, delay: 200 },
          { freq: 1047, dur: 0.3, delay: 300 },
        ]);
      prevStatusRef.current = state.gameStatus;
    }
    if (
      state.timeRemaining <= 5 &&
      state.timeRemaining > 0 &&
      prevTimeRemainingRef.current > 5
    )
      playTone(800, 0.1, "square", 0.4);
    if (state.timeRemaining <= 3 && state.timeRemaining > 0) {
      const lastSecond = Math.ceil(prevTimeRemainingRef.current);
      const currentSecond = Math.ceil(state.timeRemaining);
      if (lastSecond !== currentSecond && currentSecond >= 1)
        playTone(1000, 0.08, "square", 0.5);
    }
    prevTimeRemainingRef.current = state.timeRemaining;
    if (state.correctAnswers > prevCorrectAnswersRef.current) {
      playSequence([
        { freq: 523, dur: 0.08, delay: 0 },
        { freq: 659, dur: 0.08, delay: 80 },
        { freq: 784, dur: 0.15, delay: 160 },
      ]);
      prevCorrectAnswersRef.current = state.correctAnswers;
    }
  }, [
    state.phase,
    state.gameStatus,
    state.timeRemaining,
    state.correctAnswers,
    state.wrongAnswers,
    state.soundEnabled,
  ]);
  const playClick = useCallback(() => {
    if (!state.soundEnabled || !AUDIO_CONTEXT) return;
    playTone(800, 0.05, "sine", 0.2);
  }, [state.soundEnabled]);
  const playHover = useCallback(() => {
    if (!state.soundEnabled || !AUDIO_CONTEXT) return;
    playTone(1000, 0.03, "sine", 0.1);
  }, [state.soundEnabled]);
  const playWrong = useCallback(() => {
    if (!state.soundEnabled || !AUDIO_CONTEXT) return;
    playSequence([
      { freq: 200, dur: 0.15, delay: 0 },
      { freq: 150, dur: 0.2, delay: 150 },
    ]);
  }, [state.soundEnabled]);
  return { playClick, playHover, playWrong };
}
