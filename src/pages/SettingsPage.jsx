import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, Shield } from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../hooks/AuthContext'
import PageWrapper, { staggerContainer, staggerItem } from '../components/ui/PageWrapper'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword:     z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm your new password'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
})

export default function SettingsPage() {
  const { user } = useAuth()
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password changed'); setSuccess(true); reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
  }

  return (
    <PageWrapper>
      <div className="max-w-lg space-y-4 md:space-y-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg md:text-xl font-semibold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your account</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          {/* Profile card */}
          <motion.div variants={staggerItem}
            whileHover={{ borderColor: 'rgba(43,238,52,0.2)', boxShadow: '0 6px 24px rgba(43,238,52,0.06)', y: -2, transition: { duration: 0.2 } }}
            style={{ borderWidth: 1, borderStyle: 'solid' }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-gray-500" />
              <h2 className="text-white font-medium text-sm">Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-12 h-12 rounded-2xl bg-moss-faint flex items-center justify-center flex-shrink-0"
              >
                <span className="text-moss font-semibold text-lg">{user?.fullName?.[0] || '?'}</span>
              </motion.div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{user?.fullName}</p>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Change password */}
          <motion.div variants={staggerItem}
            whileHover={{ borderColor: 'rgba(43,238,52,0.15)', transition: { duration: 0.2 } }}
            style={{ borderWidth: 1, borderStyle: 'solid' }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock size={15} className="text-gray-500" />
              <h2 className="text-white font-medium text-sm">Change password</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { name: 'currentPassword', label: 'Current password', ph: '••••••••' },
                { name: 'newPassword',     label: 'New password',     ph: 'Min 6 characters' },
                { name: 'confirmPassword', label: 'Confirm password', ph: '••••••••' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">{f.label}</label>
                  <input {...register(f.name)} type="password" placeholder={f.ph} className="input-field" />
                  {errors[f.name] && <p className="text-red-400 text-xs mt-1">{errors[f.name].message}</p>}
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(43,238,52,0.18)' }}
                whileTap={{ scale: 0.97 }}
                type="submit" disabled={isSubmitting} className="btn-primary w-full text-sm py-2.5 mt-1">
                {isSubmitting ? 'Updating...' : 'Update password'}
              </motion.button>
              {success && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-moss text-xs text-center">Password updated successfully</motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
