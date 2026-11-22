
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  TrendingUp,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/AuthContext'
import { authService } from '../services/api'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    }
  }

  const onForgotPassword = async (data) => {
    setForgotLoading(true)

    try {
      await authService.forgotPassword(data)

      toast.success(
        'If an account exists with this email, a password reset link will be sent.'
      )

      resetForgot()
      setForgotMode(false)
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Unable to process your request. Please try again.'
      )
    } finally {
      setForgotLoading(false)
    }
  }

  const openForgotMode = () => {
    setForgotMode(true)
  }

  const returnToLogin = () => {
    setForgotMode(false)
    resetForgot()
  }

  return (
    <div className="min-h-[100dvh] bg-silver flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-moss/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm relative z-10"
      >

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 bg-moss rounded-xl flex items-center justify-center"
          >
            <TrendingUp size={20} className="text-silver" />
          </motion.div>

          <span className="text-white font-semibold text-xl">
            BudgetTracker
          </span>
        </motion.div>

        {/* Authentication card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          whileHover={{
            borderColor: 'rgba(43,238,52,0.15)',
            transition: { duration: 0.2 },
          }}
          style={{ borderWidth: 1, borderStyle: 'solid' }}
          className="card"
        >

          <AnimatePresence mode="wait">

            {!forgotMode ? (

              /* LOGIN FORM */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-white mb-1">
                  Welcome back
                </h2>

                <p className="text-sm text-gray-400 mb-6">
                  Sign in to your account
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                      Email
                    </label>

                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="input-field"
                    />

                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs text-gray-400 font-medium">
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={openForgotMode}
                        className="text-xs text-moss hover:text-moss-dim transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="input-field pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Sign in */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 4px 20px rgba(43,238,52,0.22)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-1 py-2.5"
                  >
                    {isSubmitting && (
                      <Loader2 size={14} className="animate-spin" />
                    )}

                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </motion.button>
                </form>
              </motion.div>

            ) : (

              /* FORGOT PASSWORD FORM */
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={returnToLogin}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-5"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </button>

                <div className="w-11 h-11 rounded-xl bg-moss/10 flex items-center justify-center mb-4">
                  <Mail size={21} className="text-moss" />
                </div>

                <h2 className="text-lg font-semibold text-white mb-1">
                  Forgot your password?
                </h2>

                <p className="text-sm text-gray-400 mb-6">
                  Enter your registered email address. If an account exists,
                  we will send you a password reset link.
                </p>

                <form
                  onSubmit={handleForgotSubmit(onForgotPassword)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                      Email address
                    </label>

                    <input
                      {...registerForgot('email')}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="input-field"
                    />

                    {forgotErrors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {forgotErrors.email.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 4px 20px rgba(43,238,52,0.22)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {forgotLoading && (
                      <Loader2 size={15} className="animate-spin" />
                    )}

                    {forgotLoading ? 'Sending...' : 'Send reset link'}
                  </motion.button>
                </form>
              </motion.div>

            )}

          </AnimatePresence>
        </motion.div>

        {/* Register link */}
        {!forgotMode && (
          <p className="text-center text-sm text-gray-400 mt-4">
            No account?{' '}
            <Link
              to="/register"
              className="text-moss hover:text-moss-dim transition-colors font-medium"
            >
              Create one
            </Link>
          </p>
        )}

      </motion.div>
    </div>
  )
}
