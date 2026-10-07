---
title: "Dari Server Rumahan ke Platform Multi-Aplikasi: Ubuntu, Docker, dan CI/CD"
slug: "studi-kasus-ubuntu-server-docker-cicd"
description: "Studi kasus Ubuntu Server multi-aplikasi: arsitektur visual, Docker, CI/CD GitHub Actions, penerapan security, monitoring, serta backup dan uji restore PostgreSQL."
author: "Khairul Abdi"
updated_at: "2026-09-03"
language: "id"
category: "Studi Kasus Nyata"
tab_label: "Server & DevOps"
tags:
  - Ubuntu Server
  - Docker
  - CI/CD
  - GitHub Actions
  - PostgreSQL
  - Cloudflare Tunnel
  - Tailscale
  - Monitoring
  - Server Security
  - Nginx
  - PHP
  - Node.js
cta_label: "Konsultasi server rumahan via WhatsApp"
cta_target: "https://wa.me/6285358316708?text=Halo%20Khairul%2C%20saya%20ingin%20konsultasi%20membuat%20server%20rumahan%20untuk%20aplikasi%2Fwebsite.%20Bisa%20dibantu%20diskusi%20kebutuhan%20server%2C%20Docker%2C%20CI%2FCD%2C%20backup%2C%20monitoring%2C%20dan%20security%3F"
---

<!--
Catatan integrasi website, tidak untuk ditampilkan sebagai isi artikel:
- Gunakan front matter sebagai metadata dan body Markdown sebagai satu halaman/tab artikel.
- Body menggunakan heading, tabel GFM, tautan, dan fenced code block.
- Berikan ID heading berbasis slug agar daftar isi dan CTA internal bekerja.
- Empat diagram memakai gambar PNG pada assets/ubuntu-server; versi SVG disertakan untuk pembesaran dan editing. Tidak memerlukan renderer Mermaid.
- Pertahankan direktori assets relatif terhadap artikel, atau sesuaikan URL gambar saat diintegrasikan ke website.
- Tampilkan gambar dengan max-width: 100%; height: auto; dan sediakan tautan pembesaran pada layar kecil. Jangan gunakan crop/object-fit: cover untuk diagram.
- Hindari menampilkan judul ganda jika template sudah merender title dari front matter.
- Sanitasi HTML hasil render. Jangan menyisipkan log mentah, token, alamat administrasi privat, atau file .env.
- Hubungkan bagian Diskusi Proyek ke formulir kontak milik portfolio saat integrasi.
-->

# Dari Server Rumahan ke Platform Multi-Aplikasi: Ubuntu, Docker, dan CI/CD

**Oleh Khairul Abdi · Catatan implementasi Agustus–September 2026**

Website yang berhasil dibuka adalah awal. Tantangan berikutnya adalah memastikan pembaruan bisa dilakukan dengan teratur, database dapat dipulihkan, file upload tidak hilang ketika container diganti, dan gangguan bisa diketahui tanpa menunggu laporan pengguna.

Dalam proyek ini, saya membangun lingkungan Ubuntu Server untuk menjalankan beberapa aplikasi dengan kebutuhan berbeda. Ada frontend Next.js, backend Laravel dengan dashboard Filament, PostgreSQL, reverse proxy, dan layanan monitoring. Semuanya dijalankan pada satu mesin dengan sumber daya terbatas dan koneksi internet rumah di belakang CGNAT.

Hasilnya bukan hanya aplikasi yang dapat diakses dari luar jaringan. Saya juga menyiapkan proses CI/CD dengan deployment manual melalui GitHub, pencatatan versi image, backup terjadwal ke HDD, pengujian restore terpisah, dan notifikasi monitoring melalui Telegram.

Artikel ini menjelaskan prosesnya: apa yang saya bangun, masalah yang benar-benar muncul, cara saya menelusurinya, dan pelajaran yang dapat diterapkan pada kebutuhan server lain.

> Ini merupakan studi kasus implementasi pribadi, bukan klaim sistem high availability, audit keamanan menyeluruh, atau jaminan uptime tertentu. Status yang dijelaskan berasal dari konfigurasi dan hasil pengujian yang tercatat, bukan pemeriksaan layanan secara langsung saat artikel dibaca. Detail akses privat dan kredensial tidak dipublikasikan.

## Ingin membuat server rumahan sendiri?

Butuh server rumahan untuk menjalankan website, dashboard, database, backup otomatis, monitoring, dan deployment yang lebih rapi? Saya dapat membantu menyiapkan Ubuntu Server, Docker, domain HTTPS, CI/CD, akses privat, backup database terjadwal, cleanup image Docker terjadwal, serta baseline security sesuai kebutuhan aplikasi Anda.

