# 1P-BOT-MUSIC-DISCORD

Bot music Discord menggunakan **yt-dlp** untuk streaming audio dari YouTube.

---

##  Fitur

- Putar musik dari YouTube (URL atau nama lagu)
- Sistem antrian lagu
- Atur volume real-time
- Skip lagu
- Stop musik
- Status bot berubah sesuai lagu yang diputar
- Auto keluar voice channel saat antrian habis

---

##  Persyaratan

- [Node.js](https://nodejs.org) v22 LTS atau lebih baru
- [yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest) (taruh di folder root project)
- ffmpeg (Windows: otomatis via `ffmpeg-static`, Linux: install manual)
- Discord Bot Token dari [Discord Developer Portal](https://discord.com/developers/applications)

---

##  Instalasi

### 1. Clone atau download project ini

```bash
git clone https://github.com/1pa9/1P-BOT-MUSIC-DISCORD
cd 1P-BOT-MUSIC-DISCORD
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download yt-dlp

**Windows:** Download `yt-dlp.exe` dari [sini](https://github.com/yt-dlp/yt-dlp/releases/latest), taruh di folder root project.

**Linux/Server:**
```bash
wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp
chmod +x yt-dlp
```

### 4. Buat file `.env`

```env
TOKEN=token_bot_elu
```

> Token di [Discord Developer Portal](https://discord.com/developers/applications) 

##  Struktur Project

```
1P-BOT-MUSIC-DISCORD/
├── bot.js            # File utama bot
├── .env              # Token bot 
├── yt-dlp            # Binary yt-dlp (Linux)
├── yt-dlp.exe        # Binary yt-dlp (Windows)
├── package.json
└── commands/
    ├── play.js       # Putar lagu
    ├── skip.js       # Skip lagu
    ├── stop.js       # Stop musik
    ├── queue.js      # Lihat antrian
    └── volume.js     # Atur volume
```

---

##  Perintah

| Perintah | Contoh | Fungsi |
|----------|--------|--------|
| `!play <nama/URL>` | `!play never gonna give you up` | Putar lagu dari YouTube |
| `!play <URL>` | `!play https://youtube.com/watch?v=...` | Putar via URL langsung |
| `!skip` | `!skip` | Skip ke lagu berikutnya |
| `!stop` | `!stop` | Hentikan musik & keluar voice |
| `!queue` | `!queue` | Tampilkan antrian lagu |
| `!volume` | `!volume` | Cek volume saat ini |
| `!volume <1-200>` | `!volume 80` | Atur volume (default: 100) |

---

##  Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `discord.js` | ^14.0.0 | Library utama Discord |
| `@discordjs/voice` | ^0.19.0 | Koneksi voice channel |
| `ffmpeg-static` | ^5.0.0 | Audio processing (Windows) |
| `opusscript` | ^0.0.8 | Encoder audio Opus |
| `dotenv` | ^17.0.0 | Membaca file .env |

---

##  Konfigurasi

### Mengubah Prefix

Buka `index.js`, cari baris berikut dan ubah `!` sesuai keinginan:

```javascript
if (!message.content.startsWith('!') || message.author.bot) return;
```

### Mengubah Batas Volume

Buka `commands/volume.js`, ubah angka `200` sesuai batas maksimal yang diinginkan:

```javascript
if (isNaN(vol) || vol < 1 || vol > 200) {
```

---

## Deploy ke Server Linux (Panel Pterodactyl)

1. Upload semua file ke panel
2. Upload file `yt-dlp` (bukan `.exe`) ke folder root
3. Set permission file `yt-dlp` ke **755** via file manager panel
4. Pastikan `ffmpeg` sudah terinstall di server
5. Jalankan bot

Permission otomatis sudah ditangani oleh `index.js` saat bot start.

---

##  Troubleshooting

**Error: `EACCES` saat menjalankan yt-dlp di Linux**
```bash
chmod +x yt-dlp
```

**Error: `ffmpeg not found` di Linux**
```bash
# Ubuntu/Debian
apt install ffmpeg

# CentOS/RHEL
yum install ffmpeg
```

**Error: `@discordjs/voice` tidak support Node versi lama**

Upgrade Node.js ke v22 menggunakan nvm:
```bash
nvm install 22
nvm use 22
```

**Bot tidak merespon perintah**

Pastikan di [Discord Developer Portal](https://discord.com/developers/applications) → Bot → aktifkan:
-  Message Content Intent
-  Server Members Intent
-  Presence Intent

---

##  Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

## 🙏 Credits

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — Audio extraction
- [discord.js](https://discord.js.org) — Discord API wrapper
- [@discordjs/voice](https://github.com/discordjs/voice) — Voice connection
