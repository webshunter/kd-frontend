


import { View, DashboardView, type NavLink, type DashboardNavLink, type Feature, type UMKMProfile, type Event, type Mentor, UserRole, CooperativeNews, type Order, NewsArticle } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Beranda', view: View.Home },
  {
    label: 'Ekosistem',
    children: [
      { label: 'Info UMKM', view: View.UMKM },
      { label: 'TangselMart', view: View.TangselMart },
      { label: 'GoodSkill', view: View.GoodSkill },
      { label: 'HalloHukum', view: View.HalloHukum },
      { label: 'Akses Pendanaan', view: View.Pendanaan },
      { label: 'Forum One Tangsel', view: View.Forum },
      { label: 'Mentoring Bisnis', view: View.Mentoring },
      { label: 'GoodEx', view: View.GoodEx },
    ],
  },
  {
    label: 'Fitur Lainnya',
    view: View.Koperasi,
    children: [
        { label: 'Koperasi Tangsel', view: View.Koperasi },
        { label: 'Lowongan Kerja', view: View.LowonganKerja },
        { label: 'Business Matching', view: View.BusinessMatching },
        { label: 'Digital Marketing', view: View.DigitalMarketing },
        { label: 'Event Tangsel', view: View.EventTangsel },
    ]
  },
  {
    label: 'Informasi',
    view: View.About,
    children: [
        { label: 'Tentang Kami', view: View.About },
        { label: 'Pemkot Tangsel', view: View.Pemkot },
        { label: 'Berita & Kegiatan', view: View.Berita },
    ]
  }
];

export const DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { label: 'Dashboard', view: DashboardView.Overview, icon: 'dashboard', roles: ['umkm_owner', 'pemkot_staff', 'kadin_staff', 'admin', 'customer'] },
  { label: 'Profil Usaha', view: DashboardView.Profile, icon: 'badge', roles: ['umkm_owner'] },
  { label: 'Produk Saya', view: DashboardView.Products, icon: 'inventory_2', roles: ['umkm_owner'] },
  { label: 'Pesanan Saya', view: DashboardView.Orders, icon: 'receipt_long', roles: ['umkm_owner', 'customer'] },
  { label: 'Membership Premium', view: DashboardView.MembershipPremium, icon: 'workspace_premium', roles: ['umkm_owner'] },
  { label: 'Checkout', view: DashboardView.Checkout, icon: 'shopping_cart_checkout', roles: ['customer'] },
  { label: 'Manajemen UMKM', view: DashboardView.ManageUMKM, icon: 'manage_accounts', roles: ['pemkot_staff', 'kadin_staff', 'admin'] },
  { label: 'Kursus Saya', view: DashboardView.Courses, icon: 'school', roles: ['umkm_owner', 'pemkot_staff', 'kadin_staff', 'admin'] },
  // Admin Management Menus
  { label: 'Manajemen Berita', view: DashboardView.NewsManagement, icon: 'newspaper', roles: ['admin'] },
  { label: 'Manajemen Acara', view: DashboardView.EventsManagement, icon: 'event', roles: ['admin'] },
  { label: 'Manajemen Forum', view: DashboardView.ForumManagement, icon: 'forum', roles: ['admin'] },
  { label: 'Manajemen Kursus', view: DashboardView.CoursesManagement, icon: 'school', roles: ['admin'] },
  { label: 'Manajemen Mentoring', view: DashboardView.MentoringManagement, icon: 'psychology', roles: ['admin'] },
  { label: 'Manajemen Lowongan', view: DashboardView.JobsManagement, icon: 'work', roles: ['admin'] },
  { label: 'Manajemen Bisnis', view: DashboardView.BusinessMatchingManagement, icon: 'handshake', roles: ['admin'] },
  { label: 'Pengaturan', view: DashboardView.Settings, icon: 'settings', roles: ['umkm_owner', 'pemkot_staff', 'kadin_staff', 'admin', 'customer'] },
];

export const ROLE_DISPLAY_CONFIG: Record<NonNullable<UserRole>, { name: string; color: string }> & { [key: string]: { name: string; color: string } } = {
  umkm_owner: { name: 'UMKM', color: 'bg-blue-100 text-blue-800' },
  pemkot_staff: { name: 'Staf Pemda', color: 'bg-indigo-100 text-indigo-800' },
  kadin_staff: { name: 'Staf KADIN', color: 'bg-teal-100 text-teal-800' },
  admin: { name: 'Administrator', color: 'bg-red-100 text-red-800' },
  null: { name: 'Tamu', color: 'bg-gray-100 text-gray-800' }
};


