import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { expenseService } from '../services/expenseService'
import { shopService } from '../services/shopService'
import { userService } from '../services/userService'

ModuleRegistry.registerModules([AllCommunityModule])

interface ShopExpense {
  id: number;
  shop_id: number;
  amount: number;
  expense_date: string;
  shop_name?: string;
  managers?: string[];
  created_at: string;
  updated_at: string;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense?: ShopExpense | null;
}

interface ActionMenuParams {
  data?: ShopExpense;
  node?: { data?: ShopExpense };
  onEdit?: (expense: ShopExpense) => void;
  onDelete?: (expense: ShopExpense) => void;
  cellRendererParams?: {
    onEdit?: (expense: ShopExpense) => void;
    onDelete?: (expense: ShopExpense) => void;
  };
}

const ManagersCellRenderer = (params: any) => {
  const managers = params.value || []
  
  if (managers.length === 0) {
    return <span className="text-gray-400">No managers</span>
  }
  
  const fullText = managers.join(', ')
  const maxLength = 30
  const displayText = fullText.length > maxLength 
    ? fullText.substring(0, maxLength) + '...' 
    : fullText
  
  if (fullText.length > maxLength) {
    return (
      <span 
        title={fullText} 
        className="cursor-help"
        style={{ display: 'flex', alignItems: 'center', height: '100%' }}
      >
        {displayText}
      </span>
    )
  }
  
  return (
    <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {displayText}
    </span>
  )
}

const ActionMenu = (params: ActionMenuParams) => {
  const data = params.data || params.node?.data
  const onEdit = params.onEdit || params.cellRendererParams?.onEdit
  const onDelete = params.onDelete || params.cellRendererParams?.onDelete
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 160
        })
      }
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(prev => !prev)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(false)
    if (onEdit && data) {
      onEdit(data)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(false)
    if (onDelete && data) {
      onDelete(data)
    }
  }

  const menuContent = isOpen ? (
    <div 
      ref={menuRef}
      className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
      style={{ 
        zIndex: 99999,
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleEditClick}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
      <button
        type="button"
        onClick={handleDeleteClick}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  ) : null

  return (
    <>
      <div className="relative h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      {isOpen && createPortal(menuContent, document.body)}
    </>
  )
}

