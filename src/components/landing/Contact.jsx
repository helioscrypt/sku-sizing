import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Create mailto link with form data
    const subject = encodeURIComponent(`Azure Landing Zone Inquiry from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`
    )
    window.location.href = `mailto:felix@helioscrypt.com?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="py-20 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-helio-500/10 border border-helio-500/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-sm text-helio-300 font-medium">Available for Projects</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Let's Build Your
              <span className="gradient-text"> Cloud Infrastructure</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8">
              Need help sizing your Azure Landing Zone or implementing enterprise-grade cloud infrastructure?
              Get in touch for a free consultation.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <a
                href="mailto:felix@helioscrypt.com"
                className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-helio-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white font-medium">felix@helioscrypt.com</p>
                </div>
              </a>

              <a
                href="tel:+491712775258"
                className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-helio-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-white font-medium">+49 171 2775258</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-white font-medium">Frankfurt, Germany</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="p-6 bg-gradient-to-br from-helio-600/10 to-purple-900/10 rounded-xl border border-helio-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {['Azure Landing Zones', 'Terraform/IaC', 'Kubernetes', 'Cloud Architecture', 'DevOps', 'Security'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-white/5 text-gray-300 rounded-full border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-dark-800/50 rounded-2xl border border-white/5 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>

            {status === 'sent' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Email Client Opened</h4>
                <p className="text-gray-400 mb-6">
                  Your default email client should open with the message ready to send.
                </p>
                <button
                  onClick={() => setStatus(null)}
                  className="text-helio-400 hover:text-helio-300 font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-helio-500 focus:ring-1 focus:ring-helio-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-helio-500 focus:ring-1 focus:ring-helio-500 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-helio-500 focus:ring-1 focus:ring-helio-500 transition-colors"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-helio-500 focus:ring-1 focus:ring-helio-500 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-helio-600 to-helio-500 hover:from-helio-500 hover:to-helio-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-helio-600/20 hover:shadow-helio-500/30"
                >
                  Send Message
                  <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to be contacted regarding your inquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