export const FEATURES: Feature[] = [
  {
    icon: 'storefront',
    title: 'Direktori UMKM',
    description: 'Pendaftaran dan direktori UMKM Tangsel berdasarkan kategori.',
    view: View.UMKM,
    color: 'text-blue-500',
  },
  {
    icon: 'shopping_basket',
    title: 'TangselMart',
    description: 'Marketplace lokal untuk jual beli produk UMKM unggulan.',
    view: View.TangselMart,
    color: 'text-orange-500',
  },
  {
    icon: 'school',
    title: 'GoodSkill Tangsel',
    description: 'Pusat edukasi dan pelatihan online untuk meningkatkan skill.',
    view: View.GoodSkill,
    color: 'text-green-500',
  },
  {
    icon: 'gavel',
    title: 'HalloHukum',
    description: 'Konsultasi dan pembuatan dokumen hukum via AI Legal Advisor.',
    view: View.HalloHukum,
    color: 'text-red-500',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Akses Pendanaan',
    description: 'Informasi dan pengajuan modal usaha digital (KUR, investor).',
    view: View.Pendanaan,
    color: 'text-purple-500',
  },
  {
    icon: 'groups',
    title: 'Forum One Tangsel',
    description: 'Ruang diskusi dan kolaborasi digital untuk warga & UMKM.',
    view: View.Forum,
    color: 'text-yellow-500',
  },
  {
    icon: 'savings',
    title: 'Koperasi Tangsel',
    description: 'Layanan simpan pinjam dan program pemberdayaan anggota koperasi.',
    view: View.Koperasi,
    color: 'text-pink-500',
  },
  {
    icon: 'work',
    title: 'Lowongan Kerja',
    description: 'Portal informasi lowongan kerja dari UMKM dan perusahaan di Tangsel.',
    view: View.LowonganKerja,
    color: 'text-cyan-500',
  },
  {
    icon: 'handshake',
    title: 'Business Matching',
    description: 'Temukan mitra bisnis, pemasok, atau distributor potensial di ekosistem.',
    view: View.BusinessMatching,
    color: 'text-lime-500',
  },
  {
    icon: 'campaign',
    title: 'Digital Marketing',
    description: 'Layanan terpadu untuk promosi online, manajemen medsos, dan iklan digital.',
    view: View.DigitalMarketing,
    color: 'text-sky-500',
  },
  {
    icon: 'celebration',
    title: 'Event Tangsel',
    description: 'Kalender bazaar, seminar, workshop, dan acara komunitas di Tangsel.',
    view: View.EventTangsel,
    color: 'text-amber-500',
  },
  {
    icon: 'support_agent',
    title: 'Mentoring Bisnis',
    description: 'Konsultasi bisnis dengan para ahli dan praktisi.',
    view: View.Mentoring,
    color: 'text-indigo-500',
  },
  {
    icon: 'public',
    title: 'GoodEx',
    description: 'Fasilitator ekspor untuk produk UMKM unggulan ke pasar global.',
    view: View.GoodEx,
    color: 'text-teal-500',
  },
];

