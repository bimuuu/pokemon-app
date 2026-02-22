'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface DropdownItem {
  label: string
  href: string
}

interface DropdownProps {
  trigger: string
  items: DropdownItem[]
  className?: string
}

export function Dropdown({ trigger, items, className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const hasActiveItem = items.some(item => item.href === pathname)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm font-medium transition-all duration-200 relative flex items-center gap-1 hover:text-primary ${
          hasActiveItem ? 'text-primary' : 'text-muted-foreground'
        } ${className}`}
      >
        {trigger}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        {hasActiveItem && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[160px]">
          <div className="py-1">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`block px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  item.href === pathname ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
