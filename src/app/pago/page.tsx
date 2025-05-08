"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  ChevronRight,
  User,
  Calendar,
  Clock,
  MapPin,
  Plane,
  Shield,
  Luggage,
  Armchair,
  Info,
} from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import { formatPrice } from "@/lib/format-utils"
import { useAuth } from "@/hooks/use-auth"

type PaymentMethod = "credit" | "debit" | "paypal" | "pse"
type PaymentStep = "passenger" | "payment" | "confirmation"

export default function PagoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const [currentStep, setCurrentStep] = useState<PaymentStep>("passenger")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit")
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Datos del formulario
  const [passengerData, setPassengerData] = useState({
    firstName: isAuthenticated ? user?.name?.split(" ")[0] || "" : "",
    lastName: isAuthenticated ? user?.name?.split(" ").slice(1).join(" ") || "" : "",
    email: isAuthenticated ? user?.email || "" : "",
    phone: "",
    documentType: "cc",
    documentNumber: "",
    birthDate: "",
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  })

  // Datos del vuelo desde los parámetros de URL
  const flightId = searchParams.get("flightId") || ""
  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const departureTime = searchParams.get("departureTime") || ""
  const arrivalTime = searchParams.get("arrivalTime") || ""
  const duration = searchParams.get("duration") || ""
  const price = Number(searchParams.get("price") || "0")
  const passengers = Number(searchParams.get("passengers") || "1")
  const direct = searchParams.get("direct") === "true"

  // Calcular precios
  const basePrice = price * passengers
  const taxes = Math.round(basePrice * 0.19) // 19% de impuestos
  const serviceFee = 35000 // Tarifa de servicio fija
  const totalPrice = basePrice + taxes + serviceFee

  // Servicios adicionales
  const [selectedServices, setSelectedServices] = useState({
    insurance: false,
    luggage: false,
    seat: false,
  })

  // Calcular precio total con servicios adicionales
  const insurancePrice = 45000 * passengers
  const luggagePrice = 60000 * passengers
  const seatPrice = 35000 * passengers

  const servicesTotal =
    (selectedServices.insurance ? insurancePrice : 0) +
    (selectedServices.luggage ? luggagePrice : 0) +
    (selectedServices.seat ? seatPrice : 0)

  const grandTotal = totalPrice + servicesTotal

  // Verificar si tenemos los datos necesarios
  useEffect(() => {
    if (!flightId || !origin || !destination) {
      router.push("/")
    }
  }, [flightId, origin, destination, router])

  // Manejar cambios en los datos del pasajero
  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setPassengerData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar error cuando el usuario corrige el campo
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Manejar cambios en los datos de pago
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar error cuando el usuario corrige el campo
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Manejar cambios en servicios adicionales
  const handleServiceChange = (service: keyof typeof selectedServices) => {
    setSelectedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }))
  }

  // Validar formulario de pasajero
  const validatePassengerForm = () => {
    const errors: Record<string, string> = {}

    if (!passengerData.firstName.trim()) {
      errors.firstName = "El nombre es requerido"
    }

    if (!passengerData.lastName.trim()) {
      errors.lastName = "El apellido es requerido"
    }

    if (!passengerData.email.trim()) {
      errors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(passengerData.email)) {
      errors.email = "Email inválido"
    }

    if (!passengerData.phone.trim()) {
      errors.phone = "El teléfono es requerido"
    }

    if (!passengerData.documentNumber.trim()) {
      errors.documentNumber = "El número de documento es requerido"
    }

    if (!passengerData.birthDate) {
      errors.birthDate = "La fecha de nacimiento es requerida"
    }

    return errors
  }

  // Validar formulario de pago
  const validatePaymentForm = () => {
    const errors: Record<string, string> = {}

    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (!paymentData.cardNumber.trim()) {
        errors.cardNumber = "El número de tarjeta es requerido"
      } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Número de tarjeta inválido"
      }

      if (!paymentData.cardName.trim()) {
        errors.cardName = "El nombre en la tarjeta es requerido"
      }

      if (!paymentData.expiryDate.trim()) {
        errors.expiryDate = "La fecha de expiración es requerida"
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        errors.expiryDate = "Formato inválido (MM/YY)"
      }

      if (!paymentData.cvv.trim()) {
        errors.cvv = "El código de seguridad es requerido"
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        errors.cvv = "CVV inválido"
      }
    }

    return errors
  }

  // Manejar avance al siguiente paso
  const handleNextStep = () => {
    if (currentStep === "passenger") {
      const errors = validatePassengerForm()
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }
      setCurrentStep("payment")
      window.scrollTo(0, 0)
    } else if (currentStep === "payment") {
      const errors = validatePaymentForm()
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }
      setCurrentStep("confirmation")
      window.scrollTo(0, 0)
    }
  }

  // Manejar el envío final del pago
  const handleSubmitPayment = async () => {
    setLoading(true)

    {/* 

      guardamos toda la información del vuelo en la base de datos
       try {
      // Simulamos el procesamiento del pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulamos un pago exitoso
      setCompleted(true)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setFormErrors({
        payment: "Hubo un error al procesar el pago. Por favor, inténtalo de nuevo.",
      })
    } finally {
      setLoading(false)
    }
      */}
   
  }

  // Formatear número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formatear fecha de expiración
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Renderizar el paso de información de pasajero
  const renderPassengerStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Información del pasajero</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={passengerData.firstName}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.firstName ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ingresa tu nombre"
          />
          {formErrors.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={passengerData.lastName}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.lastName ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ingresa tu apellido"
          />
          {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={passengerData.email}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="ejemplo@correo.com"
          />
          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={passengerData.phone}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.phone ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ingresa tu número de teléfono"
          />
          {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de documento
          </label>
          <select
            id="documentType"
            name="documentType"
            value={passengerData.documentType}
            onChange={handlePassengerChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="cc">Cédula de Ciudadanía</option>
            <option value="ce">Cédula de Extranjería</option>
            <option value="passport">Pasaporte</option>
          </select>
        </div>

        <div>
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento
          </label>
          <input
            type="text"
            id="documentNumber"
            name="documentNumber"
            value={passengerData.documentNumber}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.documentNumber ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ingresa tu número de documento"
          />
          {formErrors.documentNumber && <p className="mt-1 text-sm text-red-600">{formErrors.documentNumber}</p>}
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={passengerData.birthDate}
            onChange={handlePassengerChange}
            className={`w-full p-3 border rounded-lg ${formErrors.birthDate ? "border-red-500" : "border-gray-300"}`}
          />
          {formErrors.birthDate && <p className="mt-1 text-sm text-red-600">{formErrors.birthDate}</p>}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Servicios adicionales</h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition">
          <input
            type="checkbox"
            id="insurance"
            checked={selectedServices.insurance}
            onChange={() => handleServiceChange("insurance")}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="insurance" className="ml-3 flex-1 cursor-pointer">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="font-medium">Seguro de viaje</span>
              <span className="ml-auto font-medium text-emerald-600">{formatPrice(insurancePrice)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Protege tu viaje contra imprevistos y emergencias médicas</p>
          </label>
        </div>

        <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition">
          <input
            type="checkbox"
            id="luggage"
            checked={selectedServices.luggage}
            onChange={() => handleServiceChange("luggage")}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="luggage" className="ml-3 flex-1 cursor-pointer">
            <div className="flex items-center">
              <Luggage className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="font-medium">Equipaje adicional</span>
              <span className="ml-auto font-medium text-emerald-600">{formatPrice(luggagePrice)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Añade una maleta adicional de hasta 23kg</p>
          </label>
        </div>

        <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-emerald-200 transition">
          <input
            type="checkbox"
            id="seat"
            checked={selectedServices.seat}
            onChange={() => handleServiceChange("seat")}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label htmlFor="seat" className="ml-3 flex-1 cursor-pointer">
            <div className="flex items-center">
              <Armchair className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="font-medium">Selección de asiento</span>
              <span className="ml-auto font-medium text-emerald-600">{formatPrice(seatPrice)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Elige tu asiento preferido para un viaje más cómodo</p>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNextStep}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center"
        >
          Continuar al pago
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  )

  // Renderizar el paso de pago
  const renderPaymentStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Método de pago</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`border rounded-lg p-4 text-center cursor-pointer transition ${paymentMethod === "credit" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200"}`}
          onClick={() => setPaymentMethod("credit")}
        >
          <div className="flex justify-center mb-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="font-medium">Tarjeta de crédito</div>
        </div>

        <div
          className={`border rounded-lg p-4 text-center cursor-pointer transition ${paymentMethod === "debit" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200"}`}
          onClick={() => setPaymentMethod("debit")}
        >
          <div className="flex justify-center mb-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="font-medium">Tarjeta débito</div>
        </div>

        <div
          className={`border rounded-lg p-4 text-center cursor-pointer transition ${paymentMethod === "paypal" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200"}`}
          onClick={() => setPaymentMethod("paypal")}
        >
          <div className="flex justify-center mb-2">
            <svg className="h-6 w-6 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19c-1.717 0-3.146 1.27-3.403 2.94l-1.124 7.109c-.047.38.27.548.422.548h4.606l1.143-7.202c.058-.368.42-.633.789-.633h2.199c4.213 0 7.158-1.876 8.399-7.141.6-2.527.205-4.286-1.635-5.708z" />
            </svg>
          </div>
          <div className="font-medium">PayPal</div>
        </div>

        <div
          className={`border rounded-lg p-4 text-center cursor-pointer transition ${paymentMethod === "pse" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200"}`}
          onClick={() => setPaymentMethod("pse")}
        >
          <div className="flex justify-center mb-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#00A1DF" />
              <path d="M5 12H19M12 5V19" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="font-medium">PSE</div>
        </div>
      </div>

      {(paymentMethod === "credit" || paymentMethod === "debit") && (
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value)
                setPaymentData({ ...paymentData, cardNumber: formatted })

                // Limpiar error cuando el usuario corrige el campo
                if (formErrors.cardNumber) {
                  setFormErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.cardNumber
                    return newErrors
                  })
                }
              }}
              maxLength={19}
              className={`w-full p-3 border rounded-lg ${formErrors.cardNumber ? "border-red-500" : "border-gray-300"}`}
              placeholder="1234 5678 9012 3456"
            />
            {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
          </div>

          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre en la tarjeta
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={paymentData.cardName}
              onChange={handlePaymentChange}
              className={`w-full p-3 border rounded-lg ${formErrors.cardName ? "border-red-500" : "border-gray-300"}`}
              placeholder="Como aparece en la tarjeta"
            />
            {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value)
                  setPaymentData({ ...paymentData, expiryDate: formatted })

                  // Limpiar error cuando el usuario corrige el campo
                  if (formErrors.expiryDate) {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.expiryDate
                      return newErrors
                    })
                  }
                }}
                maxLength={5}
                className={`w-full p-3 border rounded-lg ${formErrors.expiryDate ? "border-red-500" : "border-gray-300"}`}
                placeholder="MM/YY"
              />
              {formErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                Código de seguridad (CVV)
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
                maxLength={4}
                className={`w-full p-3 border rounded-lg ${formErrors.cvv ? "border-red-500" : "border-gray-300"}`}
                placeholder="123"
              />
              {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={paymentData.saveCard}
              onChange={handlePaymentChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
              Guardar esta tarjeta para futuras compras
            </label>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
          <p className="text-gray-600 mb-4">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
          <div className="flex justify-center">
            <svg className="h-10 w-32" viewBox="0 0 101 32" fill="none">
              <path
                d="M38.594 3.686h-7.736c-.53 0-.984.386-1.066.91l-3.14 19.924a.644.644 0 0 0 .636.744h3.708c.53 0 .984-.386 1.066-.91l.848-5.368a1.07 1.07 0 0 1 1.066-.91h2.448c5.12 0 8.07-2.476 8.848-7.38.35-2.144.014-3.83-.994-5.01-1.1-1.294-3.05-2-5.684-2zm.896 7.274c-.424 2.79-2.554 2.79-4.614 2.79h-1.172l.822-5.204a.644.644 0 0 1 .636-.546h.536c1.404 0 2.73 0 3.414.8.408.48.532 1.192.378 2.16zm18.318-.546h-3.722c-.306 0-.572.224-.636.546l-.164 1.036-.258-.374c-.8-1.162-2.582-1.55-4.362-1.55-4.082 0-7.57 3.092-8.246 7.434-.352 2.16.148 4.228 1.376 5.67 1.13 1.328 2.742 1.88 4.66 1.88 3.294 0 5.12-2.116 5.12-2.116l-.164 1.026a.644.644 0 0 0 .636.744h3.348c.53 0 .984-.386 1.066-.91l2.008-12.7a.644.644 0 0 0-.636-.744l.044.058zm-5.19 7.208c-.356 2.11-2.036 3.53-4.18 3.53-.94 0-1.7-.302-2.184-.874-.48-.568-.662-1.376-.51-2.274.33-2.078 2.036-3.53 4.152-3.53.92 0 1.672.302 2.17.88.498.578.69 1.39.552 2.268zm26.264-6.662h-3.736a1.07 1.07 0 0 0-.88.462l-5.078 7.478-2.154-7.198a1.07 1.07 0 0 0-1.024-.742h-3.666a.644.644 0 0 0-.608.85l4.06 11.9-3.818 5.388a.644.644 0 0 0 .526 1.02h3.722a1.07 1.07 0 0 0 .88-.462l12.26-17.702a.644.644 0 0 0-.526-1.02l.042.026zM84.636 3.686h-7.736c-.53 0-.984.386-1.066.91l-3.14 19.924a.644.644 0 0 0 .636.744h3.974a.751.751 0 0 0 .742-.63l.89-5.648a1.07 1.07 0 0 1 1.066-.91h2.448c5.12 0 8.07-2.476 8.848-7.38.35-2.144.014-3.83-.994-5.01-1.1-1.294-3.05-2-5.684-2h.016zm.896 7.274c-.424 2.79-2.554 2.79-4.614 2.79h-1.172l.822-5.204a.644.644 0 0 1 .636-.546h.536c1.404 0 2.73 0 3.414.8.408.48.532 1.192.378 2.16zm18.318-.546h-3.722c-.306 0-.572.224-.636.546l-.164 1.036-.258-.374c-.8-1.162-2.582-1.55-4.362-1.55-4.082 0-7.57 3.092-8.246 7.434-.352 2.16.148 4.228 1.376 5.67 1.13 1.328 2.742 1.88 4.66 1.88 3.294 0 5.12-2.116 5.12-2.116l-.164 1.026a.644.644 0 0 0 .636.744h3.348c.53 0 .984-.386 1.066-.91l2.008-12.7a.644.644 0 0 0-.636-.744l.044.058zm-5.19 7.208c-.356 2.11-2.036 3.53-4.18 3.53-.94 0-1.7-.302-2.184-.874-.48-.568-.662-1.376-.51-2.274.33-2.078 2.036-3.53 4.152-3.53.92 0 1.672.302 2.17.88.498.578.69 1.39.552 2.268z"
                fill="#253B80"
              />
              <path
                d="M12.11 3.686H4.374c-.53 0-.984.386-1.066.91L.168 24.52a.644.644 0 0 0 .636.744h3.974a.751.751 0 0 0 .742-.63l.89-5.648a1.07 1.07 0 0 1 1.066-.91h2.448c5.12 0 8.07-2.476 8.848-7.38.35-2.144.014-3.83-.994-5.01-1.1-1.294-3.05-2-5.684-2h.016zm.896 7.274c-.424 2.79-2.554 2.79-4.614 2.79H7.22l.822-5.204a.644.644 0 0 1 .636-.546h.536c1.404 0 2.73 0 3.414.8.408.48.532 1.192.378 2.16zm18.318-.546h-3.722c-.306 0-.572.224-.636.546l-.164 1.036-.258-.374c-.8-1.162-2.582-1.55-4.362-1.55-4.082 0-7.57 3.092-8.246 7.434-.352 2.16.148 4.228 1.376 5.67 1.13 1.328 2.742 1.88 4.66 1.88 3.294 0 5.12-2.116 5.12-2.116l-.164 1.026a.644.644 0 0 0 .636.744h3.348c.53 0 .984-.386 1.066-.91l2.008-12.7a.644.644 0 0 0-.636-.744l.044.058zm-5.19 7.208c-.356 2.11-2.036 3.53-4.18 3.53-.94 0-1.7-.302-2.184-.874-.48-.568-.662-1.376-.51-2.274.33-2.078 2.036-3.53 4.152-3.53.92 0 1.672.302 2.17.88.498.578.69 1.39.552 2.268z"
                fill="#179BD7"
              />
            </svg>
          </div>
        </div>
      )}

      {paymentMethod === "pse" && (
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
              Selecciona tu banco
            </label>
            <select id="bank" name="bank" className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="">Selecciona un banco</option>
              <option value="bancolombia">Bancolombia</option>
              <option value="davivienda">Davivienda</option>
              <option value="bbva">BBVA</option>
              <option value="bogota">Banco de Bogotá</option>
              <option value="popular">Banco Popular</option>
            </select>
          </div>

          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de persona
            </label>
            <select id="personType" name="personType" className="w-full p-3 border border-gray-300 rounded-lg">
              <option value="natural">Persona Natural</option>
              <option value="juridica">Persona Jurídica</option>
            </select>
          </div>
        </div>
      )}

      {formErrors.payment && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {formErrors.payment}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => {
            setCurrentStep("passenger")
            window.scrollTo(0, 0)
          }}
          className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver
        </button>

        <button
          onClick={handleNextStep}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center"
        >
          Revisar y confirmar
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  )

  // Renderizar el paso de confirmación
  const renderConfirmationStep = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Confirmar y pagar</h2>

      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg mb-2">Resumen del vuelo</h3>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Plane className="w-5 h-5 text-gray-500 mr-2" />
              <span className="font-medium">Vuelo {flightId}</span>
              <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {direct ? "Directo" : "1 Escala"}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <span>12 de mayo, 2025</span>
            </div>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <span>
                {origin} - {destination}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-2" />
              <span>Duración: {duration}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-500 mb-1">Hora de salida</div>
            <div className="text-xl font-bold">{departureTime}</div>
            <div className="text-sm text-gray-500 mt-2 mb-1">Hora de llegada</div>
            <div className="text-xl font-bold">{arrivalTime}</div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg mb-2">Información del pasajero</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-gray-500">Nombre:</span>
            <span className="ml-2 font-medium">
              {passengerData.firstName} {passengerData.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2 font-medium truncate">{passengerData.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Teléfono:</span>
            <span className="ml-2 font-medium">{passengerData.phone}</span>
          </div>
          <div>
            <span className="text-gray-500">Documento:</span>
            <span className="ml-2 font-medium">
              {passengerData.documentType === "cc" ? "CC" : passengerData.documentType === "ce" ? "CE" : "Pasaporte"}{" "}
              {passengerData.documentNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg mb-2">Método de pago</h3>
        <div className="flex items-center">
          {paymentMethod === "credit" && (
            <>
              <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
              <span>Tarjeta de crédito terminada en {paymentData.cardNumber.slice(-4)}</span>
            </>
          )}
          {paymentMethod === "debit" && (
            <>
              <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
              <span>Tarjeta débito terminada en {paymentData.cardNumber.slice(-4)}</span>
            </>
          )}
          {paymentMethod === "paypal" && (
            <>
              <svg className="h-5 w-5 text-[#003087] mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19c-1.717 0-3.146 1.27-3.403 2.94l-1.124 7.109c-.047.38.27.548.422.548h4.606l1.143-7.202c.058-.368.42-.633.789-.633h2.199c4.213 0 7.158-1.876 8.399-7.141.6-2.527.205-4.286-1.635-5.708z" />
              </svg>
              <span>PayPal</span>
            </>
          )}
          {paymentMethod === "pse" && (
            <>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#00A1DF" />
                <path d="M5 12H19M12 5V19" stroke="white" strokeWidth="2" />
              </svg>
              <span>PSE</span>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Resumen de precios</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              Tarifa base ({passengers} {passengers > 1 ? "pasajeros" : "pasajero"})
            </span>
            <span>{formatPrice(basePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos y tasas</span>
            <span>{formatPrice(taxes)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa de servicio</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>

          {selectedServices.insurance && (
            <div className="flex justify-between">
              <span>Seguro de viaje</span>
              <span>{formatPrice(insurancePrice)}</span>
            </div>
          )}

          {selectedServices.luggage && (
            <div className="flex justify-between">
              <span>Equipaje adicional</span>
              <span>{formatPrice(luggagePrice)}</span>
            </div>
          )}

          {selectedServices.seat && (
            <div className="flex justify-between">
              <span>Selección de asiento</span>
              <span>{formatPrice(seatPrice)}</span>
            </div>
          )}

          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-emerald-600">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
          <p className="text-sm text-gray-600">
            Al hacer clic en "Confirmar y pagar", aceptas nuestros{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              política de privacidad
            </a>
            .
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => {
            setCurrentStep("payment")
            window.scrollTo(0, 0)
          }}
          className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver
        </button>

        <button
          onClick={handleSubmitPayment}
          disabled={loading}
          className={`bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </>
          ) : (
            <>
              Confirmar y pagar
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )

  // Renderizar la confirmación de pago exitoso
  const renderSuccessMessage = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-100 rounded-full p-4">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">¡Pago completado con éxito!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Tu reserva ha sido confirmada. Hemos enviado los detalles de tu vuelo a tu correo electrónico.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
        <h3 className="font-bold text-lg mb-4 text-left">Detalles de la reserva</h3>
        <div className="text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Número de reserva:</span>
            <span className="font-medium">RES-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vuelo:</span>
            <span className="font-medium">{flightId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ruta:</span>
            <span className="font-medium">
              {origin} - {destination}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">12 de mayo, 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pasajeros:</span>
            <span className="font-medium">{passengers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total pagado:</span>
            <span className="font-medium text-emerald-600">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          href="/"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          Volver al inicio
        </Link>
        <Link
          href="/mis-viajes"
          className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition"
        >
          Ver mis viajes
        </Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
     

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {!completed ? (
          <>
            {/* Pasos del proceso */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "passenger" ? "bg-emerald-600 text-white" : currentStep === "payment" || currentStep === "confirmation" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-sm mt-2">Pasajero</div>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${currentStep === "payment" || currentStep === "confirmation" ? "bg-emerald-600" : "bg-gray-200"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "payment" ? "bg-emerald-600 text-white" : currentStep === "confirmation" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-sm mt-2">Pago</div>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${currentStep === "confirmation" ? "bg-emerald-600" : "bg-gray-200"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "confirmation" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-sm mt-2">Confirmación</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {currentStep === "passenger" && renderPassengerStep()}
                {currentStep === "payment" && renderPaymentStep()}
                {currentStep === "confirmation" && renderConfirmationStep()}
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                  <h3 className="font-bold text-lg mb-4">Resumen de tu compra</h3>

                  <div className="border-b pb-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Vuelo {flightId}</span>
                      <span>
                        {origin} - {destination}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Salida</span>
                      <span>{departureTime}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Llegada</span>
                      <span>{arrivalTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pasajeros</span>
                      <span>{passengers}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Tarifa base</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos y tasas</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarifa de servicio</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>

                    {selectedServices.insurance && (
                      <div className="flex justify-between">
                        <span>Seguro de viaje</span>
                        <span>{formatPrice(insurancePrice)}</span>
                      </div>
                    )}

                    {selectedServices.luggage && (
                      <div className="flex justify-between">
                        <span>Equipaje adicional</span>
                        <span>{formatPrice(luggagePrice)}</span>
                      </div>
                    )}

                    {selectedServices.seat && (
                      <div className="flex justify-between">
                        <span>Selección de asiento</span>
                        <span>{formatPrice(seatPrice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          renderSuccessMessage()
        )}
      </div>
    </main>
  )
}