export const MOCK_UMKM_DATA: UMKMProfile[] = [
  { 
    id: 1, 
    businessName: "Bakso Mas Bejo", 
    ownerName: "Bejo Sutrisno", 
    category: "Kuliner", 
    description: "Bakso urat sapi asli dengan kuah kaldu yang kaya rasa.",
    fullDescription: "Bakso Mas Bejo telah berdiri sejak tahun 2010, menyajikan bakso sapi asli dengan resep warisan keluarga. Kami menggunakan 100% daging sapi segar dan bumbu-bumbu alami tanpa pengawet. Kuah kaldu kami direbus selama berjam-jam untuk menghasilkan rasa yang gurih dan otentik. Selain bakso urat, kami juga menyediakan mie ayam dan es campur.",
    image: "https://picsum.photos/400/300?random=1",
    gallery: ["https://picsum.photos/400/300?random=11", "https://picsum.photos/400/300?random=12", "https://picsum.photos/400/300?random=13"],
    address: "Jl. Pamulang Raya No. 12, Pamulang, Tangerang Selatan",
    contact: { phone: "0812-3456-7890", email: "info@baksomasbejo.com", website: "baksomasbejo.com" },
    socialMedia: { instagram: "baksomasbejo", facebook: "baksomasbejo.id" },
    tangselMartLink: "#",
    coordinates: { lat: -6.338, lng: 106.722 },
    financialRecording: 'manual',
    productPackaging: 'labeled',
    digitalPaymentAdoption: 'qris',
    onlinePresence: 'social_media',
  },
  { 
    id: 2, 
    businessName: "Anggrek Cantik Boutique", 
    ownerName: "Lestari Indah", 
    category: "Fashion", 
    description: "Menjual berbagai macam pakaian batik modern dan gaun pesta.",
    fullDescription: "Anggrek Cantik Boutique menyediakan koleksi batik modern premium yang didesain eksklusif. Kami bekerja sama dengan pengrajin lokal untuk menghasilkan produk berkualitas tinggi dengan sentuhan kontemporer. Cocok untuk acara formal maupun kasual.",
    image: "https://picsum.photos/400/300?random=2",
    gallery: ["https://picsum.photos/400/300?random=14", "https://picsum.photos/400/300?random=15"],
    address: "Ruko Emerald Boulevard, Bintaro Sektor 9",
    contact: { phone: "0811-2233-4455", email: "sales@anggrekboutique.com" },
    socialMedia: { instagram: "anggrekboutique" },
    tangselMartLink: "#",
    coordinates: { lat: -6.285, lng: 106.705 },
    financialRecording: 'app',
    productPackaging: 'professional',
    digitalPaymentAdoption: 'qris',
    onlinePresence: 'website',
  },
  { 
    id: 3, 
    businessName: "Servis AC Cepat", 
    ownerName: "Rudi Hartono", 
    category: "Jasa", 
    description: "Layanan perbaikan dan perawatan AC untuk rumah dan kantor.", 
    image: "https://picsum.photos/400/300?random=3", 
    fullDescription: "Tim teknisi kami berpengalaman lebih dari 5 tahun dalam menangani berbagai merek AC. Kami melayani cuci AC, tambah freon, perbaikan kebocoran, dan instalasi unit baru dengan garansi layanan.",
    address: "Jl. Ciater Raya No. 101, Serpong",
    contact: { phone: "0877-1122-3344", email: "cs@servisaccepat.id" },
    coordinates: { lat: -6.295, lng: 106.698 },
    financialRecording: 'none',
    productPackaging: 'irrelevant',
    digitalPaymentAdoption: 'transfer',
    onlinePresence: 'none',
  },
  { 
    id: 4, 
    businessName: "Creative Woodcraft", 
    ownerName: "Joko Anwar", 
    category: "Kreatif", 
    description: "Kerajinan tangan unik dari kayu daur ulang.", 
    image: "https://picsum.photos/400/300?random=4", 
    coordinates: { lat: -6.310, lng: 106.730 },
    financialRecording: 'spreadsheet',
    productPackaging: 'professional',
    digitalPaymentAdoption: 'ewallet',
    onlinePresence: 'marketplace',
  },
  { 
    id: 5, 
    businessName: "Kopi Senja Tangsel", 
    ownerName: "Dewi Putri", 
    category: "Kuliner", 
    description: "Kedai kopi dengan biji kopi pilihan dari seluruh Indonesia.", 
    image: "https://picsum.photos/400/300?random=5", 
    coordinates: { lat: -6.288, lng: 106.715 },
    financialRecording: 'app',
    productPackaging: 'labeled',
    digitalPaymentAdoption: 'qris',
    onlinePresence: 'social_media',
  },
  { 
    id: 6, 
    businessName: "Cuci Sepatu Kinclong", 
    ownerName: "Agus Setiawan", 
    category: "Jasa", 
    description: "Jasa cuci dan perawatan sepatu premium.", 
    image: "https://picsum.photos/400/300?random=6", 
    coordinates: { lat: -6.305, lng: 106.708 },
    financialRecording: 'manual',
    productPackaging: 'irrelevant',
    digitalPaymentAdoption: 'ewallet',
    onlinePresence: 'social_media',
  },
  { 
    id: 7, 
    businessName: "Hijab Al-Fath", 
    ownerName: "Fatimah Azzahra", 
    category: "Fashion", 
    description: "Menyediakan berbagai model hijab syar'i dan modern.", 
    image: "https://picsum.photos/400/300?random=7", 
    coordinates: { lat: -6.292, lng: 106.725 },
    financialRecording: 'spreadsheet',
    productPackaging: 'labeled',
    digitalPaymentAdoption: 'transfer',
    onlinePresence: 'marketplace',
  },
  { 
    id: 8, 
    businessName: "Nasi Goreng Gila 77", 
    ownerName: "Pak Slamet", 
    category: "Kuliner", 
    description: "Nasi goreng legendaris dengan porsi dan rasa yang 'gila'.", 
    image: "https://picsum.photos/400/300?random=8", 
    coordinates: { lat: -6.298, lng: 106.718 },
    financialRecording: 'none',
    productPackaging: 'basic',
    digitalPaymentAdoption: 'cash_only',
    onlinePresence: 'none',
  },
];

export const UMKM_CATEGORIES: (UMKMProfile['category'] | 'Semua')[] = ['Semua', 'Kuliner', 'Fashion', 'Jasa', 'Kreatif', 'Lainnya'];

