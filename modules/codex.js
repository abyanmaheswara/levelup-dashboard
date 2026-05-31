/**
 * LevelUp: IT Codex & Spaced Repetition Flashcards Module
 * Mengelola pustaka kartu belajar konsep IT, perputaran animasi kartu 3D,
 * penyaringan kategori, tombol evaluasi Active Recall, dan pelacakan progres belajar.
 */

class CodexModule {
  constructor() {
    this.allCards = [
      {
        id: "c1",
        category: "basics",
        categoryName: "Dasar IT",
        question: "Bagaimana cara kerja Internet secara sederhana?",
        answer: "Bayangkan internet seperti sistem surat-menyurat global. Komputer kamu (Client) mengirim surat berisi alamat tujuan (URL) ke kantor pos raksasa (Server DNS) yang menerjemahkan nama web menjadi alamat IP koordinat rumah web tersebut. Data lalu dipecah menjadi kotak-kotak kecil bernama <code>Packets</code>, dikirim melalui kabel bawah laut/serat optik, dirakit kembali oleh server tujuan, lalu server mengirim surat balasan berisi halaman web yang kamu minta kembali ke komputermu."
      },
      {
        id: "c2",
        category: "backend",
        categoryName: "Backend & DB",
        question: "Apa fungsi utama dari Database Indexing?",
        answer: "Indexing adalah seperti <strong>Daftar Indeks</strong> di halaman belakang buku tebal. Tanpa indeks, jika database mencari data spesifik (misal nama user), dia harus menyisir baris demi baris dari atas sampai bawah (<code>Full Table Scan</code>). Dengan index, database membuat kamus petunjuk khusus sehingga bisa langsung melompat ke lokasi data tersebut berada. <em>Hasilnya:</em> Pencarian data menjadi 100x kali lebih cepat, namun menambah memori penyimpanan."
      },
      {
        id: "c3",
        category: "basics",
        categoryName: "Dasar IT",
        question: "Apa itu Git dan mengapa wajib digunakan developer?",
        answer: "Git adalah <strong>sistem mesin waktu (Version Control System)</strong> untuk kode pemrogramanmu. Git mencatat setiap perubahan kode yang kamu simpan (<code>commit</code>). Jika kodinganmu hari ini rusak atau error parah, kamu bisa memutar balik waktu ke versi kemarin dengan aman. Git juga memungkinkan ribuan developer bekerja sama mengedit file yang sama tanpa takut kodingannya tertimpa satu sama lain."
      },
      {
        id: "c4",
        category: "backend",
        categoryName: "Backend & DB",
        question: "Apa perbedaan mendasar antara database SQL vs NoSQL?",
        answer: "<strong>SQL (Relational):</strong> Menyimpan data dalam tabel kaku berbentuk kolom & baris (seperti lembar Excel yang saling terhubung). Sangat cocok untuk transaksi uang yang butuh akurasi ketat (ACID). Contoh: PostgreSQL, MySQL.<br><br><strong>NoSQL (Non-relational):</strong> Menyimpan data secara fleksibel, biasanya berupa dokumen JSON yang tidak kaku. Cocok untuk data besar yang terus berubah cepat. Contoh: MongoDB, Redis."
      },
      {
        id: "c5",
        category: "frontend",
        categoryName: "Frontend & Web",
        question: "Bagaimana alur kerja REST API secara praktis?",
        answer: "REST API bekerja seperti <strong>pelayan di restoran</strong>. Kamu (Client/Frontend) adalah pembeli yang melihat daftar menu (URL API). Kamu memesan makanan menggunakan perintah khusus: <code>GET</code> (minta data), <code>POST</code> (kirim data baru), <code>PUT</code> (update data), atau <code>DELETE</code> (hapus data). Pelayan lalu membawa pesanan ke dapur (Backend/Server) dan mengantarkan makanan yang siap disajikan dalam format data terstruktur bernama <code>JSON</code>."
      },
      {
        id: "c6",
        category: "architecture",
        categoryName: "Sistem Desain",
        question: "Apa perbedaan pemrograman Synchronous vs Asynchronous?",
        answer: "<strong>Synchronous (Antre):</strong> Program dijalankan baris demi baris secara berurutan. Baris ke-2 tidak akan jalan sebelum baris ke-1 selesai. Jika baris ke-1 mendownload file besar, seluruh aplikasi akan membeku (*blocking*).<br><br><strong>Asynchronous (Paralel):</strong> Program bisa memulai tugas yang butuh waktu lama di latar belakang, lalu langsung lanjut menjalankan tugas berikutnya tanpa menunggu. Ketika tugas latar belakang selesai, dia memberi notifikasi (*non-blocking*). Sangat penting untuk web modern!"
      },
      {
        id: "c7",
        category: "frontend",
        categoryName: "Frontend & Web",
        question: "Apa itu DOM (Document Object Model) di JavaScript?",
        answer: "DOM adalah <strong>pohon peta visual (Tree Structure)</strong> dari halaman HTML-mu yang dipahami oleh browser. DOM mengubah seluruh elemen HTML (tombol, teks, gambar) menjadi 'Object' digital. JavaScript menggunakan DOM untuk mengubah warna, menambah tulisan, atau menghapus elemen secara dinamis tanpa perlu me-reload seluruh website."
      },
      {
        id: "c8",
        category: "architecture",
        categoryName: "Sistem Desain",
        question: "Apa perbedaan Monolith vs Microservices?",
        answer: "<strong>Monolith:</strong> Seluruh modul aplikasi (Auth, Pembayaran, Katalog) digabung dalam satu proyek besar. Mudah dibuat diawal, tapi jika satu modul error, seluruh sistem mati total.<br><br><strong>Microservices:</strong> Memecah aplikasi menjadi proyek-proyek kecil independen yang berkomunikasi lewat API. Jika modul Pembayaran mati, modul login & katalog tetap berjalan aman. Lebih kompleks dikelola tapi sangat terukur (*scalable*)."
      },
      {
        id: "c9",
        category: "basics",
        categoryName: "Dasar IT",
        question: "Bagaimana cara kerja DNS (Domain Name System)?",
        answer: "DNS adalah <strong>Buku Telepon Internet</strong>. Manusia mengakses informasi secara online melalui nama domain seperti <code>google.com</code> atau <code>wikipedia.org</code>. Browser web berinteraksi melalui alamat Protokol Internet (IP). DNS menerjemahkan nama domain ke alamat IP (seperti <code>172.217.17.14</code>) sehingga browser dapat memuat sumber daya internet tersebut secara otomatis."
      },
      {
        id: "c10",
        category: "backend",
        categoryName: "Backend & DB",
        question: "Apa itu CORS (Cross-Origin Resource Sharing)?",
        answer: "CORS adalah <strong>satpam keamanan browser</strong>. Secara default, browser melarang website A mengambil data dari API milik website B demi keamanan (kebijakan *Same-Origin*). CORS adalah mekanisme di server B untuk memberi izin khusus ('header CORS') yang memberi tahu browser: 'Website A terpercaya, silakan berikan datanya!' Jika server tidak diset dengan benar, browser akan memblokir request tersebut dengan error CORS."
      },
      {
        id: "c11",
        category: "frontend",
        categoryName: "Frontend & Web",
        question: "Apa perbedaan Client-Side Rendering (CSR) vs Server-Side Rendering (SSR)?",
        answer: "<strong>CSR (React/Vite default):</strong> Server mengirim file HTML kosong dan file JS besar. Browser merender seluruh tampilan web secara lokal. Web terasa cepat setelah dimuat, tapi loading pertama lambat.<br><br><strong>SSR (Next.js default):</strong> Server memproses data dan membuat HTML matang yang berisi konten lengkap di server, lalu mengirimkannya ke browser. Web langsung tampil instan dan sangat disukai oleh mesin pencari Google (SEO-friendly)."
      },
      {
        id: "c12",
        category: "architecture",
        categoryName: "Sistem Desain",
        question: "Apa itu Docker & Container secara sederhana?",
        answer: "Docker adalah <strong>kotak kemas (kontainer) kapal kargo</strong> untuk aplikasi. Dulu, aplikasi bisa berjalan di laptop developer tapi error saat di-deploy to server karena perbedaan versi Windows/Linux. Docker membungkus aplikasi beserta seluruh kodenya, versinya, dan library-nya ke dalam satu kontainer terstandarisasi. Kontainer ini dijamin bisa berjalan 100% sama persis di komputer mana pun tanpa konflik."
      },
      {
        id: "c13",
        category: "basics",
        categoryName: "Dasar IT",
        question: "Bagaimana cara kerja enkripsi HTTPS?",
        answer: "HTTPS adalah <strong>brankas terkunci</strong> saat mengirim data di internet. Berbeda dengan HTTP biasa yang mengirim data berupa teks polos (bisa diintip oleh hacker di Wi-Fi publik), HTTPS menggunakan protokol SSL/TLS. Data diacak menggunakan kunci kriptografi rumit sehingga hanya komputer pengirim dan server tujuan yang memiliki kunci untuk membukanya."
      },
      {
        id: "c14",
        category: "backend",
        categoryName: "Backend & DB",
        question: "Apa itu JWT (JSON Web Token)?",
        answer: "JWT adalah <strong>tiket gelang konser digital</strong>. Setelah kamu login berhasil, server membuat token terenkripsi (JWT) berisi identitasmu dan menyerahkannya kepadamu. Setiap kali kamu ingin membuka halaman berbayar atau melakukan transaksi, kamu cukup menunjukkan tiket JWT ini ke server. Server tidak perlu mengecek database lagi, cukup memvalidasi stempel tanda tangan digital pada tiket JWT tersebut."
      },
      {
        id: "c15",
        category: "frontend",
        categoryName: "Frontend & Web",
        question: "Mengapa CSS Grid berbeda dengan Flexbox?",
        answer: "<strong>Flexbox (1 Dimensi):</strong> Didesain untuk menyusun elemen dalam satu baris (horizontal) ATAU satu kolom (vertical). Sangat cocok untuk navbar atau menu sejajar.<br><br><strong>CSS Grid (2 Dimensi):</strong> Didesain untuk layout kolom DAN baris sekaligus secara serentak. Sangat cocok untuk tata letak halaman utama koran digital, dashboard multi-card, atau galeri foto."
      },
      {
        id: "c16",
        category: "architecture",
        categoryName: "Sistem Desain",
        question: "Apa itu Caching dan bagaimana cara kerjanya?",
        answer: "Caching adalah <strong>lemari laci meja kerja</strong> untuk menaruh file yang sering kamu pakai. Daripada setiap kali butuh data kamu harus berjalan jauh mengambilnya ke gudang utama (Database), kamu menyimpan salinan data terpopuler di laci super cepat (seperti Redis atau Memcached). Ketika ada request, sistem mengecek laci cache terlebih dahulu (<code>Cache Hit</code>). Jika tidak ada, barulah mengambil ke gudang (<code>Cache Miss</code>) dan menyimpannya di laci untuk pencarian berikutnya."
      }
    ];

    this.understoodCardIds = [];
    this.currentCategory = "all";
    this.filteredCards = [];
    this.currentIndex = 0;
  }

