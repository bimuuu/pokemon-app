'use client'

import { Shield } from 'lucide-react'

export function ProTips() {
  return (
    <div className="bg-yellow-50 rounded-lg p-3">
      <h4 className="font-medium mb-2 text-yellow-800 flex items-center">
        <Shield className="w-4 h-4 mr-2" />
        Pro Tips
      </h4>
      <ul className="text-sm space-y-1 text-yellow-700">
        <li>• Status conditions help against tough opponents</li>
        <li>• Varied move types for better coverage</li>
      </ul>
    </div>
  )
}
