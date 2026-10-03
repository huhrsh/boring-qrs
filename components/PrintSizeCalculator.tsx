'use client'

import { useState } from 'react'

export default function PrintSizeCalculator() {
  const [pixels, setPixels] = useState('970')
  const [dpi, setDpi] = useState('300')
  const p = Number(pixels), d = Number(dpi)
  const valid = Number.isFinite(p) && Number.isFinite(d) && p > 0 && d > 0
  const inches = p / d
  return <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 my-6 text-gray-900">
    <h2 className="text-xl font-bold mb-4">Calculate print dimensions</h2>
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="font-medium">PNG width in pixels<input type="number" min="1" value={pixels} onChange={e => setPixels(e.target.value)} className="block mt-2 w-full rounded-lg border border-gray-400 p-3" /></label>
      <label className="font-medium">Print resolution (DPI)<input type="number" min="1" value={dpi} onChange={e => setDpi(e.target.value)} className="block mt-2 w-full rounded-lg border border-gray-400 p-3" /></label>
    </div>
    <p role="status" className="mt-4 font-semibold">{valid ? `Print width: ${inches.toFixed(2)} inches / ${(inches * 2.54).toFixed(2)} cm` : 'Enter positive numbers for both fields.'}</p>
    <p className="text-sm mt-3">Formula: pixels ÷ DPI = inches. Multiply inches by 2.54 for centimeters. This calculates image dimensions, not a guaranteed scannable size. Include the border and test a printed proof.</p>
    <noscript>This calculator needs JavaScript. Divide PNG width in pixels by print DPI to calculate width in inches.</noscript>
  </div>
}
