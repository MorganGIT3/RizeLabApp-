import { useCallback } from "react";

export function useClickSound(volume = 0.3) {
  const play = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Créer un filtre passe-bas pour un son plus doux
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(2000, now);
      
      const gainNode = audioContext.createGain();
      
      // Son de clic doux et agréable - moins aigu
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, now); // Plus bas que 800Hz
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08); // Descente douce
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.02); // Volume réduit
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      oscillator.connect(gainNode);
      gainNode.connect(lowpass);
      lowpass.connect(audioContext.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 0.12);
    } catch (error) {
      console.log("Audio not available:", error);
    }
  }, [volume]);

  return play;
}