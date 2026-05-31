/**
 * LevelUp: Interactive AI Engineering Roadmap Module (Roadmap.sh Style)
 * Mengelola silabus 12 minggu, pencantuman interaktif sub-topik,
 * perhitungan otomatis persentase, perolehan XP, dan rendering
 * visualisasi alur timeline zig-zag dengan milestone fase terpusat.
 */

class RoadmapModule {
  constructor() {
    this.weeks = [
      {
        num: 1,
        fase: "Fase 1: Fondasi Python",
        title: "Minggu 1: Logika Dasar & Aliran Program",
        xpReward: 15,
        topics: [
          "Memahami Variabel & Tipe Data (String, Integer, List)",
          "Menguasai Kondisional (if, elif, else)",
          "Menguasai Perulangan (for loops, while loops)",
          "Praktik Mandiri: Program Simulasi Keamanan Pipa Kilang Minyak"
        ]
      },
      {
        num: 2,
        fase: "Fase 1: Fondasi Python",
        title: "Minggu 2: Efisiensi Kode dengan Fungsi",
        xpReward: 15,
        topics: [
          "Membuat Fungsi Kustom sendiri (def) & Parameters",
          "Memahami Nilai Kembalian (return value) fungsi",
          "Manipulasi Teks/String Tingkat Lanjut",
          "Praktik Mandiri: Program Konversi Barelan Minyak ke Liter"
        ]
      },
      {
        num: 3,
        fase: "Fase 1: Fondasi Python",
        title: "Minggu 3: Struktur Data & Pengenalan OOP",
        xpReward: 15,
        topics: [
          "Memahami Dictionaries & Tuples",
          "Dasar Pemrograman Berorientasi Objek (Class & Object)",
          "Praktik Mandiri: Membuat Struktur Data Riwayat Mesin Bor"
        ]
      },
      {
        num: 4,
        fase: "Fase 2: Manipulasi Data",
        title: "Minggu 4: NumPy & Perhitungan Matriks",
        xpReward: 15,
        topics: [
          "Memahami Array NumPy (1D & Multi-dimensi)",
          "Operasi Matematika & Vektorisasi Array",
          "Filter & Slicing Data Menggunakan NumPy"
        ]
      },
      {
        num: 5,
        fase: "Fase 2: Manipulasi Data",
        title: "Minggu 5: Pandas (Manipulasi Tabel Data)",
        xpReward: 15,
        topics: [
          "Membaca Berkas CSV/Excel dengan Pandas",
          "Pembersihan Data: Mengatasi Baris Data Kosong (NaN)",
          "Menyaring & Mengelompokkan Data Sensor",
          "Praktik Mandiri: Menyaring Data Sensor Suhu Ekstrim dari Kaggle"
        ]
      },
      {
        num: 6,
        fase: "Fase 2: Manipulasi Data",
        title: "Minggu 6: Visualisasi Tren Data",
        xpReward: 15,
        topics: [
          "Membuat Grafik dengan Matplotlib",
          "Membuat Grafik Keren dengan Seaborn",
          "Praktik Mandiri: Visualisasi Grafik Tren Fluktuasi Harga Minyak Dunia"
        ]
      },
      {
        num: 7,
        fase: "Fase 3: Classical Machine Learning",
        title: "Minggu 7: Regresi Linier (Prediksi Tren Angka)",
        xpReward: 20,
        topics: [
          "Memahami Teori Regresi Linier",
          "Menggunakan Scikit-Learn untuk Regresi",
          "Praktik Mandiri: Prediksi Konsumsi Solar Kapal Tanker dari Dataset"
        ]
      },
      {
        num: 8,
        fase: "Fase 3: Classical Machine Learning",
        title: "Minggu 8: Klasifikasi Data Sensor",
        xpReward: 20,
        topics: [
          "Memahami Algoritma Decision Trees & Random Forest",
          "Klasifikasi Biner Data Sensor dengan Scikit-Learn",
          "Praktik Mandiri: AI Klasifikasi Prediksi Pipa Gas Bocor vs Aman"
        ]
      },
      {
        num: 9,
        fase: "Fase 3: Classical Machine Learning",
        title: "Minggu 9: Evaluasi & Optimasi Model AI",
        xpReward: 20,
        topics: [
          "Memahami Confusion Matrix, Precision, & Recall",
          "Hyperparameter Tuning Sederhana",
          "Menyimpan Model AI (Pickle / Joblib) untuk Produksi"
        ]
      },
      {
        num: 10,
        fase: "Fase 4: Computer Vision & Integrasi",
        title: "Minggu 10: Pengenalan Gambar dengan OpenCV",
        xpReward: 20,
        topics: [
          "Membaca Video/Kamera Web di Python dengan OpenCV",
          "Pemrosesan Citra: Grayscale, Blur, & Edge Detection",
          "Mendeteksi Kontur Objek"
        ]
      },
      {
        num: 11,
        fase: "Fase 4: Computer Vision & Integrasi",
        title: "Minggu 11: Deteksi Objek Real-Time (K3)",
        xpReward: 30,
        topics: [
          "Memahami Konsep Pendeteksi Objek YOLO/Haar Cascades",
          "Melatih Detektor Objek Kustom",
          "Misi Portfolio: Membuat Detektor Helm Proyek via Webcam"
        ]
      },
      {
        num: 12,
        fase: "Fase 4: Computer Vision & Integrasi",
        title: "Minggu 12: Integrasi Gemini API",
        xpReward: 30,
        topics: [
          "Memahami Cara Kerja HTTP Request ke Gemini API",
          "Menyusun Prompt Kreatif & Pemrosesan Payload JSON",
          "Integrasi Gemini API ke Dasbor LevelUp untuk Prompt Spontan"
        ]
      }
    ];

    this.completedTopics = [];
  }

