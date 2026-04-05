# 📸 Image Upload Guide

Your app is now ready to use your custom images! Here's exactly what to do:

---

## 📁 Where to Upload Files

All files go in the **`public`** folder at the root of your project:

```
artistic-qr/
├── public/
│   ├── logo.png          ← Upload your logo here
│   └── examples/
│       ├── qr-portrait.png    ← Upload example 1 here
│       ├── qr-landscape.png   ← Upload example 2 here
│       └── qr-brand.png       ← Upload example 3 here
```

---

## 🎯 Exact Filenames Required

### Logo (Header)
**Upload ONE of these:**
- `logo.png` (recommended - supports transparency)
- `logo.svg` (vector - best quality)
- `logo.jpg` (only if necessary)

**Specs:**
- Recommended size: 120×40px to 180×60px (landscape)
- Or: 60×60px (square logo)
- Transparent background recommended
- Will appear in header next to "boring qrs" text

---

### Example QR Codes (Gallery Section)

**Upload ALL THREE of these:**

1. **`qr-portrait.png`** or **`qr-portrait.jpg`**
   - For: Personal branding, social profiles, business cards
   - Your portrait/people QR example

2. **`qr-landscape.png`** or **`qr-landscape.jpg`**
   - For: Scenic photos, travel destinations, nature photography
   - Your landscape/scenic QR example

3. **`qr-brand.png`** or **`qr-brand.jpg`**
   - For: Marketing materials, posters, event signage
   - Your brand/marketing QR example

**Specs:**
- Format: PNG (preferred) or JPG
- Size: 800×800px minimum (square aspect ratio)
- File size: Under 500KB each for fast loading
- High quality, clear images

---

## ✅ How to Upload

### Option 1: File Explorer
1. Open your project folder: `artistic-qr`
2. Navigate to the `public` folder
3. Drop your logo directly in `public/`
4. Drop your 3 QR examples in `public/examples/`

### Option 2: VS Code
1. In VS Code file explorer, expand `public/` folder
2. Right-click → "Reveal in File Explorer"
3. Drag and drop your files

---

## 🔄 What Happens

### Logo:
- Shows immediately in the header next to "boring qrs"
- Fallback: If no logo found, shows placeholder circle

### Example QRs:
- Replace the gradient placeholder boxes in the "What You Can Create" section
- Fallback: If images not found, shows "Your QR here" text

---

## 🧪 Testing

After uploading, restart your dev server:
```bash
npm run dev
```

Then check:
1. Logo appears in header (top left)
2. 3 example QR images appear in gallery section (bottom of page)

---

## 💡 Tips

- **PNG is best** for QR codes (supports transparency, crisp edges)
- **Keep file sizes small** (<500KB) for fast loading
- **Square images work best** for the QR examples
- **Test on mobile** to ensure images look good on all devices

---

## ❓ Troubleshooting

**Logo not showing?**
- Check filename is exactly `logo.png` (lowercase)
- Check it's in `/public/` not `/public/examples/`
- Hard refresh browser (Ctrl+Shift+R)

**Example QRs not showing?**
- Check filenames match exactly (e.g., `qr-portrait.png`, `qr-landscape.png`)
- Check they're in `/public/examples/` folder
- Verify images are square (same width/height)
- Hard refresh browser

---

## 📋 Quick Checklist

- [ ] Logo uploaded to `/public/logo.png`
- [ ] Portrait QR uploaded to `/public/examples/qr-portrait.png`
- [ ] Landscape QR uploaded to `/public/examples/qr-landscape.png`
- [ ] Brand QR uploaded to `/public/examples/qr-brand.png`
- [ ] Dev server restarted
- [ ] Browser hard refreshed

**You're all set! 🎉**
