# Base Tracker — Deploy Rehberi

## Adım 1: GitHub'a Yükle

```bash
cd base-tracker
git init
git add .
git commit -m "Initial: Base Tracker mini app"
git remote add origin https://github.com/KULLANICI_ADIN/base-tracker.git
git push -u origin main
```

## Adım 2: Vercel'e Deploy Et

1. [vercel.com](https://vercel.com) → "New Project"
2. GitHub repo'nu seç (base-tracker)
3. Environment Variables ekle:
   ```
   NEXT_PUBLIC_URL = https://base-tracker.vercel.app
   ```
4. Deploy!

## Adım 3: Vercel Authentication'ı Kapat

Vercel Dashboard → Settings → Deployment Protection → "Vercel Authentication" → **OFF**

## Adım 4: Farcaster Hesabınla İmzala

1. [base.dev/preview](https://base.dev/preview) git
2. App URL'ini yapıştır (örn: `base-tracker.vercel.app`)
3. "Submit" → "Verify" butonuna bas
4. Gelen `accountAssociation` objesini kopyala
5. `minikit.config.ts` içindeki `accountAssociation` alanını doldur
6. `git push` ile yayınla

## Adım 5: Uygulamayı Yayınla

Base App'i aç → Yeni post oluştur → URL'ini ekle:
```
base-tracker.vercel.app
```

## Adım 6: Doğrulama İçin Başvur (Ödüller için!)

[base.dev](https://base.dev) → Mini App'ini doğrulat → Builder Rewards programına gir

---

## Kullanılan API'lar (Ücretsiz)

| API | Endpoint | Rate Limit |
|-----|----------|-----------|
| GeckoTerminal | Top volume pools | 30 req/min |
| GeckoTerminal | New pools | 30 req/min |
| DexScreener | New token profiles | 60 req/min |

## Klasör Yapısı

```
base-tracker/
├── app/
│   ├── api/
│   │   ├── volume/route.ts      ← Top 24h hacim
│   │   ├── new-tokens/route.ts  ← Yeni tokenlar
│   │   └── webhook/route.ts     ← MiniKit webhook
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 ← Ana sayfa (UI)
├── minikit.config.ts            ← App manifest
├── next.config.js
├── package.json
└── tailwind.config.ts
```
