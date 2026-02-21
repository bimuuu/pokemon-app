import { enTranslations } from '../locales/en'
import { thTranslations } from '../locales/th'

export type Language = 'en' | 'th'
export type TranslationKey = string

export const translations = {
  en: enTranslations,
  th: thTranslations
} as const

export const defaultLanguage: Language = 'en'

export function getTranslation(language: Language, key: string): string {
  if (!key || key.trim() === '') {
    return key || ''
  }
  
  const keys = key.split('.')
  let translation: any = translations[language]
  
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k]
    } else {
      break
    }
  }
  
  // Ensure we never return an object
  if (typeof translation === 'object' && translation !== null) {
    return key
  }
  
  return translation || key
}

export function useTranslation(language: Language) {
  return (key: string, fallback?: string) => {
    const translation = getTranslation(language, key)
    return translation !== key ? translation : (fallback || key)
  }
}

export function getServerTranslation(key: string, params?: Record<string, string | number>, fallback?: string): string {
  // Try to get language from localStorage or use default
  let language: Language = defaultLanguage
  
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('pokemon-app-language') as Language
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'th')) {
      language = storedLanguage
    } else {
      language = getBrowserLanguage()
    }
  }
  
  const translation = getTranslation(language, key)
  let result = translation !== key ? translation : (fallback || key)
  
  // Replace parameters in the translation
  if (params && result) {
    Object.entries(params).forEach(([param, value]) => {
      result = result.replace(new RegExp(`\{${param}\}`, 'g'), String(value))
    })
  }
  
  return result
}