export const ALL_NEWS_ARTICLES: NewsArticle[] = [
    {
        id: 'news-1',
        image: 'https://picsum.photos/400/300?random=41',
        category: 'Inovasi',
        title: 'UMKM Tangsel Go Digital: Pelatihan Pemasaran Online Gratis dari Pemkot',
        excerpt: 'Pemerintah Kota Tangerang Selatan meluncurkan program pelatihan intensif untuk membantu UMKM memanfaatkan platform digital dalam meningkatkan penjualan.',
        date: '25 Mei 2024',
        fullContent: `Pemerintah Kota Tangerang Selatan, melalui Dinas Koperasi dan UKM, secara resmi meluncurkan program pelatihan digital marketing bertajuk "UMKM Tangsel Go Digital". Program ini bertujuan untuk meningkatkan kapasitas para pelaku UMKM dalam memanfaatkan teknologi digital untuk memperluas jangkauan pasar dan meningkatkan omzet penjualan.\n\nPelatihan yang diadakan secara gratis ini mencakup berbagai materi esensial, mulai dari dasar-dasar pemasaran media sosial, teknik fotografi produk menggunakan smartphone, hingga strategi beriklan di platform digital seperti Facebook Ads dan Instagram Ads. Acara pembukaan dihadiri langsung oleh Walikota Tangerang Selatan, Drs. H. Benyamin Davnie, yang dalam sambutannya menekankan pentingnya adaptasi digital bagi keberlangsungan usaha di era modern.\n\n"Kami tidak ingin UMKM kita tertinggal. Platform Kampung Digital dan program-program seperti ini adalah wujud komitmen kami untuk memfasilitasi para pahlawan ekonomi lokal agar bisa 'naik kelas' dan bersaing tidak hanya di tingkat lokal, tetapi juga nasional," ujar beliau. Program ini akan berjalan selama tiga bulan ke depan dengan menargetkan 500 UMKM dari berbagai sektor di tujuh kecamatan.`,
    },
    {
        id: 'news-2',
        image: 'https://picsum.photos/400/300?random=42',
        category: 'Komunitas',
        title: 'Bazaar Akbar "Karya Lokal" Sukses Digelar di Lapangan Cilenggang',
        excerpt: 'Ratusan pelaku UMKM memamerkan produk unggulannya dalam bazaar yang berlangsung selama akhir pekan dan menarik ribuan pengunjung.',
        date: '22 Mei 2024',
        fullContent: `Akhir pekan kemarin, Lapangan Cilenggang, Serpong, berubah menjadi pusat keramaian dengan digelarnya Bazaar Akbar 'Karya Lokal'. Acara yang diinisiasi oleh Komunitas UMKM Tangsel Bersatu ini berhasil menarik ribuan pengunjung dari berbagai wilayah. Lebih dari 150 stan UMKM, mulai dari kuliner, fashion, hingga kerajinan tangan, turut serta memeriahkan acara.\n\nKetua panitia, Ibu Siti Rahayu, menyatakan kegembiraannya atas antusiasme warga. "Ini bukti bahwa produk lokal kita punya kualitas dan daya tarik yang luar biasa. Bazaar seperti ini bukan hanya tentang jualan, tapi juga tentang membangun jaringan, berbagi semangat, dan menunjukkan kekuatan ekonomi lokal kita," ungkapnya. Selain area bazaar, acara ini juga dimeriahkan oleh panggung musik yang diisi oleh talenta-talenta lokal dan area bermain untuk anak-anak.`,
    },
    {
        id: 'news-3',
        image: 'https://picsum.photos/400/300?random=43',
        category: 'Pemerintahan',
        title: 'Program KUR dengan Bunga Rendah Kini Lebih Mudah Diakses oleh UMKM Tangsel',
        excerpt: 'Sinergi antara Pemkot dan bank daerah mempermudah proses pengajuan Kredit Usaha Rakyat (KUR) untuk mendorong pertumbuhan bisnis lokal.',
        date: '20 Mei 2024',
        fullContent: `Kabar gembira bagi para pelaku UMKM di Tangerang Selatan. Pemerintah Kota, bekerja sama dengan Bank Pembangunan Daerah (BPD) Banten dan beberapa bank Himbara, meluncurkan program percepatan akses Kredit Usaha Rakyat (KUR). Melalui sinergi ini, proses pengajuan KUR kini menjadi lebih sederhana dan cepat.\n\nKepala Dinas Koperasi dan UKM menjelaskan bahwa salah satu terobosan utama adalah integrasi data UMKM dari platform Kampung Digital. "UMKM yang sudah terdaftar dan memiliki skor kesiapan digital yang baik di platform kami akan mendapatkan prioritas dan proses verifikasi yang lebih cepat," jelasnya. Diharapkan dengan kemudahan ini, lebih banyak UMKM yang dapat mengakses permodalan untuk mengembangkan skala usahanya, baik untuk pembelian bahan baku, penambahan alat produksi, maupun ekspansi pemasaran.`,
    },
    {
        id: 'news-4',
        image: 'https://picsum.photos/400/300?random=44',
        category: 'Edukasi',
        title: 'GoodSkill Tangsel Luncurkan Kursus Baru Fotografi Produk',
        excerpt: 'Pusat edukasi GoodSkill menambahkan materi baru untuk membantu UMKM menghasilkan foto produk yang menarik hanya dengan menggunakan smartphone.',
        date: '18 Mei 2024',
        fullContent: `Memahami kebutuhan UMKM akan visual produk yang berkualitas, GoodSkill Tangsel secara resmi meluncurkan kursus online baru bertajuk 'Teknik Fotografi Produk dengan Smartphone'. Kursus ini dirancang khusus untuk para pelaku usaha yang memiliki keterbatasan perangkat namun ingin menghasilkan foto yang mampu bersaing di pasar digital.\n\nMateri kursus mencakup teknik dasar komposisi, pemanfaatan pencahayaan alami, tips dan trik styling produk, hingga proses editing sederhana menggunakan aplikasi gratis di smartphone. "Kami ingin mematahkan mitos bahwa foto bagus harus pakai kamera mahal. Dengan teknik yang tepat, HP di saku kita sudah jadi alat yang sangat powerful," kata Andi Wijaya, salah satu instruktur kursus.`,
    },
    {
        id: 'news-5',
        image: 'https://picsum.photos/400/300?random=45',
        category: 'Hukum',
        title: 'Webinar "Pentingnya NIB untuk UMKM" bersama HalloHukum',
        excerpt: 'HalloHukum mengadakan webinar gratis untuk mengedukasi para pelaku usaha mengenai pentingnya memiliki Nomor Induk Berusaha (NIB) untuk legalitas usaha.',
        date: '15 Mei 2024',
        fullContent: `Ratusan pelaku UMKM antusias mengikuti webinar yang diselenggarakan oleh HalloHukum dengan tema 'Pentingnya NIB untuk UMKM'. Webinar ini bertujuan untuk meningkatkan kesadaran hukum dan mendorong para pengusaha untuk segera mengurus Nomor Induk Berusaha (NIB).\n\nDalam sesi yang dibawakan oleh asisten hukum AI 'HUMI', dijelaskan bahwa NIB bukan hanya sekadar nomor registrasi, tetapi juga berfungsi sebagai Tanda Daftar Perusahaan (TDP), Angka Pengenal Impor (API), dan akses kepabeanan. "Dengan memiliki NIB, usaha Anda diakui secara hukum, lebih mudah mendapatkan akses permodalan dari bank, dan memiliki peluang lebih besar untuk mengikuti tender atau proyek pemerintah," papar narasi dari HUMI. Acara ini juga dilengkapi dengan sesi tutorial langkah-demi-langkah proses pendaftaran NIB melalui sistem Online Single Submission (OSS).`,
    },
    {
        id: 'news-6',
        image: 'https://picsum.photos/400/300?random=46',
        category: 'Ekonomi',
        title: 'TangselMart Catat Peningkatan Transaksi 30% di Kuartal Pertama',
        excerpt: 'Marketplace lokal kebanggaan Tangsel ini berhasil mencatatkan pertumbuhan signifikan, menunjukkan antusiasme warga mendukung produk lokal.',
        date: '12 Mei 2024',
        fullContent: `TangselMart, marketplace lokal yang menjadi bagian dari ekosistem Kampung Digital, berhasil mencatatkan pencapaian impresif di kuartal pertama tahun ini. Total nilai transaksi (Gross Merchandise Value) dilaporkan meningkat sebesar 30% dibandingkan dengan kuartal sebelumnya.\n\nKategori produk kuliner, terutama makanan beku (frozen food) dan produk fashion, menjadi penyumbang terbesar dalam pertumbuhan ini. Manajer TangselMart, Dewi Lestari, mengungkapkan bahwa keberhasilan ini didorong oleh berbagai kampanye promosi, seperti gratis ongkir lokal dan program 'Beli Lokal'. "Ini menunjukkan kepercayaan dan kebanggaan masyarakat Tangsel terhadap produk-produk dari tetangga mereka sendiri. Kami akan terus berinovasi untuk memberikan pengalaman belanja online lokal terbaik," ujarnya.`,
    },
];


