import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-[500px] bg-gradient-to-r from-sky-800 to-sky-600 overflow-hidden mb-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/turistico.jpg"
          alt="Destino turístico"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/90 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Descubre el mundo con nosotros</h1>
          <p className="text-xl md:text-2xl mb-8">Vuelos a más de 100 destinos con la mejor experiencia de viaje</p>
          <div className="flex space-x-4">
            <a
              href="#promotions"
              className="bg-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-300 transition"
            >
              Ver ofertas
            </a>
            <a
              href="#destinations"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition"
            >
              Explorar destinos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
