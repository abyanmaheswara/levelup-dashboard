/**
 * LevelUp: Focus Center (Pomodoro & Synthesized Ambient Audio) Module
 * Mengelola Focus Timer Pomodoro, visualisasi SVG circular progress ring,
 * dan Web Audio API generator suara latar belakang ambient (Hujan, Space Hum, Lo-Fi Beat)
 * serta pemberian hadiah XP Discipline setelah sesi fokus selesai.
 */

class FocusModule {
  constructor() {
    this.timerDuration = 25 * 60; // Default 25 minutes
    this.timeLeft = this.timerDuration;
    this.timerInterval = null;
    this.isPaused = true;
    
    // Web Audio Sound Generators
    this.audioCtx = null;
    this.noiseNode = null;
    this.spaceHumNode = null;
    this.ambientPlaying = false;
    this.currentAmbientType = "none";
  }

  init() {
    this.setupEventListeners();
    this.updateTimerDisplay();
  }

  setupEventListeners() {
    const playBtn = document.getElementById("btn-focus-toggle");
    if (playBtn) {
      playBtn.addEventListener("click", () => this.toggleTimer());
    }

    const resetBtn = document.getElementById("btn-focus-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetTimer());
    }

    // Pomodoro Mode buttons
    const modes = document.querySelectorAll(".focus-mode-btn");
    modes.forEach(btn => {
      btn.addEventListener("click", (e) => {
        modes.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const min = Number(btn.getAttribute("data-minutes"));
        this.timerDuration = min * 60;
        this.resetTimer();
      });
    });

    // Ambient Sound Buttons
    const soundBtns = document.querySelectorAll(".ambient-btn");
    soundBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const soundType = btn.getAttribute("data-sound");
        this.toggleAmbientSound(soundType);
      });
    });
  }

  // --- POMODORO TIMER LOGIC ---
  toggleTimer() {
    const btn = document.getElementById("btn-focus-toggle");
    const icon = document.getElementById("focus-play-icon");
    const text = document.getElementById("focus-play-text");

    if (this.isPaused) {
      // Start Ticking
      this.isPaused = false;
      if (btn) btn.classList.add("active");
      if (icon) icon.setAttribute("data-lucide", "pause");
      if (text) text.textContent = "Pause";
      
      this.timerInterval = setInterval(() => {
        this.timeLeft -= 1;
        this.updateTimerDisplay();
        
        if (this.timeLeft <= 0) {
          this.completeFocusSession();
        }
      }, 1000);
      
      window.app.playSynthSound("click");
    } else {
      // Pause
      this.isPaused = true;
      if (btn) btn.classList.remove("active");
      if (icon) icon.setAttribute("data-lucide", "play");
      if (text) text.textContent = "Mulai Fokus";
      
      clearInterval(this.timerInterval);
      window.app.playSynthSound("fail");
    }
    
    if (window.lucide) window.lucide.createIcons();
  }

  resetTimer() {
    this.isPaused = true;
    clearInterval(this.timerInterval);
    this.timeLeft = this.timerDuration;
    
    const btn = document.getElementById("btn-focus-toggle");
    const icon = document.getElementById("focus-play-icon");
    const text = document.getElementById("focus-play-text");

    if (btn) btn.classList.remove("active");
    if (icon) icon.setAttribute("data-lucide", "play");
    if (text) text.textContent = "Mulai Fokus";
    
    this.updateTimerDisplay();
    window.app.playSynthSound("click");
    if (window.lucide) window.lucide.createIcons();
  }

  updateTimerDisplay() {
    const mins = String(Math.floor(this.timeLeft / 60)).padStart(2, '0');
    const secs = String(this.timeLeft % 60).padStart(2, '0');
    
    const timeText = document.getElementById("focus-timer-text");
    if (timeText) timeText.textContent = `${mins}:${secs}`;

    // Update circular SVG progress circle
    const circle = document.getElementById("focus-circle-progress");
    if (circle) {
      // Radius is 110. Circumference is 2 * PI * r = ~691
      const circumference = 691;
      const progress = this.timeLeft / this.timerDuration;
      const offset = circumference - (progress * circumference);
      circle.style.strokeDashoffset = offset;
    }
  }

  completeFocusSession() {
    this.resetTimer();
    
    // Award Discipline XP
    window.app.addXP(40, "discipline");
    
    // Modal congratulation trigger
    window.app.showToast("Sesi Fokus Selesai!", "Kerja bagus! Konsentrasi tinggi mendatangkan +40 XP Discipline.", "discipline");
    
    if (window.confetti) {
      window.confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
    
    // Play celebratory bell sound Synthetically
    this.playCelebrityBell();
  }

  playCelebrityBell() {
    if (!window.app.audioCtx) return;
    const ctx = window.app.audioCtx;
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880.00, now); // A5
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
  }

  // --- WEB AUDIO API AMBIENT SOUND SYNTHESIS ---
  toggleAmbientSound(type) {
    if (this.currentAmbientType === type && this.ambientPlaying) {
      // Stop currently playing sound
      this.stopAmbientSound();
      return;
    }

    // Stop previous sound
    this.stopAmbientSound();
    
    // lazy init audio context
    window.app.initAudio();
    this.audioCtx = window.app.audioCtx;
    if (!this.audioCtx) return;

    this.currentAmbientType = type;
    this.ambientPlaying = true;

    // Highlight button
    document.querySelectorAll(".ambient-btn").forEach(btn => {
      if (btn.getAttribute("data-sound") === type) {
        btn.classList.add("playing");
      } else {
        btn.classList.remove("playing");
      }
    });

    if (type === "rain") {
      this.playSynthesizedRain();
    } else if (type === "hum") {
      this.playSynthesizedSpaceHum();
    }
    
    window.app.playSynthSound("success");
  }

  stopAmbientSound() {
    this.ambientPlaying = false;
    this.currentAmbientType = "none";
    
    document.querySelectorAll(".ambient-btn").forEach(btn => btn.classList.remove("playing"));

    // Stop and disconnect nodes safely
    if (this.noiseNode) {
      try { this.noiseNode.stop(); } catch(e){}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.spaceHumNode) {
      try { this.spaceHumNode.stop(); } catch(e){}
      this.spaceHumNode.disconnect();
      this.spaceHumNode = null;
    }
  }

  playSynthesizedRain() {
    // Generate pink noise for soft rain sounds
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pink noise approximation formula
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // scale volume
      b6 = white * 0.115926;
    }

    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Apply lowpass filter to make it sound like gentle outdoor rain
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.45;

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noiseSource.start(0);
    this.noiseNode = noiseSource;
  }

  playSynthesizedSpaceHum() {
    // Generate a deep space cabin humming sound using oscillators of overlapping low frequencies
    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.18;
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 140;

    const osc1 = this.audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 55; // A1 low pitch

    const osc2 = this.audioCtx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 110; // A2 hum

    const modulator = this.audioCtx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.value = 0.25; // 0.25 Hz slow sweep

    const modGain = this.audioCtx.createGain();
    modGain.gain.value = 15; // frequency range

    modulator.connect(modGain);
    modGain.connect(osc1.frequency); // modulate pitch slowly

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(0);
    osc2.start(0);
    modulator.start(0);

    // Keep reference to stop it later
    this.spaceHumNode = {
      stop: () => {
        osc1.stop();
        osc2.stop();
        modulator.stop();
      },
      disconnect: () => {
        osc1.disconnect();
        osc2.disconnect();
        modulator.disconnect();
        filter.disconnect();
        gain.disconnect();
      }
    };
  }
}

// Instantiate globally
window.focusModule = new FocusModule();
document.addEventListener("DOMContentLoaded", () => {
  window.focusModule.init();
});
