# 🚀 Azrim Cosmos Cloud Source

Custom Cosmos Cloud marketplace source repository for self-hosted applications.

## 📦 Included Applications

| App | Description | Port |
|-----|-------------|------|
| **qBittorrent** | Open-source BitTorrent client | 8080 |
| **Jellyfin** | Free Software Media System | 8096 |
| **Immich (No ML)** | Photo/video management without machine learning | 2283 |
| **Shoko Anime** | Anime cataloging and management | 8111 |
| **Hermes Agent** | Autonomous AI agent by Nous Research | 8642 |
| **9Router** | Smart AI API routing gateway | 20128 |
| **Pi-hole** | Network-wide ad blocker and DNS sinkhole | 80 / 53 |
| **Navidrome** | Web-based music collection server and streamer | 4533 |

## 🏠 Volume Configuration

App configs and data are stored dynamically in your Cosmos Cloud `{DefaultDataPath}` (e.g. `/cosmos-storage`), while your personal media files remain explicitly mapped to `/home/azrim`. 

```
{DefaultDataPath}/
├── qbittorrent/config/
├── jellyfin/config/
├── shoko/config/
├── hermes/
├── pihole/etc-pihole/ & etc-dnsmasq.d/
├── navidrome/config/
└── 9router/config/

/home/azrim/
├── Downloads/
├── Photos/
├── Videos/
│   ├── anime/
│   ├── movies/
│   └── series/
└── Music/
```

## 📥 How to Add This Source to Cosmos Cloud

1. Go to your Cosmos Cloud dashboard
2. Navigate to **Market** → **Sources**
3. Click **Add Source**
4. Enter the URL of this repository's `servapps.json`:
   ```
   https://YOUR_GITHUB_USERNAME.github.io/azrim-cosmos-source/servapps.json
   ```
5. Save and refresh the marketplace

## 🔧 Manual Installation

You can also import individual apps via **Import Compose File** using the `cosmos-compose.json` from each app's folder.

## 📝 Notes

### Volume Mapping Strategy
- **App Data/Config:** Uses `{DefaultDataPath}` so it automatically follows your Cosmos setting for installs (like `/cosmos-storage`).
- **Media Paths:** Uses absolute paths starting with `/home/azrim` for initial installer values since these are fixed directories on your host server. The forms still allow you to change them during installation if needed.

- **Immich**: Machine Learning is disabled by default. Facial recognition and smart search won't be available, but uploads and organization work normally.
- **Hermes Agent**: Requires API keys to be configured after installation.
- **9Router**: Configure API provider keys through the web interface after deployment.
- All apps use `TZ=auto` for automatic timezone detection by Cosmos Cloud.
