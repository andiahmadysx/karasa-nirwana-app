# Panduan Setup Karasa Nirwana API & App

### Setup API

1. **Simpan Project API di Direktori `htdocs`:**
    - Simpan project API di `htdocs/karasa-nirwana-api`.

2. **Konfigurasi Environment Laravel:**
    - Masuk ke direktori project:
      ```bash
      cd htdocs/karasa-nirwana-api
      ```
    - Konfigurasi file `.env` untuk pengaturan database dan environment lainnya.

3. **Jalankan Perintah Berikut:**
    - Update dependensi:
      ```bash
      composer update
      ```
    - Generate application key:
      ```bash
      php artisan key:generate
      ```
    - Jalankan migration untuk menyiapkan database:
      ```bash
      php artisan migrate
      ```
    - Seed database dengan data awal:
      ```bash
      php artisan db:seed --class=UserSeeder
      ```

4. **Akses Backend:**
    - Backend sekarang sudah berjalan dan dapat diakses melalui:
      ```
      [ip]/karasa-nirwana-api
      ```

---

### Setup Aplikasi

1. **Konfigurasi Environment Aplikasi:**
    - Pada file `.env`, ubah host backend menjadi:
      ```
      [ip]/karasa-nirwana
      ```
      (Catatan: Hapus `http://` dan `-api` dari URL, gunakan hanya `karasa-nirwana`.)

2. **Jalankan Perintah Berikut:**
    - Install dependensi yang dibutuhkan:
      ```bash
      npm install
      ```
    - Mulai aplikasi dengan Expo:
      ```bash
      npx expo start -c
      ```
      *(Pastikan emulator Android Studio menggunakan Android 10 atau API level 31 ke bawah.)*

3. **Kontrol Aplikasi:**
    - Tekan `s` untuk beralih ke Expo Go.
    - Tekan `a` untuk membuka aplikasi di emulator Android.

4. **Penanganan Error:**
    - Abaikan dua error yang terkait dengan thermal printing. Error ini dapat diabaikan karena tidak memengaruhi fungsionalitas aplikasi.

5. **Informasi Login:**
    - Gunakan kredensial berikut untuk login:
        - **Username:** admin
        - **Password:** admin
