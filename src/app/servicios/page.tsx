"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Luggage, Armchair, Shield } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"

export default function ServiciosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Obtener parámetros del vuelo seleccionado
  const flightId = searchParams.get("flightId") || ""
  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const departureTime = searchParams.get("departureTime") || ""
  const arrivalTime = searchParams.get("arrivalTime") || ""
  const duration = searchParams.get("duration") || ""
  const price = Number(searchParams.get("price") || "0")
  const passengers = Number(searchParams.get("passengers") || "1")
  const direct = searchParams.get("direct") === "true"
  const fareType = searchParams.get("fareType") || ""

  // Servicios adicionales seleccionados
  const [selectedServices, setSelectedServices] = useState({
    extraLuggage: false,
    seatSelection: false,
    travelInsurance: false,
  })

  useEffect(() => {
    // Verificar si tenemos los datos necesarios
    if (!flightId || !origin || !destination) {
      router.push("/")
      return
    }

    // Simular carga
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [flightId, origin, destination, router])

  const handleServiceChange = (service: keyof typeof selectedServices) => {
    setSelectedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }))
  }

  const handleContinue = () => {
    // Crear parámetros para la siguiente página
    const nextParams = new URLSearchParams(searchParams.toString())

    // Añadir servicios seleccionados
    Object.entries(selectedServices).forEach(([key, value]) => {
      nextParams.set(key, value.toString())
    })

    // Redirigir a la página de asientos
    router.push(`/asientos?${nextParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <img src="/loading.gif" alt="Cargando..." className="w-32 h-32 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="mr-4 text-gray-600" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <SiteLogo className="h-8" />
            </div>
            <div>
              <button className="bg-white border border-gray-300 rounded-full px-4 py-1 text-sm font-medium flex items-center">
                COP 0
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center text-gray-400">
            <span className="mr-2">Vuelos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Pasajeros</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-red-600 font-medium">
            <span className="mx-2">Servicios</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Asientos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Pago</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Confirmación</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Servicios adicionales</h1>

        {/* Flight summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-center mr-8">
                <div className="text-xl font-bold">{departureTime}</div>
                <div className="text-sm text-gray-500">{origin}</div>
              </div>

              <div className="flex flex-col items-center mx-4">
                <div className="text-xs text-blue-600 font-medium mb-1">Directo</div>
                <div className="relative w-20">
                  <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{duration}</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold">{arrivalTime}</div>
                <div className="text-sm text-gray-500">{destination}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Tarifa {fareType}</div>
              <div className="text-xl font-bold">COP {price.toLocaleString("es-CO")}</div>
            </div>
          </div>
        </div>

        {/* Services selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Extra luggage */}
          <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${selectedServices.extraLuggage ? "border-2 border-red-600" : ""}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Luggage className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Equipaje adicional</h3>
              <p className="text-gray-600 text-center mb-4">Añade una maleta adicional de hasta 23kg</p>
              <div className="text-center text-xl font-bold text-red-600 mb-4">COP 120.000</div>
              <button
                className={`w-full py-2 rounded-lg font-medium ${
                  selectedServices.extraLuggage
                    ? "bg-red-600 text-white"
                    : "bg-white border border-red-600 text-red-600"
                }`}
                onClick={() => handleServiceChange("extraLuggage")}
              >
                {selectedServices.extraLuggage ? "Seleccionado" : "Añadir"}
              </button>
            </div>
          </div>

          {/* Seat selection */}
          <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${selectedServices.seatSelection ? "border-2 border-red-600" : ""}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Armchair className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Selección de asientos</h3>
              <p className="text-gray-600 text-center mb-4">Elige tu asiento preferido</p>
              <div className="text-center text-xl font-bold text-red-600 mb-4">COP 80.000</div>
              <button
                className={`w-full py-2 rounded-lg font-medium ${
                  selectedServices.seatSelection
                    ? "bg-red-600 text-white"
                    : "bg-white border border-red-600 text-red-600"
                }`}
                onClick={() => handleServiceChange("seatSelection")}
              >
                {selectedServices.seatSelection ? "Seleccionado" : "Añadir"}
              </button>
            </div>
          </div>

          {/* Travel insurance */}
          <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${selectedServices.travelInsurance ? "border-2 border-red-600" : ""}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Seguro de viaje</h3>
              <p className="text-gray-600 text-center mb-4">Protege tu viaje contra imprevistos</p>
              <div className="text-center text-xl font-bold text-red-600 mb-4">COP 95.000</div>
              <button
                className={`w-full py-2 rounded-lg font-medium ${
                  selectedServices.travelInsurance
                    ? "bg-red-600 text-white"
                    : "bg-white border border-red-600 text-red-600"
                }`}
                onClick={() => handleServiceChange("travelInsurance")}
              >
                {selectedServices.travelInsurance ? "Seleccionado" : "Añadir"}
              </button>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="text-center">
          <button
            className="bg-red-600 text-white rounded-full px-8 py-3 font-medium hover:bg-red-700 transition"
            onClick={handleContinue}
          >
            Continuar
          </button>
        </div>
      </div>
    </main>
  )
}
