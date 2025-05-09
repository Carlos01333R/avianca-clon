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
  if (destination) {
    setStyleError(false);
  }
}, [destination]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex space-x-4 mb-6">
        <RadioSelector
          options={[
            { value: "roundTrip", label: "Ida y vuelta" },
            { value: "oneWay", label: "Solo ida" },
          ]}
          value={tripType}
          onChange={(value) => setTripType(value as TripType)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Origen */}
        <div className="md:col-span-1 relative">
          <div className="border rounded-lg p-3 cursor-pointer" onClick={() => setShowOriginDropdown(true)}>
            <div className="text-xs text-gray-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Origen
            </div>
            <div className="font-medium">{origin ? `${origin.name} (${origin.code})` : "Seleccionar origen"}</div>
          </div>
          <section className="absolute w-[100%] md:w-[400px]">
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

        {/* Destino */}
        <div className="md:col-span-1 relative">
          <div className={`border rounded-lg p-3 cursor-pointer ${styleError ? "border-red-500" : ""}`} onClick={() => setShowDestinationDropdown(true)}>
            <div className="text-xs text-gray-500 flex items-center">
              <Plane className="w-4 h-4 mr-1" />
              Destino
            </div>
            <div className="font-medium">
              {destination ? `${destination.name} (${destination.code})` : "Seleccionar destino"}
            </div>
          </div>
          <section className="absolute w-[100%] md:w-[400px]">
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

        {/* Fecha Ida */}
        <div className="md:col-span-1">
          <DatePicker label="Ida" value={departureDate} onChange={setDepartureDate} minDate={today} />
        </div>

        {/* Fecha Vuelta */}
        <div className="md:col-span-1">
          <DatePicker
            label="Vuelta"
            value={returnDate}
            onChange={setReturnDate}
            minDate={departureDate}
            disabled={tripType === "oneWay"}
          />
        </div>

        {/* Pasajeros */}
        <div className="md:col-span-1 relative">
          <div
            className="border rounded-lg p-3 cursor-pointer"
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
      </div>

      <div className="mt-6 flex justify-center">
        {!isLoading ? (
          <button
            className="bg-red-500 text-white rounded-full px-12 py-3 font-medium hover:bg-red-300 transition"
            onClick={handleSearch}
          >
            Buscar
          </button>
        ) : (
          <button className="bg-red-500 text-white rounded-full px-12 py-3 font-medium disabled:bg-gray-300 transition">
            Buscando...
          </button>
        )}
       
      </div>
    </div>
  )
}
