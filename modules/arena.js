/**
 * LevelUp: Speaker's Arena & Teleprompter Module
 * Mengelola naskah presentasi kustom, pemuatan materi bawaan,
 * teleprompter bergulir otomatis (WPM-based), penghitung waktu latihan,
 * dan generator tantangan topik spontan dengan hadiah XP Communication.
 */

class ArenaModule {
  constructor() {
    this.presetSpeeches = {
      intro: `Halo semuanya, selamat siang. Nama saya [Nama Kamu]. Hari ini saya ingin memperkenalkan diri saya secara profesional. Saya adalah seorang peminat dunia teknologi informasi yang sedang membangun disiplin diri setiap harinya. Saya percaya bahwa kemampuan teknis yang hebat harus didukung oleh kemampuan komunikasi yang kuat. Melalui latihan harian di Speaker's Arena ini, saya menantang diri saya sendiri untuk berbicara lebih tenang, mengatur intonasi suara, dan menyampaikan ide dengan cara yang terstruktur. Terima kasih atas perhatiannya, mari kita tumbuh bersama!`,
      
      "explain-api": `Apakah kamu tahu bagaimana aplikasi di handphone-mu berkomunikasi? Jawabannya adalah API, atau Application Programming Interface. Bayangkan API seperti seorang pelayan restoran. Kamu, sebagai pembeli, adalah Client yang duduk di meja makan. Dapur restoran adalah Server yang memproses data. Ketika kamu ingin memesan makanan, kamu tidak langsung pergi ke dapur. Kamu memanggil pelayan, menulis pesanan di kertas, dan pelayan mengantarkan pesanan itu ke dapur. Setelah makanan siap, pelayan membawanya kembali ke mejamu. Itulah API, jembatan pintar yang menghubungkan dua aplikasi berbeda agar bisa saling berkirim informasi!`,
      
      "react-pitch": `Dalam pengembangan web modern, React.js telah menjadi pustaka JavaScript yang sangat populer. Mengapa? Alasan utamanya adalah konsep komponen. Bayangkan membuat website seperti menyusun Lego. Di React, kita memecah tampilan website menjadi potongan-potongan kecil mandiri bernama Component, seperti tombol, navigasi, atau formulir. Kita cukup membuat komponen ini sekali, lalu bisa kita pakai berkali-kali di halaman mana pun. Selain itu, React menggunakan teknologi bernama Virtual DOM yang membuat halaman web ter-update secara instan dan super cepat tanpa perlu memuat ulang keseluruhan halaman browser.`,
      
      "crypto-basics": `Mari kita bahas salah satu topik paling ramai di era digital, yaitu Blockchain dan Cryptocurrency. Blockchain secara sederhana adalah sebuah buku kas digital raksasa yang transparan dan tidak bisa diedit secara curang. Buku kas ini tidak disimpan di satu komputer bank sentral, melainkan disalin dan dibagikan ke jutaan komputer di seluruh dunia. Setiap ada transaksi keuangan baru, seluruh komputer dalam jaringan harus memverifikasi dan menyetujuinya bersama-sama. Hal inilah yang mendasari mata uang digital seperti Bitcoin, menciptakan sistem keuangan yang mandiri, aman, dan tanpa perantara pihak ketiga.`
    };

    this.spontaneousPrompts = [
      "Jelaskan cara kerja sebuah mobil kepada anak kecil berusia 5 tahun.",
      "Jika kamu bisa membuat satu hukum wajib di seluruh dunia, hukum apa yang akan kamu buat?",
      "Pilih mana: Bisa membaca pikiran orang atau bisa menghilang? Jelaskan alasanmu dalam 1 menit.",
      "Jelaskan mengapa menabung uang itu terasa sangat sulit tapi sangat krusial bagi masa depan.",
      "Bagaimana kamu menjelaskan pentingnya belajar coding di tahun sekarang kepada kakek nenekmu?",
      "Ceritakan satu kesalahan terbesar yang pernah kamu buat dan pelajaran berharga apa yang kamu dapat.",
      "Jika kamu dikasih modal 10 juta rupiah hari ini, bisnis apa yang akan kamu buat secara instan?"
    ];

    this.isPlaying = false;
    this.wpm = 130;
    this.fontSize = 28;
    
    this.scrollInterval = null;
    this.timerInterval = null;
    this.secondsElapsed = 0;
  }

  init() {
    this.setupEventListeners();
    this.loadPresetSpeech("intro");
  }

