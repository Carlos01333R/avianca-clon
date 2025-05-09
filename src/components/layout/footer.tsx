import type React from "react"
import { SiteLogo } from "@/components/ui/site-logo"
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <SiteLogo className="h-8 mb-6" />
            <p className="text-black mb-6 mt-2">Conectamos personas y destinos con las mejores experiencias de viaje.</p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} />
              <SocialIcon icon={<Youtube className="w-5 h-5" />} />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
            </div>
          </div>

          <div className="">
            <h3 className="text-lg font-bold mb-4 text-black">Información</h3>
            <ul className="space-y-3 text-white flex flex-col">
            
            <a href="#" className="text-black hover:text-red-300 transition-colors">Sobre nosotros</a>
            <a href="#" className="text-black hover:text-red-300 transition-colors">Destinos</a>
            <a href="#" className="text-black hover:text-red-300 transition-colors">Flota</a>
            <a href="#" className="text-black hover:text-red-300 transition-colors">Alianzas</a>
            <a href="#" className="text-black hover:text-red-300transition-colors">Sostenibilidad</a>
          
              
             
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4  text-black">Servicios</h3>
            <ul className="space-y-3 text-white flex flex-col">
              <a href="/check-in" className="text-black hover:text-red-300 transition-colors">Check-in online</a>
              <a href="/estado-vuelo" className="text-black hover:text-red-300 transition-colors">Estado del vuelo</a>
              <a href="/equipaje-adicional" className="text-black hover:text-red-300 transition-colors">Equipaje adicional</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors">Asistencia especial</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors">Programa de viajero frecuente</a>
            
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4  text-black">Contacto</h3>
            <ul className="space-y-3 flex flex-col text-white">
              <a href="#" className="text-black hover:text-red-300 transition-colors">Atención al cliente: 01 8000 123 456</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors">Bogotá: (601) 123 4567</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors">Email: info@aerolinea.com</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors">Horario: Lunes a Domingo, 24 horas</a>
          
            </ul>
          </div>
        </div>

        <div className="border-t border-red-300 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-black mb-4 md:mb-0 text-xs">© 2025 Aerolínea. Todos los derechos reservados.</div>
            <div className="flex space-x-6">
              <a href="#" className="text-black hover:text-red-300 transition-colors text-xs"> Términos y condiciones</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors text-xs"> Política de privacidad</a>
              <a href="#" className="text-black hover:text-red-300 transition-colors text-xs"> Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a href={href} className="text-gray-400 hover:text-white">
        {label}
      </a>
    </li>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition"
    >
      {icon}
    </a>
  )
}
