'use client'

import { useState } from 'react'
import { Info, X } from 'lucide-react'

interface GymTipProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function GymTip({ title, children, className = '' }: GymTipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Tip trigger */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
        title="Click for tip"
      >
        <Info className="w-3 h-3" />
      </button>

      {/* Tip modal/popup */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsVisible(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl border max-w-md w-full p-6 z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                {title}
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-700 space-y-2">
              {children}
            </div>

            {/* Close button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
