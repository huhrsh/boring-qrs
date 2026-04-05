export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          What Makes boring qrs Different?
        </h1>

        <div className="prose max-w-none">
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
            Completely free, no-login QR code generator. Create artistic QR codes that blend with images while
            maintaining reliable scanning. All processing happens in your browser – your images never leave your device.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
            How It Works
          </h2>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 sm:p-6 mb-6 border-2 border-cyan-200">
            <ol className="space-y-3 text-sm sm:text-base text-gray-800">
              <li className="flex items-start gap-3">
                <span className="font-bold text-cyan-600 text-lg">1.</span>
                <span><strong className="font-bold">QR Matrix:</strong> Generate high-error-correction QR code matrix</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-cyan-600 text-lg">2.</span>
                <span><strong className="font-bold">Image Processing:</strong> Your image is resized and optimized</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-cyan-600 text-lg">3.</span>
                <span><strong className="font-bold">Smart Mapping:</strong> Dark QR modules map to darker pixels; light modules to lighter pixels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-cyan-600 text-lg">4.</span>
                <span><strong className="font-bold">Critical Preservation:</strong> Finder patterns and timing patterns remain untouched</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-cyan-600 text-lg">5.</span>
                <span><strong className="font-bold">Contrast Enforcement:</strong> Minimum 3:1 contrast ratio for reliable scanning</span>
              </li>
            </ol>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
            Key Features
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
              <h3 className="font-bold text-gray-900 mb-2 text-base">Free Forever</h3>
              <p className="text-sm text-gray-700">
                No hidden fees, no premium tiers, completely free
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border-2 border-cyan-200">
              <h3 className="font-bold text-gray-900 mb-2 text-base">No Login Required</h3>
              <p className="text-sm text-gray-700">
                Start creating immediately, no signup needed
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
              <h3 className="font-bold text-gray-900 mb-2 text-base">Color Support</h3>
              <p className="text-sm text-gray-700">
                Generate in grayscale or full color for different effects
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-200">
              <h3 className="font-bold text-gray-900 mb-2 text-base">Advanced Processing</h3>
              <p className="text-sm text-gray-700">
                Floyd-Steinberg dithering for professional results
              </p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
            Use Cases
          </h2>

          <ul className="space-y-2 text-sm sm:text-base text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold text-lg">•</span>
              <span><strong className="font-bold">Marketing:</strong> Eye-catching QR codes for posters and flyers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold text-lg">•</span>
              <span><strong className="font-bold">Business Cards:</strong> Professional QR codes with your branding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 font-bold text-lg">•</span>
              <span><strong className="font-bold">Events:</strong> Themed QR codes matching your event aesthetic</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold text-lg">•</span>
              <span><strong className="font-bold">Packaging:</strong> Artistic codes that enhance product design</span>
            </li>
          </ul>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 sm:p-6 mb-6">
            <p className="text-gray-800 text-sm sm:text-base">
              <strong className="font-bold">100% Privacy:</strong> All QR generation and image processing 
              happens in your browser. Your images never leave your device.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl transition-all transform hover:scale-105"
            >
              Start creating QR codes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