export const KOPERASI_NEWS: CooperativeNews[] = [
    {
        image: 'https://picsum.photos/seed/koperasi1/400/300',
        category: 'Pemberdayaan',
        title: 'Koperasi Tangsel Sejahtera Salurkan Bantuan Modal untuk 50 Anggota UMKM',
        date: '10 Juni 2024',
        excerpt: 'Sebagai wujud komitmen pada pemberdayaan anggota, Koperasi Tangsel Sejahtera telah menyalurkan bantuan modal usaha kepada 50 UMKM terpilih...',
        fullContent: 'Sebagai wujud komitmen pada pemberdayaan anggota, Koperasi Tangsel Sejahtera telah menyalurkan bantuan modal usaha kepada 50 UMKM terpilih. Bantuan ini diharapkan dapat mendorong pertumbuhan usaha anggota di tengah tantangan ekonomi.\n\nKetua Koperasi, Bapak Budi Santoso, menyatakan bahwa program ini akan terus berlanjut dan diperluas di masa mendatang. "Ini adalah dari anggota, oleh anggota, dan untuk anggota. Kita harus saling mendukung untuk maju bersama," ujarnya dalam acara penyerahan simbolis.'
    },
    {
        image: 'https://picsum.photos/seed/koperasi2/400/300',
        category: 'Acara',
        title: 'Jadwal Rapat Anggota Tahunan (RAT) Ditetapkan',
        date: '8 Juni 2024',
        excerpt: 'Manajemen Koperasi mengumumkan bahwa Rapat Anggota Tahunan (RAT) untuk tahun buku 2023 akan diselenggarakan pada tanggal 30 Juli 2024...',
        fullContent: 'Manajemen Koperasi mengumumkan bahwa Rapat Anggota Tahunan (RAT) untuk tahun buku 2023 akan diselenggarakan pada tanggal 30 Juli 2024. Seluruh anggota diundang untuk hadir dan memberikan suaranya dalam pengambilan keputusan penting terkait arah kebijakan koperasi di tahun mendatang. Agenda rapat akan mencakup laporan pertanggungjawaban pengurus, rencana kerja, serta pembagian Sisa Hasil Usaha (SHU).'
    },
    {
        image: 'https://picsum.photos/seed/koperasi3/400/300',
        category: 'Edukasi',
        title: 'Tips Mengelola Keuangan Usaha dari Sesi Pelatihan Koperasi',
        date: '5 Juni 2024',
        excerpt: 'Sesi pelatihan manajemen keuangan yang diadakan akhir pekan lalu diikuti oleh puluhan anggota. Berikut adalah beberapa tips utama dari acara tersebut...',
        fullContent: 'Sesi pelatihan manajemen keuangan yang diadakan akhir pekan lalu diikuti oleh puluhan anggota. Dalam acara tersebut, mentor keuangan Budi Santoso berbagi beberapa tips praktis:\n1. Pisahkan rekening pribadi dan usaha.\n2. Buat anggaran bulanan yang realistis.\n3. Catat semua transaksi, sekecil apapun.\n4. Sisihkan keuntungan untuk dana darurat dan pengembangan usaha.\nPara peserta mengaku mendapatkan banyak pencerahan dan siap menerapkan ilmu yang didapat untuk bisnis mereka.'
    }
];


