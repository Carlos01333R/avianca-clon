"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, MapPin, Plane, Users } from "lucide-react"
import { RadioSelector } from "@/components/ui/radio-selector"
import { LocationDropdown } from "@/components/flight/location-dropdown"
import { PassengersDropdown } from "@/components/flight/passengers-dropdown"
import type { TripType, Location } from "@/types/flight"
import { popularDestinations } from "@/lib/flight-data"
import { DatePicker } from "@/components/ui/date-picker"

export default function SearchForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState<TripType>("roundTrip")
  const [origin, setOrigin] = useState<Location | null>({ name: "Bogotá", code: "BOG", country: "Colombia" })
  const [destination, setDestination] = useState<Location | null>(null)
  const [departureDate, setDepartureDate] = useState<string>("2025-05-12")
  const [returnDate, setReturnDate] = useState<string>("2025-05-19")
  const [passengers, setPassengers] = useState<number>(1)
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [styleError, setStyleError] = useState(false)
   const [showRadioSelector, setShowRadioSelector] = useState(true)
  const [isSticky, setIsSticky] = useState(false)
   const [isMobile, setIsMobile] = useState(false)

  // Obtener la fecha actual en formato YYYY-MM-DD sin ajustes de zona horaria
  const getTodayFormatted = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1 // getMonth() devuelve 0-11
    const day = today.getDate()

    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  // Usar esta función para establecer la fecha mínima
  const today = getTodayFormatted()

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      setStyleError(true)
      return
    }



    const searchParams = new URLSearchParams()
    searchParams.append("origin", `${origin.name} (${origin.code})`)
    searchParams.append("destination", `${destination.name} (${destination.code})`)
    searchParams.append("departureDate", departureDate)
    if (tripType === "roundTrip") {
      searchParams.append("returnDate", returnDate)
      setIsLoading(true)
    }
    searchParams.append("passengers", passengers.toString())
    searchParams.append("tripType", tripType)
    setIsLoading(false)
    

    router.push(`/resultados?${searchParams.toString()}`)
 
  }

 useEffect(() => {
    // Detectar si es móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px es el breakpoint md de Tailwind
    }
    
    // Verificar al montar y al cambiar tamaño
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Solo ocultar el RadioSelector si NO es móvil
      if (!isMobile) {
        setShowRadioSelector(currentScrollY <= 10)
      }
      
      // Activar sticky después de cierto scroll
      setIsSticky(currentScrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', checkIfMobile)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile]) // Dependencia añadida



  useEffect(() => {
  if (destination) {
    setStyleError(false);
  }
}, [destination]);

  return (
    <section className={`bg-white/40 rounded-2xl sticky top-0 z-50 transition-all ${isSticky ? 'shadow-lg bg-white' : ''}`}>


      <div className={`transition-all duration-300 overflow-hidden ${
        showRadioSelector || isMobile ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <p className="h-4"></p>
        <div className="w-[300px] bg-white flex mb-4 py-2 justify-center items-center rounded-2xl ml-4">
          <RadioSelector
            options={[
              { value: "roundTrip", label: "Ida y vuelta" },
              { value: "oneWay", label: "Solo ida" },
            ]}
            value={tripType}
            onChange={(value) => setTripType(value as TripType)}
          />
        </div>
      </div>

   <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
  <div className="bg-white flex flex-col md:flex-row items-center gap-2">
    {/* Origen y Destino pegados */}
    <div className="flex flex-col md:flex-row w-full md:w-auto">
      <section className="border border-gray-300 rounded-lg flex">
{/* Origen */}
      <div className="md:w-[250px] relative hover:border-b-2 hover:border-green-500">
        <div className=" rounded-lg p-2 cursor-pointer" onClick={() => setShowOriginDropdown(true)}>
          <div className="text-xs text-gray-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Origen
          </div>
          <div className="font-medium">{origin ? `${origin.name} (${origin.code})` : "Seleccionar origen"}</div>
        </div>
        <section className="absolute w-[100%] md:w-[700px] z-10 mt-8">
          <LocationDropdown
            locations={popularDestinations}
            onSelect={setOrigin}
            excludeCode={destination?.code}
            label="Origen"
            isOpen={showOriginDropdown}
            onClose={() => setShowOriginDropdown(false)}
          />
        </section>
      </div>

        <div className="flex justify-center items-center">
          <div className="border-l border-gray-300 h-10"></div>
        </div>
      {/* Destino */}
      <div className="md:w-[250px]  hover:border-b-2 hover:border-green-500 relative mt-2 md:mt-0 md:ml-2">
        <div className={`  p-2 cursor-pointer ${styleError ? "border-red-500" : ""}`} onClick={() => setShowDestinationDropdown(true)}>
          <div className="text-xs text-gray-500 flex items-center">
            <Plane className="w-4 h-4 mr-1" />
            Destino
          </div>
          <div className="font-medium">
            {destination ? `${destination.name} (${destination.code})` : "Seleccionar destino"}
          </div>
        </div>
        <section className="absolute w-[100%] md:w-[700px] z-10">
          <LocationDropdown
            locations={popularDestinations}
            onSelect={setDestination}
            excludeCode={origin?.code}
            label="Destino"
            isOpen={showDestinationDropdown}
            onClose={() => setShowDestinationDropdown(false)}
          />
        </section> 
      </div>
      </section>
      

    </div>
    <section className=" border border-gray-300 rounded-lg p-2 hover:border-b-2 hover:border-b-green-500  hidden md:flex">
    {/* Fecha Ida */}
    <div className="w-full md:w-[180px] ">
      <DatePicker label="Ida" value={departureDate} onChange={setDepartureDate} minDate={today} />
    </div>

       <div className="flex justify-center items-center px-3">
          <div className="border-l border-gray-300 h-10"></div>
        </div>

    {/* Fecha Vuelta */}
    <div className="w-full md:w-[180px]">
      <DatePicker
        label="Vuelta"
        value={returnDate}
        onChange={setReturnDate}
        minDate={departureDate}
        disabled={tripType === "oneWay"}
      />
    </div>
    </section>


    {/* Pasajeros */}
    <div className="w-full md:w-[160px] relative hidden md:block">
      <div
        className="border border-gray-300 rounded-lg p-2 cursor-pointer"
        onClick={() => setShowPassengersDropdown(!showPassengersDropdown)}
      >
        <div className="text-xs text-gray-500 flex items-center">
          <Users className="w-4 h-4 mr-1" />
          Pasajeros
        </div>
        <div className="font-medium flex items-center justify-between">
          <span>{passengers}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {showPassengersDropdown && (
        <PassengersDropdown
          value={passengers}
          onChange={setPassengers}
          onClose={() => setShowPassengersDropdown(false)}
        />
      )}
    </div>

    {/* Botón de búsqueda */}
    <div className="w-full md:w-auto mt-4 md:mt-0">
      {!isLoading ? (
        <button
          className="bg-black text-white rounded-full px-12 py-3 font-medium hover:bg-red-300 transition w-full md:w-auto"
          onClick={handleSearch}
        >
          Buscar
        </button>
      ) : (
        <button className="bg-black text-white rounded-full px-12 py-3 font-medium disabled:bg-gray-300 transition w-full md:w-auto">
          Buscando...
        </button>
      )}
    </div>
  </div>
</div>
    </section>
  )
}