const EditExpenseDialog = ({ isOpen, onClose, onSuccess, expense }: DialogProps) => {
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allShops, setAllShops] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
  })

  useEffect(() => {
    if (isOpen) {
      shopService.getAllShops().then(shops => {
        setAllShops(shops)
      }).catch(() => {})
      
      if (expense) {
        reset({
          shop_id: expense.shop_id || '',
          amount: expense.amount || '',
          expense_date: expense.expense_date ? expense.expense_date.split('T')[0] : '',
        })
      }
    } else if (!isOpen) {
      reset({
        shop_id: '',
        amount: '',
        expense_date: '',
      })
      setSubmitError('')
    }
  }, [isOpen, expense, reset])

  const handleClose = () => {
    onClose()
  }

  const onSubmit = async (data: any) => {
    if (!expense) return
    try {
      setIsSubmitting(true)
      setSubmitError('')
      
      await expenseService.updateExpense(expense.id, {
        amount: parseFloat(data.amount),
        expense_date: data.expense_date,
      })
      
      toast.success('Expense updated successfully!')
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update expense'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !expense) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Expense</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="edit-shop_id" className="block text-sm font-medium text-gray-700 mb-1">
                Shop
              </label>
              <select
                id="edit-shop_id"
                {...register('shop_id', { required: 'Shop is required' })}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 cursor-not-allowed"
              >
                <option value={expense.shop_id}>{expense.shop_name || `Shop #${expense.shop_id}`}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">Shop cannot be changed</p>
            </div>

            <div>
              <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                id="edit-amount"
                type="number"
                step="0.01"
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.amount
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">{errors.amount.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-expense_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expense Date
              </label>
              <input
                id="edit-expense_date"
                type="date"
                {...register('expense_date', { required: 'Expense date is required' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.expense_date
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.expense_date && (
                <p className="mt-1 text-xs text-red-600">{errors.expense_date.message as string}</p>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !isValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

const DeleteExpenseDialog = ({ isOpen, onClose, onSuccess, expense }: DialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setDeleteError('')
      await expenseService.deleteExpense(expense!.id)
      toast.success('Expense deleted successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete expense'
      setDeleteError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !expense) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Delete Expense</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this expense?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Shop:</span> {expense.shop_name || `Shop #${expense.shop_id}`}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Amount:</span> ${parseFloat(expense.amount.toString()).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {new Date(expense.expense_date).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-red-600 mt-3 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {deleteError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDeleting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function ShopPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rowData, setRowData] = useState<ShopExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<ShopExpense | null>(null)
  const gridRef = useRef<AgGridReact>(null)

  const handleEdit = (expense: ShopExpense) => {
    setSelectedExpense(expense)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (expense: ShopExpense) => {
    setSelectedExpense(expense)
    setIsDeleteDialogOpen(true)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all expenses
      const expenses = await expenseService.getAllExpenses()
      
      // Fetch all shops to map shop_id to shop_name and user_id
      const shops = await shopService.getAllShops()
      const shopMap = new Map(shops.map(shop => [shop.id, shop]))
      
      // Fetch all users to map user_id to name + last_name
      const users = await userService.getAllUsers()
      const userMap = new Map(users.map(user => [user.id, `${user.name} ${user.last_name}`.trim()]))
      
      // Enrich expenses with shop names and manager names
      const enrichedExpenses: ShopExpense[] = expenses.map(expense => {
        const shop = shopMap.get(expense.shop_id)
        const managerNames: string[] = []
        
        if (shop && shop.user_id && Array.isArray(shop.user_id)) {
          shop.user_id.forEach(userId => {
            const userName = userMap.get(userId)
            if (userName) {
              managerNames.push(userName)
            }
          })
        }
        
        return {
          ...expense,
          shop_name: shop?.shop_name || `Shop #${expense.shop_id}`,
          managers: managerNames
        }
      })
      
      setRowData(enrichedExpenses)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shop expenses'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const columnDefs = useMemo(() => [
    { 
      field: 'shop_name', 
      headerName: 'Shop Name', 
      width: 250, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      field: 'managers',
      headerName: 'Managers',
      width: 250,
      sortable: true,
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: ManagersCellRenderer
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 150, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => {
        if (!params.value) return '$0.00'
        return `$${parseFloat(params.value).toFixed(2)}`
      },
      type: 'numericColumn'
    },
    { 
      field: 'expense_date', 
      headerName: 'Expense Date', 
      width: 180, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => {
        if (!params.value) return ''
        const date = new Date(params.value)
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Created At', 
      width: 200, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => {
        if (!params.value) return ''
        const date = new Date(params.value)
        return date.toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    {
      headerName: '',
      field: 'actions',
      width: 60,
      pinned: 'right' as const,
      lockPosition: true,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      cellRenderer: ActionMenu,
      cellRendererParams: {
        onEdit: handleEdit,
        onDelete: handleDelete
      },
      cellStyle: { display: 'flex', alignItems: 'center' }
    }
  ], [])

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100
  }), [])

  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={undefined} />

        <main className="p-4 lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shop Payments</h1>
              <p className="text-sm text-gray-500 mt-1">View all shop expenses ({rowData.length} total)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchExpenses}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : rowData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No shop expenses found</div>
              </div>
            ) : (
              <div 
                className="ag-theme-alpine" 
                style={{ 
                  height: '700px', 
                  width: '100%',
                  minHeight: '500px'
                }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  theme="legacy"
                  pagination={true}
                  paginationPageSize={20}
                  animateRows={true}
                  enableCellTextSelection={true}
                  domLayout="normal"
                />
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <EditExpenseDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedExpense(null)
        }}
        onSuccess={fetchExpenses}
        expense={selectedExpense}
      />

      <DeleteExpenseDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedExpense(null)
        }}
        onSuccess={fetchExpenses}
        expense={selectedExpense}
      />
    </div>
  )
}

export default ShopPaymentsPage
