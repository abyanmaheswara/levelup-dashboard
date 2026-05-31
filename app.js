/**
 * LevelUp Elite: Master Application Controller (HUD 2.0 Engine)
 * Menggabungkan Three.js (3D Tech Sphere), GSAP Navigasi Stagger,
 * Anime.js 3D Flashcard Flip, AOS Scroll-animation, Chart.js Visualizations,
 * serta seluruh logika modul (Quests, Codex, Arena, Pocket, Roadmap, Focus) secara terintegrasi.
 */

class LevelUpMasterEngine {
  constructor() {
    // --- GLOBAL RPG STATE ---
    this.state = {
      name: "User Apprentice",
      level: 1,
      xp: 0,
      xpNeeded: 100,
      stats: {
        knowledge: 10,
        communication: 10,
        wealth: 10,
        discipline: 10
      },
      streak: 0,
      lastActiveDate: "",
      totalQuests: 0
    };

    // --- SUB-MODULES STATES ---
    this.quests = {
      list: [
        { id: "q1", title: "Review 3 Topik Belajar IT di Codex", reward: "knowledge", xp: 20, completed: false, isCustom: false },
        { id: "q2", title: "Latihan Bicara Spontan di Arena Selama 1 Menit", reward: "communication", xp: 20, completed: false, isCustom: false },
        { id: "q3", title: "Catat Seluruh Pengeluaran Riil di ZenPocket", reward: "wealth", xp: 20, completed: false, isCustom: false },
        { id: "q4", title: "Selesaikan 1 Sesi Fokus Pomodoro (25 Menit)", reward: "discipline", xp: 20, completed: false, isCustom: false }
      ]
    };

    this.codex = {
      allCards: [
        { id: "c1", category: "basics", categoryName: "Dasar IT", question: "Bagaimana cara kerja Internet secara sederhana?", answer: "Bayangkan internet seperti sistem surat global. Komputer kamu (Client) mengirim surat berisi alamat tujuan (URL) ke kantor pos raksasa (Server DNS) yang menerjemahkan nama web menjadi alamat IP. Data lalu dipecah menjadi kotak-kotak kecil bernama <code>Packets</code>, dikirim melalui kabel bawah laut/serat optik, dirakit kembali oleh server tujuan, lalu server mengirim surat balasan berisi halaman web kembali ke komputermu." },
        { id: "c2", category: "backend", categoryName: "Backend & DB", question: "Apa fungsi utama dari Database Indexing?", answer: "Indexing seperti <strong>Daftar Indeks</strong> buku tebal. Tanpa indeks, database mencari data dengan menyisir baris demi baris dari atas sampai bawah (<code>Full Table Scan</code>). Dengan index, database memiliki kamus petunjuk khusus sehingga bisa langsung melompat ke lokasi data tersebut. <em>Hasilnya:</em> Pencarian data menjadi 100x lebih cepat, namun menambah memori." },
        { id: "c3", category: "basics", categoryName: "Dasar IT", question: "Apa itu Git dan mengapa wajib digunakan developer?", answer: "Git adalah <strong>sistem mesin waktu (Version Control System)</strong> untuk kode pemrogramanmu. Git mencatat setiap perubahan kode yang kamu simpan (<code>commit</code>). Jika kodinganmu hari ini rusak parah, kamu bisa memutar balik waktu ke versi kemarin dengan aman. Git juga memungkinkan ribuan developer bekerja sama mengedit file yang sama tanpa takut tertimpa." },
        { id: "c4", category: "backend", categoryName: "Backend & DB", question: "Apa perbedaan mendasar antara database SQL vs NoSQL?", answer: "<strong>SQL (Relational):</strong> Menyimpan data dalam tabel kaku berbentuk kolom & baris (seperti lembar Excel yang saling terhubung). Sangat cocok untuk transaksi uang yang butuh akurasi ketat. Contoh: PostgreSQL, MySQL.<br><br><strong>NoSQL (Non-relational):</strong> Menyimpan data secara fleksibel berupa dokumen JSON. Cocok untuk data besar berubah cepat. Contoh: MongoDB, Redis." },
        { id: "c5", category: "frontend", categoryName: "Frontend & Web", question: "Bagaimana alur kerja REST API secara praktis?", answer: "REST API bekerja seperti <strong>pelayan di restoran</strong>. Kamu (Client) memesan makanan menggunakan perintah khusus: <code>GET</code> (minta data), <code>POST</code> (kirim data baru), <code>PUT</code> (update data), atau <code>DELETE</code> (hapus data). Pelayan lalu membawa pesanan ke dapur (Backend/Server) dan mengantarkan makanan dalam format data terstruktur bernama <code>JSON</code>." },
        { id: "c6", category: "architecture", categoryName: "Sistem Desain", question: "Apa perbedaan pemrograman Synchronous vs Asynchronous?", answer: "<strong>Synchronous (Antre):</strong> Program dijalankan baris demi baris secara berurutan. Baris ke-2 tidak akan jalan sebelum baris ke-1 selesai (*blocking*).<br><br><strong>Asynchronous (Paralel):</strong> Program bisa memulai tugas yang butuh waktu lama di latar belakang, lalu langsung lanjut menjalankan tugas berikutnya tanpa menunggu. Ketika tugas latar belakang selesai, dia memberi notifikasi (*non-blocking*)." },
        { id: "c7", category: "frontend", categoryName: "Frontend & Web", question: "Apa itu DOM (Document Object Model) di JavaScript?", answer: "DOM adalah <strong>pohon peta visual (Tree Structure)</strong> dari halaman HTML-mu yang dipahami oleh browser. DOM mengubah elemen HTML (tombol, teks, gambar) menjadi 'Object' digital. JavaScript menggunakan DOM untuk mengubah warna, menambah tulisan, atau menghapus elemen secara dinamis tanpa perlu me-reload seluruh website." },
        { id: "c8", category: "architecture", categoryName: "Sistem Desain", question: "Apa perbedaan Monolith vs Microservices?", answer: "<strong>Monolith:</strong> Seluruh modul aplikasi (Auth, Pembayaran, Katalog) digabung dalam satu proyek besar. Mudah dibuat diawal, tapi jika satu modul error, seluruh sistem mati total.<br><br><strong>Microservices:</strong> Memecah aplikasi menjadi proyek-proyek kecil independen yang berkomunikasi lewat API. Jika modul Pembayaran mati, modul login & katalog tetap berjalan aman. Lebih kompleks dikelola tapi sangat terukur (*scalable*)." },
        { id: "c9", category: "basics", categoryName: "Dasar IT", question: "Bagaimana cara kerja DNS (Domain Name System)?", answer: "DNS adalah <strong>Buku Telepon Internet</strong>. Manusia mengakses informasi secara online melalui nama domain seperti <code>google.com</code>. Browser web berinteraksi melalui alamat Protokol Internet (IP). DNS menerjemahkan nama domain ke alamat IP (seperti <code>172.217.17.14</code>) sehingga browser dapat memuat sumber daya internet tersebut secara otomatis." },
        { id: "c10", category: "backend", categoryName: "Backend & DB", question: "Apa itu CORS (Cross-Origin Resource Sharing)?", answer: "CORS adalah <strong>satpam keamanan browser</strong>. Secara default, browser melarang website A mengambil data dari API milik website B (kebijakan *Same-Origin*). CORS adalah mekanisme di server B untuk memberi izin khusus ('header CORS') yang memberi tahu browser: 'Website A terpercaya, silakan berikan datanya!' Jika server tidak diset dengan benar, browser akan memblokir request tersebut." },
        { id: "c11", category: "frontend", categoryName: "Frontend & Web", question: "Apa perbedaan Client-Side Rendering (CSR) vs Server-Side Rendering (SSR)?", answer: "<strong>CSR (React/Vite default):</strong> Server mengirim file HTML kosong dan file JS besar. Browser merender seluruh tampilan web secara lokal. Web terasa cepat setelah dimuat, tapi loading pertama lambat.<br><br><strong>SSR (Next.js default):</strong> Server memproses data dan membuat HTML matang yang berisi konten lengkap di server, lalu mengirimkannya ke browser. Web langsung tampil instan dan sangat disukai oleh mesin pencari Google (SEO-friendly)." },
        { id: "c12", category: "architecture", categoryName: "Sistem Desain", question: "Apa itu Docker & Container secara sederhana?", answer: "Docker adalah <strong>kotak kemas (kontainer) kapal kargo</strong> untuk aplikasi. Docker membungkus aplikasi beserta seluruh kodenya, versinya, dan library-nya ke dalam satu kontainer terstandarisasi. Kontainer ini dijamin bisa berjalan 100% sama persis di komputer mana pun tanpa konflik lingkungan." },
        { id: "c13", category: "basics", categoryName: "Dasar IT", question: "Bagaimana cara kerja enkripsi HTTPS?", answer: "HTTPS adalah <strong>brankas terkunci</strong> saat mengirim data di internet. Berbeda dengan HTTP biasa yang mengirim data berupa teks polos (bisa diintip oleh hacker di Wi-Fi publik), HTTPS menggunakan protokol SSL/TLS. Data diacak menggunakan kunci kriptografi rumit sehingga hanya komputer pengirim dan server tujuan yang memiliki kunci untuk membukanya." },
        { id: "c14", category: "backend", categoryName: "Backend & DB", question: "Apa itu JWT (JSON Web Token)?", answer: "JWT adalah <strong>tiket gelang konser digital</strong>. Setelah login berhasil, server membuat token terenkripsi (JWT) berisi identitasmu dan menyerahkannya kepadamu. Setiap kali kamu ingin membuka halaman berbayar atau transaksi, kamu cukup menunjukkan tiket JWT ini. Server tidak perlu mengecek database lagi, cukup memvalidasi tanda tangan digital tiket JWT tersebut." },
        { id: "c15", category: "frontend", categoryName: "Frontend & Web", question: "Mengapa CSS Grid berbeda dengan Flexbox?", answer: "<strong>Flexbox (1 Dimensi):</strong> Didesain untuk menyusun elemen dalam satu baris (horizontal) ATAU satu kolom (vertical). Sangat cocok untuk navbar atau menu sejajar.<br><br><strong>CSS Grid (2 Dimensi):</strong> Didesain untuk layout kolom DAN baris sekaligus secara serentak. Sangat cocok untuk tata letak halaman utama koran digital, dashboard multi-card, atau galeri foto." },
        { id: "c16", category: "architecture", categoryName: "Sistem Desain", question: "Apa itu Caching dan bagaimana cara kerjanya?", answer: "Caching adalah <strong>lemari laci meja kerja</strong> untuk menaruh file yang sering kamu pakai. Daripada setiap kali butuh data kamu harus berjalan jauh mengambilnya ke database utama, kamu menyimpan salinan data terpopuler di memori super cepat (seperti Redis). Ketika ada request, sistem mengecek laci cache terlebih dahulu (<code>Cache Hit</code>). Jika tidak ada, barulah mengambil ke database (<code>Cache Miss</code>)." }
      ],
      understoodCardIds: [],
      currentCategory: "all",
      filteredCards: [],
      currentIndex: 0,
      isFlipped: false
    };

    this.arena = {
      prompterInterval: null,
      scrollPosition: 0,
      isPlaying: false,
      timerInterval: null,
      timeElapsed: 0,
      fontSize: 28,
      wpm: 130,
      customText: "",
      presets: {
        intro: "Halo semuanya, perkenalkan nama saya User Apprentice. Hari ini saya ingin menjelaskan mengapa AI Engineering sangat penting bagi masa depan industri energi, terutama minyak dan gas. Dengan mengkombinasikan pemrograman Python, pengolahan data sensor, dan integrasi kecerdasan buatan, kita dapat mengoptimalkan pipa minyak, memprediksi kerusakan mesin bor secara preventif, serta meningkatkan keselamatan K3 para pekerja di lapangan kilang bor secara real-time.",
        "explain-api": "API atau Application Programming Interface adalah jembatan komunikasi digital antara dua aplikasi yang berbeda. Bayangkan API seperti seorang pelayan di restoran. Anda sebagai client adalah tamu yang memesan makanan dari menu. Pelayan menerima pesanan Anda, membawanya ke dapur server untuk dimasak, lalu membawa makanan matang kembali ke meja Anda. Dengan API, sistem frontend modern dapat bertukar data instan dengan server backend secara aman.",
        "react-pitch": "Mengapa kita harus memilih React.js untuk pengembangan frontend web modern? Jawabannya terletak pada konsep Virtual DOM dan arsitektur berbasis komponen. React memungkinkan developer memecah halaman web menjadi blok-blok kecil yang independen dan dapat digunakan kembali. Ketika data berubah, React hanya meng-update bagian elemen HTML yang berubah saja, bukan men-draw ulang seluruh halaman. Hal ini membuat aplikasi web Anda sangat cepat dan interaktif.",
        "crypto-basics": "Blockchain adalah buku besar digital yang terdesentralisasi, aman, dan mencatat transaksi di jaringan komputer global. Bayangkan sebuah catatan kas yang tidak dipegang oleh satu bank pusat saja, melainkan digandakan secara identik oleh jutaan komputer di seluruh dunia. Ketika transaksi baru terjadi, seluruh komputer harus memvalidasi data tersebut sebelum dirangkai ke dalam blok kriptografi permanen yang tidak bisa diedit atau dihapus kembali."
      },
      impromptuPrompts: [
        "Jelaskan bagaimana AI dapat digunakan untuk mendeteksi pipa gas yang bocor secara otomatis.",
        "Bagaimana Anda menjelaskan konsep Docker kepada nenek berumur 80 tahun?",
        "Mengapa disiplin mengelola uang dengan metode 50/30/20 adalah kunci kebebasan finansial?",
        "Apa strategi terbaik mengatasi kecemasan berbicara di depan umum saat presentasi IT?",
        "Bagaimana AI dapat membantu Pertamina meningkatkan produksi minyak nasional?",
        "Jelaskan perbedaan mendasar antara Machine Learning tradisional dan Deep Learning."
      ]
    };

    this.pocket = {
      income: 3000000,
      ledger: [],
      limits: { needs: 0, wants: 0, savings: 0 },
      spent: { needs: 0, wants: 0, savings: 0 },
      pieChart: null
    };

    this.roadmap = {
      // Main timeline milestones
      milestones: [
        {
          id: "phase1",
          title: "Fase 1: Fondasi LLM & Prompting",
          color: "color-knowledge",
          nodes: [
            {
              id: "intro",
              title: "Pendahuluan AI",
              color: "color-knowledge",
              connection: "right",
              rightCard: {
                title: "Pengenalan Rekayasa AI",
                topics: [
                  { id: "intro_1", label: "Apa itu AI Engineer?", xp: 15 },
                  { id: "intro_2", label: "Peran & Tanggung Jawab", xp: 15 },
                  { id: "intro_3", label: "Dampak Pengembangan Produk", xp: 15 },
                  { id: "intro_4", label: "AI Engineer vs ML Engineer", xp: 15 }
                ]
              }
            },
            {
              id: "llm_basics",
              title: "Cara Kerja LLM",
              color: "color-knowledge",
              connection: "both",
              leftCard: {
                title: "Elemen Inti LLM",
                topics: [
                  { id: "llm_1", label: "Token & Jendela Konteks (Context Window)", xp: 15 },
                  { id: "llm_2", label: "Sampling: Temperature, Top-K, Top-P", xp: 15 },
                  { id: "llm_3", label: "Penalti Pengulangan (Repetition Penalties)", xp: 15 }
                ]
              },
              rightCard: {
                title: "Terminologi Umum",
                topics: [
                  { id: "term_1", label: "Kecerdasan Buatan: AI vs AGI", xp: 15 },
                  { id: "term_2", label: "Vektor Embedding, Pelatihan & Inferensi", xp: 15 },
                  { id: "term_3", label: "Fine-tuning vs Arsitektur RAG", xp: 15 },
                  { id: "term_4", label: "Rekayasa Prompt vs Konteks", xp: 15 }
                ]
              }
            },
            {
              id: "prompt_eng",
              title: "Rekayasa Prompt & Konteks",
              color: "color-knowledge",
              connection: "both",
              leftCard: {
                title: "Rekayasa Prompt (Prompt Engineering)",
                topics: [
                  { id: "pr_1", label: "Metode Zero-Shot & Few-Shot", xp: 20 },
                  { id: "pr_2", label: "Pola Berpikir ReAct & Chain-of-Thought (CoT)", xp: 20 },
                  { id: "pr_3", label: "Function Calling & Output Terstruktur", xp: 20 },
                  { id: "pr_4", label: "Caching Prompt & Streaming Respons", xp: 15 },
                  { id: "pr_5", label: "Prompt Sistem (System Prompts) & Batasan", xp: 15 }
                ]
              },
              rightCard: {
                title: "Rekayasa Konteks (Context Engineering)",
                topics: [
                  { id: "ctx_1", label: "Memori Eksternal (External Memory)", xp: 20 },
                  { id: "ctx_2", label: "RAG & Sistem Filter Dinamis", xp: 20 },
                  { id: "ctx_3", label: "Kompaksi Konteks & Isolasi Data", xp: 20 }
                ]
              }
            }
          ]
        },
        {
          id: "phase2",
          title: "Fase 2: Model & Ekosistem",
          color: "color-wealth",
          nodes: [
            {
              id: "models",
              title: "Ekosistem Model AI",
              color: "color-wealth",
              connection: "both",
              leftCard: {
                title: "Model Tertutup (Closed-Source)",
                topics: [
                  { id: "md_1", label: "OpenAI GPT Series (GPT-4o/o3)", xp: 20 },
                  { id: "md_2", label: "Anthropic Claude (Sonnet 3.5)", xp: 20 },
                  { id: "md_3", label: "Google Gemini (Pro/Flash 1.5)", xp: 20 },
                  { id: "md_4", label: "API Model Cohere & Mistral AI", xp: 15 }
                ]
              },
              rightCard: {
                title: "Model Terbuka (Open-Source) & Mandiri",
                topics: [
                  { id: "os_1", label: "Meta Llama (Llama 3)", xp: 20 },
                  { id: "os_2", label: "DeepSeek-V3 & Reasoning R1", xp: 20 },
                  { id: "os_3", label: "Alibaba Qwen & Google Gemma 2", xp: 15 },
                  { id: "os_4", label: "Penyedia Mandiri: Ollama, LM Studio & OpenRouter", xp: 20 },
                  { id: "os_5", label: "Pustaka AI Lokal: Transformers.js", xp: 20 }
                ]
              }
            }
          ]
        },
        {
          id: "phase3",
          title: "Fase 3: RAG & Basis Data Vektor",
          color: "color-communication",
          nodes: [
            {
              id: "embeddings",
              title: "Vektor Embedding & Basis Data",
              color: "color-communication",
              connection: "both",
              leftCard: {
                title: "Model Vektor Embedding",
                topics: [
                  { id: "emb_1", label: "Apa itu Vektor Embedding?", xp: 15 },
                  { id: "emb_2", label: "Pencarian Semantik & Klasifikasi Data", xp: 15 },
                  { id: "emb_3", label: "Pustaka Sentence Transformers Lokal", xp: 20 },
                  { id: "emb_4", label: "API Vektor OpenAI & Google Gemini", xp: 20 }
                ]
              },
              rightCard: {
                title: "Basis Data Vektor (Vector DB)",
                topics: [
                  { id: "db_1", label: "ChromaDB & FAISS (Lokal)", xp: 20 },
                  { id: "db_2", label: "Pinecone & Qdrant (Awan/Cloud)", xp: 20 },
                  { id: "db_3", label: "Weaviate & LanceDB", xp: 20 },
                  { id: "db_4", label: "Supabase PGVector & MongoDB Atlas", xp: 20 }
                ]
              }
            },
            {
              id: "rag",
              title: "Arsitektur RAG",
              color: "color-communication",
              connection: "both",
              leftCard: {
                title: "Implementasi RAG",
                topics: [
                  { id: "rg_1", label: "Strategi Pemotongan Dokumen (Chunking)", xp: 20 },
                  { id: "rg_2", label: "Pengindeksan Pencarian Vektor", xp: 20 },
                  { id: "rg_3", label: "Proses Retrieval (Penyaringan) & Generasi", xp: 20 }
                ]
              },
              rightCard: {
                title: "Framework Orkestrasi",
                topics: [
                  { id: "fw_1", label: "LangChain (Integrasi Model)", xp: 30 },
                  { id: "fw_2", label: "LlamaIndex (Orkestrasi Data)", xp: 30 },
                  { id: "fw_3", label: "Haystack & RAGFlow Pipeline", xp: 20 }
                ]
              }
            }
          ]
        },
        {
          id: "phase4",
          title: "Fase 4: Agen, MCP & Penerapan Lanjut",
          color: "color-discipline",
          nodes: [
            {
              id: "agents",
              title: "Agen AI & Protokol MCP",
              color: "color-discipline",
              connection: "both",
              leftCard: {
                title: "Agen Kecerdasan Buatan (AI Agents)",
                topics: [
                  { id: "ag_1", label: "Arsitektur Agen Berpikir & Pola ReAct", xp: 25 },
                  { id: "ag_2", label: "Integrasi Alat Bantu (Tools) & Pemanggilan Fungsi", xp: 25 },
                  { id: "ag_3", label: "Sistem Kolaborasi Multi-Agen (Multi-Agent)", xp: 25 },
                  { id: "ag_4", label: "OpenAI AgentKit & Claude Agent SDK", xp: 25 }
                ]
              },
              rightCard: {
                title: "Model Context Protocol (MCP)",
                topics: [
                  { id: "mcp_1", label: "Arsitektur MCP Host, Client & Server", xp: 30 },
                  { id: "mcp_2", label: "Lapisan Data & Transportasi MCP", xp: 25 },
                  { id: "mcp_3", label: "Pembuatan Server MCP Kustom Sendiri", xp: 30 },
                  { id: "mcp_4", label: "Koneksi Server MCP Lokal & Jarak Jauh", xp: 25 }
                ]
              }
            },
            {
              id: "safety",
              title: "Etika Keamanan & Observabilitas",
              color: "color-discipline",
              connection: "both",
              leftCard: {
                title: "Keamanan AI (AI Safety & Ethics)",
                topics: [
                  { id: "sf_1", label: "Serangan Injeksi Prompt (Prompt Injection)", xp: 25 },
                  { id: "sf_2", label: "API Moderasi Konten & Filter Kata", xp: 20 },
                  { id: "sf_3", label: "Pengujian Adversarial & Guardrails Sistem", xp: 25 },
                  { id: "sf_4", label: "Batasan Keadilan AI & Penanganan Bias", xp: 20 }
                ]
              },
              rightCard: {
                title: "Observabilitas & Evaluasi",
                topics: [
                  { id: "ob_1", label: "Tracing & Logging (LangSmith & Langfuse)", xp: 30 },
                  { id: "ob_2", label: "Pemantauan Pengeluaran Biaya & Latensi Token", xp: 20 },
                  { id: "ob_3", label: "Evaluasi Deterministik & Berbasis Model (RAGAS)", xp: 30 },
                  { id: "ob_4", label: "Pengujian Regresi Sistem LLM", xp: 25 }
                ]
              }
            },
            {
              id: "multimodal",
              title: "Multimodal AI & Perkakas Dev",
              color: "color-discipline",
              connection: "both",
              leftCard: {
                title: "Tugas AI Multimodal",
                topics: [
                  { id: "mm_1", label: "Pemahaman Gambar (GPT-Vision / Gemini Multimodal)", xp: 25 },
                  { id: "mm_2", label: "API Pembuat Gambar Dinamis (DALL-E / Imagen)", xp: 25 },
                  { id: "mm_3", label: "Pemrosesan Suara & Speech-to-Text (Whisper)", xp: 25 },
                  { id: "mm_4", label: "Aplikasi Multimodal di LangChain & LlamaIndex", xp: 25 }
                ]
              },
              rightCard: {
                title: "Asisten Koding Cerdas",
                topics: [
                  { id: "cod_1", label: "API Claude Code & Gemini Coding Tool", xp: 20 },
                  { id: "cod_2", label: "Lingkungan Kerja Cursor IDE & Windsurf", xp: 20 },
                  { id: "cod_3", label: "Asisten Koding Mandiri: Codex & Replit Agent", xp: 15 }
                ]
              }
            }
          ]
        }
      ],
      completedTopics: []
    };

    this.focus = {
      timerDuration: 25 * 60,
      timeLeft: 25 * 60,
      timerInterval: null,
      isPaused: true,
      noiseNode: null,
      spaceHumNode: null,
      ambientPlaying: false,
      currentAmbientType: "none"
    };

    // --- AUDIO CONTEXT ---
    this.audioCtx = null;
    this.radarChart = null;

    // --- THREE.JS GRAPHICS ---
    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.threeMesh = null;
    this.mousePos = { x: 0, y: 0 };
    this.targetRot = { x: 0, y: 0 };
  }

