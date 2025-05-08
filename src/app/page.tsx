import SearchForm from "@/components/flight/search-form"
import { HeroSection } from "@/components/sections/hero-section"
import { PromotionsSection } from "@/components/sections/promotions-section"
import { ServicesSection } from "@/components/sections/services-section"
import { DestinationsSection } from "@/components/sections/destinations-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Form Section */}
      <section className="relative z-10 -mt-24 px-4 mb-16">
        <div className="container mx-auto max-w-5xl">
          <SearchForm />
        </div>
      </section>

      {/* Promotions Section */}
      <PromotionsSection />

      {/* Services Section */}
      <ServicesSection />

   

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  )
}
