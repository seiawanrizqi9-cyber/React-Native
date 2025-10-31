## **Evaluasi Harian Hari ke-2 – Pengenalan React Native & Setup Environment**

### **1. Konsep Dasar React Native dan Peran New Architecture**
React Native adalah framework open-source buatan Meta yang digunakan untuk membangun aplikasi mobile **cross-platform** (Android dan iOS) menggunakan **JavaScript** atau **TypeScript**. Framework ini menggunakan prinsip **komponen dan state management** seperti React di web, namun perbedaannya terletak pada **cara render-nya**.
Jika React web merender ke **DOM (HTML & CSS)**, maka React Native merender ke **komponen native** seperti `View`, `Text`, atau `Button`. Hal ini membuat aplikasi terasa dan berperforma seperti aplikasi native asli.

Pada versi **React Native v0.80**, diperkenalkan **New Architecture** dengan sistem **JavaScript Interface (JSI)** yang menggantikan *bridge* lama. Arsitektur baru ini membuat komunikasi antara JavaScript dan native code menjadi lebih cepat dan efisien. Dampaknya, performa aplikasi meningkat signifikan, terutama pada operasi berat seperti animasi dan gesture, karena latency komunikasi berkurang hingga 50%.

---

### **2. Perbandingan React Native CLI dan Expo**
React Native CLI dan Expo adalah dua cara utama untuk membangun aplikasi React Native.
**React Native CLI** menghasilkan proyek dengan **akses penuh ke kode native** (folder `android/` dan `ios/`), sehingga developer dapat melakukan modifikasi mendalam pada level sistem. Sedangkan **Expo** menyediakan **managed workflow**, di mana kode native disembunyikan agar setup menjadi lebih sederhana dan cepat.

Proses build pada CLI dilakukan secara lokal menggunakan **Gradle (Android)** atau **Xcode (iOS)**, sedangkan Expo memungkinkan build melalui **cloud (EAS Build)** atau menjalankan langsung lewat aplikasi **Expo Go** tanpa kompilasi.

Kelebihan React Native CLI adalah fleksibilitas tinggi untuk membuat modul native custom, namun kekurangannya adalah setup yang cukup kompleks dan rawan error versi. Sementara itu, Expo memiliki keunggulan dalam kemudahan setup dan kecepatan pengujian, tetapi memiliki batasan akses ke kode native.
Contohnya, proyek **e-commerce besar dengan integrasi Bluetooth atau kamera custom** lebih cocok menggunakan **CLI**, sedangkan **prototipe atau aplikasi sederhana** lebih efisien dikembangkan menggunakan **Expo**.

---

### **3. Peran SDK Platforms, Build Tools, dan Platform Tools**
Dalam setup environment Android, terdapat tiga komponen utama yang wajib diinstal agar React Native dapat berjalan dengan benar, yaitu **SDK Platforms**, **Build Tools**, dan **Platform Tools**.

* **SDK Platforms (android-35)** menyediakan pustaka API Android 15 yang diperlukan untuk mengkompilasi aplikasi dengan fitur OS terbaru. Tanpanya, build akan gagal karena target SDK tidak ditemukan.
* **Build Tools (35.0.0)** berisi alat penting seperti *aapt2*, *apksigner*, dan *zipalign* yang digunakan dalam proses kompilasi dan penandatanganan APK. Jika tidak tersedia, proses Gradle akan berhenti karena alat build tidak ditemukan.
* **Platform Tools** berisi *adb (Android Debug Bridge)* yang digunakan untuk menginstal dan menjalankan aplikasi di emulator atau perangkat fisik. Jika hilang, VS Code tidak dapat berkomunikasi dengan emulator, dan aplikasi tidak bisa dijalankan.

Ketiga komponen ini bekerja sama memastikan proses build, debugging, dan deployment berjalan lancar.

---

### **4. Prasyarat Umum Setup React Native CLI v0.80**
Beberapa alat utama yang wajib disiapkan sebelum memulai proyek React Native CLI antara lain **Node.js**, **Watchman**, dan **Yarn**.
**Node.js** berfungsi sebagai runtime JavaScript yang menjalankan Metro Bundler untuk menggabungkan kode JavaScript menjadi bundle yang dapat dijalankan di platform native. **Watchman**, yang dikembangkan oleh Meta, berfungsi memantau perubahan file agar fitur **Hot Reloading** berjalan otomatis tanpa restart aplikasi. **Yarn** digunakan sebagai manajer paket alternatif dari npm yang lebih cepat dan stabil, terutama untuk proyek besar atau monorepo.

Ketiga tools ini berperan penting dalam menjembatani eksekusi kode JavaScript ke native runtime dan memastikan proses pengembangan berjalan efisien.

---

### **5. Struktur Folder Proyek React Native CLI**
Struktur folder standar React Native CLI terdiri dari beberapa bagian utama, yaitu:

* **android/**: berisi kode native Android, file Gradle, dan konfigurasi build.
* **ios/**: berisi kode native iOS (Swift/Objective-C) dan file Xcode project.
* **src/** (opsional): tempat kode utama React (komponen, screens, assets).
* **App.js**: komponen utama aplikasi yang merender tampilan ke layar.
* **index.js**: entry point yang menghubungkan React ke lapisan native.
* **metro.config.js**: mengatur proses bundling JavaScript oleh Metro Bundler.
* **package.json**: menyimpan daftar dependensi dan script proyek.

Struktur ini memisahkan dengan jelas antara bagian **native** dan **JavaScript**, sehingga memungkinkan **pengembangan lintas platform** (satu kode untuk Android dan iOS). Di sisi lain, pengorganisasian ini juga memudahkan navigasi di VS Code, karena developer cukup fokus pada file JavaScript tanpa sering mengubah bagian native.
