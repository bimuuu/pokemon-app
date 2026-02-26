"use client"

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedTooltipProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  isOpen: boolean
  className?: string
  position?: {
    x: number
    y: number
  }
  preventOverflow?: {
    width?: number
    offset?: number
  }
}

export function AnimatedTooltip({
  children,
  isOpen,
  className = "",
  position,
  preventOverflow,
  ...motionProps
}: AnimatedTooltipProps) {
  const getPositionStyle = () => {
    if (!position) return {}

    if (preventOverflow) {
      const { width = 320, offset = 10 } = preventOverflow
      const wouldOverflowRight = position.x + offset + width > window.innerWidth
      
      if (wouldOverflowRight) {
        return {
          left: `${Math.max(position.x - width - offset, 10)}px`,
          top: `${Math.min(position.y - 100, window.innerHeight - 200)}px`
        }
      }
    }

    return {
      left: `${position.x + (preventOverflow?.offset || 10)}px`,
      top: `${Math.min(position.y - 100, window.innerHeight - 200)}px`
    }
  }

  const defaultAnimation = {
    initial: { opacity: 0, y: 5, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 5, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" as const }
  }

  const animationProps = {
    initial: motionProps.initial || defaultAnimation.initial,
    animate: motionProps.animate || defaultAnimation.animate,
    exit: motionProps.exit || defaultAnimation.exit,
    transition: motionProps.transition || defaultAnimation.transition
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed z-[1000004] ${className}`}
          style={getPositionStyle()}
          {...animationProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
