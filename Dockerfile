# Tahap 1: Pilih Base Image
FROM node:18-alpine

# Tahap 2: Atur Lingkungan Kerja
WORKDIR /app

# Tahap 3: Install System Dependencies & Dependensi Proyek
RUN apk add --no-cache python3 make g++

# Salin package.json
COPY package*.json ./

# Jalankan npm install.
# Jika ini gagal, perintah `||` akan menjalankan perintah berikutnya
# yang akan menampilkan log error.
RUN npm install || (cat /root/.npm/_logs/*.log && exit 1)

# Hapus build-essentials setelah selesai
RUN apk del python3 make g++

# Tahap 4: Salin Kode Aplikasi
COPY . .

# Tahap 5: Buka Port Aplikasi
EXPOSE 3000

# Tahap 6: Tentukan Perintah untuk Menjalankan Aplikasi
CMD ["npm", "start"]