import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mt-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Epilepsy Services Hub
          </h1>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience comprehensive epilepsy care management with our modern, secure platform designed for
            healthcare professionals and patients. Your journey to better health starts here.
          </p>
        </div>

        <div className="animate-fade-in-up animation-delay-400">
          <Link
            href="/auth"
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        <div className="mt-12 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animation-delay-600">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-teal-600 text-2xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Platform</h3>
            <p className="text-gray-600">HIPAA-compliant data protection</p>
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 text-2xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Care</h3>
            <p className="text-gray-600">Connect with healthcare professionals</p>
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your health journey</p>
          </div>
        </div>
      </div>
    </div>
  )
}