export const MOCK_COURSES_SEARCH = [
    { 
        id: 'course-1',
        title: "Dasar-Dasar Digital Marketing untuk UMKM", 
        category: "Pemasaran", 
    },
    { 
        id: 'course-2',
        title: "Manajemen Keuangan Bisnis Sederhana", 
        category: "Keuangan", 
    },
    { 
        id: 'course-3',
        title: "Teknik Fotografi Produk dengan Smartphone", 
        category: "Kreatif", 
    },
];

export const MOCK_ORDERS: Order[] = [
    { id: 'TGS-001', date: '2024-05-20', customerName: 'Andi Wijaya', total: 50000, status: 'Selesai', items: [{ id: 1, name: 'Bakso Urat Super', quantity: 2, price: 25000 }] },
    { id: 'TGS-002', date: '2024-05-21', customerName: 'Siti Rahayu', total: 36000, status: 'Dikirim', items: [{ id: 2, name: 'Mie Ayam Original', quantity: 2, price: 18000 }] },
    { id: 'TGS-003', date: '2024-05-22', customerName: 'Budi Santoso', total: 43000, status: 'Diproses', items: [{ id: 1, name: 'Bakso Urat Super', quantity: 1, price: 25000 }, { id: 2, name: 'Mie Ayam Original', quantity: 1, price: 18000 }] },
    { id: 'TGS-004', date: '2024-05-19', customerName: 'Dewi Lestari', total: 15000, status: 'Dibatalkan', items: [{ id: 3, name: 'Es Campur Spesial', quantity: 1, price: 15000 }] },
    { id: 'TGS-005', date: '2024-05-23', customerName: 'Rudi Hartono', total: 75000, status: 'Selesai', items: [{ id: 1, name: 'Bakso Urat Super', quantity: 3, price: 25000 }] },
];


