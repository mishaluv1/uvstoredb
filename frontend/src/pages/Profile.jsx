import React, { useState, useEffect } from 'react'
import { useShop } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { user, updateProfile, token } = useShop()
    const navigate = useNavigate()
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
        }
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipcode: user.address?.zipcode || '',
                    country: user.address?.country || ''
                }
            })
        }
    }, [user, token, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('address.')) {
            const field = name.split('.')[1]
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSave = async () => {
        setSaving(true)
        const success = await updateProfile(formData)
        setSaving(false)
        if (success) {
            setEditing(false)
        }
    }

    if (!user) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-surface-400 text-lg'>Loading profile...</p>
                </div>
            </div>
        )
    }

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    return (
        <div className='page-enter'>
            {/* Hero Header */}
            <div className='relative overflow-hidden bg-surface-950 py-16 mb-12'>
                <div className='absolute inset-0 bg-grid opacity-10'></div>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl'></div>
                <div className='relative max-w-4xl mx-auto px-4'>
                    <p className='text-surface-400 text-sm uppercase tracking-widest mb-3 animate-fade-down'>
                        My Account
                    </p>
                    <h1 className='text-4xl md:text-5xl font-bold text-white animate-fade-up'>
                        Profile <span className='text-gradient'>Settings</span>
                    </h1>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 pb-20'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Sidebar - Avatar Card */}
                    <div className='lg:col-span-1'>
                        <div className='glass rounded-2xl p-8 text-center sticky top-24'>
                            {/* Avatar */}
                            <div className='relative inline-block mb-6'>
                                <div className='w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-[3px] animate-float'>
                                    <div className='w-full h-full rounded-2xl bg-surface-900 flex items-center justify-center'>
                                        <span className='text-4xl font-bold text-white'>{initials}</span>
                                    </div>
                                </div>
                                <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-surface-50 flex items-center justify-center'>
                                    <svg className='w-4 h-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                    </svg>
                                </div>
                            </div>

                            <h2 className='text-xl font-bold text-surface-900 mb-1'>{user.name}</h2>
                            <p className='text-surface-500 text-sm mb-4'>{user.email}</p>

                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                    : 'bg-surface-100 text-surface-600 border border-surface-200'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-primary-500' : 'bg-surface-400'
                                    }`}></span>
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>

                            <div className='mt-8 pt-6 border-t border-surface-200'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='text-center'>
                                        <p className='text-2xl font-bold text-gradient'>
                                            {user.createdAt
                                                ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
                                                : '—'}
                                        </p>
                                        <p className='text-xs text-surface-400 mt-1'>Days Member</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-2xl font-bold text-gradient-warm'>—</p>
                                        <p className='text-xs text-surface-400 mt-1'>Orders</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setEditing(!editing)}
                                className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${editing
                                        ? 'border-2 border-surface-300 text-surface-600 hover:bg-surface-100'
                                        : 'btn-primary'
                                    }`}
                            >
                                {editing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Personal Information */}
                        <div className='glass rounded-2xl p-6 md:p-8 animate-fade-up'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-primary-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-surface-900'>Personal Information</h3>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Full Name
                                    </label>
                                    {editing ? (
                                        <input
                                            name='name'
                                            value={formData.name}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='Your full name'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>{user.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Email Address
                                    </label>
                                    <p className='text-surface-800 font-medium flex items-center gap-2'>
                                        {user.email}
                                        <svg className='w-4 h-4 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                    </p>
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Phone Number
                                    </label>
                                    {editing ? (
                                        <input
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='+1 (555) 000-0000'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.phone || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Member Since
                                    </label>
                                    <p className='text-surface-800 font-medium'>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className='glass rounded-2xl p-6 md:p-8 animate-fade-up' style={{ animationDelay: '0.1s' }}>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-accent-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-surface-900'>Shipping Address</h3>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                <div className='sm:col-span-2'>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Street Address
                                    </label>
                                    {editing ? (
                                        <input
                                            name='address.street'
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='123 Main Street, Apt 4B'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.address?.street || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        City
                                    </label>
                                    {editing ? (
                                        <input
                                            name='address.city'
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='New York'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.address?.city || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        State
                                    </label>
                                    {editing ? (
                                        <input
                                            name='address.state'
                                            value={formData.address.state}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='NY'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.address?.state || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Zip Code
                                    </label>
                                    {editing ? (
                                        <input
                                            name='address.zipcode'
                                            value={formData.address.zipcode}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='10001'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.address?.zipcode || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-surface-400 uppercase tracking-wider mb-1.5 block'>
                                        Country
                                    </label>
                                    {editing ? (
                                        <input
                                            name='address.country'
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            className='input-modern'
                                            placeholder='United States'
                                        />
                                    ) : (
                                        <p className='text-surface-800 font-medium'>
                                            {user.address?.country || (
                                                <span className='text-surface-300 italic'>Not provided</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {editing && (
                            <div className='flex justify-end animate-fade-up' style={{ animationDelay: '0.2s' }}>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className='btn-primary px-10 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                                >
                                    {saving ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            SAVING...
                                        </>
                                    ) : (
                                        <>
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                            </svg>
                                            SAVE CHANGES
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile