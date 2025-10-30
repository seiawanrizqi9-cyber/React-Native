# Evaluasi React-Native Day 1

### Soal 1: *Jelaskan definisi Mobile App Development sesuai pemahaman anda beserta fokus utama dan output teknisnya!*

Jawaban: Proses lengkap untuk membuat aplikasi mobile mulai dari merangcang sampai ke pemeliharaanya dengan memanfaatkan fitur perangkat seperti kamera, GPS, notifikasi, hingga proses latar belakang.

- **Fokus utamanya:** pengalaman pengguna yang optimal dalam menjalankan aplikasi serta performa stabil pada perangkat yang beragam.

- **Outpunya:** membuat aplikasi paket rilis untuk android (APK/AAB) dan ios (IPA), sertifikat penandatanganan, konfigurasi izin, dan metadata rilis

### Soal 2: *Bandingkan perbedaan mendasar antara Web Development dan Mobile App Development dalam aspek target eksekusi, distribusi, dan akses hardware. Berikan contoh implikasi praktis dari perbedaan tersebut dalam pengembangan aplikasi sehari-hari.*

- **Target Eksekusi:** Web Development berjalan di browser (DOM) sedangkan Mobile App Development berjalan di runtime native dengan komponen UI native

- **Distribusi:** Web Development melalui URL dan server deploy, sedangkan Mobile App Development melalui Store (Play/App Store) atau sideload/enterprise

- **Akses Hardware:** Web Development terbatas via API browser, sedangkan Mobile App Development memiliki akses luas ke kamera, GPS, sensor, dan background tasks

**Implikasi Praktis:** Mobile menuntut pengelolaan izin, penanganan jaringan fluktuatif, optimasi konsumsi baterai/memori, dan proses rilis yang tunduk pada kebijakan toko aplikasi.

### Soal 3: *Uraikan tahapan Discovery & Requirement dalam siklus hidup aplikasi mobile. Bagaimana tahap ini memengaruhi keputusan target platform (Android/iOS) dan kebutuhan offline/online?*

1. Mengidentifikasi masalah bisnis dan menentukan target platform berdasarkan audiens & pasar.

2. Mendefinisikan use-case inti, alur pengguna, dan kebutuhan fungsional (seperti dukungan offline/online).

**Bagaimana tahap ini bisa mempengaruhi keputusan target:** Analisis risiko awal dan prioritas fitur. Tahap ini secara langsung memengaruhi keputusan platform dan kebutuhan offline/online, **karena kita harus tahu terlebih dahulu apa yang perlu kita siapkan sebelum mulai membuatnya, agar kita bisa membuat aplikasi yang sesuai dengan kebutuhan user.**

### Soal 4: *Deskripsikan tahapan Perancangan Arsitektur & Teknologi dalam Mobile App Development, khususnya dalam konteks React Native sesuai pemahaman anda. Mengapa pemilihan strategi state management dan navigasi menjadi krusial di tahap ini?*

**Untuk tahap perancangan Arsitektur & Teknologi:**

1. Menentukan pendekatan pengembangan (cross-platform native) dan struktur modul aplikasi.

2. Merancang strategi manajemen state, pola navigasi (stack/tab), serta mekanisme penanganan error dan logging.

**Mengapa pemilihan strategi state management dan navigasi menjadi krusial:** *karena untuk memastikan skalabilitas, keandalan, dan mendukung maintainability aplikasi dalam jangka panjang.*

### Soal 5: *Jelaskan perbedaan antara pendekatan Native Development dan Hybrid Development dalam pengembangan aplikasi mobile. Sertakan keuntungan serta kekurangan masing-masing, dan berikan contoh framework yang relevan selain dari yang telah disampaikan di materi.*

**Perbedaan antara Native Development dan Hybrid Development:**

**Native Development:** *Pembangunan aplikasi menggunakan bahasa dan tools khusus platform (Kotlin/Java dengan Android Studio untuk Android; Swift/Objective-C dengan Xcode untuk iOS)*

- **Keuntungan:**
    - Performa maksimal karena akses langsung ke hardware dan API
    - Pengalaman pengguna paling otentik dan selaras dengan panduan desain platform
    - Kemampuan debugging mendalam dan dukungan komunitas platform resmi

