export function PreparateViajar() {
    const itemsCards = [
        {
            title: "Check-in online",
            description: "Obtén tu pase de abordar y ahorra tiempo en el aeropuerto.",
            icon: "/3.svg",
            link: "https://www.aerolinea.com.co/check-in",
        },
        {
            title: "Centro de ayuda",
            description: "Busca y encuentra información útil para resolver tus preguntas.",
            icon: "/2.svg",
            link: "https://www.aerolinea.com.co/centro-de-ayuda",
        },
        {
            title: "Requisitos para viajar",
            description: "Infórmate acerca de visas, vacunas y demás documentos.",
            icon: "1.svg",
            link: "https://www.aerolinea.com.co/requisitos-para-viajar",
        },
    ]

    return (
        <section className="w-full py-8 px-4 bg-[#F9FAFB]">
            <p className="text-center text-3xl font-black mb-8">Prepárate para viajar</p>
            
            <div className="md:px-6">
                {/* Contenedor para móvil (scroll horizontal) y desktop (grid) */}
                <div className="md:grid md:grid-cols-3 md:gap-6 flex overflow-x-auto pb-4 gap-2 scroll-smooth">
                    {itemsCards.map((item, index) => (
                        <a
                            href={item.link}
                            key={index}
                            className="flex bg-white items-start p-6 hover:bg-gray-50 rounded-lg transition-colors shadow-lg min-w-[85%] md:min-w-0 flex-shrink-0"
                        >
                            <div className="mr-4">
                                <img 
                                    src={item.icon} 
                                    alt="icon" 
                                    className="w-20 h-20 object-contain" 
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-bold mb-2">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}