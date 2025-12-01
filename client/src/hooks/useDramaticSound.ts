import { useCallback } from 'react';

export const useDramaticSound = () => {
  const playDramaticSound = useCallback(() => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Créer un filtre passe-bas pour un son plus doux et chaleureux
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(4000, now);
      lowpass.Q.setValueAtTime(1, now);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.3, now + 0.1);
      master.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
      
      master.connect(lowpass);
      lowpass.connect(ctx.destination);

      const playTone = (freq: number, start: number, duration: number, detune = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);
        osc.detune.setValueAtTime(detune, now + start);

        // Envelope douce et progressive
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.7, now + start + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + start);
        osc.stop(now + start + duration);
      };

      // Mélodie douce et accueillante en progression ascendante harmonieuse
      // Plus doux et moins dramatique
      playTone(392.00, 0.0, 1.2, 0);     // G4 - Sol
      playTone(493.88, 0.2, 1.0, 0);     // B4 - Si
      playTone(523.25, 0.4, 0.9, 0);     // C5 - Do
      playTone(659.25, 0.6, 0.8, 0);     // E5 - Mi
      playTone(783.99, 0.8, 0.7, 0);     // G5 - Sol

      // Fermer le contexte après la fin
      setTimeout(() => {
        try { 
          ctx.close(); 
        } catch (e) {
          // Ignorer les erreurs de fermeture
        }
      }, 3000);
    } catch (error) {
      console.log("Audio not available:", error);
    }
  }, []);

  return { playDramaticSound };
};