  init() {
    this.loadUnderstoodData();
    this.filterCards();
    this.setupEventListeners();
    this.renderActiveCard();
  }

  // --- STATE PERSISTENCE ---
  loadUnderstoodData() {
    const saved = localStorage.getItem("levelup_understood_cards");
    if (saved) {
      try {
        this.understoodCardIds = JSON.parse(saved);
      } catch (e) {
        console.error("Gagal memuat status kartu dipahami", e);
      }
    }
  }

  saveUnderstoodData() {
    localStorage.setItem("levelup_understood_cards", JSON.stringify(this.understoodCardIds));
    this.updateProgressHeader();
  }

  // --- RENDERING & SWITCHING ---
  filterCards() {
    if (this.currentCategory === "all") {
      this.filteredCards = [...this.allCards];
    } else {
      this.filteredCards = this.allCards.filter(c => c.category === this.currentCategory);
    }
    this.currentIndex = 0;
  }

  renderActiveCard() {
    const cardContainer = document.getElementById("active-flashcard");
    if (!cardContainer) return;

    // Reset flipped state immediately when rendering a new card
    cardContainer.classList.remove("flipped");

    const catBadge = document.getElementById("card-cat-badge");
    const questionText = document.getElementById("card-question-text");
    const answerText = document.getElementById("card-answer-text");

    if (this.filteredCards.length === 0) {
      catBadge.textContent = "KOSONG";
      questionText.textContent = "Tidak ada kartu di kategori ini.";
      answerText.textContent = "Cobalah berpindah ke kategori belajar yang lain.";
      return;
    }

    const card = this.filteredCards[this.currentIndex];

    // Inject data
    catBadge.textContent = card.categoryName;
    questionText.textContent = card.question;
    answerText.innerHTML = card.answer;

    // Color code front badge
    let color = "var(--color-knowledge)";
    if (card.category === "backend") color = "var(--color-communication)";
    if (card.category === "frontend") color = "var(--color-wealth)";
    if (card.category === "architecture") color = "var(--color-discipline)";

    catBadge.style.color = color;
    catBadge.style.borderColor = color.replace(")", ", 0.2)");
    catBadge.style.background = color.replace(")", ", 0.08)");

    this.updateProgressHeader();
  }

