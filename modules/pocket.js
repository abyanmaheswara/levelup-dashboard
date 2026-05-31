/**
 * LevelUp: ZenPocket 50/30/20 Budgeting Module
 * Mengelola anggaran bulanan terencana, perhitungan alokasi kantong virtual,
 * pencatatan pengeluaran cepat, visualisasi grafis 'Benteng Tabungan',
 * dan sinkronisasi status evaluasi finansial ke dashboard utama.
 */

class PocketModule {
  constructor() {
    this.income = 3000000;
    this.ledger = [];
    this.limits = { needs: 0, wants: 0, savings: 0 };
    this.spent = { needs: 0, wants: 0, savings: 0 };
  }

  init() {
    this.loadPocketData();
    this.setupEventListeners();
    this.recalculatePockets();
    this.renderPocketUI();
  }

  // --- STATE PERSISTENCE ---
  loadPocketData() {
    const savedIncome = localStorage.getItem("levelup_pocket_income");
    if (savedIncome) {
      this.income = Number(savedIncome);
      const input = document.getElementById("monthly-income-input");
      if (input) input.value = this.income;
    }

    const savedLedger = localStorage.getItem("levelup_pocket_ledger");
    if (savedLedger) {
      try {
        this.ledger = JSON.parse(savedLedger);
      } catch (e) {
        console.error("Gagal memuat catatan transaksi", e);
      }
    }
  }

  savePocketData() {
    localStorage.setItem("levelup_pocket_income", this.income);
    localStorage.setItem("levelup_pocket_ledger", JSON.stringify(this.ledger));
  }

  syncState() {
    this.recalculatePockets();
    this.renderPocketUI();
  }