  init() {
    this.loadState();
    this.initClock();
    this.setupAudioTrigger();
    this.initThree3D();
    
    // Initialize modular listeners
    this.initQuests();
    this.initCodex();
    this.initArena();
    this.initPocket();
    this.initRoadmap();
    this.initFocus();

    this.initNavigation();
    this.updateUI();

    // Trigger AOS
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-out-quad',
        once: true
      });
    }
  }

  // --- LOCAL STORAGE BACKUP ---
  loadState() {
    const saved = localStorage.getItem("levelup_rpg_state_2_0");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
        this.state.stats = { ...this.state.stats, ...parsed.stats };
      } catch (e) {
        console.error("State loading error", e);
      }
    }
    
    // Understood cards
    const understood = localStorage.getItem("levelup_understood_cards_2_0");
    if (understood) {
      try { this.codex.understoodCardIds = JSON.parse(understood); } catch(e){}
    }

    // Roadmap topics
    const roadmapData = localStorage.getItem("levelup_roadmap_completed_2_0");
    if (roadmapData) {
      try { this.roadmap.completedTopics = JSON.parse(roadmapData); } catch(e){}
    }

    // ZenPocket
    const pocketInc = localStorage.getItem("levelup_pocket_income_2_0");
    if (pocketInc) this.pocket.income = Number(pocketInc);

    const pocketLedger = localStorage.getItem("levelup_pocket_ledger_2_0");
    if (pocketLedger) {
      try { this.pocket.ledger = JSON.parse(pocketLedger); } catch(e){}
    }

    // Custom Quests
    const savedQuests = localStorage.getItem("levelup_quests_list_2_0");
    if (savedQuests) {
      try { this.quests.list = JSON.parse(savedQuests); } catch(e){}
    }
  }

  saveState() {
    localStorage.setItem("levelup_rpg_state_2_0", JSON.stringify(this.state));
    localStorage.setItem("levelup_understood_cards_2_0", JSON.stringify(this.codex.understoodCardIds));
    localStorage.setItem("levelup_roadmap_completed_2_0", JSON.stringify(this.roadmap.completedTopics));
    localStorage.setItem("levelup_pocket_income_2_0", this.pocket.income);
    localStorage.setItem("levelup_pocket_ledger_2_0", JSON.stringify(this.pocket.ledger));
    localStorage.setItem("levelup_quests_list_2_0", JSON.stringify(this.quests.list));
  }

  // --- AUDIO SYNTHESIZER ---
  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  setupAudioTrigger() {
    document.addEventListener("click", () => this.initAudio(), { once: true });
  }

  playSynthSound(type) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;

    if (type === "click" || type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.08); // C6
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } 
    else if (type === "levelup") {
      osc.type = "triangle";
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + (idx * 0.07));
      });
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.6);
    } 
    else if (type === "fail") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180.00, now);
      osc.frequency.exponentialRampToValueAtTime(70.00, now + 0.25);
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  }

  // --- THREE.JS 3D HUD GRAPHICS ---
  initThree3D() {
    const canvas = document.getElementById("three-hologram-canvas");
    if (!canvas) return;

    // Create scene
    this.threeScene = new THREE.Scene();

    // Create perspective camera
    this.threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.threeCamera.position.z = 10;

    // Setup WebGL Renderer with transparency
    this.threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create rotating tech mesh
    const geometry = new THREE.SphereGeometry(3.2, 22, 22);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });

    this.threeMesh = new THREE.Mesh(geometry, material);
    this.threeScene.add(this.threeMesh);

    // Capture mouse movement for HUD parallax tilt
    window.addEventListener("mousemove", (e) => {
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle resizing
    window.addEventListener("resize", () => {
      if (this.threeCamera && this.threeRenderer) {
        this.threeCamera.aspect = window.innerWidth / window.innerHeight;
        this.threeCamera.updateProjectionMatrix();
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    // Start 3D rendering loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.threeMesh) {
        // Slow constant rotations
        this.threeMesh.rotation.y += 0.002;
        this.threeMesh.rotation.x += 0.001;

        // Smoothly tilt mesh towards cursor coordinates
        this.targetRot.y = this.mousePos.x * 0.4;
        this.targetRot.x = -this.mousePos.y * 0.4;

        this.threeMesh.rotation.y += (this.targetRot.y - this.threeMesh.rotation.y) * 0.05;
        this.threeMesh.rotation.x += (this.targetRot.x - this.threeMesh.rotation.x) * 0.05;
      }

      this.threeRenderer.render(this.threeScene, this.threeCamera);
    };

    animate();
  }

  // --- FLOATING TOAST SYSTEM ---
  showToast(title, message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast glass`;

    let icon = "award";
    let color = "var(--color-discipline)";

    if (type === "knowledge") { icon = "book-open"; color = "var(--color-knowledge)"; }
    else if (type === "communication") { icon = "message-square-quote"; color = "var(--color-communication)"; }
    else if (type === "wealth") { icon = "coins"; color = "var(--color-wealth)"; }
    else if (type === "xp") { icon = "zap"; color = "var(--color-knowledge)"; }
    else if (type === "fail") { icon = "alert-triangle"; color = "var(--color-danger)"; }

    toast.innerHTML = `
      <div class="toast-icon" style="color: ${color}">
        <i data-lucide="${icon}"></i>
      </div>
      <div class="toast-details">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.add("removing");
      toast.addEventListener("animationend", () => toast.remove());
    }, 3200);
  }

  // --- ADD XP SYSTEM ---
  addXP(amount, statType) {
    this.playSynthSound("success");

    if (statType && this.state.stats[statType] !== undefined) {
      this.state.stats[statType] += 1;
      this.showToast(`+1 ${this.capitalize(statType)}`, `Status kompetensi berhasil ditingkatkan!`, statType);
    }

    this.state.xp += amount;
    this.showToast(`+${amount} XP`, `Disiplin melatih karakter diri.`, "xp");

    let leveledUp = false;
    const prevLvl = this.state.level;

    while (this.state.xp >= this.state.xpNeeded) {
      this.state.xp -= this.state.xpNeeded;
      this.state.level += 1;
      this.state.xpNeeded = this.state.level * 100;
      leveledUp = true;
    }

    if (leveledUp) {
      this.triggerLevelUpCelebration(prevLvl, this.state.level);
    }

    this.saveState();
    this.updateUI();
  }

  triggerLevelUpCelebration(prevLvl, newLvl) {
    const modal = document.getElementById("levelup-modal");
    if (modal) {
      document.getElementById("modal-prev-lvl").textContent = prevLvl;
      document.getElementById("modal-new-lvl").textContent = newLvl;
      modal.classList.add("active");
    }

    setTimeout(() => this.playSynthSound("levelup"), 150);

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60, origin: { x: 0.2, y: 0.6 } });
      window.confetti({ particleCount: 80, spread: 60, origin: { x: 0.8, y: 0.6 } });
    }

    const closeBtn = document.getElementById("btn-close-levelup");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.remove("active");
        this.playSynthSound("click");
      };
    }
  }

  // --- UI RENDER SYNCS ---
  updateUI() {
    // Sidebar indicators
    document.getElementById("char-level").textContent = this.state.level;
    document.getElementById("xp-text").textContent = `${this.state.xp} / ${this.state.xpNeeded}`;

    const xpPct = Math.min((this.state.xp / this.state.xpNeeded) * 100, 100);
    document.getElementById("xp-bar-fill").style.width = `${xpPct}%`;
    document.getElementById("streak-count").textContent = this.state.streak;

    const title = this.getTitleByLevel(this.state.level);
    document.querySelector(".title-badge").textContent = title;
    const charBadge = document.getElementById("char-badge");
    if (charBadge) charBadge.textContent = title;

    // Stat card updates
    document.getElementById("stat-knowledge-val").textContent = this.state.stats.knowledge;
    document.getElementById("stat-communication-val").textContent = this.state.stats.communication;
    document.getElementById("stat-wealth-val").textContent = this.state.stats.wealth;
    document.getElementById("stat-discipline-val").textContent = this.state.stats.discipline;

    // character sheet
    const qCount = document.getElementById("char-total-quests");
    if (qCount) qCount.textContent = this.state.totalQuests;

    const ratingEl = document.getElementById("discipline-rating");
    if (ratingEl) {
      if (this.state.streak >= 15) ratingEl.textContent = "Legendaris (Top)";
      else if (this.state.streak >= 7) ratingEl.textContent = "Tangguh";
      else if (this.state.streak >= 3) ratingEl.textContent = "Konsisten";
      else ratingEl.textContent = "Apprentice";
    }

    this.updateRadarChart();
    if (this.updateRoadmapProgress) {
      this.updateRoadmapProgress();
    }
  }

  getTitleByLevel(lvl) {
    if (lvl >= 15) return "Grandmaster IT Practitioner";
    if (lvl >= 10) return "Expert Tech Specialist";
    if (lvl >= 6) return "Elite Developer";
    if (lvl >= 3) return "Junior Programmer";
    return "IT Apprentice";
  }

  initClock() {
    const clock = document.getElementById("live-clock");
    const tick = () => {
      const d = new Date();
      clock.textContent = d.toTimeString().split(" ")[0];
    };
    tick();
    setInterval(tick, 1000);
  }

  // --- SPA GSAP NAVIGATION STAGGER ---
  initNavigation() {
    document.querySelectorAll(".nav-menu button").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        this.switchView(view);
        this.playSynthSound("click");
      });
    });
  }

  switchView(viewName) {
    // 1. Sidebar Highlight Toggle
    document.querySelectorAll(".nav-menu button").forEach(btn => {
      if (btn.getAttribute("data-view") === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 2. Section Active Toggle
    document.querySelectorAll(".view-section").forEach(sec => {
      if (sec.getAttribute("id") === `${viewName}-view`) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // 3. GSAP Stagger Entrance animations
    if (window.gsap) {
      window.gsap.killTweensOf(`#${viewName}-view .glass, #${viewName}-view .stat-card, #${viewName}-view .bootcamp-card, #${viewName}-view .pocket-card`);
      window.gsap.fromTo(
        `#${viewName}-view .glass, #${viewName}-view .stat-card, #${viewName}-view .bootcamp-card, #${viewName}-view .pocket-card`,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "back.out(1.35)", clearProps: "transform,opacity" }
      );
    }

    if (window.AOS) {
      window.AOS.refresh();
    }

    // 4. View entering actions
    if (viewName === "dashboard") {
      this.updateUI();
      this.renderDashboardQuests();
    }
    else if (viewName === "quests") {
      this.renderQuestsBoard();
    }
    else if (viewName === "codex") {
      this.renderActiveCard();
    }
    else if (viewName === "arena") {
      this.stopPrompter();
    }
    else if (viewName === "pocket") {
      this.renderPocketUI();
    }
    else if (viewName === "roadmap") {
      this.renderRoadmap();
      this.updateRoadmapProgress();
    }
    else if (viewName === "focus") {
      this.updateFocusTimerDisplay();
    }
  }

  // --- RADAR CHART (CHART.JS) ---
  initRadarChart() {
    if (!window.Chart) return;
    const ctx = document.getElementById("rpg-radar-chart");
    if (!ctx) return;

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Knowledge', 'Communication', 'Wealth', 'Discipline'],
        datasets: [{
          label: 'Kompetensi Diri',
          data: [
            this.state.stats.knowledge,
            this.state.stats.communication,
            this.state.stats.wealth,
            this.state.stats.discipline
          ],
          backgroundColor: 'rgba(0, 242, 254, 0.15)',
          borderColor: '#00f2fe',
          borderWidth: 2,
          pointBackgroundColor: '#ff2a85',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff2a85'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: {
              color: '#94a3b8',
              font: { family: 'Outfit', size: 10, weight: '600' }
            },
            ticks: {
              backdropColor: 'transparent',
              color: '#475569',
              font: { family: 'Fira Code', size: 8 },
              stepSize: 10
            },
            suggestedMin: 0,
            suggestedMax: 60
          }
        }
      }
    });
  }

  updateRadarChart() {
    if (!this.radarChart) {
      this.initRadarChart();
      return;
    }
    this.radarChart.data.datasets[0].data = [
      this.state.stats.knowledge,
      this.state.stats.communication,
      this.state.stats.wealth,
      this.state.stats.discipline
    ];
    this.radarChart.update();
  }

  // ==========================================================================
  // MODULES IMPLEMENTATIONS
  // ==========================================================================

  // --- A. QUESTS BOARD ---
  initQuests() {
    const form = document.getElementById("add-quest-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addCustomQuest();
      });
    }

    const resetBtn = document.getElementById("btn-reset-quests");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetQuests());
    }

    this.renderDashboardQuests();
  }

  renderDashboardQuests() {
    const list = document.getElementById("mini-quest-list");
    if (!list) return;

    list.innerHTML = "";
    // Show top 3 pending daily quests
    const items = this.quests.list.filter(q => !q.completed).slice(0, 3);

    if (items.length === 0) {
      list.innerHTML = `<div class="mini-quest-item pending"><i data-lucide="sparkles"></i><span class="text">Semua tugas utama hari ini selesai!</span></div>`;
    } else {
      items.forEach(q => {
        const item = document.createElement("div");
        item.className = "mini-quest-item pending";
        item.innerHTML = `
          <i data-lucide="circle"></i>
          <span class="text">${q.title}</span>
        `;
        list.appendChild(item);
      });
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderQuestsBoard() {
    const container = document.getElementById("daily-quest-list");
    if (!container) return;

    container.innerHTML = "";
    this.quests.list.forEach(q => {
      const card = document.createElement("div");
      card.className = `quest-card ${q.completed ? 'completed' : 'pending'}`;
      card.innerHTML = `
        <div class="quest-checkbox-wrapper" onclick="window.app.toggleQuest('${q.id}')">
          <div class="quest-checkbox">
            <i data-lucide="check"></i>
          </div>
        </div>
        <div class="quest-details" onclick="window.app.toggleQuest('${q.id}')">
          <h3>${q.title}</h3>
          <div class="quest-meta">
            <span class="quest-badge reward">+${q.xp} XP</span>
            <span class="quest-badge type-${q.reward}">💡 ${this.capitalize(q.reward)}</span>
          </div>
        </div>
        ${q.isCustom ? `<button class="action-btn-delete" onclick="window.app.deleteQuest('${q.id}')"><i data-lucide="trash-2"></i></button>` : ''}
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
    this.renderDashboardQuests();
    this.syncStreakRewards();
  }

  toggleQuest(id) {
    const idx = this.quests.list.findIndex(q => q.id === id);
    if (idx === -1) return;

    const quest = this.quests.list[idx];
    quest.completed = !quest.completed;

    if (quest.completed) {
      this.state.totalQuests += 1;
      this.addXP(quest.xp, quest.reward);
    } else {
      this.state.totalQuests = Math.max(0, this.state.totalQuests - 1);
      this.showToast("Misi Dibatalkan", "Hadiah status dinonaktifkan.", "fail");
      this.playSynthSound("fail");
    }

    this.saveState();
    this.renderQuestsBoard();
    this.updateUI();
  }

  addCustomQuest() {
    const titleInput = document.getElementById("quest-title");
    const rewardInput = document.getElementById("quest-reward");
    const xpInput = document.getElementById("quest-xp");

    const newQ = {
      id: "q_" + Date.now(),
      title: titleInput.value.trim(),
      reward: rewardInput.value,
      xp: Number(xpInput.value),
      completed: false,
      isCustom: true
    };

    this.quests.list.push(newQ);
    this.saveState();
    this.renderQuestsBoard();

    titleInput.value = "";
    this.showToast("Misi Ditambahkan", "Misi kustom berhasil masuk ke board.", "discipline");
  }

  deleteQuest(id) {
    this.quests.list = this.quests.list.filter(q => q.id !== id);
    this.saveState();
    this.renderQuestsBoard();
    this.showToast("Misi Dihapus", "Misi berhasil dibersihkan dari board.", "fail");
    this.playSynthSound("fail");
  }

  resetQuests() {
    if (confirm("Reset ulang centang seluruh misi hari ini?")) {
      this.quests.list.forEach(q => q.completed = false);
      this.saveState();
      this.renderQuestsBoard();
      this.showToast("Misi Direset", "Quest board berhasil dikosongkan.", "success");
    }
  }

  syncStreakRewards() {
    document.querySelectorAll(".streak-milestones .milestone-item").forEach(item => {
      const target = Number(item.id.replace("milestone-", ""));
      if (this.state.streak >= target) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // --- B. IT CODEX (ANIMEJS FLIP) ---
  initCodex() {
    // Nav & Feedbacks
    document.getElementById("active-flashcard").addEventListener("click", (e) => {
      if (e.target.closest(".card-feedback-actions")) return;
      this.flipCodexCard();
    });

    document.getElementById("btn-prev-card").onclick = () => {
      this.codex.currentIndex = (this.codex.currentIndex - 1 + this.codex.filteredCards.length) % this.codex.filteredCards.length;
      this.renderActiveCard();
      this.playSynthSound("click");
    };

    document.getElementById("btn-next-card").onclick = () => {
      this.codex.currentIndex = (this.codex.currentIndex + 1) % this.codex.filteredCards.length;
      this.renderActiveCard();
      this.playSynthSound("click");
    };

    document.getElementById("btn-feedback-easy").onclick = (e) => {
      e.stopPropagation();
      this.markCodexCardUnderstood();
    };

    document.getElementById("btn-feedback-hard").onclick = (e) => {
      e.stopPropagation();
      this.keepCodexCardInDeck();
    };

    // Category filter tabs
    document.getElementById("codex-filters").onclick = (e) => {
      const tab = e.target.closest(".filter-tab");
      if (!tab) return;

      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      this.codex.currentCategory = tab.getAttribute("data-category");
      this.filterCodexCards();
      this.renderActiveCard();
      this.playSynthSound("click");
    };

    this.filterCodexCards();
  }

  filterCodexCards() {
    if (this.codex.currentCategory === "all") {
      this.codex.filteredCards = [...this.codex.allCards];
    } else {
      this.codex.filteredCards = this.codex.allCards.filter(c => c.category === this.codex.currentCategory);
    }
    this.codex.currentIndex = 0;
  }

  renderActiveCard() {
    const cardEl = document.getElementById("active-flashcard");
    if (!cardEl) return;

    // Reset flipped state immediately
    this.codex.isFlipped = false;
    cardEl.style.transform = "rotateY(0deg)";

    const catBadge = document.getElementById("card-cat-badge");
    const qText = document.getElementById("card-question-text");
    const aText = document.getElementById("card-answer-text");

    if (this.codex.filteredCards.length === 0) {
      catBadge.textContent = "KOSONG";
      qText.textContent = "Tidak ada kartu di kategori ini.";
      aText.innerHTML = "Cobalah berpindah ke filter kategori belajar yang lain.";
      return;
    }

    const card = this.codex.filteredCards[this.codex.currentIndex];
    catBadge.textContent = card.categoryName;
    qText.textContent = card.question;
    aText.innerHTML = card.answer;

    // Set colors
    let color = "var(--color-knowledge)";
    if (card.category === "backend") color = "var(--color-communication)";
    if (card.category === "frontend") color = "var(--color-wealth)";
    if (card.category === "architecture") color = "var(--color-discipline)";

    catBadge.style.color = color;
    catBadge.style.borderColor = color.replace(")", ", 0.2)");
    catBadge.style.background = color.replace(")", ", 0.08)");

    this.updateCodexProgressHeader();
  }

  flipCodexCard() {
    if (this.codex.filteredCards.length === 0) return;
    this.codex.isFlipped = !this.codex.isFlipped;

    if (window.anime) {
      window.anime({
        targets: '#active-flashcard',
        rotateY: this.codex.isFlipped ? 180 : 0,
        duration: 750,
        easing: 'easeOutElastic(1, 0.85)'
      });
    } else {
      document.getElementById("active-flashcard").style.transform = this.codex.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    }
  }

  markCodexCardUnderstood() {
    if (this.codex.filteredCards.length === 0) return;
    const card = this.codex.filteredCards[this.codex.currentIndex];

    if (!this.codex.understoodCardIds.includes(card.id)) {
      this.codex.understoodCardIds.push(card.id);
      this.saveState();
      this.addXP(15, "knowledge");
    } else {
      this.showToast("Sudah Dipelajari", "Kamu sudah memahami topik IT ini sebelumnya.", "knowledge");
    }

    // Flip back and trigger slide transition to next card
    this.flipCodexCard();
    setTimeout(() => {
      this.codex.currentIndex = (this.codex.currentIndex + 1) % this.codex.filteredCards.length;
      this.renderActiveCard();
    }, 320);
  }

  keepCodexCardInDeck() {
    this.showToast("Spaced Repetition", "Konsep disimpan. Kami akan memunculkannya lagi nanti!", "fail");
    this.playSynthSound("fail");

    const card = this.codex.filteredCards[this.codex.currentIndex];
    this.codex.understoodCardIds = this.codex.understoodCardIds.filter(id => id !== card.id);
    this.saveState();

    this.flipCodexCard();
    setTimeout(() => {
      this.codex.currentIndex = (this.codex.currentIndex + 1) % this.codex.filteredCards.length;
      this.renderActiveCard();
    }, 320);
  }

  updateCodexProgressHeader() {
    const total = this.codex.allCards.length;
    const understood = this.codex.understoodCardIds.filter(id => 
      this.codex.allCards.some(c => c.id === id)
    ).length;
    document.getElementById("codex-progress-text").textContent = `Paham: ${understood} / ${total} Topik`;
  }

  // --- C. SPEAKER'S ARENA (TELEPROMPTER SCROLLER) ---
  initArena() {
    const wpmSlider = document.getElementById("prompter-wpm");
    const wpmVal = document.getElementById("prompter-wpm-val");
    if (wpmSlider && wpmVal) {
      wpmSlider.oninput = (e) => {
        this.arena.wpm = Number(e.target.value);
        wpmVal.textContent = `${this.arena.wpm} WPM`;
        if (this.arena.isPlaying) {
          this.pausePrompter();
          this.startPrompter();
        }
      };
    }

    const fontSlider = document.getElementById("prompter-font-size");
    const fontVal = document.getElementById("prompter-font-val");
    const textEl = document.getElementById("prompter-text-container");
    if (fontSlider && fontVal && textEl) {
      fontSlider.oninput = (e) => {
        this.arena.fontSize = Number(e.target.value);
        fontVal.textContent = `${this.arena.fontSize}px`;
        textEl.style.fontSize = `${this.arena.fontSize}px`;
      };
    }

    document.getElementById("btn-prompter-toggle").onclick = () => this.togglePrompter();
    document.getElementById("btn-prompter-reset").onclick = () => this.resetPrompter();

    // Draft tabs
    document.getElementById("tab-custom-speech").onclick = () => this.switchDraftTab("custom");
    document.getElementById("tab-preset-speech").onclick = () => this.switchDraftTab("preset");

    document.getElementById("btn-apply-custom-speech").onclick = () => {
      const txt = document.getElementById("custom-speech-input").value.trim();
      if (txt === "") return;
      this.arena.customText = txt;
      this.applySpeechText(txt);
      this.showToast("Naskah Kustom", "Naskah berhasil terpasang di prompter.", "communication");
    };

    document.querySelectorAll(".preset-speech-list button").forEach(btn => {
      btn.onclick = () => {
        const type = btn.getAttribute("data-speech");
        const txt = this.arena.presets[type];
        this.applySpeechText(txt);
        this.showToast("Naskah Bawaan", "Naskah bawaan berhasil terpasang.", "communication");
      };
    });

    document.getElementById("btn-generate-prompt").onclick = () => {
      const idx = Math.floor(Math.random() * this.arena.impromptuPrompts.length);
      document.getElementById("random-prompt-display").innerHTML = `<strong>Tantangan Bicara Spontan:</strong><br>${this.arena.impromptuPrompts[idx]}`;
      this.playSynthSound("success");
    };
  }

  applySpeechText(txt) {
    this.resetPrompter();
    const container = document.getElementById("prompter-text-container");
    // Convert newlines to paragraphs for sleek pacing
    container.innerHTML = txt.split("\n").map(p => `<p>${p}</p>`).join("");
  }

  togglePrompter() {
    if (this.arena.isPlaying) {
      this.pausePrompter();
    } else {
      this.startPrompter();
    }
  }

  startPrompter() {
    this.initAudio();
    this.arena.isPlaying = true;
    this.playSynthSound("click");

    const playBtn = document.getElementById("btn-prompter-toggle");
    const playIcon = document.getElementById("prompter-play-icon");
    const playText = document.getElementById("prompter-play-text");

    playBtn.classList.add("playing");
    playIcon.setAttribute("data-lucide", "pause");
    playText.textContent = "Pause";
    if (window.lucide) window.lucide.createIcons();

    // Auto-Scroll Prompter Tick
    const screen = document.getElementById("prompter-screen");
    const content = document.getElementById("prompter-text-container");
    
    // speed calculation: WPM to pixels per millisecond
    // Average word has 5 characters + space.
    const charPerMin = this.arena.wpm * 6;
    const scrollSpeed = (this.arena.fontSize * (charPerMin / 45)) / 60000; // pixels per ms approximation

    let lastTime = performance.now();
    this.arena.prompterInterval = requestAnimationFrame((timestamp) => {
      this.scrollTick(timestamp);
    });

    // Stopwatch Timer
    this.arena.timerInterval = setInterval(() => {
      this.arena.timeElapsed += 1;
      const mins = String(Math.floor(this.arena.timeElapsed / 60)).padStart(2, '0');
      const secs = String(this.arena.timeElapsed % 60).padStart(2, '0');
      document.getElementById("speech-timer").textContent = `${mins}:${secs}`;
    }, 1000);
  }

  scrollTick(timestamp) {
    if (!this.arena.isPlaying) return;
    const screen = document.getElementById("prompter-screen");
    
    // Pixels scroll speed factor
    const speedFactor = (this.arena.wpm / 130) * 0.45;
    this.arena.scrollPosition += speedFactor;
    screen.scrollTop = this.arena.scrollPosition;

    // Boundary check
    if (screen.scrollTop + screen.clientHeight >= screen.scrollHeight) {
      this.completeSpeechSession();
    } else {
      this.arena.prompterInterval = requestAnimationFrame((t) => this.scrollTick(t));
    }
  }

  pausePrompter() {
    this.arena.isPlaying = false;
    cancelAnimationFrame(this.arena.prompterInterval);
    clearInterval(this.arena.timerInterval);

    const playBtn = document.getElementById("btn-prompter-toggle");
    const playIcon = document.getElementById("prompter-play-icon");
    const playText = document.getElementById("prompter-play-text");

    playBtn.classList.remove("playing");
    playIcon.setAttribute("data-lucide", "play");
    playText.textContent = "Mulai";
    if (window.lucide) window.lucide.createIcons();
    this.playSynthSound("fail");
  }

  resetPrompter() {
    this.pausePrompter();
    this.arena.scrollPosition = 0;
    document.getElementById("prompter-screen").scrollTop = 0;
    this.arena.timeElapsed = 0;
    document.getElementById("speech-timer").textContent = "00:00";
    this.playSynthSound("click");
  }

  completeSpeechSession() {
    this.pausePrompter();
    
    // If talked for more than 20 seconds, give communication stat + XP!
    if (this.arena.timeElapsed >= 20) {
      this.addXP(35, "communication");
      this.showToast("Sesi Bicara Selesai!", "Kerja bagus! Kemampuan bicaramu semakin terasah. (+35 XP)", "communication");
      if (window.confetti) window.confetti({ particleCount: 30, spread: 40 });
    } else {
      this.showToast("Selesai Latihan", "Latihan terlalu singkat untuk mendapatkan status point.", "fail");
    }

    this.resetPrompter();
  }

  switchDraftTab(tab) {
    document.querySelectorAll(".draft-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".draft-subpanel").forEach(p => p.classList.remove("active"));

    if (tab === "custom") {
      document.getElementById("tab-custom-speech").classList.add("active");
      document.getElementById("panel-custom-speech").classList.add("active");
    } else {
      document.getElementById("tab-preset-speech").classList.add("active");
      document.getElementById("panel-preset-speech").classList.add("active");
    }
    this.playSynthSound("click");
  }

  // --- D. ZENPOCKET BUDGETING (CHART.JS PIE CHART) ---
  initPocket() {
    const incInput = document.getElementById("monthly-income-input");
    if (incInput) {
      incInput.oninput = (e) => {
        let val = Number(e.target.value);
        if (val < 100000) val = 100000;
        this.pocket.income = val;
        this.recalculatePocketLimits();
        this.renderPocketUI();
        this.saveState();
      };
    }

    document.getElementById("add-transaction-form").onsubmit = (e) => {
      e.preventDefault();
      this.addPocketTransaction();
    };

    document.getElementById("btn-clear-ledger").onclick = () => this.clearPocketLedger();

    this.recalculatePocketLimits();
  }

  recalculatePocketLimits() {
    this.pocket.limits.needs = Math.floor(this.pocket.income * 0.5);
    this.pocket.limits.wants = Math.floor(this.pocket.income * 0.3);
    this.pocket.limits.savings = Math.floor(this.pocket.income * 0.2);

    this.pocket.spent.needs = 0;
    this.pocket.spent.wants = 0;
    this.pocket.spent.savings = 0;

    this.pocket.ledger.forEach(tx => {
      if (this.pocket.spent[tx.category] !== undefined) {
        this.pocket.spent[tx.category] += tx.amount;
      }
    });
  }

  renderPocketUI() {
    const formatRp = (num) => "Rp " + num.toLocaleString("id-ID");
    document.getElementById("total-balance-text").textContent = formatRp(this.pocket.income);

    // Needs
    const spentN = this.pocket.spent.needs;
    const limitN = this.pocket.limits.needs;
    document.getElementById("pocket-needs-current").textContent = formatRp(spentN);
    document.getElementById("pocket-needs-limit").textContent = formatRp(limitN);
    
    const pctN = Math.min((spentN / limitN) * 100, 100);
    document.getElementById("pocket-needs-fill").style.width = `${pctN}%`;
    
    const cardN = document.querySelector(".pocket-card.color-needs");
    if (spentN > limitN) cardN.classList.add("over-limit");
    else cardN.classList.remove("over-limit");

    // Wants
    const spentW = this.pocket.spent.wants;
    const limitW = this.pocket.limits.wants;
    document.getElementById("pocket-wants-current").textContent = formatRp(spentW);
    document.getElementById("pocket-wants-limit").textContent = formatRp(limitW);
    
    const pctW = Math.min((spentW / limitW) * 100, 100);
    document.getElementById("pocket-wants-fill").style.width = `${pctW}%`;

    const cardW = document.querySelector(".pocket-card.color-wants");
    if (spentW > limitW) cardW.classList.add("over-limit");
    else cardW.classList.remove("over-limit");

    // Savings
    const spentS = this.pocket.spent.savings;
    const limitS = this.pocket.limits.savings;
    document.getElementById("pocket-savings-current").textContent = formatRp(spentS);
    document.getElementById("pocket-savings-limit").textContent = formatRp(limitS);
    
    const pctS = Math.min((spentS / limitS) * 100, 100);
    document.getElementById("pocket-savings-fill").style.width = `${pctS}%`;

    // Vault Graphic
    const vaultFill = document.getElementById("vault-graphic-fill");
    const vaultText = document.getElementById("vault-graphic-text");
    if (vaultFill && vaultText) {
      const pct = Math.floor(pctS);
      vaultFill.style.height = `${pct}%`;
      vaultText.textContent = `${pct}% Terkunci`;
      vaultText.style.color = pct >= 100 ? "#000" : "var(--color-wealth)";
    }

    // Render ledger
    const list = document.getElementById("ledger-list");
    list.innerHTML = "";
    if (this.pocket.ledger.length === 0) {
      list.innerHTML = `<div class="empty-ledger">Belum ada pengeluaran dicatat bulan ini.</div>`;
    } else {
      [...this.pocket.ledger].reverse().forEach(tx => {
        const item = document.createElement("div");
        item.className = "ledger-item";
        
        const catIcons = { needs: "🏠 Needs", wants: "🎮 Wants", savings: "📈 Savings" };
        item.innerHTML = `
          <div class="ledger-left">
            <span class="ledger-title">${tx.desc}</span>
            <span class="ledger-meta">${catIcons[tx.category]} | ${tx.date}</span>
          </div>
          <div class="ledger-right">
            <span class="ledger-val">-${formatRp(tx.amount)}</span>
          </div>
        `;
        list.appendChild(item);
      });
    }

    // Sync financial evaluasi badge on dashboard
    const statusEl = document.getElementById("char-pocket-status");
    if (statusEl) {
      if (spentN > limitN && spentW > limitW) {
        statusEl.textContent = "Bocor Parah! 🚨";
        statusEl.style.color = "var(--color-danger)";
      } else if (spentN > limitN || spentW > limitW) {
        statusEl.textContent = "Bocor Halus ⚠️";
        statusEl.style.color = "var(--color-warning)";
      } else if (spentS >= limitS) {
        statusEl.textContent = "Sangat Sehat 👑";
        statusEl.style.color = "var(--color-wealth)";
      } else {
        statusEl.textContent = "Seimbang";
        statusEl.style.color = "var(--color-knowledge)";
      }
    }

    this.updatePocketDoughnutChart();
  }

  addPocketTransaction() {
    const descEl = document.getElementById("tx-desc");
    const amtEl = document.getElementById("tx-amount");
    const catEl = document.getElementById("tx-category");

    const desc = descEl.value.trim();
    const amount = Number(amtEl.value);
    const category = catEl.value;

    if (desc === "" || amount <= 0) return;

    const d = new Date();
    const dateStr = `${d.getDate()}/${d.getMonth() + 1} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const newTx = {
      id: "tx_" + Date.now(),
      desc: desc,
      amount: amount,
      category: category,
      date: dateStr
    };

    this.pocket.ledger.push(newTx);
    this.recalculatePocketLimits();
    this.saveState();

    this.addXP(25, "wealth");
    this.renderPocketUI();
    this.updateUI();

    descEl.value = "";
    amtEl.value = "";

    this.showToast("Kas Dicatat!", "Catatan transaksi pengeluaran ter-update.", "wealth");
  }

  clearPocketLedger() {
    if (this.pocket.ledger.length === 0) return;
    if (confirm("Reset ulang seluruh catatan pengeluaran?")) {
      this.pocket.ledger = [];
      this.recalculatePocketLimits();
      this.saveState();
      this.renderPocketUI();
      this.updateUI();
      this.showToast("Buku Kas Dihapus", "Seluruh riwayat buku kas berhasil di-reset.", "fail");
      this.playSynthSound("fail");
    }
  }

  updatePocketDoughnutChart() {
    if (!window.Chart) return;
    const canvasCtx = document.getElementById("expense-pie-chart");
    if (!canvasCtx) return;

    const dataVals = [this.pocket.spent.needs, this.pocket.spent.wants, this.pocket.spent.savings];

    if (this.pocket.pieChart) {
      this.pocket.pieChart.data.datasets[0].data = dataVals;
      this.pocket.pieChart.update();
    } else {
      this.pocket.pieChart = new Chart(canvasCtx, {
        type: 'doughnut',
        data: {
          labels: ['Needs', 'Wants', 'Savings'],
          datasets: [{
            data: dataVals,
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

  // --- E. AI ROADMAP (ROADMAP.SH FLOWCHART & CONCEPT DRAWER) ---
  initRoadmap() {
    const searchInput = document.getElementById("roadmap-search-input");
    const clearBtn = document.getElementById("btn-clear-roadmap-search");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value;
        this.searchRoadmap(query);
        if (clearBtn) {
          clearBtn.style.display = query.trim().length > 0 ? "flex" : "none";
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          this.searchRoadmap("");
        }
        clearBtn.style.display = "none";
        this.playSynthSound("click");
      });
    }

    // Close HUD drawer triggers
    const overlay = document.getElementById("roadmap-drawer-overlay");
    const closeBtn = document.getElementById("btn-close-hud-drawer");

    if (overlay) overlay.onclick = () => this.closeConceptDrawer();
    if (closeBtn) closeBtn.onclick = () => this.closeConceptDrawer();

    this.renderRoadmap();
    this.updateRoadmapProgress();
  }

  searchRoadmap(query) {
    const capsules = document.querySelectorAll(".topic-capsule");
    const cleanQuery = query.toLowerCase().trim();

    if (cleanQuery === "") {
      capsules.forEach(cap => {
        cap.classList.remove("dimmed", "pulsing-glow");
      });
      return;
    }

    capsules.forEach(cap => {
      const label = cap.getAttribute("data-topic-label").toLowerCase();
      if (label.includes(cleanQuery)) {
        cap.classList.remove("dimmed");
        cap.classList.add("pulsing-glow");
      } else {
        cap.classList.remove("pulsing-glow");
        cap.classList.add("dimmed");
      }
    });
  }

  renderRoadmap() {
    const treeContainer = document.getElementById("roadmap-flowchart-tree");
    if (!treeContainer) return;

    treeContainer.innerHTML = "";

    this.roadmap.milestones.forEach(milestone => {
      // 1. Render Milestone Header
      const phaseDiv = document.createElement("div");
      phaseDiv.className = "phase-milestone";
      phaseDiv.innerHTML = `
        <div class="phase-milestone-content ${milestone.color}">
          <span>${milestone.title}</span>
        </div>
      `;
      treeContainer.appendChild(phaseDiv);

      // 2. Render Nodes
      milestone.nodes.forEach(node => {
        const row = document.createElement("div");
        
        let connClass = "none-connected";
        if (node.connection === "both") connClass = "both-connected";
        else if (node.connection === "left") connClass = "left-connected";
        else if (node.connection === "right") connClass = "right-connected";

        row.className = `roadmap-node-row ${connClass}`;

        // Left Side Card
        const leftSide = document.createElement("div");
        leftSide.className = "roadmap-side-card left-side";
        if (node.leftCard) {
          leftSide.innerHTML = `
            <div class="side-card-title">${node.leftCard.title}</div>
            <div class="side-card-topics">
              ${node.leftCard.topics.map(topic => {
                const isCompleted = this.roadmap.completedTopics.includes(topic.id);
                return `
                  <div class="topic-capsule ${isCompleted ? 'completed' : ''}" 
                       data-topic-id="${topic.id}" 
                       data-topic-label="${topic.label}"
                       data-topic-xp="${topic.xp}"
                       onclick="window.app.openConceptDrawer('${topic.id}', '${topic.label}')">
                    <span class="check-ico" onclick="event.stopPropagation(); window.app.toggleRoadmapTopic('${topic.id}', ${topic.xp})">
                      <i data-lucide="${isCompleted ? 'check-square' : 'square'}"></i>
                    </span>
                    <span class="topic-lbl-text">${topic.label}</span>
                    <span class="info-ico"><i data-lucide="help-circle"></i></span>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }
        row.appendChild(leftSide);

        // Center Node Button
        const centerNode = document.createElement("div");
        centerNode.className = "roadmap-center-node";
        centerNode.innerHTML = `
          <button class="roadmap-center-button ${node.color}">
            <span>${node.title}</span>
          </button>
        `;
        row.appendChild(centerNode);

        // Right Side Card
        const rightSide = document.createElement("div");
        rightSide.className = "roadmap-side-card right-side";
        if (node.rightCard) {
          rightSide.innerHTML = `
            <div class="side-card-title">${node.rightCard.title}</div>
            <div class="side-card-topics">
              ${node.rightCard.topics.map(topic => {
                const isCompleted = this.roadmap.completedTopics.includes(topic.id);
                return `
                  <div class="topic-capsule ${isCompleted ? 'completed' : ''}" 
                       data-topic-id="${topic.id}" 
                       data-topic-label="${topic.label}"
                       data-topic-xp="${topic.xp}"
                       onclick="window.app.openConceptDrawer('${topic.id}', '${topic.label}')">
                    <span class="check-ico" onclick="event.stopPropagation(); window.app.toggleRoadmapTopic('${topic.id}', ${topic.xp})">
                      <i data-lucide="${isCompleted ? 'check-square' : 'square'}"></i>
                    </span>
                    <span class="topic-lbl-text">${topic.label}</span>
                    <span class="info-ico"><i data-lucide="help-circle"></i></span>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }
        row.appendChild(rightSide);

        treeContainer.appendChild(row);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  toggleRoadmapTopic(key, xpReward) {
    const idx = this.roadmap.completedTopics.indexOf(key);
    const capsules = document.querySelectorAll(`[data-topic-id="${key}"]`);

    if (idx === -1) {
      // Mark as completed
      this.roadmap.completedTopics.push(key);
      capsules.forEach(cap => {
        cap.classList.add("completed");
        const ico = cap.querySelector(".check-ico");
        if (ico) ico.innerHTML = `<i data-lucide="check-square"></i>`;
      });
      
      this.addXP(xpReward, "knowledge");
      this.playSynthSound("success");

      if (window.confetti) {
        window.confetti({ particleCount: 20, spread: 30, origin: { y: 0.85 } });
      }
    } else {
      // Uncheck
      this.roadmap.completedTopics.splice(idx, 1);
      capsules.forEach(cap => {
        cap.classList.remove("completed");
        const ico = cap.querySelector(".check-ico");
        if (ico) ico.innerHTML = `<i data-lucide="square"></i>`;
      });
      
      this.showToast("Topik Dibatalkan", "XP dinonaktifkan kembali.", "fail");
      this.playSynthSound("fail");
    }

    if (window.lucide) window.lucide.createIcons();
    this.saveState();
    this.updateRoadmapProgress();
    
    // If currently displaying inside the open drawer, update the drawer UI status too!
    const drawer = document.getElementById("roadmap-info-drawer");
    if (drawer && drawer.classList.contains("active") && drawer.getAttribute("data-current-topic-id") === key) {
      this.syncDrawerButtonState(key, xpReward);
    }
  }

  updateRoadmapProgress() {
    let total = 0;
    this.roadmap.milestones.forEach(m => {
      m.nodes.forEach(n => {
        if (n.leftCard) total += n.leftCard.topics.length;
        if (n.rightCard) total += n.rightCard.topics.length;
      });
    });

    const completed = this.roadmap.completedTopics.length;
    const progress = total > 0 ? Math.floor((completed / total) * 100) : 0;

    const bar = document.getElementById("roadmap-progress-fill");
    const pct = document.getElementById("roadmap-progress-percent");
    const stats = document.getElementById("roadmap-progress-stats");

    if (bar) bar.style.width = `${progress}%`;
    if (pct) pct.textContent = `${progress}%`;
    if (stats) stats.textContent = `${completed} / ${total} Topik Selesai`;
  }

  openConceptDrawer(topicId, label) {
    const overlay = document.getElementById("roadmap-drawer-overlay");
    const drawer = document.getElementById("roadmap-info-drawer");
    if (!overlay || !drawer) return;

    // Fetch cyber concept details
    const details = this.getConceptDetails(topicId, label);

    // Update markup
    document.getElementById("drawer-topic-category").textContent = details.category.toUpperCase();
    document.getElementById("drawer-topic-title").textContent = details.title;
    document.getElementById("drawer-topic-desc").textContent = details.desc;
    
    const codeBlock = document.getElementById("drawer-topic-code");
    codeBlock.textContent = details.code;

    const link = document.getElementById("drawer-topic-link");
    link.href = details.link;

    // Set topic context references in drawer attributes
    drawer.setAttribute("data-current-topic-id", topicId);
    
    // Calculate reward xp
    let xpVal = 15;
    this.roadmap.milestones.forEach(m => {
      m.nodes.forEach(n => {
        const findInCard = (c) => {
          if (!c) return;
          const found = c.topics.find(t => t.id === topicId);
          if (found) xpVal = found.xp;
        };
        findInCard(n.leftCard);
        findInCard(n.rightCard);
      });
    });
    drawer.setAttribute("data-current-topic-xp", xpVal);

    this.syncDrawerButtonState(topicId, xpVal);

    // Buka laci info secara dramatis menggunakan GSAP!
    overlay.classList.add("active");
    drawer.classList.add("active");

    if (window.gsap) {
      window.gsap.fromTo(drawer, 
        { right: "-420px" }, 
        { right: "0px", duration: 0.4, ease: "power2.out" }
      );
    } else {
      drawer.style.right = "0px";
    }
    
    this.playSynthSound("success");
  }

  syncDrawerButtonState(topicId, xpVal) {
    const completeBtn = document.getElementById("btn-drawer-toggle-complete");
    const isCompleted = this.roadmap.completedTopics.includes(topicId);

    if (completeBtn) {
      if (isCompleted) {
        completeBtn.className = "action-btn success full-width";
        completeBtn.innerHTML = `<i data-lucide="check-square"></i> <span>Sudah Selesai (Klik Batal)</span>`;
      } else {
        completeBtn.className = "action-btn primary full-width";
        completeBtn.innerHTML = `<i data-lucide="check-circle"></i> <span>Tandai Selesai (+${xpVal} XP)</span>`;
      }
      
      // Bind click event
      completeBtn.onclick = () => {
        this.toggleRoadmapTopic(topicId, xpVal);
      };
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeConceptDrawer() {
    const overlay = document.getElementById("roadmap-drawer-overlay");
    const drawer = document.getElementById("roadmap-info-drawer");
    if (!overlay || !drawer) return;

    if (window.gsap) {
      window.gsap.to(drawer, { 
        right: "-420px", 
        duration: 0.35, 
        ease: "power2.in",
        onComplete: () => {
          overlay.classList.remove("active");
          drawer.classList.remove("active");
        }
      });
    } else {
      overlay.classList.remove("active");
      drawer.classList.remove("active");
      drawer.style.right = "-420px";
    }
    this.playSynthSound("click");
  }

  getConceptDetails(topicId, label) {
    const data = {
      // Phase 1
      intro_1: {
        category: "Intro to AI",
        desc: "Seorang AI Engineer menjembatani rekayasa perangkat lunak tradisional dengan model kecerdasan buatan. Tugas utamanya adalah merancang, men-deploy, dan memelihara aplikasi bertenaga LLM.",
        code: "# Memulai dengan Gemini API\nimport google.generativeai as genai\n\ngenai.configure(api_key='YOUR_API_KEY')\nmodel = genai.GenerativeModel('gemini-1.5-flash')\nresponse = model.generate_content('Apa peran AI Engineer?')\nprint(response.text)",
        link: "https://roadmap.sh/ai-engineer"
      },
      intro_2: {
        category: "Intro to AI",
        desc: "Tanggung jawab meliputi pemilihan model LLM yang tepat, integrasi API, prompt tuning, penanganan context window, optimasi biaya/latensi token, dan memastikan keamanan model.",
        code: "{\n  \"role\": \"AI Engineer\",\n  \"tasks\": [\n    \"Integrasi API LLM\",\n    \"Optimasi Token & Caching\",\n    \"Desain Pipeline RAG\",\n    \"Monitoring LLM Ops\"\n  ]\n}",
        link: "https://roadmap.sh/ai-engineer"
      },
      intro_4: {
        category: "Intro to AI",
        desc: "ML Engineer melatih model dari awal (TensorFlow/PyTorch, matematika rumit). AI Engineer menggunakan model pra-terlatih (pretrained) melalui API/SDK dan merancang arsitektur aplikasi di sekitarnya.",
        code: "# ML: Melatih model kustom (PyTorch)\n# loss = criterion(outputs, labels); loss.backward(); optimizer.step()\n\n# AI: Menggunakan API instan (Gemini)\nresponse = model.generate_content('Klasifikasikan sentimen: ...')",
        link: "https://roadmap.sh/ai-engineer"
      },
      llm_1: {
        category: "Core LLM",
        desc: "Token adalah unit dasar pemrosesan LLM (kata/suku kata). Context Window adalah batasan jumlah token maksimal yang dapat diterima dan dihasilkan LLM dalam sekali panggilan.",
        code: "import tiktoken\n\nencoder = tiktoken.get_encoding(\"cl100k_base\")\ntokens = encoder.encode(\"Belajar AI di LevelUp sangat menyenangkan!\")\nprint(f\"Jumlah Token: {len(tokens)}\") # Output: representasi integer token",
        link: "https://platform.openai.com/tokenizer"
      },
      llm_2: {
        category: "Core LLM",
        desc: "Temperature mengontrol keacakan respons (0 = deterministik, 1 = kreatif). Top-P (nucleus sampling) memilih token dari kumulatif probabilitas terkaya. Top-K memilih K token terpopuler.",
        code: "# Konfigurasi Sampling di Python\nresponse = model.generate_content(\n    'Tulis puisi tentang masa depan',\n    generation_config=genai.types.GenerationConfig(\n        temperature=0.8,\n        top_p=0.95,\n        top_k=40\n    )\n)",
        link: "https://ai.google.dev/gemini-api/docs/capabilities"
      },
      term_3: {
        category: "Terminology",
        desc: "Fine-tuning melatih ulang bobot model internal dengan dataset khusus (menambah pemahaman perilaku). RAG menghubungkan model ke database eksternal secara dinamis tanpa melatih ulang (akurasi data).",
        code: "# Perbandingan Strategi\n# Fine-tuning: Cocok untuk gaya bicara khusus, bahasa langka, format kaku\n# RAG: Cocok untuk basis pengetahuan internal perusahaan yang terus berubah cepat",
        link: "https://roadmap.sh/ai-engineer"
      },
      pr_1: {
        category: "Prompting",
        desc: "Zero-Shot: LLM menjawab langsung tugas tanpa contoh. Few-Shot: Memberikan 1-3 contoh format input-output di dalam prompt sebelum meminta LLM menghasilkan jawaban baru.",
        code: "Prompt Few-Shot:\nTugas: Terjemahkan slang ke formal\nContoh 1:\nInput: 'Gokil parah'\nOutput: 'Luar biasa sekali'\n\nContoh 2:\nInput: 'Mager cuy'\nOutput: 'Saya sedang tidak ingin beraktivitas'\n\nInput: 'Gas bang'\nOutput:",
        link: "https://www.promptingguide.ai/"
      },
      pr_2: {
        category: "Prompting",
        desc: "Chain-of-Thought (CoT) meminta LLM berpikir baris demi baris ('Let's think step by step'). ReAct (Reason + Act) menggabungkan pemikiran logis dengan pemanggilan alat eksternal secara berulang.",
        code: "Prompt CoT:\n\"Selesaikan soal matematika ini dan tuliskan langkah berpikirmu secara bertahap sebelum menuliskan jawaban akhir: Jika Budi memiliki 5 apel dan membeli 2 keranjang berisi masing-masing 6 apel...\"",
        link: "https://www.promptingguide.ai/techniques/cot"
      },
      pr_3: {
        category: "Prompting",
        desc: "Function Calling mendeteksi kapan API eksternal harus dipanggil berdasarkan perintah user, lalu mengembalikan argumen JSON terstruktur. Structured Output memaksa LLM patuh pada skema JSON tertentu.",
        code: "# Contoh Structured Output menggunakan Pydantic di Python\nfrom pydantic import BaseModel\n\nclass UserProfile(BaseModel):\n    name: str\n    age: int\n    skills: list[str]\n\n# Memaksa respons LLM cocok dengan skema UserProfile di atas",
        link: "https://ai.google.dev/gemini-api/docs/function-calling"
      },
      fw_1: {
        category: "Frameworks",
        desc: "LangChain adalah framework modular terpopuler untuk menghubungkan model LLM ke rantai eksekusi (*chains*), memori percakapan, dan agen cerdas.",
        code: "from langchain_core.prompts import ChatPromptTemplate\nfrom langchain_openai import ChatOpenAI\n\nprompt = ChatPromptTemplate.from_template(\"Jelaskan {topic} secara singkat\")\nchain = prompt | ChatOpenAI(model=\"gpt-4o-mini\")\nresponse = chain.invoke({\"topic\": \"LangChain\"})",
        link: "https://www.langchain.com/"
      },
      fw_2: {
        category: "Frameworks",
        desc: "LlamaIndex berfokus sebagai jembatan data masif. Sangat unggul dalam melakukan RAG, membuat indeks vektor, dan menyaring dokumen dalam jumlah besar.",
        code: "from llama_index.core import VectorStoreIndex, SimpleDirectoryReader\n\ndocuments = SimpleDirectoryReader(\"knowledge_base\").load_data()\nindex = VectorStoreIndex.from_documents(documents)\nquery_engine = index.as_query_engine()\nresponse = query_engine.query(\"Apa instruksi K3 di kilang minyak?\")",
        link: "https://www.llamaindex.ai/"
      },
      mcp_1: {
        category: "Model Context Protocol",
        desc: "Model Context Protocol (MCP) dikembangkan Anthropic sebagai standar universal untuk menghubungkan asisten AI (seperti Claude) secara aman ke data lokal, API, dan filesystem.",
        code: "// File Konfigurasi Claude Desktop App (claude_desktop_config.json)\n{\n  \"mcpServers\": {\n    \"sqlite-db\": {\n      \"command\": \"uvx\",\n      \"args\": [\"mcp-server-sqlite\", \"--db-path\", \"/path/to/database.db\"]\n    }\n  }\n}",
        link: "https://modelcontextprotocol.io"
      },
      db_1: {
        category: "Vector Databases",
        desc: "ChromaDB dan FAISS adalah database vektor lokal yang sangat cepat untuk memuat dan menyimpan embedding vektor secara instan di memori RAM atau penyimpanan lokal komputer saat pengembangan.",
        code: "import chromadb\n\nclient = chromadb.Client()\ncollection = client.create_collection(name=\"it_docs\")\ncollection.add(\n    documents=[\"DNS menerjemahkan nama domain ke IP.\"],\n    ids=[\"id1\"]\n)\nresults = collection.query(query_texts=[\"Buku telepon internet\"], n_results=1)",
        link: "https://docs.trychroma.com/"
      },
      os_2: {
        category: "Open-Source Models",
        desc: "DeepSeek-V3/R1 adalah model open-source mutakhir dari China yang menawarkan performa setingkat GPT-4 dengan biaya komputasi yang sangat murah, terkenal dengan efisiensi Mixture-of-Experts (MoE) dan kemampuan penalaran logis tingkat tinggi.",
        code: "# Mengakses DeepSeek via API kompatibel OpenAI\nfrom openai import OpenAI\nclient = OpenAI(api_key=\"DEEPSEEK_KEY\", base_url=\"https://api.deepseek.com\")\n\nresp = client.chat.completions.create(\n    model=\"deepseek-chat\",\n    messages=[{\"role\": \"user\", \"content\": \"Jelaskan rumus Einstein\"}]\n)",
        link: "https://www.deepseek.com/"
      }
    };

    if (data[topicId]) return data[topicId];

    // Dynamic high-fidelity fallback generator if not predefined
    const fallbackCategory = topicId.startsWith("intro") || topicId.startsWith("llm") || topicId.startsWith("term") ? "Dasar LLM"
      : topicId.startsWith("pr") || topicId.startsWith("ctx") ? "Prompt & Context"
      : topicId.startsWith("md") || topicId.startsWith("os") ? "Models & Ecosystem"
      : topicId.startsWith("emb") || topicId.startsWith("db") ? "Embeddings & DB"
      : topicId.startsWith("rg") || topicId.startsWith("fw") ? "RAG Architecture"
      : topicId.startsWith("ag") || topicId.startsWith("mcp") ? "Agents & MCP"
      : topicId.startsWith("sf") || topicId.startsWith("ob") ? "Safety & Eval"
      : "Multimodal & Dev Tools";

    return {
      category: fallbackCategory,
      desc: `${label} adalah pilar penting dalam arsitektur AI modern. Memahami ${label} membantu AI Engineer membangun sistem cerdas yang andal, aman, berkinerja tinggi, dan siap diintegrasikan ke lingkungan produksi.`,
      code: `# Contoh implementasi teoritis untuk ${label}\n# Silakan pelajari dokumentasi resmi terkait untuk detail teknis lengkap.\n\ndef handle_${topicId.replace("-", "_")}():\n    print("Menginisialisasi modul ${label}...")\n    # Masukkan logika atau parameter integrasi di sini\n    return True`,
      link: "https://roadmap.sh/ai-engineer"
    };
  }

  // --- F. FOCUS CENTER (POMODORO & AUDIO WEB AUDIO API) ---
  initFocus() {
    document.getElementById("btn-focus-toggle").onclick = () => this.toggleFocusTimer();
    document.getElementById("btn-focus-reset").onclick = () => this.resetFocusTimer();

    // Mode selectors
    document.querySelectorAll(".focus-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".focus-mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const min = Number(btn.getAttribute("data-minutes"));
        this.focus.timerDuration = min * 60;
        this.resetFocusTimer();
      });
    });

    // Ambient sound triggers
    document.querySelectorAll(".ambient-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const soundType = btn.getAttribute("data-sound");
        this.toggleAmbientSound(soundType);
      });
    });
  }

  toggleFocusTimer() {
    this.initAudio();
    const btn = document.getElementById("btn-focus-toggle");
    const icon = document.getElementById("focus-play-icon");
    const text = document.getElementById("focus-play-text");

    if (this.focus.isPaused) {
      this.focus.isPaused = false;
      btn.classList.add("active");
      icon.setAttribute("data-lucide", "pause");
      text.textContent = "Pause";
      this.playSynthSound("click");

      this.focus.timerInterval = setInterval(() => {
        this.focus.timeLeft -= 1;
        this.updateFocusTimerDisplay();

        if (this.focus.timeLeft <= 0) {
          this.completeFocusSession();
        }
      }, 1000);
    } else {
      this.focus.isPaused = true;
      btn.classList.remove("active");
      icon.setAttribute("data-lucide", "play");
      text.textContent = "Mulai Fokus";
      clearInterval(this.focus.timerInterval);
      this.playSynthSound("fail");
    }

    if (window.lucide) window.lucide.createIcons();
  }

  resetFocusTimer() {
    this.focus.isPaused = true;
    clearInterval(this.focus.timerInterval);
    this.focus.timeLeft = this.focus.timerDuration;

    const btn = document.getElementById("btn-focus-toggle");
    const icon = document.getElementById("focus-play-icon");
    const text = document.getElementById("focus-play-text");

    btn.classList.remove("active");
    icon.setAttribute("data-lucide", "play");
    text.textContent = "Mulai Fokus";
    
    this.updateFocusTimerDisplay();
    this.playSynthSound("click");
    if (window.lucide) window.lucide.createIcons();
  }

  updateFocusTimerDisplay() {
    const mins = String(Math.floor(this.focus.timeLeft / 60)).padStart(2, '0');
    const secs = String(this.focus.timeLeft % 60).padStart(2, '0');
    
    document.getElementById("focus-timer-text").textContent = `${mins}:${secs}`;

    const circle = document.getElementById("focus-circle-progress");
    if (circle) {
      const circ = 691;
      const progress = this.focus.timeLeft / this.focus.timerDuration;
      const offset = circ - (progress * circ);
      circle.style.strokeDashoffset = offset;
    }
  }

  completeFocusSession() {
    this.resetFocusTimer();
    this.addXP(40, "discipline");
    this.showToast("Sesi Fokus Selesai!", "Hebat! Kamu telah berkonsentrasi penuh selama sesi Pomodoro. (+40 XP)", "discipline");

    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    }

    // Play retro celebratory bell Synthetically
    if (this.audioCtx) {
      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc2.frequency.setValueAtTime(880.00, now); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    }
  }

  // --- AUDIO SYNTHESIS AMBIENT SOUND GENERATORS ---
  toggleAmbientSound(type) {
    if (this.focus.currentAmbientType === type && this.focus.ambientPlaying) {
      this.stopAmbientSound();
      return;
    }

    this.stopAmbientSound();
    this.initAudio();
    if (!this.audioCtx) return;

    this.focus.currentAmbientType = type;
    this.focus.ambientPlaying = true;

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
    
    this.playSynthSound("success");
  }

  stopAmbientSound() {
    this.focus.ambientPlaying = false;
    this.focus.currentAmbientType = "none";

    document.querySelectorAll(".ambient-btn").forEach(btn => {
      if (btn.getAttribute("data-sound") === "none") {
        btn.classList.add("playing");
      } else {
        btn.classList.remove("playing");
      }
    });

    if (this.focus.noiseNode) {
      try { this.focus.noiseNode.stop(); } catch(e){}
      this.focus.noiseNode.disconnect();
      this.focus.noiseNode = null;
    }

    if (this.focus.spaceHumNode) {
      try { this.focus.spaceHumNode.stop(); } catch(e){}
      this.focus.spaceHumNode.disconnect();
      this.focus.spaceHumNode = null;
    }
  }

  playSynthesizedRain() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise formula approximation
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
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.45;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    source.start(0);
    this.focus.noiseNode = source;
  }

  playSynthesizedSpaceHum() {
    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.18;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 140;

    const osc1 = this.audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 55; // A1 deep cabin sound

    const osc2 = this.audioCtx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 110; // A2 hum

    const modulator = this.audioCtx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.value = 0.25; // 0.25 Hz slow pitch sweep

    const modGain = this.audioCtx.createGain();
    modGain.gain.value = 15; // pitch range

    modulator.connect(modGain);
    modGain.connect(osc1.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(0);
    osc2.start(0);
    modulator.start(0);

    this.focus.spaceHumNode = {
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

  // --- GENERAL HELPER ---
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Global exposure
window.app = new LevelUpMasterEngine();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