  updateProgressHeader() {
    const progressEl = document.getElementById("codex-progress-text");
    if (progressEl) {
      const total = this.allCards.length;
      const understood = this.understoodCardIds.filter(id => 
        this.allCards.some(c => c.id === id)
      ).length;
      progressEl.textContent = `Paham: ${understood} / ${total} Topik`;
    }
  }

  // --- EVENT LISTENERS ---
  setupEventListeners() {
    const cardContainer = document.getElementById("active-flashcard");
    if (cardContainer) {
      cardContainer.addEventListener("click", (e) => {
        // Prevent flipping if clicked on feedback action buttons
        if (e.target.closest(".card-feedback-actions")) return;
        cardContainer.classList.toggle("flipped");
        window.app.playSynthSound("click");
      });
    }

    // Prev / Next Nav Buttons
    const prevBtn = document.getElementById("btn-prev-card");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.filteredCards.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.filteredCards.length) % this.filteredCards.length;
        this.renderActiveCard();
        window.app.playSynthSound("click");
      });
    }

    const nextBtn = document.getElementById("btn-next-card");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.filteredCards.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.filteredCards.length;
        this.renderActiveCard();
        window.app.playSynthSound("click");
      });
    }

    // Category Filter Buttons
    const filterContainer = document.getElementById("codex-filters");
    if (filterContainer) {
      filterContainer.addEventListener("click", (e) => {
        const tab = e.target.closest(".filter-tab");
        if (!tab) return;

        document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        this.currentCategory = tab.getAttribute("data-category");
        this.filterCards();
        this.renderActiveCard();
        window.app.playSynthSound("click");
      });
    }

    // Feedback Assessment Buttons
    const easyBtn = document.getElementById("btn-feedback-easy");
    if (easyBtn) {
      easyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.markCurrentCardAsUnderstood();
      });
    }

    const hardBtn = document.getElementById("btn-feedback-hard");
    if (hardBtn) {
      hardBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.keepCurrentCardInDeck();
      });
    }
  }

  // --- CORE ACTIONS ---
  markCurrentCardAsUnderstood() {
    if (this.filteredCards.length === 0) return;
    const card = this.filteredCards[this.currentIndex];

    if (!this.understoodCardIds.includes(card.id)) {
      this.understoodCardIds.push(card.id);
      this.saveUnderstoodData();
      
      // Award XP
      window.app.addXP(20, "knowledge");
    } else {
      window.app.showToast("Sudah Dipelajari", "Kamu sudah memahami topik ini sebelumnya.", "knowledge");
    }

    // Auto flip back and move to next
    const cardContainer = document.getElementById("active-flashcard");
    cardContainer.classList.remove("flipped");

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.filteredCards.length;
      this.renderActiveCard();
    }, 300);
  }

  keepCurrentCardInDeck() {
    window.app.showToast("Active Recall", "Topik disimpan. Kita pelajari lagi sebentar lagi!", "fail");
    window.app.playSynthSound("fail");

    // Remove from understood list if they previously marked it understood but now forgot
    const card = this.filteredCards[this.currentIndex];
    this.understoodCardIds = this.understoodCardIds.filter(id => id !== card.id);
    this.saveUnderstoodData();

    // Auto flip back and move to next
    const cardContainer = document.getElementById("active-flashcard");
    cardContainer.classList.remove("flipped");

    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.filteredCards.length;
      this.renderActiveCard();
    }, 300);
  }
}

// Instantiate globally
window.codexModule = new CodexModule();
document.addEventListener("DOMContentLoaded", () => {
  window.codexModule.init();
});