// Get current year and month for dynamic dates
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
const yearForNextMonth = currentMonth === 12 ? currentYear + 1 : currentYear;

const pad = (num: number) => num.toString().padStart(2, '0');

export const MOCK_EVENTS: Event[] = [
    {
        id: 1,
        title: "Bazaar UMKM Kreatif Tangsel",
        date: `${currentYear}-${pad(currentMonth)}-15`,
        time: "10:00 - 21:00 WIB",
        location: "Bintaro Jaya Xchange Mall",
        address: "Jl. Sektor VII No.2, Pd. Jaya, Kec. Pd. Aren, Kota Tangerang Selatan",
        category: "Bazaar",
        description: "Temukan produk-produk unik dan kreatif dari UMKM terbaik di Tangerang Selatan. Mulai dari kuliner, fashion, hingga kerajinan tangan. Acara ini juga akan dimeriahkan oleh pertunjukan musik dan workshop gratis.",
        organizer: "Dinas Koperasi dan UKM Tangsel",
        image: "https://picsum.photos/seed/bazaar/800/400",
        registrationLink: "#",
        coordinates: { lat: -6.286, lng: 106.725 }
    },
    {
        id: 2,
        title: "Seminar Digital Marketing 101",
        date: `${currentYear}-${pad(currentMonth)}-22`,
        time: "09:00 - 12:00 WIB",
        location: "Aula Kecamatan Ciputat",
        address: "Jl. Ir H. Juanda No.56, Cireundeu, Kec. Ciputat Tim., Kota Tangerang Selatan",
        category: "Seminar",
        description: "Pelajari dasar-dasar pemasaran digital, mulai dari SEO, media sosial, hingga iklan berbayar. Seminar ini dibawakan oleh praktisi berpengalaman dan cocok untuk pemula.",
        organizer: "Komunitas Pengusaha Muda Tangsel",
        image: "https://picsum.photos/seed/seminar/800/400",
        registrationLink: "#",
        coordinates: { lat: -6.311, lng: 106.760 }
    },
    {
        id: 3,
        title: "Workshop Fotografi Produk dengan Smartphone",
        date: `${currentYear}-${pad(currentMonth)}-28`,
        time: "13:00 - 16:00 WIB",
        location: "Creative Hub BSD",
        address: "The Breeze, Jl. Grand Boulevard BSD, Sampora, Kec. Cisauk, Kabupaten Tangerang",
        category: "Workshop",
        description: "Tingkatkan kualitas foto produk Anda hanya dengan menggunakan kamera smartphone. Workshop ini akan membahas teknik pencahayaan, komposisi, dan editing sederhana untuk hasil yang profesional.",
        organizer: "GoodSkill Tangsel",
        image: "https://picsum.photos/seed/workshop/800/400",
        coordinates: { lat: -6.302, lng: 106.654 }
    },
    {
        id: 4,
        title: "Kumpul Komunitas Pecinta Kopi Tangsel",
        date: `${yearForNextMonth}-${pad(nextMonth)}-05`,
        time: "16:00 - selesai",
        location: "Kopi Senja Tangsel",
        address: "Jl. Bintaro Utama 9, Pd. Pucung, Kec. Pd. Aren, Kota Tangerang Selatan",
        category: "Komunitas",
        description: "Acara santai untuk para pecinta dan pelaku usaha kopi di Tangerang Selatan. Mari berbagi cerita, pengalaman, dan menjalin koneksi baru.",
        organizer: "Kopi Senja Tangsel",
        image: "https://picsum.photos/seed/komunitas/800/400",
        coordinates: { lat: -6.288, lng: 106.715 }
    },
     {
        id: 5,
        title: "Pameran & Kompetisi Masakan Lokal",
        date: `${currentYear}-${pad(currentMonth)}-18`,
        time: "11:00 - 18:00 WIB",
        location: "Teras Kota BSD",
        address: "Jl. Pahlawan Seribu, CBD Lot VII B, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan",
        category: "Bazaar",
        description: "Saksikan kreasi masakan lokal terbaik dari para koki UMKM Tangsel dan cicipi berbagai hidangan lezat. Akan ada kompetisi memasak dengan hadiah menarik.",
        organizer: "Asosiasi Kuliner Tangsel",
        image: "https://picsum.photos/seed/pameran/800/400",
        registrationLink: "#",
        coordinates: { lat: -6.293, lng: 106.664 }
    }
];

const generateSlots = (days: number[], hours: number[]) => {
    const slots: string[] = [];
    const now = new Date();
    days.forEach(dayOffset => {
        hours.forEach(hour => {
            const date = new Date(now);
            date.setDate(now.getDate() + dayOffset);
            date.setHours(hour, 0, 0, 0);
            slots.push(date.toISOString());
        });
    });
    return slots;
};

