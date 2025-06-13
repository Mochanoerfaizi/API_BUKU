# Tahap 1: Gunakan Base Image Standar (Non-Alpine)
# Mengganti `node:18-alpine` dengan `node:18`. Image ini lebih besar tapi
# jauh lebih kompatibel dengan package yang butuh kompilasi.
# Ini adalah solusi paling umum untuk error `npm install` yang sulit dilacak.
FROM node:18

# Tahap 2: Atur Lingkungan Kerja
WORKDIR /app

# Tahap 3: Install Dependensi
COPY package*.json ./
RUN npm install

# Tahap 4: Salin Kode Aplikasi
COPY . .

# Tahap 5: Buka Port Aplikasi
EXPOSE 3000

# Tahap 6: Tentukan Perintah untuk Menjalankan Aplikasi
# Pastikan skrip "start" di package.json Anda sudah menjalankan migrasi.
CMD ["npm", "start"]