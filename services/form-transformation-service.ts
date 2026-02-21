import { FormTransformationCondition } from '@/types/pokemon'
import { transformationData } from './transformation-data'
import { megaGmaxData } from './mega-gmax-data'
import { getServerTranslation } from '@/lib/i18n'

/**
 * Comprehensive form transformation conditions for Pokemon
 * This service uses internationalized data from service files
 */
export class FormTransformationService {
  private static transformationConditions: Record<string, FormTransformationCondition[]> = {
    ...transformationData,
    ...megaGmaxData
  }

  /**
   * Gets transformation conditions for a specific Pokemon with translated descriptions
   */
  static getTransformationConditions(pokemonName: string): FormTransformationCondition[] {
    const baseName = pokemonName.split('-')[0].toLowerCase()
    const conditions = this.transformationConditions[baseName] || []
    
    // Translate descriptions
    return conditions.map(condition => ({
      ...condition,
      description: this.translateDescription(condition.description)
    }))
  }

  /**
   * Gets transformation conditions for a specific form with translated descriptions
   */
  static getFormTransformationConditions(formName: string): FormTransformationCondition[] {
    
    // First check if there are specific conditions for this exact form
    const exactFormConditions = this.transformationConditions[formName.toLowerCase()] || []
    if (exactFormConditions.length > 0) {
      return exactFormConditions.map(condition => ({
        ...condition,
        description: this.translateDescription(condition.description)
      }))
    }
    
    // If no exact form conditions, get base Pokemon conditions
    const baseName = formName.split('-')[0].toLowerCase()
    const baseConditions = this.transformationConditions[baseName] || []
    
    // Return all base conditions with translated descriptions
    return baseConditions.map(condition => ({
      ...condition,
      description: this.translateDescription(condition.description)
    }))
  }

  /**
   * Translates description using the translation key
   */
  private static translateDescription(descriptionKey: string): string {
    // If it's already a translation key (starts with formTransformations.)
    if (descriptionKey.startsWith('formTransformations.')) {
      return getServerTranslation(descriptionKey)
    }
    
    // If it's a hardcoded description, return as is (fallback)
    return descriptionKey
  }

  /**
   * Checks if a Pokemon has multiple forms
   */
  static hasMultipleForms(pokemonName: string): boolean {
    const baseName = pokemonName.split('-')[0].toLowerCase()
    return this.transformationConditions.hasOwnProperty(baseName)
  }

  /**
   * Gets all form names for a Pokemon
   */
  static getAllFormNames(pokemonName: string): string[] {
    const baseName = pokemonName.split('-')[0].toLowerCase()
    const conditions = this.transformationConditions[baseName] || []
    
    // This is a simplified version - in reality, you'd need comprehensive form mappings
    return conditions.map(condition => condition.trigger)
  }

  /**
   * Gets form description for display with translation
   */
  static getFormDescription(pokemonName: string, formName: string): string {
    const conditions = this.getFormTransformationConditions(formName)
    if (conditions.length > 0) {
      return conditions[0].description
    }
    
    // Default description
    return `${formName} form of ${pokemonName}`
  }

  /**
   * Checks if transformation requires an item
   */
  static requiresItem(formName: string): boolean {
    const conditions = this.getFormTransformationConditions(formName)
    return conditions.some(condition => condition.type === 'item')
  }

  /**
   * Checks if transformation is ability-based
   */
  static isAbilityBased(formName: string): boolean {
    const conditions = this.getFormTransformationConditions(formName)
    return conditions.some(condition => condition.type === 'ability')
  }

  /**
   * Checks if transformation is weather-based
   */
  static isWeatherBased(formName: string): boolean {
    const conditions = this.getFormTransformationConditions(formName)
    return conditions.some(condition => condition.type === 'weather')
  }

  /**
   * Checks if transformation is Gmax-based
   */
  static isGmaxBased(formName: string): boolean {
    const conditions = this.getFormTransformationConditions(formName)
    return conditions.some(condition => condition.type === 'gmax')
  }

  /**
   * Gets transformation trigger items
   */
  static getTriggerItems(pokemonName: string): string[] {
    const conditions = this.getTransformationConditions(pokemonName)
    return conditions
      .filter(condition => condition.type === 'item')
      .map(condition => condition.trigger)
  }

  /**
   * Gets transformation trigger abilities
   */
  static getTriggerAbilities(pokemonName: string): string[] {
    const conditions = this.getTransformationConditions(pokemonName)
    return conditions
      .filter(condition => condition.type === 'ability')
      .map(condition => condition.trigger)
  }
}