- **Kekurangan:**
    - Memerlukan dua codebase terpisah untuk Android dan iOS
    - Pemeliharaan sulit untuk fitur cross-platform
    - Kurva belajar tinggi untuk developer baru

**Hybrid Development:** *Penggabungan teknologi web (HTML, CSS, JavaScript) dalam wadah aplikasi native melalui komponen WebView*

- **Keuntungan:**
    - Satu codebase untuk multi-platform
    - Mudah bagi developer web untuk bertransisi
    - Biaya rendah untuk maintenance

- **Kekurangan:**
    - Performa lebih rendah karena ketergantungan WebView
    - Pengalaman pengguna kurang native
    - Akses hardware terbatas dan bergantung plugin

**Contoh framework:** Apache Cordova, Ionic, PhoneGap

### Soal 6: *Apa yang dimaksud dengan Cross-Platform Native Development? Bandingkan keuntungan dan kekurangannya dengan pendekatan native.*

**Cross-Platform Native Development adalah** *Pendekatan pengembangan menggunakan satu basis kode tunggal yang dirender menjadi komponen UI native asli untuk setiap platform tanpa bergantung pada WebView.*

- **Keuntungan:**
    - Satu codebase menghasilkan UI native
    - Skalabilitas tinggi untuk tim, dengan komunitas besar dan library siap pakai
    - Fleksibilitas untuk kustomisasi platform-spesifik tanpa rewrite total

- **Kekurangan:**
    - Overhead bridge dapat menimbulkan bottleneck pada operasi intensif
    - Debugging lebih kompleks karena melibatkan dua layer (JS dan native)
    - Potensi inkonsistensi UI jika tidak dikelola dengan baik

### Soal 7: *Posisikan React Native dalam ekosistem pengembangan aplikasi mobile. Bagaimana React Native berbeda dari ReactJS dalam hal target, sintaks dasar, dan styling?*

**React Native** adalah framework cross-platform native yang memungkinkan pembangunan aplikasi mobile dengan filosofi dan sintaks mirip ReactJS.

**Perbedaan React Native dengan ReactJS:**
- **Target:** ReactJS target DOM, sedangkan React Native target komponen UI native (View, Text, Image)
- **Sintaks Dasar:** Sama-sama menggunakan JSX atau TSX
- **Styling:** ReactJS menggunakan CSS atau Tailwind, sedangkan React Native menggunakan JavaScript Objects (StyleSheet)

### Soal 8: *Analisis tantangan utama dalam pengembangan aplikasi mobile dibandingkan dengan web. Bagaimana pendekatan cross-platform seperti React Native mengatasi tantangan ini?*

**Tantangan utama dari mobile development:**

- Pengelolaan izin
- Penanganan jaringan yang fluktuatif
- Optimasi konsumsi baterai/memori
- Proses rilis yang tunduk pada kebijakan toko aplikasi

**Cara React Native mengatasinya:**

- Menyediakan akses native melalui bridge
- Satu codebase untuk multi-platform mengurangi kompleksitas
- Komunitas besar menyediakan library untuk tantangan mobile-specific

### Soal 9: *Uraikan tahapan Pengujian dan Build, Signing, serta Release dalam Mobile App Development menggunakan React Native!*

**Tahapannya:**

1. Melakukan pengujian unit untuk memverifikasi fungsi individu
2. pengujian snapshot untuk kestabilan UI.
3. Melaksanakan pengujian end-to-end di lingkungan simulasi dan perangkat nyata, serta pengujian manual untuk skenario penggunaan beragam.
4. Menyiapkan paket rilis yang aman melalui proses signing dan enkripsi.
5. Mengonfigurasi metadata aplikasi
6. memvalidasi kepatuhan terhadap standar keamanan serta regulasi platform.

### Soal 10: *Berdasarkan penjelasan diatas, jelaskan kenapa React native menjadi pilihan dalam development application mobile saat ini?*

**React Native menjadi pilihan karena:**

- Satu codebase menghasilkan UI native, mendekati performa native dengan biaya rendah
- Skalabilitas tinggi untuk tim, dengan komunitas besar dan library siap pakai
- Fleksibilitas untuk kustomisasi platform-spesifik tanpa rewrite total
- Pendekatan "learn once, write anywhere" yang efisien untuk waktu rilis cepat

