import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getStorageItem, setStorageItem } from '../utils/storage'

const DEFAULT_CATEGORIES = [
  { id: 'hostel', name: 'Hostel', color: '#3b82f6', icon: '🏠', isDefault: true },
  { id: 'office', name: 'Office', color: '#8b5cf6', icon: '💼', isDefault: true },
  { id: 'travel', name: 'Travel', color: '#10b981', icon: '✈️', isDefault: true },
  { id: 'food', name: 'Food', color: '#f59e0b', icon: '🍔', isDefault: true },
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899', icon: '🎬', isDefault: true },
  { id: 'utilities', name: 'Utilities', color: '#6366f1', icon: '💡', isDefault: true },
  { id: 'shopping', name: 'Shopping', color: '#14b8a6', icon: '🛍️', isDefault: true },
  { id: 'others', name: 'Others', color: '#64748b', icon: '📦', isDefault: true }
]

export const useCategories = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const storageKey = `categories_${user?.id}`

  useEffect(() => {
    if (user) {
      const savedCategories = getStorageItem(storageKey)
      if (!savedCategories || savedCategories.length === 0) {
        // Initialize with default categories
        setStorageItem(storageKey, DEFAULT_CATEGORIES)
        setCategories(DEFAULT_CATEGORIES)
      } else {
        setCategories(savedCategories)
      }
      setLoading(false)
    }
  }, [user, storageKey])

  const saveCategories = useCallback((newCategories) => {
    setCategories(newCategories)
    setStorageItem(storageKey, newCategories)
  }, [storageKey])

  const addCategory = useCallback((category) => {
    const newCategory = {
      id: Date.now().toString(),
      userId: user.id,
      isDefault: false,
      createdAt: new Date().toISOString(),
      ...category
    }
    const updatedCategories = [...categories, newCategory]
    saveCategories(updatedCategories)
    return newCategory
  }, [categories, user, saveCategories])

  const updateCategory = useCallback((id, updates) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...updates, updatedAt: new Date().toISOString() } : category
    )
    saveCategories(updatedCategories)
  }, [categories, saveCategories])

  const deleteCategory = useCallback((id) => {
    // Prevent deletion of default categories
    const category = categories.find(c => c.id === id)
    if (category?.isDefault) {
      throw new Error('Cannot delete default categories')
    }
    const updatedCategories = categories.filter(category => category.id !== id)
    saveCategories(updatedCategories)
  }, [categories, saveCategories])

  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id)
  }, [categories])

  const resetToDefaults = useCallback(() => {
    saveCategories(DEFAULT_CATEGORIES)
  }, [saveCategories])

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    resetToDefaults,
    defaultCategories: DEFAULT_CATEGORIES
  }
}
