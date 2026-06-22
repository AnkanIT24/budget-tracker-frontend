import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { TrendingUp, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/AuthContext'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try { await login(data); navigate('/') }
    catch (err) { toast.error(err.response?.data?.message || 'Invalid credentials') }
  }

  return (
    <div className="min-h-screen bg-silver flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-moss/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm relative z-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex items-center justify-center gap-2.5 mb-8">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}
            className="w-10 h-10 bg-moss rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-silver" />
          </motion.div>
          <span className="text-white font-semibold text-xl">BudgetTracker</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{ borderColor: 'rgba(43,238,52,0.15)', transition: { duration: 0.2 } }}
          style={{ borderWidth: 1, borderStyle: 'solid' }}
          className="card">
          <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" className="input-field" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(43,238,52,0.22)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-1 py-2.5">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              Sign in
            </motion.button>
          </form>
        </motion.div>
        <p className="text-center text-sm text-gray-400 mt-4">
          No account?{' '}
          <Link to="/register" className="text-moss hover:text-moss-dim transition-colors font-medium">Create one</Link>
        </p>
      </motion.div>
    </div>
  )
}
