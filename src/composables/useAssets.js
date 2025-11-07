import { ref } from 'vue'

let assetLibrary = null
let isLoading = false
let loadPromise = null

/**
 * Composable for managing asset library
 * @returns {Object} Asset library utilities
 */
export function useAssets() {
  const assets = ref(assetLibrary)
  const loading = ref(isLoading)

  /**
   * Load the asset library from JSON
   */
  const loadAssets = async () => {
    if (assetLibrary) {
      return assetLibrary
    }

    if (loadPromise) {
      return loadPromise
    }

    isLoading = true
    loading.value = true

    loadPromise = fetch('/assets/assetLibrary.json')
      .then(response => response.json())
      .then(data => {
        assetLibrary = data
        assets.value = data
        isLoading = false
        loading.value = false
        return data
      })
      .catch(error => {
        console.error('Failed to load asset library:', error)
        isLoading = false
        loading.value = false
        throw error
      })

    return loadPromise
  }

  /**
   * Get an asset by category and name
   * @param {string} category - Asset category (characters, objects, backgrounds, actions)
   * @param {string} name - Asset name
   * @returns {Object|null} Asset object with emoji and image path
   */
  const getAsset = (category, name) => {
    if (!assetLibrary) {
      console.warn('Asset library not loaded yet')
      return null
    }

    const asset = assetLibrary[category]?.[name]
    if (!asset) {
      console.warn(`Asset not found: ${category}/${name}`)
      return null
    }

    return asset
  }

  /**
   * Get emoji for an asset (fallback if image doesn't exist)
   * @param {string} category - Asset category
   * @param {string} name - Asset name
   * @param {string} fallback - Fallback emoji if asset not found
   * @returns {string} Emoji character
   */
  const getEmoji = (category, name, fallback = '❓') => {
    const asset = getAsset(category, name)
    return asset?.emoji || fallback
  }

  /**
   * Get all assets in a category
   * @param {string} category - Asset category
   * @returns {Object} All assets in the category
   */
  const getCategory = (category) => {
    if (!assetLibrary) {
      console.warn('Asset library not loaded yet')
      return {}
    }

    return assetLibrary[category] || {}
  }

  /**
   * Get all available categories
   * @returns {Array<string>} Category names
   */
  const getCategories = () => {
    if (!assetLibrary) {
      return []
    }

    return Object.keys(assetLibrary)
  }

  return {
    assets,
    loading,
    loadAssets,
    getAsset,
    getEmoji,
    getCategory,
    getCategories
  }
}
