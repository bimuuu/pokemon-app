'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  width?: string
  position?: 'right' | 'left'
}

export function SlidePanel({ 
  isOpen, 
  onClose, 
  children, 
  width = 'w-96',
  position = 'right'
}: SlidePanelProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Light overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Slide Panel */}
      <div className={`
        fixed top-0 h-full bg-white shadow-2xl 
        transform transition-all duration-300 ease-in-out
        z-50 overflow-y-auto
        ${width}
        ${position === 'right' 
          ? isOpen ? 'translate-x-0 right-0' : 'translate-x-full right-0'
          : isOpen ? 'translate-x-0 left-0' : '-translate-x-full left-0'
        }
      `}>
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">Trainer Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  )
}
