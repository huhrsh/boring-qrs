# Google SEO Meta Tags Guide

Meta tags for Google SEO are configured in **`app/layout.tsx`** in the `metadata` export.

## ✅ Already Configured

Your app already has these SEO essentials:
- ✅ Title tag
- ✅ Description meta tag
- ✅ Keywords
- ✅ Open Graph tags (social media)
- ✅ Twitter Card tags
- ✅ Favicon/icons
- ✅ Robots directives (just added)
- ✅ Google verification placeholder (just added)

---

## 🔧 Google Search Console Verification

**Location:** `app/layout.tsx` → `metadata.verification.google`

### How to Get Your Verification Code:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property" → Enter your domain
3. Choose "HTML tag" verification method
4. Copy the **content value** from the meta tag shown
   ```html
   <meta name="google-site-verification" content="abc123xyz..." />
   ```
5. Paste only the `abc123xyz...` part into `layout.tsx`:
   ```typescript
   verification: {
     google: 'abc123xyz...', // ← Paste here
   },
   ```
6. Deploy your site
7. Return to Google Search Console and click "Verify"

---

## 📊 Already Configured Meta Tags

### 1. **Robots Meta (Lines 41-51)**
```typescript
robots: {
  index: true,              // Allow Google to index pages
  follow: true,             // Allow crawling links
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,        // No limit on video preview
    'max-image-preview': 'large',   // Large image previews in search
    'max-snippet': -1,              // No limit on text snippet
  },
}
```

### 2. **Open Graph (Social Sharing)**
Already configured with title, description, type, and locale.

### 3. **Structured Data** (Optional - Add Later)
For rich snippets, you can add JSON-LD in `layout.tsx`:

```typescript
// Add this after metadata export:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "boring qrs",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })
  }}
/>
```

---

## 🎯 Other Verification Codes (Optional)

### Bing Webmaster Tools:
```typescript
verification: {
  google: 'your-google-code',
  bing: 'YOUR_BING_CODE_HERE',
}
```

### Yandex:
```typescript
verification: {
  google: 'your-google-code',
  yandex: 'YOUR_YANDEX_CODE_HERE',
}
```

---

## 📝 Current Location in Code

File: **`app/layout.tsx`**

```typescript
export const metadata: Metadata = {
  title: '...',
  description: '...',
  keywords: [...],
  authors: [...],
  metadataBase: new URL(...),
  
  // 👇 NEW: Google SEO configuration
  robots: { ... },           // Lines 41-51
  verification: {            // Lines 52-56
    google: 'YOUR_CODE',
  },
  
  icons: [...],
  openGraph: {...},
  twitter: {...},
}
```

---

## ✅ Steps to Complete

1. **Deploy your site** to production
2. **Get verification code** from Google Search Console
3. **Replace** `'YOUR_GOOGLE_VERIFICATION_CODE_HERE'` with actual code
4. **Re-deploy**
5. **Verify** in Search Console
6. **Submit sitemap:** Your sitemap is at `https://yourdomain.com/sitemap.xml`

---

## 🚀 Already Optimized For:

✅ Google indexing  
✅ Social media sharing (Facebook, Twitter, LinkedIn)  
✅ Mobile-first indexing  
✅ Rich image previews  
✅ Keyword optimization (20+ keywords configured)  
✅ Sitemap generation (`app/sitemap.ts`)  
✅ Robots.txt (`app/robots.ts`)  

Your SEO foundation is solid! 🎉
