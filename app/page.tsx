import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users, MapPin, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import {
  FAQSection,
  SmoothScrollLink,
} from '@/components/landing/LandingClient'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                HelloEveryone
              </span>
            </div>
            <div className="hidden items-center space-x-8 md:flex">
              <SmoothScrollLink
                href="#features"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                Features
              </SmoothScrollLink>
              <SmoothScrollLink
                href="#testimonials"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                Stories
              </SmoothScrollLink>
              <SmoothScrollLink
                href="#faq"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                FAQ
              </SmoothScrollLink>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-6xl lg:text-7xl">
                Find Your
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}
                  People
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
                Smart social matching for busy adults. Connect with like-minded
                people at local events through intelligent compatibility
                scoring.
              </p>
            </div>

            <div className="animate-fade-in-up animation-delay-200 mb-16 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full bg-indigo-600 px-8 py-4 text-lg shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl sm:w-auto"
                >
                  Start Connecting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <SmoothScrollLink href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 py-4 text-lg hover:bg-gray-50 sm:w-auto"
                >
                  Learn More
                </Button>
              </SmoothScrollLink>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up animation-delay-400 mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-indigo-600">
                  10K+
                </div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-indigo-600">
                  500+
                </div>
                <div className="text-gray-600">Events Monthly</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-indigo-600">
                  95%
                </div>
                <div className="text-gray-600">Match Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-xl text-gray-600">
              Our intelligent matching system helps you find meaningful
              connections at real-world events
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="feature-card animate-fade-in-up animation-delay-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 transition-transform group-hover:scale-110">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                AI-powered compatibility scoring based on interests,
                personality, and preferences
              </p>
            </div>

            <div className="feature-card animate-fade-in-up animation-delay-400">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 transition-transform group-hover:scale-110">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Local Events
              </h3>
              <p className="text-gray-600">
                Discover and attend curated events in your area with compatible
                matches
              </p>
            </div>

            <div className="feature-card animate-fade-in-up animation-delay-600">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-transform group-hover:scale-110">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Easy Planning
              </h3>
              <p className="text-gray-600">
                Seamlessly sync events to your calendar and coordinate with your
                matches
              </p>
            </div>

            <div className="feature-card animate-fade-in-up animation-delay-800">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 transition-transform group-hover:scale-110">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Meaningful Connections
              </h3>
              <p className="text-gray-600">
                Build lasting friendships and relationships with people who
                truly understand you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-xl text-gray-600">
              See how HelloEveryone has helped thousands find their perfect
              social circle
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="testimonial-card animate-fade-in-up animation-delay-200">
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 italic text-gray-700">
                "I found my best friend through a hiking event. The matching was
                so accurate - we had everything in common!"
              </p>
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 font-semibold text-white">
                  S
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-500">Marketing Manager</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card animate-fade-in-up animation-delay-400">
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 italic text-gray-700">
                "As someone who just moved to the city, HelloEveryone helped me
                build an entire social network within months."
              </p>
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-semibold text-white">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Mike L.</div>
                  <div className="text-sm text-gray-500">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card animate-fade-in-up animation-delay-600">
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 italic text-gray-700">
                "The events are always well-organized and I've met so many
                interesting people. It's changed my social life completely."
              </p>
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 font-semibold text-white">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Alex K.</div>
                  <div className="text-sm text-gray-500">Teacher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="animate-fade-in-up mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="animate-fade-in-up animation-delay-200 text-xl text-gray-600">
              Everything you need to know about HelloEveryone
            </p>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="animate-fade-in-up mb-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to Find Your People?
          </h2>
          <p className="animate-fade-in-up animation-delay-200 mb-8 text-xl text-indigo-100">
            Join thousands of others who have already found their perfect social
            circle
          </p>
          <div className="animate-fade-in-up animation-delay-400 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="w-full px-8 py-4 text-lg shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <SmoothScrollLink href="#features">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white px-8 py-4 text-lg text-white transition-all hover:bg-white hover:text-indigo-600 sm:w-auto"
              >
                Learn More
              </Button>
            </SmoothScrollLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="animate-fade-in-up">
              <div className="mb-4 flex items-center">
                <Heart className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">HelloEveryone</span>
              </div>
              <p className="mb-4 text-gray-400">
                Connecting like-minded people through intelligent matching at
                local events.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <SmoothScrollLink
                    href="#features"
                    className="transition-colors hover:text-white"
                  >
                    Features
                  </SmoothScrollLink>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Events
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up animation-delay-600">
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/privacy"
                    className="transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="transition-colors hover:text-white"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HelloEveryone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