**Konsultasi langsung via WhatsApp:** [Hubungi 085358316708](https://wa.me/6285358316708?text=Halo%20Khairul%2C%20saya%20ingin%20konsultasi%20membuat%20server%20rumahan%20untuk%20aplikasi%2Fwebsite.%20Bisa%20dibantu%20diskusi%20kebutuhan%20server%2C%20Docker%2C%20CI%2FCD%2C%20backup%2C%20monitoring%2C%20dan%20security%3F)

Pesan awal sudah otomatis terisi agar diskusi bisa langsung masuk ke kebutuhan server, aplikasi, backup, monitoring, dan keamanan.

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin:28px 0 10px;">
  <img src="https://cdn.simpleicons.org/ubuntu/E95420" alt="Ubuntu Server" title="Ubuntu Server" width="42" height="42">
  <img src="https://cdn.simpleicons.org/docker/2496ED" alt="Docker" title="Docker" width="42" height="42">
  <img src="https://cdn.simpleicons.org/githubactions/2088FF" alt="CI/CD" title="CI/CD" width="42" height="42">
  <img src="https://cdn.simpleicons.org/githubactions/2088FF" alt="GitHub Actions" title="GitHub Actions" width="42" height="42">
  <img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" title="PostgreSQL" width="42" height="42">
  <img src="https://cdn.simpleicons.org/cloudflare/F38020" alt="Cloudflare Tunnel" title="Cloudflare Tunnel" width="42" height="42">
  <img src="https://cdn.simpleicons.org/tailscale/242424" alt="Tailscale" title="Tailscale" width="42" height="42">
  <img src="https://cdn.simpleicons.org/uptimekuma/5CDD8B" alt="Monitoring" title="Monitoring" width="42" height="42">
  <img src="https://cdn.simpleicons.org/letsencrypt/003A70" alt="Server Security" title="Server Security" width="42" height="42">
  <img src="https://cdn.simpleicons.org/nginx/009639" alt="Nginx" title="Nginx" width="42" height="42">
  <img src="https://cdn.simpleicons.org/cloudflare/F38020" alt="Cloudflare" title="Cloudflare" width="42" height="42">
  <img src="https://cdn.simpleicons.org/termius/000000" alt="Termius" title="Termius" width="42" height="42">
  <img src="https://cdn.simpleicons.org/php/777BB4" alt="PHP" title="PHP" width="42" height="42">
  <img src="https://cdn.simpleicons.org/nodedotjs/5FA04E" alt="Node.js" title="Node.js" width="42" height="42">
</div>

## Tech stack yang digunakan

Stack ini dipilih untuk kebutuhan server rumahan yang tetap operasional: aplikasi berjalan dalam container, rilis dikontrol lewat pipeline, database punya jadwal backup, storage dijaga dengan cleanup berkala, dan akses administrasi dipisahkan dari akses publik.

## Ringkasan hasil

| Area | Hasil yang tercatat | Manfaat praktis |
| --- | --- | --- |
| Publikasi aplikasi | Website dapat diakses melalui domain HTTPS; akses dari jaringan seluler turut diuji | Pengunjung tidak perlu berada di jaringan rumah |
| Multi-aplikasi | GreetingCard, frontend Masjid, dan backend Masjid dijalankan dalam container terpisah | Runtime dan konfigurasi aplikasi lebih mudah dikelola |
| Akses administrasi | SSH dan akses database menggunakan Tailscale | Port administrasi tidak perlu dibuka langsung ke internet |
| CI/CD | Pemeriksaan CI dan deployment manual GitHub berhasil untuk tiga repository aplikasi | Pembaruan mengikuti prosedur yang dapat diulang |
| Pelacakan versi | Deployment mencatat commit, image, waktu deploy, dan hasil pemeriksaan publik | Versi yang berjalan lebih mudah ditelusuri |
| Backup database | Backup terjadwal ke HDD dan checksum tersedia | Ada salinan data dengan retensi yang jelas |
| Uji pemulihan | Backup Masjid berhasil direstore ke PostgreSQL pengujian yang terpisah | Backup tidak hanya dibuat, tetapi pernah dibuktikan dapat dibaca kembali |
| Monitoring | Uptime Kuma, healthcheck, dan notifikasi Telegram dikonfigurasi | Kondisi aplikasi dan infrastruktur dapat diamati |
| Pemeliharaan storage | Rotasi log Docker serta cleanup image/build cache terjadwal disiapkan | Pertumbuhan pemakaian disk lebih terkendali |

## Daftar isi

1. [Konteks dan batasan awal](#konteks-dan-batasan-awal)
2. [Arsitektur yang saya bangun](#arsitektur-yang-saya-bangun)
3. [Tahapan setup](#tahapan-setup)
4. [Troubleshooting berdasarkan bukti](#troubleshooting-berdasarkan-bukti)
5. [Alur CI/CD dan migration database](#alur-cicd-dan-migration-database)
6. [Penyimpanan, backup, dan uji restore](#penyimpanan-backup-dan-uji-restore)
7. [Monitoring dan pemeliharaan](#monitoring-dan-pemeliharaan)
8. [Penerapan security dan batas kepercayaan](#penerapan-security-dan-batas-kepercayaan)
9. [Eksperimen Open WebUI dan AI lokal](#eksperimen-open-webui-dan-ai-lokal)
10. [Bukti hasil dan batasannya](#bukti-hasil-dan-batasannya)
11. [Pengembangan berikutnya](#pengembangan-berikutnya)
12. [Layanan yang bisa saya bantu](#layanan-yang-bisa-saya-bantu)
13. [Diskusi proyek](#diskusi-proyek)

## Konteks dan batasan awal

Mesin yang digunakan memiliki prosesor Intel Core i3-5005U, RAM 8 GB, SSD 500 GB, dan HDD 1 TB. Sistem operasinya Ubuntu Server 24.04 LTS.

Kebutuhannya cukup jelas:

- Menjalankan beberapa website dan aplikasi pada satu server.
- Membuka website ke publik tanpa mengandalkan port forwarding dari router.
- Mengakses server dari luar jaringan untuk administrasi.
- Memisahkan kode aplikasi, konfigurasi rahasia, database, dan file upload.
- Membuat proses deployment yang lebih teratur daripada menjalankan perintah berbeda setiap kali ada perubahan.
- Menjaga penggunaan storage agar image dan log tidak terus menumpuk.

Koneksi rumah menggunakan CGNAT, sehingga koneksi masuk langsung bukan pilihan yang praktis. Saya memisahkan jalur untuk pengunjung website dari jalur untuk administrator: Cloudflare Tunnel untuk layanan web publik, Tailscale untuk akses privat.

Docker Compose dipilih karena kebutuhan awal masih dapat dikelola pada satu host. Pada tahap ini, menambah cluster atau Kubernetes belum menjadi kebutuhan yang terbukti.

**Ukuran keberhasilan proyek bukan banyaknya tools yang terpasang, melainkan apakah aplikasi bisa dijalankan, diperbarui, diperiksa, dan dipulihkan dengan prosedur yang dipahami.**

## Arsitektur yang saya bangun

### Jalur pengunjung dan komunikasi aplikasi

![Arsitektur Ubuntu Server: jalur publik Cloudflare dan Nginx menuju aplikasi, serta jalur privat Tailscale menuju SSH, Uptime Kuma, dan PostgreSQL.](assets/ubuntu-server/01-arsitektur-server.png)

*Gambar 1. Jalur publik dan administrasi dipisahkan. Panah menunjukkan jalur request/akses, bukan arah pembentukan tunnel.* [Buka diagram SVG](assets/ubuntu-server/01-arsitektur-server.svg).

Cloudflared membentuk koneksi tunnel dari server ke Cloudflare. Nginx menerima trafik dari tunnel dan memilih aplikasi berdasarkan hostname. Backend dan frontend berkomunikasi melalui jaringan Docker internal, tanpa harus mengakses domain publik untuk setiap panggilan server-to-server.

Jaringan Docker mempermudah komunikasi antarlayanan, tetapi bukan pengganti autentikasi API. Hak akses tetap diperiksa oleh aplikasi.

### Pembagian domain

| Alamat | Tujuan |
| --- | --- |
| [greetingcard.id](https://greetingcard.id) dan [www.greetingcard.id](https://www.greetingcard.id) | Website GreetingCard |
| [masdjidalfurqon.com](https://masdjidalfurqon.com) | Landing page Masjid Al Furqon |
| [www.masdjidalfurqon.com](https://www.masdjidalfurqon.com) | Redirect ke domain utama Masjid |
| [dashboard.masdjidalfurqon.com/admin](https://dashboard.masdjidalfurqon.com/admin) | Dashboard administrasi Filament |
| `dashboard.masdjidalfurqon.com/api` | Prefix endpoint API Laravel, bukan halaman dashboard |
| [dashboard.masdjidalfurqon.com/up](https://dashboard.masdjidalfurqon.com/up) | Endpoint health aplikasi Laravel |

Dashboard sebelumnya menggunakan subdomain `admin`, lalu dipindahkan ke `dashboard`. Perubahan ini mencakup routing, konfigurasi URL aplikasi, dan referensi yang digunakan frontend; mengganti DNS saja tidak selalu cukup.

### Jalur administrasi

Laptop administrator terhubung melalui Tailscale untuk SSH, akses PostgreSQL, dan dashboard Uptime Kuma. Layanan privat tersebut tidak dipublikasikan sebagai website bebas akses.

Nginx dan PostgreSQL memiliki binding host pada loopback untuk kebutuhan konfigurasi ini. Akses database jarak jauh menggunakan jalur Tailscale yang telah dikonfigurasi, bukan port database publik.

## Tahapan setup

### 1. Menyiapkan sistem dan penyimpanan

Saya memulai dari pembaruan Ubuntu, pemeriksaan layanan, pemasangan HDD, dan validasi mount. SSD dipakai untuk sistem, aplikasi, image Docker, dan database aktif. HDD yang dipasang pada `/data` digunakan untuk file aplikasi berukuran besar dan backup.

Pemeriksaan seperti `findmnt`, `df`, dan `free` membantu membedakan kapasitas disk, penggunaan RAM, serta cache sistem. Sebuah direktori bernama `/data` belum membuktikan bahwa penulisan benar-benar masuk ke HDD; mount-nya harus diperiksa.

### 2. Menyiapkan akses privat

Tailscale dipasang di Ubuntu dan perangkat administrator. Pengujian dilakukan bertahap: konektivitas antarperangkat, port SSH, kemudian autentikasi.

Salah satu pelajaran awalnya adalah membedakan SSH yang tidak terjangkau dari Tailscale SSH yang meminta verifikasi identitas tambahan. Keduanya menghasilkan pengalaman “tidak bisa masuk”, tetapi penanganannya berbeda.

Firewall host juga dikonfigurasi untuk membatasi akses masuk. Karena Docker memiliki aturan jaringan sendiri, pemeriksaan keamanan tidak berhenti pada tampilan status UFW; binding port dan aturan forwarding turut diperhatikan.

### 3. Membuat aplikasi dapat dijalankan melalui Docker

Backend Masjid menggunakan Laravel 11, Filament 3, Apache, dan PHP 8.4 pada build yang berhasil diuji. PostgreSQL menjadi database aplikasi.

Frontend Masjid serta GreetingCard menggunakan Next.js. Konfigurasi `output: "standalone"` menjadi bagian penting untuk menyediakan runtime yang dibutuhkan image produksi.

Pekerjaan containerisasi meliputi:

- Dockerfile dan `.dockerignore` yang sesuai dengan alur build.
- Dependency PHP dan ekstensi yang dibutuhkan aplikasi.
- Konfigurasi Apache untuk direktori `public` Laravel.
- Pemisahan proses build dan runtime pada aplikasi yang menggunakan multi-stage build.
- Penggunaan user non-root pada runtime frontend.
- Persistent storage agar file aplikasi tidak hanya hidup di writable layer container.

Tujuannya adalah mengurangi ketergantungan pada konfigurasi manual host, sambil tetap memperhatikan bahwa image harus diperbarui dan diuji secara berkala.

### 4. Memisahkan environment dan secret

Konfigurasi backend dan frontend disimpan terpisah dari kode repository. Permission file environment dibatasi, dan nilai rahasia tidak dimasukkan ke Git.

Ada perbedaan penting antara konfigurasi saat build dan saat aplikasi berjalan:

- Pada Next.js, variabel `NEXT_PUBLIC_*` yang direferensikan untuk browser dapat tertanam dalam bundle ketika build. Mengganti file environment lalu menjalankan restart saja tidak memperbarui bundle tersebut.
- Variabel server-side dapat dibaca saat runtime apabila implementasinya memang demikian. Rendering statis dapat membuat sebagian hasil ditentukan lebih awal, saat build.
- Pada Laravel, cache konfigurasi perlu diperbarui sesuai perubahan environment.

BuildKit secret digunakan untuk memberikan konfigurasi kepada proses build frontend. File secret mount tidak otomatis menjadi layer image, tetapi kode build tetap dapat menyalin atau memasukkan nilainya ke output. Karena itu, penggunaan BuildKit secret tidak mengubah secret menjadi aman untuk dipublikasikan.

Perubahan isi secret juga tidak otomatis membatalkan cache build. Ketika perubahan environment harus masuk ke hasil build, proses build perlu memastikan langkah terkait benar-benar dijalankan ulang.

### 5. Menghubungkan domain dan reverse proxy

Domain yang dibeli melalui registrar tidak harus dipindahkan registrasinya. Pada implementasi ini, pengelolaan DNS dihubungkan ke Cloudflare dengan mengganti nameserver sesuai penugasan Cloudflare.

Record email seperti MX, SPF, dan DKIM tetap diperhatikan agar publikasi website tidak merusak layanan lain. Setelah itu, hostname pada tunnel dan konfigurasi Nginx diselaraskan.

Pengujian mencakup domain utama, `www`, dashboard, redirect, dan endpoint health. Pemeriksaan dari server dilengkapi dengan percobaan akses melalui jaringan luar.

### 6. Memvalidasi aplikasi sebelum otomatisasi

Sebelum membuat pipeline deployment, saya memastikan aplikasi dapat dibuild dan dijalankan secara manual dengan prosedur yang diketahui:

1. Periksa konfigurasi Compose.
2. Build image dan uji runtime.
3. Periksa koneksi database serta status migration.
4. Jalankan aplikasi dan periksa healthcheck.
5. Uji domain publik dan fungsi yang relevan.

Langkah ini membantu agar CI/CD mengotomatisasi proses yang sudah dipahami, bukan menyembunyikan masalah setup dasar.

## Troubleshooting berdasarkan bukti

Bagian paling berharga dari proyek ini adalah menelusuri kegagalan pada lapisan yang tepat. Pesan error di browser belum tentu berasal dari frontend, dan respons HTTP yang berhasil belum tentu berarti seluruh fungsi bisnis berjalan.

### Kasus 1 — Host bisa mengakses internet, container mengalami timeout

Gejala awal muncul saat mengambil paket Debian dan mengakses API Telegram. Koneksi dari host berhasil, tetapi koneksi dari container bridge gagal. Pengujian dengan host networking berhasil, sehingga arah investigasi berpindah ke jalur jaringan container.

Saya memeriksa resolusi DNS, mencoba alamat tujuan tanpa bergantung pada DNS, membandingkan jalur network, lalu melihat forwarding, NAT, connection tracking, dan packet capture.

Bukti yang paling menentukan adalah paket balasan TCP tiba di interface host dengan **TTL 1**. Paket tersebut dapat diterima oleh host sebagai tujuan akhir, tetapi tidak dapat diteruskan lagi ke container karena TTL akan habis.

Penelusuran menemukan aturan MikroTik yang mengubah TTL trafik menuju jaringan tertentu menjadi 1. Pada router yang dikelola untuk lingkungan ini, aturan tersebut diberi pengecualian bagi server, tanpa mengubah kebijakan untuk seluruh klien jaringan.

Setelah pengecualian diterapkan dan workaround sementara di Ubuntu dilepas, container berhasil mengakses Telegram serta repository Debian. Notifikasi Telegram juga kemudian berhasil dikirim.

**Pelajaran:** masalah ini tidak selesai hanya dengan mengganti DNS, menambah aturan allow firewall, atau restart Docker. Akar masalah ditemukan dari perilaku paket. Perubahan kebijakan router harus dilakukan oleh pihak yang berwenang dan sesuai aturan jaringan.

### Kasus 2 — Dependency PHP tidak sesuai image

Composer menolak instalasi karena beberapa dependency yang terkunci membutuhkan versi PHP lebih tinggi daripada image yang sedang digunakan.

Saya menyelaraskan versi PHP image dengan kebutuhan `composer.lock`, lalu memeriksa versi Laravel dan ekstensi PHP dari dalam container. Pendekatannya bukan mengabaikan platform requirement agar build terlihat hijau.

**Pelajaran:** lockfile, versi runtime, dan ekstensi merupakan satu kesatuan. Mengubah dependency secara massal pada server bukan langkah pertama untuk menyelesaikan ketidakcocokan runtime.

### Kasus 3 — Route Laravel ada, tetapi `/up` menghasilkan 404

Daftar route Laravel menampilkan `/up`. Namun, permintaan ke `/up` mendapatkan halaman 404 dari Apache, sedangkan `/index.php/up` berhasil.

Perbedaan ini menunjukkan bahwa aplikasi dapat menerima request melalui front controller, tetapi penulisan ulang URL belum bekerja. Pemeriksaan berikutnya menemukan file `.htaccess` yang belum tersedia pada lokasi yang diperlukan. Konfigurasi rewrite kemudian dimasukkan ke repository dan image.

**Pelajaran:** bedakan respons web server dari respons framework sebelum mengubah controller atau route.

### Kasus 4 — HTTPS berubah menjadi HTTP saat redirect login

Domain dapat dibuka melalui HTTPS, tetapi respons redirect dashboard sempat menghasilkan URL HTTP.

Konfigurasi reverse proxy, header forwarded, trusted proxy Laravel, dan URL aplikasi perlu konsisten. Setelah perbaikan, redirect ke halaman login kembali menggunakan HTTPS.

**Pelajaran:** terminasi TLS di depan aplikasi harus disertai penyampaian informasi skema yang benar. Hanya proxy yang dipercaya yang boleh menentukan header tersebut.

### Kasus 5 — API bisa diuji dengan curl, tetapi frontend belum menampilkan data

Pemeriksaan preflight mendapatkan respons, dan request login dengan data tidak valid menghasilkan error validasi aplikasi. Itu menunjukkan sebagian jalur HTTP bekerja, bukan bukti bahwa seluruh integrasi frontend sudah benar.

Pengujian dari dalam container frontend kemudian memperlihatkan timeout saat memanggil domain publik. Environment diperbaiki dan komunikasi server-to-server diarahkan melalui nama service Docker. Data akhirnya tampil pada website.

**Pelajaran:** bedakan request dari browser dengan request dari server Next.js. CORS adalah aturan browser; ia tidak menjelaskan semua kegagalan fetch server-side. Respons preflight dengan wildcard juga bukan bukti konfigurasi cocok untuk request yang membawa cookie.

### Kasus 6 — Password database, role, dan cache konfigurasi

Error autentikasi PostgreSQL diikuti temuan bahwa role aplikasi belum tersedia. Setelah role, database, hak akses, dan environment diselaraskan, Laravel dapat berkomunikasi dengan database dan memeriksa migration.

Database dengan persistent volume juga memiliki keadaan yang berbeda dari environment container. Mengubah `POSTGRES_PASSWORD` pada Compose tidak otomatis mengganti password role dalam database yang sudah diinisialisasi.

**Pelajaran:** periksa user database yang sebenarnya, bukan hanya isi file konfigurasi. Hindari menghapus volume untuk menyelesaikan kesalahan autentikasi.

### Kasus 7 — CI gagal meskipun build lokal pernah berhasil

Beberapa kegagalan muncul karena environment runner bersih mengungkap ketergantungan pada file lokal:

- Dockerfile belum tersedia pada commit yang sedang dibuild.
- Konfigurasi standalone Next.js belum ikut masuk Git.
- Folder cache dan view Laravel belum dibuat sebelum script Composer memulai boot aplikasi.
- Validasi Composer strict gagal karena metadata project belum lengkap.
- File seeder yang dipanggil tidak tersedia pada versi kode dalam image.

Saya memperbaiki sumber dan urutan setup, lalu menjalankan pemeriksaan kembali. Untuk metadata lisensi, nilai yang dipilih harus sesuai hak penggunaan project, bukan sekadar agar validasi lolos.

**Pelajaran:** file yang ada di server belum tentu ada di repository, dan file yang ada di repository belum tentu sudah ada di container yang berjalan.

## Alur CI/CD dan migration database

### CI memeriksa, CD menerapkan perubahan

CI dijalankan pada GitHub-hosted runner untuk memeriksa perubahan dan build. Deployment produksi dipisahkan ke workflow manual yang menggunakan self-hosted runner.

![Flow CI/CD: pull request diperiksa pada GitHub-hosted runner, perbaikan jika gagal, merge setelah lulus, kemudian deployment manual pada runner produksi dan verifikasi hasil.](assets/ubuntu-server/02-flow-cicd.png)

*Gambar 2. Pemeriksaan perubahan dipisahkan dari eksekusi berprivilege di produksi. Kegagalan deployment memerlukan evaluasi; diagram tidak mengklaim rollback otomatis.* [Buka diagram SVG](assets/ubuntu-server/02-flow-cicd.svg).

Dengan alur ini, merge tidak langsung berarti aplikasi produksi berubah. Operator menentukan kapan deployment dijalankan setelah pemeriksaan yang diperlukan selesai.

Ketiga repository aplikasi telah memiliki alur CI dan deployment manual yang berhasil dijalankan. Required status checks menggunakan pemeriksaan CI, bukan workflow deployment yang baru dijalankan setelah merge.

### Menata branch agar server mengikuti sumber yang jelas

Pada fase awal, branch konfigurasi Docker dan `main` berkembang terpisah sehingga `git pull` mengalami divergent branches. Perubahan konfigurasi kemudian diintegrasikan melalui pull request, dan repository deployment diarahkan ke `main`.

Ada juga kegagalan deployment karena repository server masih berada pada branch pembuatan workflow. Script menghentikan proses karena branch tidak sesuai. Pemeriksaan tersebut membantu mencegah deployment dari sumber yang tidak diharapkan.

### Versioning dan batas rollback

Hasil deployment mencatat commit Git, identitas image, tag versi, tag rollback, waktu deploy, serta hasil pemeriksaan publik. Ini memberi jejak yang dapat digunakan saat membandingkan versi atau menelusuri masalah setelah pembaruan.

Git tag release seperti `v1.0.0` berbeda dari tag Docker berdasarkan commit. Git tag dapat digunakan saat menandai release penting; tag image berbasis commit membantu menelusuri build yang digunakan.

Pada alur yang tercatat, deployment masih melakukan build di server. Artinya, tag commit yang sama tidak dengan sendirinya membuktikan bahwa image CI dan image deployment identik secara byte. Build sekali lalu mempromosikan image berdasarkan digest merupakan pengembangan berikutnya.

**Rollback image tidak otomatis mengembalikan database.** Versi aplikasi sebelumnya harus tetap kompatibel dengan schema yang ada, atau membutuhkan prosedur pemulihan tersendiri. Tersedianya tag rollback juga belum setara dengan uji pemulihan menyeluruh.

### Migration database yang terkontrol

Salah satu pembaruan menambahkan kolom nullable `deleted_at` pada sejumlah tabel. Sebelum diterapkan, status migration diperiksa dan SQL yang direncanakan ditinjau melalui mode `--pretend`.

Urutan operasionalnya adalah memeriksa perubahan, memastikan backup tersedia, meninjau migration, menjalankannya pada jendela deployment yang sesuai, lalu memvalidasi aplikasi.

Mode `--pretend` membantu melihat SQL; bukan jaminan bahwa migration aman terhadap lock, volume data besar, atau ketergantungan kode. Schema change tetap perlu dirancang kompatibel dan diuji sesuai karakter aplikasi.

Seeder juga tidak dijalankan sembarangan pada setiap deploy. Seeder yang membuat data contoh atau tidak idempoten berisiko mengubah data yang seharusnya dipertahankan.

### Menjaga batas akses runner

User runner diberi izin `sudo` untuk script deployment tertentu melalui `sudoers`, bukan izin menjalankan semua perintah sebagai root tanpa password. Konfigurasi diperiksa melalui `visudo`.

Pembatasan ini tetap bergantung pada keamanan script, ownership file, input, repository, dan workflow yang memanggilnya. Script deployment yang dapat dibaca tetapi tidak sembarang ditulis merupakan bagian dari batas kepercayaan tersebut.

Runner produksi tidak digunakan untuk menjalankan kode pull request yang belum dipercaya. Label runner membantu memilih mesin, tetapi bukan isolasi keamanan. Beberapa runner pada satu host dengan user yang sama masih berbagi ruang kepercayaan.

## Penyimpanan, backup, dan uji restore

![Alur backup PostgreSQL dari SSD ke HDD dengan timer systemd, pemeriksaan checksum, dan restore pada container pengujian terpisah tanpa menimpa produksi.](assets/ubuntu-server/03-backup-restore.png)

*Gambar 3. Pemeriksaan integritas file dan uji restore memberikan bukti yang berbeda. Backup database tidak otomatis mencakup file upload aplikasi.* [Buka diagram SVG](assets/ubuntu-server/03-backup-restore.svg).

### Memisahkan data yang bisa dibuat ulang dari data yang harus dijaga

Source code dan image dapat dibuild kembali. Database dan file yang diunggah pengguna memerlukan perlindungan tersendiri.

| Penyimpanan | Pemakaian dalam implementasi |
| --- | --- |
| SSD | Ubuntu, source/configuration, Docker image, build cache, dan volume PostgreSQL aktif |
| HDD pada `/data` | Storage Laravel dan direktori backup PostgreSQL |
| Git repository | Source code, Dockerfile, konfigurasi aplikasi yang aman dipublikasikan, dan workflow |

File environment rahasia tidak menjadi bagian repository. Storage Laravel dipasang sebagai bind mount sehingga penggantian container tidak dengan sendirinya menghapus upload.

### Backup terjadwal ke HDD

Backup database sudah dibuat terjadwal melalui service dan timer systemd, sehingga prosesnya tidak bergantung pada ingatan menjalankan perintah manual. Hasilnya meliputi dump seluruh PostgreSQL, dump khusus database Masjid dalam format custom, serta checksum SHA-256. Kebijakan awal menyimpan backup selama 30 hari.

Permission backup dibatasi. Salah satu kendala operasional yang ditemukan adalah wildcard shell: ekspansi nama file terjadi sebelum `sudo`, sehingga pengguna yang tidak memiliki akses direktori dapat gagal menemukan file walaupun perintah akhirnya memakai `sudo`. Pemeriksaan dengan `find` berizin sesuai mengatasi kasus tersebut tanpa melonggarkan permission backup.

Validasi checksum berhasil. Namun, checksum hanya membantu memeriksa konsistensi file terhadap checksum yang dicatat; ia belum membuktikan bahwa database dapat digunakan setelah pemulihan.

### Uji restore pada lingkungan terpisah

Untuk menguji pemulihan, saya menjalankan container PostgreSQL pengujian terpisah dengan direktori data tersendiri. Backup direstore ke database pengujian, bukan menimpa database produksi.

Setelah restore, query berhasil membaca tabel pengguna, donasi, rekening, dan migration. Container pengujian kemudian dihentikan serta dihapus, dan PostgreSQL produksi diperiksa kembali dalam keadaan menerima koneksi.

Percobaan sebelumnya pernah gagal karena tabel sudah ada pada database tujuan. Dari situ, prosedur diarahkan pada target pengujian yang benar-benar terpisah dan kosong, bukan memaksakan restore berulang ke schema yang sudah terisi.

**Cakupan hasilnya jelas:** backup Masjid yang dipilih berhasil direstore dan dibaca. Pengujian tersebut belum membuktikan seluruh backup historis, file upload, role, konfigurasi, maupun aplikasi lengkap dapat dipulihkan sekaligus.

Backup di HDD yang masih berada dalam satu server membantu menghadapi beberapa jenis kesalahan operasional. Ia belum melindungi dari kehilangan seluruh mesin, pencurian, atau kejadian yang merusak kedua disk bersamaan.

## Monitoring dan pemeliharaan

### Memantau beberapa lapisan

Uptime Kuma digunakan untuk memeriksa website publik, endpoint health backend, PostgreSQL melalui port TCP, Nginx, dan container aplikasi. Dashboard monitoring hanya diakses melalui jaringan privat Tailscale.

Notifikasi Telegram disiapkan agar gangguan tidak harus diketahui lewat pemeriksaan manual. Pada awal pengujian, Telegram pernah mengembalikan error karena tujuan pesan adalah bot lain. Kasus tersebut berbeda dari timeout jaringan, sehingga konfigurasi penerima perlu dibedakan dari konektivitas API.

Setiap pemeriksaan memiliki arti yang terbatas:

- HTTP `200` menunjukkan endpoint merespons, belum membuktikan transaksi bisnis berhasil.
- Port PostgreSQL terbuka belum membuktikan autentikasi dan query aplikasi bekerja.
- Container `running` belum tentu sehat.
- Endpoint `/up` belum tentu memeriksa seluruh dependency, kecuali pemeriksaan itu memang ditambahkan.

Angka uptime pada dashboard juga mengikuti periode pengamatan. Screenshot dengan indikator hijau bukan bukti SLA bulanan atau ketersediaan tanpa gangguan.

### Healthcheck dan restart

Healthcheck ditambahkan pada layanan, lalu timer systemd disiapkan untuk memeriksa container yang unhealthy. Docker healthcheck sendiri tidak otomatis melakukan restart hanya karena status berubah menjadi unhealthy.

Otomatisasi restart perlu dibatasi dan diawasi. Restart tidak menyelesaikan disk penuh, konfigurasi yang salah, atau database yang bermasalah; loop restart justru bisa menyamarkan penyebabnya.

### Log rotation

Layanan yang dikonfigurasi menggunakan log driver Docker `local` dengan batas ukuran dan jumlah file. Langkah ini membantu mengendalikan pertumbuhan log container.

File log yang ditulis langsung ke direktori host oleh Nginx atau Laravel tetap memerlukan pemeriksaan tersendiri. Batas log driver Docker tidak otomatis berlaku untuk semua file di bind mount.

Log juga harus menghindari password, token, cookie sesi, dan tautan verifikasi rahasia. Menyimpan pesan error lengkap tanpa penyaringan dapat membocorkan kredensial dari URL integrasi.

### Cleanup image dan build cache

Cleanup image Docker dan build cache juga disiapkan sebagai pekerjaan terjadwal untuk menjaga ruang SSD, bukan menghapus semua yang sedang tidak terpakai tanpa pertimbangan. Sebagian image yang tidak dipakai container aktif masih berguna untuk rollback.

Kebijakan script cleanup yang ditinjau membatasi target ke repository aplikasi lokal, melindungi image yang digunakan container dan tag penting, serta mempertahankan sejumlah versi dan umur retensi. Pemeriksaan lock dimaksudkan untuk menghindari benturan dengan deployment; perlindungan itu efektif hanya jika kedua proses menggunakan lock yang sama.

Dalam salah satu pemeliharaan, sekitar 1,35 GiB build cache berhasil dibersihkan. Itu adalah ruang penyimpanan disk, bukan RAM. Volume database bukan target pembersihan ini.

Saya juga tidak menjadikan pengosongan cache RAM sebagai cronjob rutin. Linux menggunakan RAM kosong sebagai cache yang dapat direklamasi; penilaian memori perlu melihat nilai `available`, swap, dan tekanan memori, bukan hanya kolom `free`.

## Penerapan security dan batas kepercayaan

Security dalam proyek ini tidak saya letakkan pada satu tools saja. Saya membaginya menjadi akses jaringan, identitas pengguna, hak proses deployment, perlindungan secret, dan pemulihan data. Tujuannya adalah memperkecil permukaan serangan serta membatasi dampak kesalahan, tanpa mengklaim server bebas celah.

![Lapisan security: Cloudflare dan autentikasi untuk dashboard/API, Tailscale dan layanan privat untuk administrator, serta kontrol secret, runtime dan backup. Penguatan yang belum diverifikasi ditandai terpisah.](assets/ubuntu-server/04-security-layers.png)

*Gambar 4. Diagram merangkum lapisan kontrol, bukan urutan paket yang melewati setiap kotak. Kontrol yang tercatat dibedakan dari penguatan yang belum diverifikasi.* [Buka diagram SVG](assets/ubuntu-server/04-security-layers.svg).

### Risiko yang menjadi perhatian

- Port administrasi atau database terbuka ke internet tanpa kebutuhan.
- Kredensial bocor melalui repository, bundle frontend, atau log error.
- Kode yang belum dipercaya dieksekusi oleh runner dengan akses produksi.
- Pengguna aplikasi memperoleh hak lebih luas daripada perannya.
- File upload, backup, atau image rollback hilang akibat cleanup yang terlalu agresif.

### Matriks kontrol yang tercatat

“Tercatat” berarti ada konfigurasi, kode, atau hasil pengujian dalam riwayat implementasi. Status ini tidak berarti seluruh cakupan kontrol sudah lolos audit keamanan.

| Area | Penerapan yang tercatat | Batas atau verifikasi lanjutan |
| --- | --- | --- |
| Akses publik | Website menggunakan HTTPS melalui Cloudflare Tunnel | Tunnel tidak menggantikan autentikasi dashboard dan API |
| Administrasi | SSH, akses database, dan dashboard Kuma melalui Tailscale | Kebijakan ACL/grants per pengguna dan MFA penyedia identitas perlu diverifikasi |
| Port host | Nginx dan PostgreSQL memiliki binding loopback; aturan UFW membatasi SSH ke interface privat | Periksa juga IPv6, published ports Docker, dan aturan forwarding; UFW saja bukan bukti semua port tertutup |
| Proxy | Redirect HTTPS diperbaiki melalui konfigurasi proxy dan aplikasi | Header forwarded hanya boleh dipercaya dari jalur proxy yang memang dikendalikan |
| Dashboard | Akses panel Filament memeriksa role admin atau superadmin melalui kode aplikasi | Hak atas setiap resource dan aksi tetap membutuhkan pengujian otorisasi tersendiri |
| API | Kode pembuatan token menyimpan hash SHA-256 dan menyediakan field kedaluwarsa | Penegakan expiry, pencabutan token, dan otorisasi tiap endpoint perlu diperiksa; bukan sekadar token ada |
| Sesi | Respons login yang diuji memuat atribut `Secure`, `HttpOnly`, dan `SameSite=Lax` pada cookie sesi | Cakupan domain cookie dan perubahan konfigurasi berikutnya tetap perlu ditinjau |
| Secret | File environment berpermission terbatas; secret produksi tidak dimasukkan ke Git; build menggunakan secret mount | Build output dan log masih dapat membocorkan nilai jika kode tidak menghindarinya |
| Runner | CI pull request dipisahkan dari runner deployment; izin `sudo` diarahkan ke script tertentu | Script, direktori induk, input, dan repository tepercaya adalah bagian dari batas keamanan |
| Runtime | Image frontend dikonfigurasi menggunakan user non-root | Tidak berarti semua proses pada seluruh stack berjalan tanpa privilege |
| Data | File upload menggunakan storage persisten; permission backup dibatasi dan restore terpisah pernah diuji | Persistensi tidak berarti enkripsi, privasi file, atau pemulihan menyeluruh sudah terjamin |

### Menjelaskan enkripsi tanpa klaim berlebihan

Pada desain ini, istilah “website menggunakan HTTPS” perlu dibedakan dari “semua komunikasi internal menggunakan TLS”.

| Segmen koneksi | Perlindungan atau kondisi pada desain |
| --- | --- |
| Browser ke Cloudflare | HTTPS |
| Cloudflare ke konektor cloudflared | Tunnel terenkripsi |
| Cloudflared ke Nginx pada host | Origin HTTP melalui loopback pada konfigurasi yang tercatat |
| Nginx ke aplikasi | HTTP melalui jaringan Docker internal |
| Backend ke PostgreSQL | Jaringan internal; TLS database belum diklaim terkonfigurasi |

Hop lokal tersebut tidak dipublikasikan langsung sebagai layanan internet pada desain ini. Namun, jaringan internal tetap membutuhkan batas kepercayaan: jika kebutuhan berubah menjadi multi-host atau melayani beberapa pihak dengan tingkat kepercayaan berbeda, segmentasi dan TLS internal harus dievaluasi kembali.

### Membedakan autentikasi dan otorisasi

Autentikasi menjawab “siapa pengguna ini”, sedangkan otorisasi menjawab “apa yang boleh ia lakukan”. Akses ke panel admin tidak seharusnya otomatis memberikan semua hak pada data atau endpoint lain.

Pada backend Masjid, pemeriksaan role panel sudah terlihat pada kode. Untuk cakupan lebih lengkap, pengujian lanjutan perlu mencakup pengguna tanpa role, pengguna dengan role terbatas, token kedaluwarsa atau dicabut, serta percobaan mengakses data milik pihak lain.

CORS bukan pengganti pemeriksaan tersebut. Membatasi origin browser tidak mencegah klien non-browser memanggil endpoint. Rate limit login yang muncul pada respons juga tidak dengan sendirinya membuktikan semua endpoint penting memiliki perlindungan yang memadai.

### Perlindungan secret sepanjang siklus deployment

Permission file environment membatasi pembacaan pada host, tetapi secret dapat tetap keluar melalui tahapan lain. Nilai rahasia tidak boleh menggunakan prefix `NEXT_PUBLIC_`, tidak dicetak dalam log CI, dan tidak disisipkan ke halaman statis atau output build yang dikirim ke browser.

BuildKit secret membantu menyediakan file sementara selama build. Mekanisme ini tidak mencegah kode build menyalin isi file tersebut. Karena itu, pemeriksaan tetap mencakup dependency build, hasil artifact, dan cara aplikasi membaca konfigurasi.

Dalam peninjauan log historis, URL integrasi pernah memuat token. Tindakan yang diperlukan jika token masih aktif adalah mencabut dan menggantinya, memperbarui konfigurasi konsumen, serta menambahkan redaksi pada logging. Artikel ini tidak mengklaim rotasi dan redaksi tersebut sudah selesai tanpa hasil verifikasi.

### Batas akses deployment dan Docker

Izin `NOPASSWD` pada script tertentu tidak sama dengan memberikan terminal root tanpa batas. Namun, pembatasan itu baru efektif jika user runner tidak dapat mengubah script atau direktori induknya, script memvalidasi input, dan kode yang dijalankan memang berasal dari sumber yang dipercaya.

Branch protection dan pemeriksaan CI membantu tata kelola perubahan. Penguatan berikutnya dapat meliputi review workflow, permission token GitHub seminimal mungkin, pin action ke commit yang ditinjau, serta pemisahan runner jika kebutuhan isolasi meningkat. Rekomendasi ini tidak saya labeli sudah diterapkan seluruhnya.

Docker socket juga merupakan akses berprivilege tinggi. Jika monitoring membutuhkan akses Docker API, izin endpoint dan jaringannya perlu ditinjau. Mount socket dengan opsi `:ro` saja tidak mengubah API Docker menjadi read-only. Penggunaan proxy API terbatas harus dibuktikan dari konfigurasi, bukan diasumsikan ada.

### Keamanan upload dan backup

Menyimpan upload pada HDD menyelesaikan kebutuhan persistensi, bukan seluruh kebutuhan keamanan file. Pemeriksaan lanjutan mencakup validasi ukuran dan isi/MIME, penamaan file yang aman, penolakan file executable, serta pembatasan akses untuk dokumen sensitif seperti bukti transfer.

Backup dapat mengandung data pribadi dan material autentikasi. Permission file sudah menjadi bagian setup, sementara enkripsi backup dan prosedur pengelolaan kuncinya belum diklaim diterapkan. Backup yang terlindungi tetap harus dapat dipulihkan oleh pihak yang berwenang.

### Checklist sebelum serah terima ke klien

Daftar berikut merupakan target verifikasi, bukan daftar pekerjaan yang semuanya sudah selesai:

- [ ] Audit port dari jaringan yang relevan; pastikan database dan dashboard monitoring tidak terbuka bebas.
- [ ] Verifikasi akses Tailscale dan GitHub, termasuk MFA, perangkat yang masih berizin, serta proses pencabutan akses.
- [ ] Uji otorisasi dashboard/API, perilaku token, rate limit, CSRF untuk alur berbasis sesi, dan cakupan cookie.
- [ ] Periksa permission secret, pastikan `APP_DEBUG` produksi tidak aktif, dan cari kebocoran pada log maupun artifact.
- [ ] Tinjau ownership script deployment, input, workflow, akses Docker, dan isolasi runner.
- [ ] Periksa hak role database; user aplikasi tidak diberi superuser hanya untuk mempermudah setup.
- [ ] Uji keamanan upload dan hak baca file sensitif.
- [ ] Uji pemulihan lengkap serta dokumentasikan update dependency, maintenance, dan tanggung jawab operasional.

Dengan pendekatan ini, klaim security dapat dikaitkan dengan kontrol dan bukti yang spesifik. Penggunaan Cloudflare, Tailscale, atau Docker tidak dengan sendirinya berarti WAF khusus, MFA, enkripsi backup, isolasi tenant, atau audit keamanan formal sudah tersedia.

## Eksperimen Open WebUI dan AI lokal

Di luar layanan inti, saya mengeksplorasi Open WebUI sebagai antarmuka untuk layanan AI. Eksperimen mencakup deployment Docker, penggunaan PostgreSQL, penyimpanan file pada HDD, serta pemeriksaan endpoint health.

Riwayat percobaan berikutnya juga mencakup koneksi ke Ollama pada perangkat Windows melalui jaringan privat. Pendekatan tersebut memisahkan mesin yang melayani antarmuka dari mesin yang menjalankan model, sehingga beban inferensi tidak harus ditempatkan pada server aplikasi yang sama.

Open WebUI kemudian tidak dimasukkan sebagai layanan aktif dalam baseline artikel ini: catatan lanjutan menunjukkan penghapusan database dan role khususnya, direktori aplikasi/data, serta image yang digunakan. Pembersihan DNS atau route publik tidak saya klaim selesai tanpa bukti tambahan.

Pelajaran dari eksperimen ini adalah memahami siklus hidup layanan: instalasi, konfigurasi, validasi, penilaian manfaat, sampai pembersihan resource yang memang sudah tidak diperlukan. Eksperimen tersebut bukan klaim platform AI multi-tenant berskala besar atau kemampuan menjalankan banyak model berat pada server RAM 8 GB.

## Bukti hasil dan batasannya

Berikut beberapa milestone yang tercatat selama pengerjaan:

| Periode | Hasil pengujian atau perubahan |
| --- | --- |
| Akhir Agustus 2026 | Domain aplikasi merespons melalui Cloudflare; redirect dan akses dashboard diperbaiki |
| 30 Agustus 2026 | Diagnosis koneksi keluar container mengarah pada TTL MikroTik; koneksi dan notifikasi Telegram kemudian berhasil |
| 30–31 Agustus 2026 | Backup terjadwal, healthcheck, dan monitoring ditambahkan |
| 31 Agustus 2026 | CI dan deployment manual Masjid berhasil dijalankan; metadata deployment tercatat |
| Awal September 2026 | Pipeline GreetingCard dan pemeriksaan domain publik berhasil dijalankan |
| 2 September 2026 | Restore backup Masjid pada container terpisah berhasil dan tabel dapat dibaca |
| Awal September 2026 | Cleanup storage ditinjau kembali; eksperimen Open WebUI memiliki catatan instalasi dan pembersihan lanjutan |

Untuk klien, hasil seperti ini dapat menjadi dasar acceptance test: aplikasi merespons, deployment memiliki jejak versi, backup terbentuk, dan restore pada lingkungan terpisah berhasil. Output yang dibagikan harus disanitasi, bukan menampilkan kredensial atau data pengguna.

Tetap ada batasan yang perlu disampaikan:

- Arsitektur masih menggunakan satu host; kegagalan mesin dapat memengaruhi seluruh layanan.
- Ketersediaan bergantung pada listrik, jaringan rumah, dan layanan pihak ketiga yang digunakan.
- Belum ada klaim load test, kapasitas pengguna bersamaan, atau angka throughput.
- CI yang berhasil mencakup pemeriksaan yang dikonfigurasi; bukan bukti seluruh skenario aplikasi sudah memiliki automated test.
- Container berbagi host dan sebagian jaringan; ini bukan isolasi setara mesin terpisah untuk setiap klien.
- Belum ada klaim zero-downtime deployment atau disaster recovery lintas lokasi yang sudah teruji.

Keterbukaan terhadap batasan membantu menentukan kapan arsitektur ini cukup dan kapan aplikasi sebaiknya dipindahkan ke VPS, dedicated server, atau lingkungan dengan redundansi.

## Pengembangan berikutnya

Prioritas berikutnya adalah meningkatkan kelengkapan operasional, bukan menambah tools tanpa kebutuhan:

1. **Melengkapi cakupan backup.** File upload, konfigurasi pemulihan, serta secret yang disimpan dengan perlindungan memadai perlu tercakup; tidak cukup hanya dump database.
2. **Menguji pemulihan aplikasi secara menyeluruh.** Uji database sudah dilakukan. Tahap lanjutan mencakup file, konfigurasi, dan fungsi aplikasi setelah restore, termasuk mengukur waktu pemulihannya.
3. **Menambahkan pengamatan dari luar host.** Monitoring pada server yang sama tidak dapat mengirim notifikasi ketika seluruh server mati atau kehilangan koneksi internet.
4. **Mengembangkan automated test.** Fokus pada autentikasi, hak akses, alur dana, validasi upload, dan endpoint yang penting bagi pengguna.
5. **Mempromosikan image yang sama dari CI ke deployment.** Registry dan digest image dapat mengurangi perbedaan antara build yang diperiksa dan build yang dijalankan.
6. **Meninjau isolasi dan hak akses.** Runner, Docker socket, network antarlayanan, secret, dan script berprivilege menjadi prioritas audit.
7. **Menetapkan target operasional sesuai kebutuhan bisnis.** Periode backup, retensi, toleransi downtime, kapasitas, dan jadwal maintenance perlu disepakati, bukan diasumsikan.

Queue untuk pekerjaan berat seperti pemrosesan gambar atau notifikasi dapat dievaluasi jika dibutuhkan. Konversi WebP dan penambahan Redis tidak saya nyatakan sebagai fitur yang sudah diterapkan dalam studi kasus ini.

## Layanan yang bisa saya bantu

Pengalaman ini menjadi dasar untuk membantu developer, pemilik aplikasi, organisasi, dan tim kecil yang ingin memiliki proses deployment dan pengelolaan server yang lebih teratur.

### Setup Ubuntu Server dan akses administrasi

Lingkup dapat mencakup penataan sistem, user dan permission, akses SSH privat, Docker, direktori kerja, storage, serta baseline konfigurasi keamanan. Rancangan disesuaikan dengan server rumah, on-premise, atau VPS yang dimiliki klien.

### Dockerisasi dan publikasi aplikasi

Saya dapat membantu menyiapkan Dockerfile dan Compose, dependency runtime, environment, persistent storage, reverse proxy, domain, dan HTTPS untuk aplikasi yang sesuai dengan lingkup pengalaman proyek.

### CI/CD dan prosedur release

Lingkup dapat mencakup workflow CI, deployment manual atau otomasi yang disepakati, penataan branch, pelacakan versi image, prosedur migration, dan panduan rollback sesuai kompatibilitas aplikasi serta database.

### PostgreSQL, backup, dan pengujian pemulihan

Pekerjaan dapat meliputi role dan akses aplikasi, persistent volume, backup terjadwal, retensi, pemeriksaan file backup, serta restore pada lingkungan pengujian yang tidak menimpa produksi.

### Monitoring, maintenance, dan troubleshooting

Saya dapat membantu memetakan healthcheck, monitor website dan layanan, notifikasi, log rotation, cleanup image Docker terjadwal, cleanup build cache, serta menelusuri masalah DNS, reverse proxy, container networking, environment, dan deployment berdasarkan bukti.

### Pendampingan dan dokumentasi

Bagi yang ingin belajar mengelola sistemnya sendiri, implementasi dapat disertai penjelasan alasan konfigurasi, panduan operasi, dan sesi serah terima. Tujuannya agar klien memahami cara menggunakan serta merawat hasil pekerjaan, bukan hanya menerima server yang sedang menyala.

### Bentuk kerja sama

Alur kerja yang saya tawarkan:

1. **Pemetaan kebutuhan:** aplikasi, infrastruktur yang sudah ada, data penting, batasan akses, anggaran, dan risiko.
2. **Rancangan dan kesepakatan lingkup:** arsitektur, target pengujian, jadwal perubahan, serta hal yang tidak termasuk pekerjaan.
3. **Implementasi bertahap:** perubahan kecil dengan pemeriksaan sebelum melanjutkan ke tahap berikutnya.
4. **Validasi bersama:** uji akses, deployment, fungsi yang disepakati, dan backup/restore sesuai lingkup.
5. **Serah terima:** dokumentasi konfigurasi, panduan deployment, backup, troubleshooting, dan catatan batasan.

Deliverable dapat berupa diagram arsitektur, konfigurasi yang dikelola melalui Git, workflow, runbook operasional, dan hasil pengujian yang sudah disanitasi. Kepemilikan akun serta akses tetap ditetapkan bersama klien.

Biaya domain, infrastruktur, layanan pihak ketiga, dan maintenance dibahas terpisah sesuai kebutuhan. Pekerjaan setup tidak otomatis mencakup dukungan 24 jam, sertifikasi keamanan, atau SLA tertentu.

## Diskusi proyek

Apakah aplikasi Anda sudah selesai dikembangkan, tetapi proses deployment masih manual dan sulit diulang? Atau server sudah berjalan, namun backup, monitoring, dan prosedur pembaruannya belum jelas?

Saya dapat membantu meninjau kondisi awal dan menyusun langkah implementasi yang realistis. Kita bisa mulai dari satu aplikasi, satu pipeline deployment, atau satu masalah operasional yang paling mendesak.

Untuk memulai diskusi melalui menu kontak portfolio ini, cukup sampaikan:

- Aplikasi dan teknologi yang digunakan.
- Lokasi server saat ini: lokal, kantor, atau VPS.
- Kendala utama yang ingin diselesaikan.
- Kebutuhan akses, deployment, backup, dan monitoring.
- Target waktu serta batasan anggaran.

Tidak perlu mengirim password, token, private key, atau file `.env` pada percakapan awal.

**Mari siapkan server yang bukan hanya bisa menjalankan aplikasi, tetapi juga memiliki proses pembaruan, pemantauan, dan pemulihan yang dapat dipahami.**

[Konsultasi server rumahan via WhatsApp](https://wa.me/6285358316708?text=Halo%20Khairul%2C%20saya%20ingin%20konsultasi%20membuat%20server%20rumahan%20untuk%20aplikasi%2Fwebsite.%20Bisa%20dibantu%20diskusi%20kebutuhan%20server%2C%20Docker%2C%20CI%2FCD%2C%20backup%2C%20monitoring%2C%20dan%20security%3F)

---

*Catatan editorial: artikel ini disusun dari riwayat implementasi, potongan konfigurasi, log pengujian, dan hasil operasi yang tersedia sampai 3 September 2026. Bukan audit langsung seluruh source repository atau kondisi host terkini. Versi software menunjukkan konteks pengerjaan, bukan rekomendasi untuk mempertahankan versi tersebut tanpa pembaruan keamanan.*
