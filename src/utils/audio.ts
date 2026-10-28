class SoundSynth {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Generic sound wave helper
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number = 0.1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio context errors
    }
  }

  // Button Click / Tap
  public playClick() {
    this.playTone(600, 'sine', 0.05, 0.08);
  }

  // Countdown Tick
  public playTick() {
    this.playTone(800, 'square', 0.04, 0.05);
  }

  // Final Countdown Alert
  public playTickUrgent() {
    this.playTone(1200, 'sawtooth', 0.08, 0.12);
  }

  // Correct Action / Point Earned
  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.1, 0.1);
      }, idx * 60);
    });
  }

  // Incorrect Action / Fail
  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [220, 180].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.15, 0.12);
      }, idx * 100);
    });
  }

  // High Score / Level Up Fanfare
  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.15);
      }, idx * 90);
    });
  }

  // Badge Unlock Special Sound
  public playBadgeUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.3, 0.15);
      }, idx * 80);
    });
  }
}

export const soundFx = new SoundSynth();
