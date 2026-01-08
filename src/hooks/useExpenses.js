import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getStorageItem, setStorageItem } from '../utils/storage'

export const useExpenses = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const storageKey = `expenses_${user?.id}`

  useEffect(() => {
    if (user) {
      const savedExpenses = getStorageItem(storageKey) || []
      setExpenses(savedExpenses)
      setLoading(false)
    }
  }, [user, storageKey])

  const saveExpenses = useCallback((newExpenses) => {
    setExpenses(newExpenses)
    setStorageItem(storageKey, newExpenses)
  }, [storageKey])

  const addExpense = useCallback((expense) => {
    const newExpense = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...expense
    }
    const updatedExpenses = [...expenses, newExpense]
    saveExpenses(updatedExpenses)
    return newExpense
  }, [expenses, user, saveExpenses])

  const updateExpense = useCallback((id, updates) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updates, updatedAt: new Date().toISOString() } : expense
    )
    saveExpenses(updatedExpenses)
  }, [expenses, saveExpenses])

  const deleteExpense = useCallback((id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id)
    saveExpenses(updatedExpenses)
  }, [expenses, saveExpenses])

  const deleteMultipleExpenses = useCallback((ids) => {
    const updatedExpenses = expenses.filter(expense => !ids.includes(expense.id))
    saveExpenses(updatedExpenses)
  }, [expenses, saveExpenses])

  const getExpensesByDateRange = useCallback((startDate, endDate) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
    })
  }, [expenses])

  const getExpensesByCategory = useCallback((category) => {
    return expenses.filter(expense => expense.category === category)
  }, [expenses])

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0)
  }, [expenses])

  const getExpensesByMonth = useCallback((year, month) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month
    })
  }, [expenses])

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMultipleExpenses,
    getExpensesByDateRange,
    getExpensesByCategory,
    getTotalExpenses,
    getExpensesByMonth
  }
}
