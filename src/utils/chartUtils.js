/**
 * Chart data preparation utilities
 */

export const prepareCategoryChartData = (expenses, categories) => {
  const categoryTotals = {}
  
  expenses.forEach(expense => {
    const categoryId = expense.category
    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = 0
    }
    categoryTotals[categoryId] += parseFloat(expense.amount)
  })
  
  return Object.entries(categoryTotals).map(([categoryId, total]) => {
    const category = categories.find(c => c.id === categoryId)
    return {
      name: category?.name || 'Unknown',
      value: total,
      color: category?.color || '#64748b'
    }
  }).sort((a, b) => b.value - a.value)
}

export const prepareMonthlyChartData = (expenses, months = 6) => {
  const monthlyData = {}
  const today = new Date()
  
  // Initialize last N months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyData[key] = {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: 0,
      count: 0
    }
  }
  
  // Aggregate expenses
  expenses.forEach(expense => {
    const date = new Date(expense.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (monthlyData[key]) {
      monthlyData[key].amount += parseFloat(expense.amount)
      monthlyData[key].count += 1
    }
  })
  
  return Object.values(monthlyData)
}

export const prepareDailyChartData = (expenses, days = 30) => {
  const dailyData = {}
  const today = new Date()
  
  // Initialize last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = date.toISOString().split('T')[0]
    dailyData[key] = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: 0,
      count: 0
    }
  }
  
  // Aggregate expenses
  expenses.forEach(expense => {
    const key = new Date(expense.date).toISOString().split('T')[0]
    
    if (dailyData[key]) {
      dailyData[key].amount += parseFloat(expense.amount)
      dailyData[key].count += 1
    }
  })
  
  return Object.values(dailyData)
}

export const prepareWeeklyChartData = (expenses, weeks = 12) => {
  const weeklyData = {}
  const today = new Date()
  
  // Initialize last N weeks
  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - (i * 7))
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const key = weekStart.toISOString().split('T')[0]
    
    weeklyData[key] = {
      week: `Week ${weeks - i}`,
      amount: 0,
      count: 0
    }
  }
  
  // Aggregate expenses
  expenses.forEach(expense => {
    const date = new Date(expense.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const key = weekStart.toISOString().split('T')[0]
    
    if (weeklyData[key]) {
      weeklyData[key].amount += parseFloat(expense.amount)
      weeklyData[key].count += 1
    }
  })
  
  return Object.values(weeklyData)
}

export const getTopCategories = (expenses, categories, limit = 5) => {
  const categoryData = prepareCategoryChartData(expenses, categories)
  return categoryData.slice(0, limit)
}

export const calculateCategoryPercentages = (expenses, categories) => {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  const categoryData = prepareCategoryChartData(expenses, categories)
  
  return categoryData.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }))
}
