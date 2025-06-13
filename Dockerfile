# Tahap 1: Pilih Base Image
FROM node:18-alpine

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
CMD ["npm", "start"]