  // --- EVENT LISTENERS ---
  setupEventListeners() {
    // WPM and Font Sliders
    const wpmSlider = document.getElementById("prompter-wpm");
    const wpmVal = document.getElementById("prompter-wpm-val");
    if (wpmSlider && wpmVal) {
      wpmSlider.addEventListener("input", (e) => {
        this.wpm = Number(e.target.value);
        wpmVal.textContent = `${this.wpm} WPM`;
        if (this.isPlaying) {
          // Restart prompter to apply new speed smoothly
          this.startPrompter();
        }
      });
    }

    const fontSlider = document.getElementById("prompter-font-size");
    const fontVal = document.getElementById("prompter-font-val");
    const prompterText = document.getElementById("prompter-text-container");
    if (fontSlider && fontVal && prompterText) {
      fontSlider.addEventListener("input", (e) => {
        this.fontSize = Number(e.target.value);
        fontVal.textContent = `${this.fontSize}px`;
        prompterText.style.fontSize = `${this.fontSize}px`;
      });
    }

    // Prompter Action Buttons
    const toggleBtn = document.getElementById("btn-prompter-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        this.togglePrompter();
      });
    }

    const resetBtn = document.getElementById("btn-prompter-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetPrompter();
      });
    }

    // Speech Draft Panel Switching
    const customSpeechTab = document.getElementById("tab-custom-speech");
    const presetSpeechTab = document.getElementById("tab-preset-speech");
    const customPanel = document.getElementById("panel-custom-speech");
    const presetPanel = document.getElementById("panel-preset-speech");

    if (customSpeechTab && presetSpeechTab && customPanel && presetPanel) {
      customSpeechTab.addEventListener("click", () => {
        customSpeechTab.classList.add("active");
        presetSpeechTab.classList.remove("active");
        customPanel.classList.add("active");
        presetPanel.classList.remove("active");
        window.app.playSynthSound("click");
      });

      presetSpeechTab.addEventListener("click", () => {
        presetSpeechTab.classList.add("active");
        customSpeechTab.classList.remove("active");
        presetPanel.classList.add("active");
        customPanel.classList.remove("active");
        window.app.playSynthSound("click");
      });
    }

    // Apply custom speech
    const applyBtn = document.getElementById("btn-apply-custom-speech");
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        this.applyCustomSpeech();
      });
    }

    // Select preset speech item
    const presetList = document.querySelector(".preset-speech-list");
    if (presetList) {
      presetList.addEventListener("click", (e) => {
        const item = e.target.closest(".preset-item");
        if (!item) return;

        const key = item.getAttribute("data-speech");
        this.loadPresetSpeech(key);
        window.app.playSynthSound("click");
      });
    }

    // Spontaneous Prompt Generator
    const promptBtn = document.getElementById("btn-generate-prompt");
    if (promptBtn) {
      promptBtn.addEventListener("click", () => {
        this.generateRandomPrompt();
      });
    }
  }

  // --- CORE TELEPROMPTER LOGIC ---
  togglePrompter() {
    if (this.isPlaying) {
      this.pausePrompter();
    } else {
      this.startPrompter();
    }
    window.app.playSynthSound("click");
  }

  startPrompter() {
    const screen = document.getElementById("prompter-screen");
    const textContainer = document.getElementById("prompter-text-container");
    const toggleBtn = document.getElementById("btn-prompter-toggle");
    const playIcon = document.getElementById("prompter-play-icon");
    const playText = document.getElementById("prompter-play-text");

    if (!screen || !textContainer) return;

    this.isPlaying = true;
    if (toggleBtn) toggleBtn.classList.add("playing");
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    if (playText) playText.textContent = "Pause";
    if (window.lucide) window.lucide.createIcons();

    // Clear existing scrolling interval
    clearInterval(this.scrollInterval);

    // Calculate scroll speeds based on WPM
    // Standard speaking speed: ~130-150 words per minute.
    // 130 WPM means roughly 2.1 words per second.
    // Let's scroll the screen based on WPM.
    // We can increment the screen's scrollTop. 
    // Higher WPM means faster scroll updates.
    // Scrolling formula: pixels scrolled per 20 milliseconds.
    const scrollStep = (this.wpm / 130) * 0.45; // custom scroll factor tuned for Outfit font

    this.scrollInterval = setInterval(() => {
      screen.scrollTop += scrollStep;
      
      // Auto-stop at the very end of scrolling
      const maxScroll = textContainer.offsetHeight - screen.offsetHeight + 240; // including bottom padding
      if (screen.scrollTop >= maxScroll) {
        this.completeSpeechTraining();
      }
    }, 20);

    // Start Timer if not already running
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this.secondsElapsed += 1;
        this.updateTimerDisplay();
      }, 1000);
    }
  }

  pausePrompter() {
    const toggleBtn = document.getElementById("btn-prompter-toggle");
    const playIcon = document.getElementById("prompter-play-icon");
    const playText = document.getElementById("prompter-play-text");

    this.isPlaying = false;
    if (toggleBtn) toggleBtn.classList.remove("playing");
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
    if (playText) playText.textContent = "Mulai";
    if (window.lucide) window.lucide.createIcons();

    clearInterval(this.scrollInterval);
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  stopPrompter() {
    this.pausePrompter();
  }

  resetPrompter() {
    this.pausePrompter();
    
    const screen = document.getElementById("prompter-screen");
    if (screen) screen.scrollTop = 0;

    this.secondsElapsed = 0;
    this.updateTimerDisplay();
    window.app.playSynthSound("click");
  }

  updateTimerDisplay() {
    const display = document.getElementById("speech-timer");
    if (!display) return;

    const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
    const secs = String(this.secondsElapsed % 60).padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
  }

  // --- ACTIONS ---
  applyCustomSpeech() {
    const input = document.getElementById("custom-speech-input");
    const textContainer = document.getElementById("prompter-text-container");

    if (!input || !textContainer) return;

    const text = input.value.trim();
    if (text === "") {
      window.app.showToast("Naskah Kosong", "Silakan masukkan naskah terlebih dahulu.", "fail");
      window.app.playSynthSound("fail");
      return;
    }

    // Convert newlines to paragraphs for prompter styling
    const htmlText = text.split("\n\n").map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
    textContainer.innerHTML = htmlText;
    
    this.resetPrompter();
    window.app.showToast("Naskah Diterapkan", "Naskah berhasil dipasang ke teleprompter.", "communication");
  }

  loadPresetSpeech(key) {
    const text = this.presetSpeeches[key];
    const textContainer = document.getElementById("prompter-text-container");
    const inputTextArea = document.getElementById("custom-speech-input");

    if (!text || !textContainer) return;

    // Convert newlines to HTML paragraphs
    textContainer.innerHTML = `<p>${text}</p>`;
    if (inputTextArea) inputTextArea.value = text;

    this.resetPrompter();
  }

  generateRandomPrompt() {
    const display = document.getElementById("random-prompt-display");
    if (!display) return;

    const idx = Math.floor(Math.random() * this.spontaneousPrompts.length);
    const selectedPrompt = this.spontaneousPrompts[idx];

    display.innerHTML = `<strong>Tantangan Hari Ini:</strong><br>"${selectedPrompt}"`;
    
    // Inject automatically into prompter as well for practice!
    const textContainer = document.getElementById("prompter-text-container");
    if (textContainer) {
      textContainer.innerHTML = `
        <p><strong>[TANTANGAN SPONTAN KILAT]</strong></p>
        <p>Jelaskan topik berikut ini selama 1 menit tanpa persiapan:</p>
        <p style="color: var(--color-communication); font-size: 32px; font-weight: 800; line-height: 1.4; margin: 24px 0;">
          "${selectedPrompt}"
        </p>
        <p>Tarik napas dalam-dalam, klik tombol Mulai, dan latih kelancaran bicaramu sekarang!</p>
      `;
    }

    this.resetPrompter();
    window.app.showToast("Tantangan Dimulai!", "Gunakan prompter untuk melacak durasi bicaramu.", "communication");
  }

  completeSpeechTraining() {
    this.pausePrompter();

    // Reward XP only if practiced for more than 30 seconds to avoid cheating
    if (this.secondsElapsed >= 30) {
      window.app.addXP(25, "communication");
      window.app.showToast("Latihan Selesai!", "Luar biasa! Latihan bicaramu tuntas secara konsisten.", "communication");
      
      // Update custom status on main dashboard sheet
      const speakerLevelEl = document.getElementById("char-speaker-level");
      if (speakerLevelEl) {
        if (window.app.state.stats.communication >= 30) speakerLevelEl.textContent = "Orator Berbakat";
        else if (window.app.state.stats.communication >= 20) speakerLevelEl.textContent = "Percaya Diri";
        else if (window.app.state.stats.communication >= 12) speakerLevelEl.textContent = "Menengah";
        else speakerLevelEl.textContent = "Basic";
      }
    } else {
      window.app.showToast("Latihan Singkat", "Coba berbicara minimal 30 detik untuk mengklaim XP Communication harian!", "fail");
      window.app.playSynthSound("fail");
    }

    this.resetPrompter();
  }
}

// Instantiate globally
window.arenaModule = new ArenaModule();
document.addEventListener("DOMContentLoaded", () => {
  window.arenaModule.init();
});
