'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-navy">UkurKompeten</div>
          <nav className="space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-navy transition">
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal-dark transition"
            >
              Mulai Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-navy mb-6">
            Kenali Kemampuan, Asah Kompetensi
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform assessment kompetensi berbasis data untuk profesional Indonesia. 
            Hasil objektif, rekomendasi actionable.
          </p>
          <div className="space-x-4">
            <Link 
              href="/register" 
              className="bg-teal text-white px-8 py-3 rounded-lg text-lg hover:bg-teal-dark transition inline-block"
            >
              Mulai Assessment Gratis
            </Link>
            <Link 
              href="#features" 
              className="border-2 border-navy text-navy px-8 py-3 rounded-lg text-lg hover:bg-navy hover:text-white transition inline-block"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-navy mb-12">
            Kenapa UkurKompeten?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-navy">Assessment Terstandarisasi</h3>
              <p className="text-gray-600">
                Menggunakan framework Holland Code, Big Five, dan NACE Competencies
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-navy">Hasil Objektif</h3>
              <p className="text-gray-600">
                Bukan feeling, tapi data yang terukur dan bisa dipertanggungjawabkan
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-navy">Rekomendasi Actionable</h3>
              <p className="text-gray-600">
                Langkah konkret untuk pengembangan kompetensi Anda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-teal-light">Profesional Terdaftar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-teal-light">Assessment Selesai</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-teal-light">Kepuasan User</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Siap Mengenal Kemampuan Anda Lebih Dalam?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mulai assessment gratis sekarang dan dapatkan insight tentang kompetensi Anda
          </p>
          <Link 
            href="/register" 
            className="bg-teal text-white px-8 py-3 rounded-lg text-lg hover:bg-teal-dark transition inline-block"
          >
            Mulai Assessment Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 UkurKompeten. All rights reserved.</p>
          <p className="text-sm mt-2 text-gray-300">
            Kenali kemampuan, asah kompetensi
          </p>
        </div>
      </footer>
    </main>
  )
}
