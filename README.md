# Aplikasi Payroll & Absensi HR

Aplikasi Payroll dan Absensi Karyawan berbasis React + Vite + TailwindCSS.

## Fitur
- Manajemen data karyawan dan absensi
- Perhitungan payroll (Gaji, UMK/UMP, tunjangan, potongan)
- Template UMK Kabupaten/Kota & UMP Provinsi (CSV/XLSX)
- Ekspor data ke Excel

## Teknologi
- React 19
- Vite 7
- TailwindCSS 3

## Menjalankan secara lokal
```bash
npm install
npm run dev      # development server (http://127.0.0.1:5173)
npm run build    # build produksi ke folder dist/
npm run preview  # preview hasil build
```

## Deployment

### Vercel
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Tidak perlu konfigurasi tambahan (base path = `./`).

### GitHub Pages
- Otomatis melalui workflow `.github/workflows/deploy.yml`.
- Syarat: Settings → Pages → Build and deployment → Source = **GitHub Actions**.
- URL hasil: `https://jarotandi.github.io/Aplikasi-Payroll-HR/`

## Lisensi
Private / Internal Use.
