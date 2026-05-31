/**
 * LevelUp: Quests & Habit RPG Module
 * Mengelola daftar quest harian bawaan, penambahan quest kustom,
 * pencentangan quest dengan perolehan XP, pelacakan total quest, dan milestone streak.
 */

class QuestsModule {
  constructor() {
    this.defaultQuests = [
      { id: "q1", title: "💡 Buka 3 Flashcard IT di Codex", reward: "knowledge", xp: 20, completed: false, isDefault: true },
      { id: "q2", title: "🎤 Bicara 2 menit di Speaker's Arena", reward: "communication", xp: 20, completed: false, isDefault: true },
      { id: "q3", title: "💰 Catat pengeluaran hari ini di ZenPocket", reward: "wealth", xp: 20, completed: false, isDefault: true },
      { id: "q4", title: "⚡ Kerjakan Latihan Coding Ringkas 15 Menit", reward: "knowledge", xp: 40, completed: false, isDefault: true }
    ];
    this.userQuests = [];
  }

  init() {
    this.loadQuests();
    this.renderQuestsBoard();
    this.renderDashboardList();
    this.setupEventListeners();
    this.syncMilestones();
  }

  // --- STATE PERSISTENCE ---
  loadQuests() {
    const saved = localStorage.getItem("levelup_quests_list");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Split between default templates and custom quests
        this.userQuests = parsed.filter(q => !q.isDefault);
        
        // Load completion states for default templates if saved
        const defaultStates = parsed.filter(q => q.isDefault);
        this.defaultQuests.forEach(def => {
          const match = defaultStates.find(s => s.id === def.id);
          if (match) def.completed = match.completed;
        });
      } catch (e) {
        console.error("Gagal memuat quests", e);
      }
    }
  }

  saveQuests() {
    const combined = [...this.defaultQuests, ...this.userQuests];
    localStorage.setItem("levelup_quests_list", JSON.stringify(combined));
    this.renderDashboardList();
  }

  syncState() {
    this.syncMilestones();
  }

  // --- EVENT HANDLERS SETUP ---
  setupEventListeners() {
    const form = document.getElementById("add-quest-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addNewCustomQuest();
      });
    }

    const resetBtn = document.getElementById("btn-reset-quests");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetDailyQuests();
      });
    }
  }

  // --- RENDERING ON VIEWS ---
  renderQuestsBoard() {
    const listContainer = document.getElementById("daily-quest-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    const allQuests = [...this.defaultQuests, ...this.userQuests];

    if (allQuests.length === 0) {
      listContainer.innerHTML = `<div class="empty-ledger">Belum ada misi. Tambahkan misi di sebelah kanan!</div>`;
      return;
    }

    allQuests.forEach(q => {
      const card = document.createElement("div");
      card.className = `quest-card ${q.completed ? "completed" : "pending"}`;
      
      const badgeIcon = q.reward === "knowledge" ? "💡" : q.reward === "communication" ? "🎤" : q.reward === "wealth" ? "💰" : "⚡";

      card.innerHTML = `
        <div class="quest-checkbox-wrapper">
          <div class="quest-checkbox">
            <i data-lucide="check"></i>
          </div>
        </div>
        <div class="quest-details">
          <h4>${q.title}</h4>
          <div class="reward-info">
            <span class="reward-badge">${badgeIcon} +${q.xp} XP ${window.app.capitalize(q.reward)}</span>
          </div>
        </div>
        ${!q.isDefault ? `
          <button class="quest-actions-btn" data-delete="${q.id}" title="Hapus Misi">
            <i data-lucide="trash-2"></i>
          </button>
        ` : ''}
      `;

      // Complete Quest Event Click
      card.querySelector(".quest-checkbox-wrapper").addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleQuestCompletion(q.id);
      });

      // Delete Custom Quest Click
      if (!q.isDefault) {
        card.querySelector("[data-delete]").addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteQuest(q.id);
        });
      }

      listContainer.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
    this.syncMilestones();
  }

  renderDashboardList() {
    const listContainer = document.getElementById("mini-quest-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    
    // Pick first 3 incomplete quests, or completed ones if all solved
    const allQuests = [...this.defaultQuests, ...this.userQuests];
    const displayList = allQuests.sort((a,b) => a.completed - b.completed).slice(0, 3);

    if (displayList.length === 0) {
      listContainer.innerHTML = `<div class="empty-ledger">Belum ada misi terdaftar hari ini.</div>`;
      return;
    }

    displayList.forEach(q => {
      const item = document.createElement("div");
      item.className = `mini-quest-item ${q.completed ? "completed" : "pending"}`;
      
      const icon = q.completed ? "check-circle-2" : "circle";
      
      item.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span class="text">${q.title}</span>
      `;
      listContainer.appendChild(item);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // --- ACTIONS ---
  toggleQuestCompletion(id) {
    let quest = this.defaultQuests.find(q => q.id === id) || this.userQuests.find(q => q.id === id);
    if (!quest) return;

    quest.completed = !quest.completed;

    if (quest.completed) {
      // Award XP & increase total completed count
      window.app.addXP(Number(quest.xp), quest.reward);
      window.app.state.totalQuests += 1;
      
      // Auto-trigger canvas confetti for small celebratory boost!
      if (window.confetti) {
        window.confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        window.confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }
    } else {
      // Undo rewards
      window.app.state.totalQuests = Math.max(0, window.app.state.totalQuests - 1);
      window.app.showToast("Misi Dibatalkan", "Hadiah quest dinonaktifkan kembali.", "fail");
      window.app.playSynthSound("fail");
    }

    window.app.saveState();
    this.saveQuests();
    this.renderQuestsBoard();
    window.app.updateUI();
  }

  addNewCustomQuest() {
    const titleInput = document.getElementById("quest-title");
    const rewardInput = document.getElementById("quest-reward");
    const xpInput = document.getElementById("quest-xp");

    if (!titleInput || !rewardInput || !xpInput) return;

    const newQuest = {
      id: "uq_" + Date.now(),
      title: titleInput.value.trim(),
      reward: rewardInput.value,
      xp: Number(xpInput.value),
      completed: false,
      isDefault: false
    };

    this.userQuests.push(newQuest);
    this.saveQuests();
    this.renderQuestsBoard();

    // Reset Form Input
    titleInput.value = "";
    window.app.showToast("Quest Ditambahkan!", "Tantangan kustom baru terdaftar di papan.", "discipline");
  }

  deleteQuest(id) {
    this.userQuests = this.userQuests.filter(q => q.id !== id);
    this.saveQuests();
    this.renderQuestsBoard();
    window.app.showToast("Quest Dihapus", "Tantangan kustom dikeluarkan dari board.", "fail");
    window.app.playSynthSound("fail");
  }

  resetDailyQuests() {
    // Reset all default daily quests checkboxes
    this.defaultQuests.forEach(q => q.completed = false);
    
    // Optional: let user keep custom quests, but clear their completion state too
    this.userQuests.forEach(q => q.completed = false);

    this.saveQuests();
    this.renderQuestsBoard();
    
    window.app.showToast("Papan Reset!", "Quest harian berhasil diatur ulang untuk hari baru.", "discipline");
    window.app.playSynthSound("click");
  }

  syncMilestones() {
    const streak = window.app.state.streak;
    
    // Milestones check
    const m3 = document.getElementById("milestone-3");
    const m7 = document.getElementById("milestone-7");
    const m15 = document.getElementById("milestone-15");

    if (m3) {
      if (streak >= 3) m3.classList.add("achieved");
      else m3.classList.remove("achieved");
    }
    if (m7) {
      if (streak >= 7) m7.classList.add("achieved");
      else m7.classList.remove("achieved");
    }
    if (m15) {
      if (streak >= 15) m15.classList.add("achieved");
      else m15.classList.remove("achieved");
    }
  }
}

// Instantiate globally
window.questsModule = new QuestsModule();
document.addEventListener("DOMContentLoaded", () => {
  window.questsModule.init();
});
