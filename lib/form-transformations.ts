import { FormTransformationService as NewFormTransformationService } from '@/services/form-transformation-service'

/**
 * Legacy FormTransformationService - redirects to new service
 * @deprecated Use FormTransformationService from services/form-transformation-service instead
 */
export class FormTransformationService {
  /**
   * Gets transformation conditions for a specific Pokemon
   */
  static getTransformationConditions(pokemonName: string) {
    return NewFormTransformationService.getTransformationConditions(pokemonName)
  }

  /**
   * Gets transformation conditions for a specific form
   */
  static getFormTransformationConditions(formName: string) {
    return NewFormTransformationService.getFormTransformationConditions(formName)
  }

  /**
   * Checks if a Pokemon has multiple forms
   */
  static hasMultipleForms(pokemonName: string) {
    return NewFormTransformationService.hasMultipleForms(pokemonName)
  }

  /**
   * Gets all form names for a Pokemon
   */
  static getAllFormNames(pokemonName: string) {
    return NewFormTransformationService.getAllFormNames(pokemonName)
  }

  /**
   * Gets form description for display
   */
  static getFormDescription(pokemonName: string, formName: string) {
    return NewFormTransformationService.getFormDescription(pokemonName, formName)
  }

  /**
   * Checks if transformation requires an item
   */
  static requiresItem(formName: string) {
    return NewFormTransformationService.requiresItem(formName)
  }

  /**
   * Checks if transformation is ability-based
   */
  static isAbilityBased(formName: string) {
    return NewFormTransformationService.isAbilityBased(formName)
  }

  /**
   * Checks if transformation is weather-based
   */
  static isWeatherBased(formName: string) {
    return NewFormTransformationService.isWeatherBased(formName)
  }

  /**
   * Checks if transformation is Gmax-based
   */
  static isGmaxBased(formName: string) {
    return NewFormTransformationService.isGmaxBased(formName)
  }

  /**
   * Gets transformation trigger items
   */
  static getTriggerItems(pokemonName: string) {
    return NewFormTransformationService.getTriggerItems(pokemonName)
  }

  /**
   * Gets transformation trigger abilities
   */
  static getTriggerAbilities(pokemonName: string) {
    return NewFormTransformationService.getTriggerAbilities(pokemonName)
  }
}
