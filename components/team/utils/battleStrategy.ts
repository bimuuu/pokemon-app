// Battle strategy calculation utilities

export const getBattleStrategy = (trainerWeaknesses: string[], trainerStrengths: string[], averageLevel: number): string[] => {
  const strategies: string[] = []
  
  // Focus on the most important weaknesses
  if (trainerWeaknesses.length > 0) {
    strategies.push(`Target ${trainerWeaknesses.slice(0, 3).join('/')} types`)
  }

  if (trainerStrengths.length > 0) {
    strategies.push(`Avoid ${trainerStrengths.slice(0, 3).join('/')} types`)
  }

  // Simple level recommendation
  const recommendedLevel = averageLevel + 3
  strategies.push(`Level ${recommendedLevel}+ recommended`)

  return strategies.slice(0, 3) // Keep it short
}
