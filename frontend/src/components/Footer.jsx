import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className='relative bg-surface-950 text-white overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-grid opacity-10' />
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-[120px]' />

            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    {/* Brand Column */}
                    <div className='lg:col-span-1'>
                        <Link to='/' className='flex items-center gap-2 mb-6 group'>
                            <img
                                src={assets.logo}
                                alt='UV Store'
                                className='h-14 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-all duration-300'
                            />
                        </Link>
                        <p className='text-surface-400 text-sm leading-relaxed mb-6'>
                            Premium fashion destination. Discover the latest trends with quality you can trust.
                        </p>
                        <div className='flex gap-3'>
                            {['Twitter', 'Instagram', 'Facebook'].map((social) => (
                                <a
                                    key={social}
                                    href='#'
                                    className='w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-600 flex items-center justify-center text-surface-400 hover:text-white transition-all duration-300 hover:scale-110'
                                >
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-semibold mb-6'>Quick Links</h4>
                        <ul className='space-y-3'>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/collection', label: 'Collection' },
                                { to: '/about', label: 'About Us' },
                                { to: '/contact', label: 'Contact' },
                                { to: '/cart', label: 'Cart' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className='text-surface-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group'
                                    >
                                        <span className='w-0 h-px bg-primary-400 group-hover:w-3 transition-all duration-300' />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className='text-white font-semibold mb-6'>Customer Service</h4>
                        <ul className='space-y-3'>
                            {['Help Center', 'Returns', 'Shipping Info', 'Size Guide', 'Track Order'].map((item) => (
                                <li key={item}>
                                    <a
                                        href='#'
                                        className='text-surface-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group'
                                    >
                                        <span className='w-0 h-px bg-primary-400 group-hover:w-3 transition-all duration-300' />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className='text-white font-semibold mb-6'>Get In Touch</h4>
                        <ul className='space-y-4'>
                            <li className='flex items-start gap-3'>
                                <div className='w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg className='w-4 h-4 text-primary-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                </div>
                                <span className='text-surface-400 text-sm'>
                                    670643<br />kerala,kannur,india
                                </span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-4 h-4 text-primary-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                    </svg>
                                </div>
                                <span className='text-surface-400 text-sm'>+91 86063375</span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-4 h-4 text-primary-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <span className='text-surface-400 text-sm'>support@uvstore.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='mt-16 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-surface-500 text-sm'>
                        &copy; {new Date().getFullYear()} UV Store. All rights reserved.
                    </p>
                    <div className='flex gap-6'>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a
                                key={item}
                                href='#'
                                className='text-surface-500 hover:text-surface-300 text-sm transition-all duration-300'
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer