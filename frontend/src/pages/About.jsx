import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  const features = [
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
        </svg>
      ),
      title: 'Quality Assurance',
      desc: 'We meticulously select and vet each product to ensure it meets our stringent quality standards.',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 10V3L4 14h7v7l9-11h-7z' />
        </svg>
      ),
      title: 'Convenience',
      desc: 'With our user-friendly interface and hassle-free ordering process, shopping has never been easier.',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      title: 'Exceptional Service',
      desc: 'Our team of dedicated professionals is here to assist you, ensuring your satisfaction is our top priority.',
    },
  ]

  const values = [
    { title: 'Sustainability', desc: 'We are committed to sustainable fashion practices and ethical sourcing.' },
    { title: 'Innovation', desc: 'Constantly evolving with the latest trends and technology to serve you better.' },
    { title: 'Community', desc: 'Building a community of fashion-forward individuals who inspire each other.' },
    { title: 'Integrity', desc: 'Honest pricing, transparent policies, and genuine care for our customers.' },
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
              Our Story
            </div>
            <h1 className='section-title'>
              About <span className='text-gradient'>UV Store</span>
            </h1>
            <p className='section-subtitle'>
              Your destination for premium fashion at affordable prices
            </p>
          </div>

          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='flex-1'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-[3rem] blur-2xl transform -rotate-3' />
                <img
                  className='relative w-full rounded-[3rem] shadow-glass-lg'
                  src={assets.about_img}
                  alt='About Us'
                />
              </div>
            </div>
            <div className='flex-1 space-y-6'>
              <p className='text-surface-600 leading-relaxed text-lg'>
                Welcome to <b className='text-surface-900'>UV Store</b> — your destination for premium fashion at
                affordable prices. We believe that style should be accessible to everyone, and our curated collections
                reflect the latest trends while maintaining timeless quality.
              </p>
              <p className='text-surface-600 leading-relaxed'>
                Founded in 2024, UV Store has quickly grown from a small online boutique to a trusted fashion destination.
                Our mission is simple: to provide high-quality clothing that makes you look and feel your best, without
                breaking the bank.
              </p>
              <div className='glass rounded-2xl p-6'>
                <h3 className='text-lg font-bold text-surface-900 mb-2'>Our Mission</h3>
                <p className='text-surface-600 leading-relaxed'>
                  We are committed to sustainable fashion practices, ethical sourcing, and delivering exceptional customer
                  experiences. Every piece in our collection is carefully selected to ensure it meets our high standards
                  of quality, comfort, and style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-16 lg:py-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-14'>
            <h2 className='section-title'>
              Why <span className='text-gradient'>Choose Us</span>
            </h2>
            <p className='section-subtitle'>
              What sets us apart from the rest
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {features.map((feature, i) => (
              <div
                key={i}
                className='glass rounded-2xl p-8 text-center card-hover animate-fade-up'
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className='w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-bold text-surface-900 mb-3'>{feature.title}</h3>
                <p className='text-surface-500 text-sm leading-relaxed'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-16 lg:py-24 bg-surface-100/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-14'>
            <h2 className='section-title'>
              Our <span className='text-gradient'>Values</span>
            </h2>
            <p className='section-subtitle'>
              The principles that guide everything we do
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((value, i) => (
              <div
                key={i}
                className='glass rounded-2xl p-6 card-hover animate-fade-up'
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className='w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4'>
                  <span className='text-lg font-extrabold'>0{i + 1}</span>
                </div>
                <h3 className='text-lg font-bold text-surface-900 mb-2'>{value.title}</h3>
                <p className='text-surface-500 text-sm leading-relaxed'>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About