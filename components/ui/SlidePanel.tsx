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
      // Use CSS class instead of inline styles
      document.body.classList.add('slide-panel-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.classList.remove('slide-panel-open')
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Light overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 slide-panel-overlay"
        onClick={onClose}
      />
      
      {/* Slide Panel */}
      <div className={`
        fixed top-0 h-full bg-white shadow-2xl 
        z-50 overflow-visible slide-panel-content
        ${width}
        ${position === 'right' 
          ? `right-0 slide-in-right`
          : `left-0 slide-in-left`
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
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          {children}
        </div>
      </div>
    </>
  )
}
