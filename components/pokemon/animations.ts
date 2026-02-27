// Animation variants for Pokemon detail components

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

export const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20, duration: 0.6 },
  },
}

export const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
}

export const abilityCardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring' as const, stiffness: 600, damping: 10 },
  },
}

export const varietyCardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  },
  selected: {
    scale: 1.02,
    boxShadow: '0 12px 30px rgba(147, 51, 234, 0.2)',
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  },
}

export const moveCategoryVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 500, damping: 20 },
  },
  hover: {
    scale: 1.05,
    transition: { type: 'spring' as const, stiffness: 600, damping: 15 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring' as const, stiffness: 700, damping: 10 },
  },
}

export const getAnimationProps = (variants: any, customDelay = 0, shouldReduceMotion = false) => {
  if (shouldReduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, delay: customDelay * 0.1 },
    }
  }
  return {
    variants,
    initial: 'hidden',
    animate: 'visible',
    transition: { delay: customDelay },
  }
}
