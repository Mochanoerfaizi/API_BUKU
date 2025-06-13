# Tahap 1: Pilih Base Image (Pondasi)
# Menggunakan Node.js versi 18-alpine. 'alpine' membuat ukuran image sangat kecil,
# sehingga proses deployment lebih cepat.
FROM node:18-alpine

# Tahap 2: Atur Lingkungan Kerja (Working Directory)
# Semua perintah selanjutnya akan dijalankan dari dalam folder /app di dalam kontainer.
WORKDIR /app

# Tahap 3: Install Dependensi (Langkah Paling Penting untuk Optimasi)
# Salin hanya package.json dan package-lock.json terlebih dahulu.
# Docker akan menyimpan hasil `npm install` di cache. Langkah ini hanya akan
# diulang jika ada perubahan pada file package.json.
COPY package*.json ./

# Jalankan npm install untuk membuat folder node_modules yang bersih di dalam
# kontainer Linux ini. Ini menyelesaikan masalah "Permission Denied".
RUN npm install

# Tahap 4: Salin Seluruh Kode Aplikasi
# Salin sisa kode proyek Anda ke dalam direktori /app.
# Folder node_modules dari komputer lokal Anda akan diabaikan karena ada file .dockerignore.
COPY . .

# Tahap 5: Jalankan Build (Migrasi & Seeding Database)
# Menjalankan skrip "build" dari package.json Anda, yang berisi perintah
# untuk migrasi dan seeding database. Ini hanya berjalan sekali saat build.
RUN npm run build

# Tahap 6: Buka Port Aplikasi
# Memberi tahu Docker bahwa aplikasi di dalam kontainer akan berjalan di port 3000.
# Ganti 3000 jika aplikasi Anda menggunakan port lain.
EXPOSE 3000

# Tahap 7: Tentukan Perintah untuk Menjalankan Aplikasi
# Ini adalah "Start Command" Anda. Perintah ini akan dieksekusi saat kontainer
# dimulai setelah proses build berhasil.
CMD ["npm", "start"]