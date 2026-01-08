import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatDate } from './formatters'

/**
 * Export expenses to PDF
 */
export const exportToPDF = (expenses, categories, options = {}) => {
  const {
    title = 'Expense Report',
    startDate,
    endDate,
    includeCharts = false
  } = options

  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(title, 14, 20)
  
  // Add date range if provided
  if (startDate && endDate) {
    doc.setFontSize(12)
    doc.text(`Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 30)
  }
  
  // Add summary
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  doc.setFontSize(12)
  doc.text(`Total Expenses: ${formatCurrency(total)}`, 14, startDate ? 40 : 30)
  doc.text(`Number of Transactions: ${expenses.length}`, 14, startDate ? 48 : 38)
  
  // Prepare table data
  const tableData = expenses.map(expense => {
    const category = categories.find(c => c.id === expense.category)
    return [
      formatDate(expense.date),
      category?.name || 'Unknown',
      formatCurrency(expense.amount),
      expense.notes || '-'
    ]
  })
  
  // Add table
  doc.autoTable({
    startY: startDate ? 56 : 46,
    head: [['Date', 'Category', 'Amount', 'Notes']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 'auto' }
    }
  })
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }
  
  // Save the PDF
  const fileName = `expense-report-${new Date().getTime()}.pdf`
  doc.save(fileName)
}

/**
 * Export expenses to CSV
 */
export const exportToCSV = (expenses, categories) => {
  const headers = ['Date', 'Category', 'Amount', 'Notes', 'Tags']
  
  const rows = expenses.map(expense => {
    const category = categories.find(c => c.id === expense.category)
    return [
      formatDate(expense.date),
      category?.name || 'Unknown',
      expense.amount,
      expense.notes || '',
      expense.tags?.join('; ') || ''
    ]
  })
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `expenses-${new Date().getTime()}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export expenses to Excel (CSV format compatible with Excel)
 */
export const exportToExcel = (expenses, categories) => {
  // Excel prefers CSV with specific formatting
  exportToCSV(expenses, categories)
}