  init() {
    this.loadStates();
    this.renderRoadmap();
    this.updateProgress();
  }

  // --- STATE PERSISTENCE ---
  loadStates() {
    const saved = localStorage.getItem("levelup_roadmap_completed");
    if (saved) {
      try {
        this.completedTopics = JSON.parse(saved);
      } catch (e) {
        console.error("Gagal memuat status roadmap", e);
      }
    }
  }

  saveStates() {
    localStorage.setItem("levelup_roadmap_completed", JSON.stringify(this.completedTopics));
    this.updateProgress();
  }

  syncState() {
    this.updateProgress();
  }

  // --- UI TIMELINE RENDERING (ROADMAP.SH STYLE) ---
  renderRoadmap() {
    const timeline = document.getElementById("roadmap-weeks-grid");
    if (!timeline) return;

    // We replace grid layout with a timeline container class dynamically
    timeline.className = "roadmap-weeks-timeline";
    timeline.innerHTML = "";

    let currentPhase = "";

    this.weeks.forEach((week, index) => {
      // 1. Render Phase Title Banners as Central Milestones
      if (week.fase !== currentPhase) {
        currentPhase = week.fase;
        
        let phaseGlowClass = "color-knowledge";
        if (currentPhase.includes("Fase 2")) phaseGlowClass = "color-wealth";
        else if (currentPhase.includes("Fase 3")) phaseGlowClass = "color-communication";
        else if (currentPhase.includes("Fase 4")) phaseGlowClass = "color-discipline";

        const milestone = document.createElement("div");
        milestone.className = "phase-milestone";
        milestone.innerHTML = `
          <div class="phase-milestone-content ${phaseGlowClass}">
            <span>${currentPhase.toUpperCase()}</span>
          </div>
        `;
        timeline.appendChild(milestone);
      }

      // 2. Render Zig-Zag Week Cards (Left and Right alternating)
      const itemContainer = document.createElement("div");
      const isLeft = index % 2 === 0;
      itemContainer.className = `roadmap-timeline-item ${isLeft ? 'left-align' : 'right-align'}`;

      let colorClass = "color-knowledge";
      if (week.fase.includes("Fase 2")) colorClass = "color-wealth";
      else if (week.fase.includes("Fase 3")) colorClass = "color-communication";
      else if (week.fase.includes("Fase 4")) colorClass = "color-discipline";

      // Check if all topics in this week are completed to light up the connection node!
      const weekKeys = week.topics.map((_, idx) => `${week.num}_${idx}`);
      const isWeekFullyCompleted = weekKeys.every(k => this.completedTopics.includes(k));

      itemContainer.innerHTML = `
        <!-- Timeline connection dot -->
        <div class="timeline-dot ${colorClass} ${isWeekFullyCompleted ? 'active-glow' : ''}">
          <div class="inner-core"></div>
        </div>
        
        <!-- Interactive Card -->
        <div class="roadmap-week-card glass ${isWeekFullyCompleted ? 'completed-glow' : ''}">
          <div class="week-card-header ${colorClass}">
            <span class="fase-tag">${week.fase}</span>
            <h3>${week.title}</h3>
          </div>
          <div class="week-topics-list">
            ${week.topics.map((topic, idx) => {
              const key = `${week.num}_${idx}`;
              const isCompleted = this.completedTopics.includes(key);
              
              return `
                <div class="topic-row ${isCompleted ? 'completed' : 'pending'}" data-topic-key="${key}" onclick="window.roadmapModule.toggleTopic('${key}', ${week.xpReward})">
                  <div class="topic-checkbox-wrapper">
                    <div class="topic-checkbox">
                      <i data-lucide="check"></i>
                    </div>
                  </div>
                  <span class="topic-text">${topic}</span>
                </div>
              `;
            }).join("")}
          </div>
          <div class="week-footer">
            <span class="reward-info">🎁 Hadiah per sub-topik: +${week.xpReward} XP Knowledge</span>
          </div>
        </div>
      `;

      timeline.appendChild(itemContainer);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  updateProgress() {
    let totalTopics = 0;
    this.weeks.forEach(w => totalTopics += w.topics.length);
    
    const completedCount = this.completedTopics.length;
    const progressPercent = Math.floor((completedCount / totalTopics) * 100);

    const barFill = document.getElementById("roadmap-progress-fill");
    const textPercent = document.getElementById("roadmap-progress-percent");
    const textStats = document.getElementById("roadmap-progress-stats");

    if (barFill) barFill.style.width = `${progressPercent}%`;
    if (textPercent) textPercent.textContent = `${progressPercent}%`;
    if (textStats) textStats.textContent = `${completedCount} / ${totalTopics} Topik Selesai`;
  }

  // --- ACTIONS ---
  toggleTopic(key, xpReward) {
    const idx = this.completedTopics.indexOf(key);
    const row = document.querySelector(`[data-topic-key="${key}"]`);

    if (idx === -1) {
      // Completed!
      this.completedTopics.push(key);
      if (row) {
        row.classList.remove("pending");
        row.classList.add("completed");
      }
      
      window.app.addXP(xpReward, "knowledge");
      
      if (window.confetti) {
        window.confetti({
          particleCount: 25,
          spread: 35,
          origin: { y: 0.85 }
        });
      }
    } else {
      // Uncompleted!
      this.completedTopics.splice(idx, 1);
      if (row) {
        row.classList.remove("completed");
        row.classList.add("pending");
      }
      
      window.app.showToast("Topik Dibatalkan", "Hadiah XP dinonaktifkan kembali.", "fail");
      window.app.playSynthSound("fail");
    }

    this.saveStates();
    
    // Rerender specific card to update its active glow connector!
    this.renderRoadmap();
  }
}

// Instantiate globally
window.roadmapModule = new RoadmapModule();
document.addEventListener("DOMContentLoaded", () => {
  window.roadmapModule.init();
});
