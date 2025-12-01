import { useCallback } from 'react';

export const useAuthSound = () => {
  const playAuthSound = useCallback(() => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Créer un filtre passe-bas pour un son plus doux
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(3000, now);
      lowpass.Q.setValueAtTime(1, now);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, now);
      master.gain.linearRampToValueAtTime(0.25, now + 0.05);
      master.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      
      master.connect(lowpass);
      lowpass.connect(ctx.destination);

      const playTone = (freq: number, start: number, duration: number, detune = 0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + start);
        osc.detune.setValueAtTime(detune, now + start);

        // Envelope très douce pour un son apaisant
        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.6, now + start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + start);
        osc.stop(now + start + duration);
      };

      // Mélodie harmonieuse et agréable en accord majeur (Do-Mi-Sol-Do)
      // Son de connexion réussie - doux et accueillant
      playTone(523.25, 0.0, 1.0, 0);     // C5 - Do
      playTone(659.25, 0.15, 0.9, 0);    // E5 - Mi
      playTone(783.99, 0.3, 0.8, 0);     // G5 - Sol
      playTone(1046.50, 0.45, 0.7, 0);   // C6 - Do (octave)

      // Fermer le contexte après la fin
      setTimeout(() => {
        try { 
          ctx.close(); 
        } catch (e) {
          // Ignorer les erreurs de fermeture
        }
      }, 2500);
    } catch (error) {
      console.log("Audio not available:", error);
    }
  }, []);

  return { playAuthSound };
};
