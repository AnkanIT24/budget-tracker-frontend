import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18 } },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
}

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// Breathing hover — cards gently lift and glow border
export const breathe = {
  rest:  { scale: 1,    y: 0,  boxShadow: '0 0 0 0px rgba(43,238,52,0)',   borderColor: 'rgba(42,42,42,1)' },
  hover: { scale: 1.012, y: -2, boxShadow: '0 8px 32px rgba(43,238,52,0.07)', borderColor: 'rgba(43,238,52,0.25)' },
  tap:   { scale: 0.98, y: 0 },
}

// Lighter breath for list rows
export const rowBreathe = {
  rest:  { backgroundColor: 'rgba(30,30,30,0)', x: 0 },
  hover: { backgroundColor: 'rgba(43,238,52,0.04)', x: 2 },
  tap:   { scale: 0.99 },
}

// Nav item breath
export const navBreathe = {
  rest:  { x: 0, opacity: 0.7 },
  hover: { x: 3, opacity: 1 },
  tap:   { scale: 0.97 },
}

export default function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}
