'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy, Download, Share2, Star } from 'lucide-react'

interface ActionButtonsProps {
  copied: boolean
  isComplete: boolean
  onCopyBuild: () => void
  onExport: () => void
  onShare: () => void
  onOptimize: () => void
}

export function ActionButtons({
  copied,
  isComplete,
  onCopyBuild,
  onExport,
  onShare,
  onOptimize
}: ActionButtonsProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="flex flex-wrap gap-3 pt-4 border-t"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onCopyBuild}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy Build'}
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onOptimize}
            className="flex items-center gap-2"
            disabled={!isComplete}
          >
            <Star className="h-4 w-4" />
            Optimize Build
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