export function translateCondition(condition: string): string {
  if (!condition || condition.trim() === '') return condition
  
  // Try to get language from localStorage or use default
  let language: Language = defaultLanguage
  
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('pokemon-app-language') as Language
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'th')) {
      language = storedLanguage
    } else {
      language = getBrowserLanguage()
    }
  }
  
  // Handle complex conditions with multiple parts
  const parts = condition.split(',').map(part => part.trim())
  const translatedParts = parts.map(part => {
    // Try exact match first
    const exactTranslation = getTranslation(language, `conditions.${part.toLowerCase().replace(/[^a-z0-9]/g, '')}`)
    if (exactTranslation !== `conditions.${part.toLowerCase().replace(/[^a-z0-9]/g, '')}`) {
      return exactTranslation
    }
    
    // Try to match common patterns
    const lowerPart = part.toLowerCase()
    
    // Weather conditions
    if (lowerPart.includes('weather clear') || lowerPart === 'weather clear') {
      return getTranslation(language, 'conditions.weatherClear')
    }
    if (lowerPart.includes('day') && lowerPart.includes('weather clear')) {
      return `${getTranslation(language, 'conditions.day')}, ${getTranslation(language, 'conditions.weatherClear')}`
    }
    if (lowerPart.includes('night') && lowerPart.includes('weather clear')) {
      return `${getTranslation(language, 'conditions.night')}, ${getTranslation(language, 'conditions.weatherClear')}`
    }
    
    // Time conditions
    if (lowerPart === 'day') return getTranslation(language, 'conditions.day')
    if (lowerPart === 'night') return getTranslation(language, 'conditions.night')
    if (lowerPart === 'dawn') return getTranslation(language, 'conditions.dawn')
    if (lowerPart === 'dusk') return getTranslation(language, 'conditions.dusk')
    
    // Weather conditions
    if (lowerPart.includes('storm')) {
      if (lowerPart.includes('during')) return getTranslation(language, 'conditions.duringStorm')
      if (lowerPart.includes('thunderstorm')) return getTranslation(language, 'conditions.duringThunderstorm')
      if (lowerPart.includes('rain')) return getTranslation(language, 'conditions.duringRain')
      return getTranslation(language, 'conditions.storm')
    }
    if (lowerPart === 'rain') return getTranslation(language, 'conditions.rain')
    if (lowerPart === 'thunderstorm') return getTranslation(language, 'conditions.thunderstorm')
    
    // Fishing conditions
    if (lowerPart.includes('fishing')) {
      if (lowerPart.includes('also by fishing')) return getTranslation(language, 'conditions.alsoByFishing')
      if (lowerPart.includes('same biome')) return getTranslation(language, 'conditions.alsoFishingSameBiome')
      return part // Keep original for complex fishing conditions
    }
    
    // Location conditions
    if (lowerPart.includes('village')) {
      if (lowerPart.includes('more common')) return getTranslation(language, 'conditions.moreCommonInVillages')
      if (lowerPart.includes('near')) return getTranslation(language, 'conditions.nearVillage')
      if (lowerPart.includes('common')) return getTranslation(language, 'conditions.inVillages')
    }
    if (lowerPart.includes('mansion')) {
      if (lowerPart.includes('more common')) return getTranslation(language, 'conditions.moreCommonInMansion')
      if (lowerPart.includes('common')) return getTranslation(language, 'conditions.inMansion')
    }
    if (lowerPart.includes('igloo')) return getTranslation(language, 'conditions.nearIgloo')
    if (lowerPart.includes('beehives')) return getTranslation(language, 'conditions.nearBeehives')
    if (lowerPart.includes('cake')) return getTranslation(language, 'conditions.nearCake')
    if (lowerPart.includes('pc')) return getTranslation(language, 'conditions.nearPC')
    if (lowerPart.includes('pumpkin')) return getTranslation(language, 'conditions.nearPumpkin')
    if (lowerPart.includes('purpur')) return getTranslation(language, 'conditions.nearPurpurBlock')
    if (lowerPart.includes('coal ore')) return getTranslation(language, 'conditions.nearCoalOre')
    if (lowerPart.includes('diamond ore')) return getTranslation(language, 'conditions.nearDiamondOre')
    if (lowerPart.includes('iron block')) return getTranslation(language, 'conditions.nearIronBlock')
    if (lowerPart.includes('lava')) return getTranslation(language, 'conditions.nearLava')
    if (lowerPart.includes('lightning rod')) return getTranslation(language, 'conditions.nearLightningRod')
    if (lowerPart.includes('medicinal leek')) return getTranslation(language, 'conditions.nearMedicinalLeek')
    if (lowerPart.includes('redstone')) return getTranslation(language, 'conditions.nearRedstone')
    
    // Special conditions
    if (lowerPart.includes('resurrection machine')) return getTranslation(language, 'conditions.useResurrectionMachine')
    if (lowerPart.includes('caves')) return getTranslation(language, 'conditions.inCaves')
    if (lowerPart.includes('ancient city')) return getTranslation(language, 'conditions.inAncientCity')
    if (lowerPart.includes('cobblemon ruins')) return getTranslation(language, 'conditions.inCobblemonRuins')
    if (lowerPart.includes('ocean ruins')) return getTranslation(language, 'conditions.inOceanRuins')
    if (lowerPart.includes('desert pyramid')) return getTranslation(language, 'conditions.inDesertPyramid')
    if (lowerPart.includes('jungle temple')) return getTranslation(language, 'conditions.inJungleTemple')
    if (lowerPart.includes('slime chunk')) return getTranslation(language, 'conditions.inSlimeChunk')
    if (lowerPart.includes('seafloor')) return getTranslation(language, 'conditions.seafloorOrFishing')
    if (lowerPart.includes('submerged')) return getTranslation(language, 'conditions.submergedOrFishing')
    if (lowerPart.includes('suspicious sand')) return getTranslation(language, 'conditions.inSuspiciousSand')
    if (lowerPart.includes('suspicious gravel')) return getTranslation(language, 'conditions.inSuspiciousSand')
    
    // Y coordinate conditions
    if (lowerPart.includes('min y=0')) return getTranslation(language, 'conditions.minY0')
    if (lowerPart.includes('max y=0')) return getTranslation(language, 'conditions.maxY0')
    if (lowerPart.includes('y > 190')) return getTranslation(language, 'conditions.yAbove190')
    if (lowerPart.includes('y > 48')) return getTranslation(language, 'conditions.yAbove48')
    
    // Special Pokemon conditions
    if (lowerPart.includes('sweet apple')) return getTranslation(language, 'conditions.giveSweetApple')
    if (lowerPart.includes('tart apple')) return getTranslation(language, 'conditions.giveTartApple')
    if (lowerPart.includes('bisharp')) return getTranslation(language, 'conditions.bisharpDefeat')
    if (lowerPart.includes('gimmighoul')) return getTranslation(language, 'conditions.gimmighoulCoins')
    if (lowerPart.includes('zygarde')) return getTranslation(language, 'conditions.zygardeCells')
    if (lowerPart.includes('flabebe') || lowerPart.includes('6 colored')) return getTranslation(language, 'conditions.flabebeColors')
    
    // Return original if no translation found
    return part
  })
  
  return translatedParts.join(', ')
}

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage
  
  const browserLang = navigator.language.toLowerCase()
  
  if (browserLang.startsWith('th')) {
    return 'th'
  }
  
  return 'en'
}
