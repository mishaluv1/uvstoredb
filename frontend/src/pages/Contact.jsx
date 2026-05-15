import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent successfully! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactCards = [
    {
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      ),
      title: 'Visit Us',
      lines: ['54709 Willms Station', 'Suite 350, Washington, USA'],
    },
    {
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
        </svg>
      ),
      title: 'Call Us',
      lines: ['(415) 555-0132', 'Mon-Fri 9am-6pm EST'],
    },
    {
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
        </svg>
      ),
      title: 'Email Us',
      lines: ['support@uvstore.com', 'We reply within 24 hours'],
    },
  ]

  return (
    <div className='page-enter'>
      {/* Hero */}
      <section className='relative overflow-hidden bg-surface-50 py-16 lg:py-24'>
        <div className='absolute inset-0 bg-grid' />
        <div className='absolute top-10 right-10 w-80 h-80 bg-primary-400/10 rounded-full blur-[100px]' />
        <div className='absolute bottom-10 left-10 w-80 h-80 bg-accent-400/10 rounded-full blur-[100px]' />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6'>
              Get In Touch
            </div>
            <h1 className='section-title'>
              Contact <span className='text-gradient'>Us</span>
            </h1>
            <p className='section-subtitle'>
              We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            {contactCards.map((card, i) => (
              <div
                key={i}
                className='glass rounded-2xl p-6 text-center card-hover animate-fade-up'
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className='w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  {card.icon}
                </div>
                <h3 className='text-lg font-bold text-surface-900 mb-2'>{card.title}</h3>
                {card.lines.map((line, j) => (
                  <p key={j} className='text-surface-500 text-sm'>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Image */}
      <section className='py-16 lg:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col lg:flex-row gap-12 items-center'>
            {/* Image */}
            <div className='flex-1'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-[3rem] blur-2xl transform rotate-3' />
                <img
                  className='relative w-full rounded-[3rem] shadow-glass-lg'
                  src={assets.contact_img}
                  alt='Contact'
                />
              </div>
            </div>

            {/* Form */}
            <div className='flex-1 w-full'>
              <div className='glass rounded-3xl p-8 sm:p-10 shadow-glass-lg'>
                <h2 className='text-2xl font-extrabold text-surface-900 mb-2'>
                  Send Us a <span className='text-gradient'>Message</span>
                </h2>
                <p className='text-surface-500 text-sm mb-8'>
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className='space-y-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                    <div>
                      <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Name</label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='input-modern'
                        placeholder='Your name'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Email</label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='input-modern'
                        placeholder='you@example.com'
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Subject</label>
                    <input
                      type='text'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      className='input-modern'
                      placeholder='How can we help?'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-surface-700 mb-1.5'>Message</label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className='input-modern resize-none'
                      placeholder='Tell us more about your inquiry...'
                      required
                    />
                  </div>

                  <button type='submit' className='btn-primary w-full flex items-center justify-center gap-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                    </svg>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className='py-16 lg:py-24 bg-surface-100/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='glass rounded-3xl p-10 sm:p-14 text-center shadow-glass-lg relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-40 h-40 bg-primary-400/10 rounded-full blur-[60px]' />
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-accent-400/10 rounded-full blur-[60px]' />
            <div className='relative'>
              <h2 className='text-3xl sm:text-4xl font-extrabold text-surface-900 mb-4'>
                Join Our <span className='text-gradient'>Team</span>
              </h2>
              <p className='text-surface-500 mb-8 max-w-lg mx-auto'>
                Learn more about our teams and job openings. We're always looking for talented individuals.
              </p>
              <button className='btn-outline inline-flex items-center gap-2'>
                Explore Careers
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact