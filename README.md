# Gujral Hills — Powered by Colonizer Pro

This repository contains:

| Folder | Contents |
|--------|----------|
| `website/` | Static HTML/CSS/JS public marketing site (Hostinger) |
| `src/` | **Colonizer Pro** — React management app |
| `public/` | React app HTML shell |

---

## Colonizer Pro

A white-label real estate project management suite for RERA-registered
plotted development colonizers. Features:

- 🗺️ **Plot Map** — interactive SVG plot grid with live availability
- 👥 **CRM** — lead and buyer management
- 📦 **Inventory** — materials and construction stock tracking
- 💰 **Finance** — payment tracking and reports
- 🔐 **Auth** — Supabase email/password login
- 🌐 **Public Map** — customer-facing plot availability page

### Quick setup for a new project

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_ORG/gujralhills.git
   cd gujralhills
   npm install
   ```

2. **Configure the project** — edit `src/config.js`:
   ```js
   projectName:    'Your Colony Name',
   reraNumber:     'P-XXX-YY-ZZZZ',
   projectAddress: 'Village, Tehsil, District',
   whatsapp:       '91XXXXXXXXXX',
   website:        'yourcolony.in',
   totalPlots:     120,
   ```

3. **Set up Supabase** — copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run locally**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## Website (Hostinger)

Static files in `website/` are deployed to Hostinger via FTP or File Manager.
The site includes a **"Manage Project"** button linking to the Colonizer Pro login.

---

## Tech Stack

- React 18 · react-scripts (CRA)
- Supabase (auth + database)
- DM Sans (Google Fonts)
- Deployed: Hostinger (website) + Vercel/Netlify (app)
