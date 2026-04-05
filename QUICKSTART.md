# 🚀 Quick Start Guide

Get the Artistic QR Code Generator running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Unsplash API (Optional)

The app works without this, but you'll get placeholder images instead of real scenic photos.

1. Go to https://unsplash.com/developers
2. Create a free developer account
3. Create a new application
4. Copy your Access Key
5. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
6. Edit `.env.local` and add your key:
   ```env
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_actual_key_here
   ```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:3000**

## First QR Code

1. Enter a URL in the text field (e.g., `https://github.com`)
2. Click **Download PNG** for a standard QR code

## First Artistic QR Code

1. Enter your URL
2. Click **Upload Image** or **Random Scenic**
3. Adjust the **Image Strength** slider to 60-70%
4. Click **Download PNG**
5. Test with your phone's camera!

## Building for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` environment variable
4. Deploy!

## Troubleshooting

### "No matching version found for @types/qrcode-generator"
- Already fixed! We provide custom type definitions in `qrcode-generator.d.ts`

### Unsplash random images not working
- Check your API key in `.env.local`
- Verify it's named `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- The app will use placeholder images if Unsplash is unavailable

### QR code won't scan
- Reduce image strength to 50-60%
- Use a higher-contrast image
- Check the contrast warning message
- Test with multiple scanner apps

### TypeScript errors
```bash
npm run type-check
```

### Build errors
```bash
rm -rf node_modules .next
npm install
npm run build
```

## Next Steps

- Read the full [README.md](./README.md)
- Visit `/about` page for algorithm details
- Test with different images and strength levels
- Try the dithering and color options!

## Support

For issues or questions, check the [README.md](./README.md) or open a GitHub issue.

Happy QR code generating! 🎨📱
