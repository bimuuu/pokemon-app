'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function BuildPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header Skeleton */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-10 h-10 bg-gray-200 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-6 w-32 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Training Summary Skeleton */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <motion.div
                className="h-6 w-48 bg-gray-200 rounded flex items-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-8 w-8 bg-gray-200 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Pokemon Overview Skeleton */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gray-50 rounded-lg space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className="h-20 bg-gray-200 rounded-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  />
                  <motion.div
                    className="h-20 bg-gray-200 rounded-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="h-12 bg-gray-200 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Section Navigation Skeleton */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2 p-2 bg-gray-50 rounded-lg"
              >
                {['moves', 'item', 'evs', 'nature', 'ability'].map((section, i) => (
                  <motion.div
                    key={section}
                    className="h-10 flex-1 bg-gray-200 rounded-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>

              {/* Build Statistics Skeleton */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <motion.div
                      className="h-4 w-20 bg-gray-200 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                    <motion.div
                      className="h-6 w-16 bg-gray-200 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 + i * 0.1 }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Active Section Content Skeleton */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                {/* Moves Section Skeleton */}
                <div className="space-y-3">
                  <motion.div
                    className="h-6 w-32 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="p-3 bg-gray-50 rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <motion.div
                            className="h-4 w-24 bg-gray-200 rounded"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                          <motion.div
                            className="h-6 w-12 bg-gray-200 rounded"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 + i * 0.1 }}
                          />
                        </div>
                        <motion.div
                          className="h-3 w-16 bg-gray-200 rounded"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 + i * 0.1 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Item/EV/Nature/Ability Section Skeleton */}
                <div className="space-y-3">
                  <motion.div
                    className="h-6 w-32 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <motion.div
                          className="h-4 w-20 bg-gray-200 rounded mb-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 + i * 0.05 }}
                        />
                        <motion.div
                          className="h-3 w-16 bg-gray-200 rounded"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 + i * 0.05 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons Skeleton */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-2 pt-4 border-t"
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="h-10 w-24 bg-gray-200 rounded-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * i }}
                  />
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
