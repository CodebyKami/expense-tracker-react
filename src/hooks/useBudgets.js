import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getStorageItem, setStorageItem } from '../utils/storage'

export const useBudgets = () => {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  const storageKey = `budgets_${user?.id}`

  useEffect(() => {
    if (user) {
      const savedBudgets = getStorageItem(storageKey) || []
      setBudgets(savedBudgets)
      setLoading(false)
    }
  }, [user, storageKey])

  const saveBudgets = useCallback((newBudgets) => {
    setBudgets(newBudgets)
    setStorageItem(storageKey, newBudgets)
  }, [storageKey])

  const addBudget = useCallback((budget) => {
    const newBudget = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...budget
    }
    const updatedBudgets = [...budgets, newBudget]
    saveBudgets(updatedBudgets)
    return newBudget
  }, [budgets, user, saveBudgets])

  const updateBudget = useCallback((id, updates) => {
    const updatedBudgets = budgets.map(budget =>
      budget.id === id ? { ...budget, ...updates, updatedAt: new Date().toISOString() } : budget
    )
    saveBudgets(updatedBudgets)
  }, [budgets, saveBudgets])

  const deleteBudget = useCallback((id) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id)
    saveBudgets(updatedBudgets)
  }, [budgets, saveBudgets])

  const getBudgetByCategory = useCallback((categoryId) => {
    return budgets.find(budget => budget.categoryId === categoryId)
  }, [budgets])

  const checkBudgetAlert = useCallback((categoryId, spent) => {
    const budget = getBudgetByCategory(categoryId)
    if (!budget) return null

    const percentage = (spent / budget.amount) * 100

    if (percentage >= 100) {
      return { type: 'exceeded', message: `Budget exceeded for ${budget.categoryName}!`, percentage }
    } else if (percentage >= 80) {
      return { type: 'warning', message: `You've used ${percentage.toFixed(0)}% of your ${budget.categoryName} budget`, percentage }
    } else if (percentage >= 50) {
      return { type: 'info', message: `You've used ${percentage.toFixed(0)}% of your ${budget.categoryName} budget`, percentage }
    }

    return null
  }, [budgets, getBudgetByCategory])

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
    checkBudgetAlert
  }
}