  // --- EVENT LISTENERS ---
  setupEventListeners() {
    // Budget Input Change
    const incomeInput = document.getElementById("monthly-income-input");
    if (incomeInput) {
      incomeInput.addEventListener("input", (e) => {
        let val = Number(e.target.value);
        if (val < 100000) val = 100000; // Floor limit
        this.income = val;
        this.recalculatePockets();
        this.renderPocketUI();
        this.savePocketData();
      });
    }

    // Add transaction Form
    const form = document.getElementById("add-transaction-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTransaction();
      });
    }

    // Clear Ledger Click
    const clearBtn = document.getElementById("btn-clear-ledger");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearLedger();
      });
    }
  }

  // --- CALCULATOR ENGINE ---
  recalculatePockets() {
    // Calculate 50/30/20 Envelope Limits
    this.limits.needs = Math.floor(this.income * 0.5);
    this.limits.wants = Math.floor(this.income * 0.3);
    this.limits.savings = Math.floor(this.income * 0.2);

    // Reset current spent amounts
    this.spent.needs = 0;
    this.spent.wants = 0;
    this.spent.savings = 0;

    // Sum transaction items
    this.ledger.forEach(item => {
      if (this.spent[item.category] !== undefined) {
        this.spent[item.category] += item.amount;
      }
    });
  }

  // --- UI RENDER ENGINE ---
  renderPocketUI() {
    // Formatting Helpers
    const formatRp = (num) => "Rp " + num.toLocaleString("id-ID");

    // Total income limits texts
    document.getElementById("total-balance-text").textContent = formatRp(this.income);

    // 1. Needs Pocket UI
    const spentNeeds = this.spent.needs;
    const limitNeeds = this.limits.needs;
    document.getElementById("pocket-needs-current").textContent = formatRp(spentNeeds);
    document.getElementById("pocket-needs-limit").textContent = formatRp(limitNeeds);
    
    const needsPct = Math.min((spentNeeds / limitNeeds) * 100, 100);
    const needsFill = document.getElementById("pocket-needs-fill");
    if (needsFill) needsFill.style.width = `${needsPct}%`;
    
    // Toggle Overlimit Warning Class
    const cardNeeds = document.querySelector(".pocket-card.color-needs");
    if (cardNeeds) {
      if (spentNeeds > limitNeeds) cardNeeds.classList.add("over-limit");
      else cardNeeds.classList.remove("over-limit");
    }

    // 2. Wants Pocket UI
    const spentWants = this.spent.wants;
    const limitWants = this.limits.wants;
    document.getElementById("pocket-wants-current").textContent = formatRp(spentWants);
    document.getElementById("pocket-wants-limit").textContent = formatRp(limitWants);
    
    const wantsPct = Math.min((spentWants / limitWants) * 100, 100);
    const wantsFill = document.getElementById("pocket-wants-fill");
    if (wantsFill) wantsFill.style.width = `${wantsPct}%`;
    
    const cardWants = document.querySelector(".pocket-card.color-wants");
    if (cardWants) {
      if (spentWants > limitWants) cardWants.classList.add("over-limit");
      else cardWants.classList.remove("over-limit");
    }

    // 3. Savings Pocket UI
    // Note: For savings, adding transactions acts as "locking funds in vault", which is positive!
    const spentSavings = this.spent.savings;
    const limitSavings = this.limits.savings;
    document.getElementById("pocket-savings-current").textContent = formatRp(spentSavings);
    document.getElementById("pocket-savings-limit").textContent = formatRp(limitSavings);
    
    const savingsPct = Math.min((spentSavings / limitSavings) * 100, 100);
    const savingsFill = document.getElementById("pocket-savings-fill");
    if (savingsFill) savingsFill.style.width = `${savingsPct}%`;

    // 4. Savings Vault Graphic Fill
    const vaultFill = document.getElementById("vault-graphic-fill");
    const vaultText = document.getElementById("vault-graphic-text");
    if (vaultFill && vaultText) {
      const pct = Math.floor(savingsPct);
      vaultFill.style.height = `${pct}%`;
      vaultText.textContent = `${pct}% Terkunci`;
      if (pct >= 100) {
        vaultText.style.color = "#000";
      } else {
        vaultText.style.color = "var(--color-wealth)";
      }
    }

    // 5. Transaction Ledger render
    const ledgerContainer = document.getElementById("ledger-list");
    if (ledgerContainer) {
      ledgerContainer.innerHTML = "";
      
      if (this.ledger.length === 0) {
        ledgerContainer.innerHTML = `<div class="empty-ledger">Belum ada pengeluaran dicatat bulan ini.</div>`;
      } else {
        // Render newest transaction first
        [...this.ledger].reverse().forEach(item => {
          const row = document.createElement("div");
          row.className = "ledger-item";

          const categoryIcons = { needs: "🏠", wants: "🎮", savings: "📈" };
          const categoryName = item.category === "needs" ? "Needs" : item.category === "wants" ? "Wants" : "Savings";

          row.innerHTML = `
            <div class="ledger-left">
              <span class="ledger-title">${item.desc}</span>
              <span class="ledger-meta">${categoryIcons[item.category]} ${categoryName} | ${item.date}</span>
            </div>
            <div class="ledger-right">
              <span class="ledger-val">-${formatRp(item.amount)}</span>
            </div>
          `;
          ledgerContainer.appendChild(row);
        });
      }
    }

    // 6. Sync financial status evaluation badge on dashboard character sheet
    const pocketStatusEl = document.getElementById("char-pocket-status");
    if (pocketStatusEl) {
      let isNeedsOver = spentNeeds > limitNeeds;
      let isWantsOver = spentWants > limitWants;

      if (isNeedsOver && isWantsOver) {
        pocketStatusEl.textContent = "Bocor Parah! 🚨";
        pocketStatusEl.style.color = "var(--color-danger)";
      } else if (isNeedsOver || isWantsOver) {
        pocketStatusEl.textContent = "Bocor Halus ⚠️";
        pocketStatusEl.style.color = "var(--color-warning)";
      } else if (spentSavings >= limitSavings) {
        pocketStatusEl.textContent = "Sangat Sehat 👑";
        pocketStatusEl.style.color = "var(--color-wealth)";
      } else {
        pocketStatusEl.textContent = "Seimbang";
        pocketStatusEl.style.color = "var(--color-knowledge)";
      }
    }

    // 7. Pie/Doughnut Chart for Spent Categories
    if (window.Chart) {
      const chartCtx = document.getElementById("expense-pie-chart");
      if (chartCtx) {
        if (this.pieChart) {
          this.pieChart.data.datasets[0].data = [spentNeeds, spentWants, spentSavings];
          this.pieChart.update();
        } else {
          this.pieChart = new Chart(chartCtx, {
            type: 'doughnut',
            data: {
              labels: ['Needs', 'Wants', 'Savings'],
              datasets: [{
                data: [spentNeeds, spentWants, spentSavings],
                backgroundColor: ['#00f2fe', '#ff2a85', '#00ff87'],
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: '#94a3b8',
                    font: { family: 'Outfit', size: 11 }
                  }
                }
              },
              cutout: '70%'
            }
          });
        }
      }
    }
  }

  // --- ACTIONS ---
  addTransaction() {
    const descInput = document.getElementById("tx-desc");
    const amountInput = document.getElementById("tx-amount");
    const catSelect = document.getElementById("tx-category");

    if (!descInput || !amountInput || !catSelect) return;

    const desc = descInput.value.trim();
    const amount = Number(amountInput.value);
    const category = catSelect.value;

    if (desc === "" || amount <= 0) return;

    // Create timestamp
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTx = {
      id: "tx_" + Date.now(),
      desc: desc,
      amount: amount,
      category: category,
      date: dateStr
    };

    this.ledger.push(newTx);
    
    // Save data and recalculate totals
    this.savePocketData();
    this.recalculatePockets();
    
    // Award wealth XP and status point
    window.app.addXP(25, "wealth");

    // Render new states
    this.renderPocketUI();
    window.app.updateUI();

    // Reset forms
    descInput.value = "";
    amountInput.value = "";

    window.app.showToast("Pengeluaran Dicatat!", "Catatan buku kas digital ter-update.", "wealth");
  }

  clearLedger() {
    if (this.ledger.length === 0) return;
    
    if (confirm("Apakah kamu yakin ingin menghapus seluruh catatan transaksi bulan ini?")) {
      this.ledger = [];
      this.savePocketData();
      this.recalculatePockets();
      this.renderPocketUI();
      window.app.updateUI();
      
      window.app.showToast("Buku Kas Dihapus", "Seluruh catatan transaksi telah di-reset.", "fail");
      window.app.playSynthSound("fail");
    }
  }
}

// Instantiate globally
window.pocketModule = new PocketModule();
document.addEventListener("DOMContentLoaded", () => {
  window.pocketModule.init();
});