export const MOCK_MENTORS: Mentor[] = [
    { 
        id: 1,
        name: "Andi Wijaya", 
        expertise: "Pemasaran Digital",
        specialties: ["SEO", "Social Media Ads", "Content Marketing", "Google Analytics"],
        company: "Founder, TUPA Consulting", 
        image: "https://picsum.photos/200/200?random=23",
        bio: "Membantu UMKM tumbuh secara online melalui strategi pemasaran digital yang efektif dan terukur.",
        fullDescription: "Dengan pengalaman lebih dari 10 tahun di industri digital, Andi telah membantu puluhan UMKM meningkatkan omzet mereka hingga 300%. Keahliannya meliputi optimisasi mesin pencari (SEO), iklan berbayar di media sosial, dan pembuatan konten yang menjual.",
        availableSlots: generateSlots([1, 3, 5], [9, 10, 14, 15]),
    },
    { 
        id: 2,
        name: "Siti Rahayu", 
        expertise: "Branding & Strategi", 
        specialties: ["Brand Identity", "Marketing Strategy", "Product Positioning"],
        company: "Brand Strategist, HighYard", 
        image: "https://picsum.photos/200/200?random=24",
        bio: "Spesialis dalam membangun merek yang kuat dan berkesan untuk menjangkau target pasar yang tepat.",
        fullDescription: "Siti adalah seorang ahli strategi merek yang percaya bahwa setiap bisnis, sekecil apapun, berhak memiliki identitas merek yang kuat. Ia akan membimbing Anda dalam menemukan nilai unik bisnis Anda dan menerjemahkannya ke dalam logo, slogan, dan strategi komunikasi yang efektif.",
        availableSlots: generateSlots([2, 4, 6], [10, 11, 13, 14]),
    },
    { 
        id: 3,
        name: "Budi Santoso", 
        expertise: "Keuangan", 
        specialties: ["Laporan Keuangan", "Manajemen Arus Kas", "Perpajakan UMKM", "Akses Pendanaan"],
        company: "Komunitas Pengusaha Tangsel", 
        image: "https://picsum.photos/200/200?random=25",
        bio: "Memberikan solusi praktis untuk manajemen keuangan UMKM agar bisnis lebih sehat dan bankable.",
        fullDescription: "Sebagai akuntan dengan spesialisasi UMKM, Budi memahami tantangan keuangan yang sering dihadapi usaha kecil. Ia dapat membantu Anda membuat laporan keuangan sederhana, mengelola arus kas agar tidak 'besar pasak daripada tiang', hingga menyiapkan dokumen untuk pengajuan pinjaman.",
        availableSlots: generateSlots([1, 2, 7], [9, 11, 15]),
    },
    { 
        id: 4,
        name: "Dewi Lestari", 
        expertise: "Operasional", 
        specialties: ["Manajemen Stok", "Efisiensi Produksi", "Standar Pelayanan", "SOP"],
        company: "Praktisi & Mentor Lokal", 
        image: "https://picsum.photos/200/200?random=26",
        bio: "Fokus pada perbaikan proses bisnis internal untuk meningkatkan efisiensi dan kepuasan pelanggan.",
        fullDescription: "Dewi memiliki pengalaman 15 tahun dalam mengelola operasional bisnis ritel dan kuliner. Ia adalah orang yang tepat untuk diajak berdiskusi tentang cara mengatur stok barang, menata alur kerja di dapur atau workshop, dan menciptakan Standard Operating Procedure (SOP) agar kualitas layanan tetap terjaga.",
        availableSlots: generateSlots([3, 5, 8], [13, 14, 15, 16]),
    },
     { 
        id: 5,
        name: "Rian Hidayat", 
        expertise: "Pemasaran Digital", 
        specialties: ["Email Marketing", "CRM", "Marketplace Optimization"],
        company: "Growth Specialist", 
        image: "https://picsum.photos/200/200?random=27",
        bio: "Ahli dalam mengoptimalkan penjualan di marketplace dan membangun loyalitas pelanggan.",
        fullDescription: "Rian adalah spesialis dalam memaksimalkan potensi platform seperti Tokopedia dan Shopee. Ia akan mengajarkan cara riset kata kunci, membuat judul produk yang menjual, hingga strategi iklan di dalam marketplace. Selain itu, ia juga ahli dalam membangun database pelanggan.",
        availableSlots: generateSlots([2, 4, 7], [10, 11, 16]),
    },
];

export const MENTOR_CATEGORIES: (Mentor['expertise'] | 'Semua Keahlian')[] = [
    'Semua Keahlian', 
    'Pemasaran Digital', 
    'Keuangan', 
    'Branding & Strategi', 
    'Operasional'
];