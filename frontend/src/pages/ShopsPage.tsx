import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { shopService } from '../services/shopService'
import { userService } from '../services/userService'
import { incomeTransactionService } from '../services/incomeTransactionService'
import { authService } from '../services/authService'
import { createShopSchema, type CreateShopFormData } from '../validator/createShopSchema'
import { updateShopSchema, type UpdateShopFormData } from '../validator/updateShopSchema'
interface Shop {
  id: number;
  shop_name: string;
  user_id: number[] | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
  }[] | null;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shop?: Shop | null;
}

const EditShopDialog = ({ isOpen, onClose, onSuccess, shop }: DialogProps) => {
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopUsers, setShopUsers] = useState<any[]>([])
  const [selectedManagers, setSelectedManagers] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(updateShopSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (isOpen && shop) {
      reset({
        shop_name: shop.shop_name || '',
        user_id: shop.user_id || null,
        description: shop.description || '',
        address: shop.address || '',
        phone: shop.phone || '',
      })
      userService.getUsersByRole('shop').then(users => {
        setShopUsers(users)
      }).catch(() => {
      })
      if (shop.user_id && Array.isArray(shop.user_id) && shop.user_id.length > 0) {
        setSelectedManagers([...shop.user_id])
      } else {
        setSelectedManagers([])
      }
    } else if (!isOpen) {
      reset({
        shop_name: '',
        user_id: null,
        description: '',
        address: '',
        phone: '',
      })
      setSubmitError('')
      setSelectedManagers([])
    }
  }, [isOpen, shop, reset])


  const handleClose = () => {
    onClose()
  }


  const onSubmit = async (data: UpdateShopFormData) => {
    if (!shop) return
    try {
      setIsSubmitting(true)
      setSubmitError('')
      const updateData: UpdateShopFormData & { user_id?: number[] | null } = {
        ...data,
        user_id: selectedManagers.length > 0 ? selectedManagers : null
      }
      await shopService.updateShop(shop.id, updateData)
      
      toast.success('Shop updated successfully!')
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update shop'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !shop) return null

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
            <h2 className="text-2xl font-bold text-gray-900">Edit Shop</h2>
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
              <label htmlFor="edit-shop_name" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                id="edit-shop_name"
                type="text"
                {...register('shop_name')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.shop_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop name"
              />
              {errors.shop_name && (
                <p className="mt-1 text-xs text-red-600">{errors.shop_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                {...register('description')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop description"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="edit-address"
                type="text"
                {...register('address')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop address"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="edit-phone"
                type="text"
                {...register('phone')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop phone"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Managers <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              {shopUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No users with Shop role found</div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {shopUsers
                    .filter(user => user.role && user.role.toLowerCase() === 'shop')
                    .map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedManagers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedManagers([...selectedManagers, user.id])
                            } else {
                              setSelectedManagers(selectedManagers.filter(id => id !== user.id))
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user.last_name}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                </div>
              )}
              {selectedManagers.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  {selectedManagers.length} manager(s) selected
                </p>
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

const DeleteShopDialog = ({ isOpen, onClose, onSuccess, shop }: DialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setDeleteError('')
      await shopService.deleteShop(shop!.id)
      toast.success('Shop deleted successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete shop'
      setDeleteError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen || !shop) return null

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
            <h2 className="text-2xl font-bold text-gray-900">Delete Shop</h2>
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
              Are you sure you want to delete this shop?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Shop Name:</span> {shop.shop_name}
              </p>
              {shop.description && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {shop.description}
                </p>
              )}
              {shop.address && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {shop.address}
                </p>
              )}
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

const ManageManagersDialog = ({ isOpen, onClose, onSuccess, shop: initialShop }: DialogProps & { shop: Shop | null }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(initialShop)
  const [allShops, setAllShops] = useState<Shop[]>([])
  const [shopUsers, setShopUsers] = useState<any[]>([])
  const [selectedManagers, setSelectedManagers] = useState<number[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedShop(initialShop)
      shopService.getAllShops().then(shops => {
        setAllShops(shops)
      }).catch(() => {
        setError('Failed to load shops')
      })
      
      if (initialShop) {
        userService.getUsersByRole('shop').then(users => {
          const shopOnlyUsers = users.filter(user => user.role && user.role.toLowerCase() === 'shop')
          setShopUsers(shopOnlyUsers)
        }).catch(() => {
        })
        
        if (initialShop.user_id && Array.isArray(initialShop.user_id)) {
          setSelectedManagers(initialShop.user_id)
        } else {
          setSelectedManagers([])
        }
      }
    } else {
      setSelectedShop(null)
      setAllShops([])
      setShopUsers([])
      setSelectedManagers([])
      setError('')
    }
  }, [isOpen, initialShop])

  const handleShopChange = async (shopId: string) => {
    const shop = allShops.find(s => s.id === parseInt(shopId))
    setSelectedShop(shop || null)
    if (shop) {
      try {
        const users = await userService.getUsersByRole('shop')
        setShopUsers(users)
      } catch {}
      
      if (shop.user_id && Array.isArray(shop.user_id)) {
        setSelectedManagers(shop.user_id)
      } else {
        setSelectedManagers([])
      }
    } else {
      setShopUsers([])
      setSelectedManagers([])
    }
  }

  const handleSave = async () => {
    if (!selectedShop) {
      setError('Please select a shop')
      return
    }

    try {
      setIsSaving(true)
      setError('')
      
      await shopService.updateShop(selectedShop.id, {
        user_id: selectedManagers.length > 0 ? selectedManagers : null
      })
      
      toast.success('Managers updated successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update managers'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Shop Managers</h2>
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

          <div className="space-y-6">
            <div>
              <label htmlFor="shop-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Shop <span className="text-red-500">*</span>
              </label>
              <select
                id="shop-select"
                value={selectedShop?.id || ''}
                onChange={(e) => handleShopChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="">Select a shop</option>
                {allShops.map((shop) => (
                  <option key={shop.id} value={shop.id.toString()}>
                    {shop.shop_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedShop && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Managers
                </label>
                {shopUsers.length === 0 ? (
                  <div className="text-sm text-gray-500">No users with Shop role found</div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                    {shopUsers
                      .filter(user => user.role && user.role.toLowerCase() === 'shop')
                      .map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedManagers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedManagers([...selectedManagers, user.id])
                              } else {
                                setSelectedManagers(selectedManagers.filter(id => id !== user.id))
                              }
                            }}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </label>
                      ))}
                  </div>
                )}
                {selectedManagers.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    {selectedManagers.length} manager(s) selected
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedShop || isSaving}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !selectedShop || isSaving
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

const PurchaseDialog = ({ isOpen, onClose, shop }: { isOpen: boolean; onClose: () => void; shop: Shop | null }) => {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0]
      setDate(today)
      setAmount('')
      setCustomerName('')
      setError('')
      
      // Get current user name for customer_name
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setCustomerName(`${currentUser.name} ${currentUser.last_name}`.trim())
      }
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      setError('Please select a date')
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!customerName || customerName.trim() === '') {
      setError('Please enter customer name')
      return
    }

    if (!shop) {
      setError('Shop information is missing')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      
      await incomeTransactionService.createIncomeTransaction({
        shop_id: shop.id,
        customer_name: customerName.trim(),
        amount: parseFloat(amount),
        transaction_date: date
      })
      
      toast.success(`Payment created successfully! Date: ${date}, Amount: $${parseFloat(amount).toFixed(2)}`)
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !shop) return null

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
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

          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Shop:</p>
              <p className="text-lg font-semibold text-gray-900">{shop.shop_name}</p>
              {shop.description && (
                <p className="text-sm text-gray-500 mt-1">{shop.description}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="payment-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="payment-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

const CreateShopUserDialog = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [allShops, setAllShops] = useState<Shop[]>([])
  const [shopUsers, setShopUsers] = useState<any[]>([])
  const [selectedManagers, setSelectedManagers] = useState<number[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      shopService.getAllShops().then(shops => {
        setAllShops(shops)
      }).catch(() => {
        setError('Failed to load shops')
      })
      
      userService.getUsersByRole('shop').then(users => {
        const shopOnlyUsers = users.filter(user => user.role && user.role.toLowerCase() === 'shop')
        setShopUsers(shopOnlyUsers)
      }).catch(() => {
      })
    } else {
      setSelectedShop(null)
      setAllShops([])
      setShopUsers([])
      setSelectedManagers([])
      setError('')
    }
  }, [isOpen])

  const handleShopChange = async (shopId: string) => {
    const shop = allShops.find(s => s.id === parseInt(shopId))
    setSelectedShop(shop || null)
    if (shop) {
      userService.getUsersByRole('shop').then(users => {
        const shopOnlyUsers = users.filter(user => user.role && user.role.toLowerCase() === 'shop')
        setShopUsers(shopOnlyUsers)
      }).catch(() => {
      })
    } else {
      setShopUsers([])
      setSelectedManagers([])
    }
  }

  const handleCreate = async () => {
    if (!selectedShop) {
      setError('Please select a shop')
      return
    }

    if (selectedManagers.length === 0) {
      setError('Please select at least one manager')
      return
    }

    try {
      setIsCreating(true)
      setError('')
      
      await shopService.updateShop(selectedShop.id, {
        user_id: selectedManagers.length > 0 ? selectedManagers : null
      })
      
      toast.success('Shop managers created successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create shop managers'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Shop Managers</h2>
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

          <div className="space-y-6">
            <div>
              <label htmlFor="create-shop-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Shop <span className="text-red-500">*</span>
              </label>
              <select
                id="create-shop-select"
                value={selectedShop?.id || ''}
                onChange={(e) => handleShopChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="">Select a shop</option>
                {allShops.map((shop) => (
                  <option key={shop.id} value={shop.id.toString()}>
                    {shop.shop_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedShop && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Managers
                </label>
                {shopUsers.length === 0 ? (
                  <div className="text-sm text-gray-500">No users with Shop role found</div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                    {shopUsers
                      .filter(user => user.role && user.role.toLowerCase() === 'shop')
                      .map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedManagers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedManagers([...selectedManagers, user.id])
                              } else {
                                setSelectedManagers(selectedManagers.filter(id => id !== user.id))
                              }
                            }}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </label>
                      ))}
                  </div>
                )}
                {selectedManagers.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    {selectedManagers.length} manager(s) selected
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!selectedShop || selectedManagers.length === 0 || isCreating}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !selectedShop || selectedManagers.length === 0 || isCreating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

const CreateShopDialog = ({ isOpen, onClose, onSuccess }: Omit<DialogProps, 'shop'>) => {
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopUsers, setShopUsers] = useState<any[]>([])
  const [selectedManagers, setSelectedManagers] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(createShopSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (isOpen) {
      userService.getUsersByRole('shop').then(users => {
        const shopOnlyUsers = users.filter(user => user.role && user.role.toLowerCase() === 'shop')
        setShopUsers(shopOnlyUsers)
      }).catch(() => {
      })
    } else if (!isOpen) {
      reset()
      setSubmitError('')
      setSelectedManagers([])
    }
  }, [isOpen, reset])


  const handleClose = () => {
    onClose()
  }


  const onSubmit = async (data: CreateShopFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      const createData: CreateShopFormData & { user_id?: number[] | null } = {
        ...data,
        user_id: selectedManagers.length > 0 ? selectedManagers : null
      }
      await shopService.createShop(createData)
      
      toast.success('Shop created successfully!')
      reset()
      setSelectedManagers([])
      onSuccess()
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create shop'
      setSubmitError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

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
            <h2 className="text-2xl font-bold text-gray-900">Create Shop</h2>
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
              <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                id="shop_name"
                type="text"
                {...register('shop_name')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.shop_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop name"
              />
              {errors.shop_name && (
                <p className="mt-1 text-xs text-red-600">{errors.shop_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop address (optional)"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                {...register('phone')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Enter shop phone (optional)"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Managers <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              {shopUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No users with Shop role found</div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {shopUsers
                    .filter(user => user.role && user.role.toLowerCase() === 'shop')
                    .map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedManagers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedManagers([...selectedManagers, user.id])
                            } else {
                              setSelectedManagers(selectedManagers.filter(id => id !== user.id))
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user.last_name}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                </div>
              )}
              {selectedManagers.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  {selectedManagers.length} manager(s) selected
                </p>
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
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

function ShopsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rowData, setRowData] = useState<Shop[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  const handlePurchase = (shop: Shop) => {
    setSelectedShop(shop)
    setIsPurchaseDialogOpen(true)
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      setError(null)
      const shops = await shopService.getAllShops()
      setRowData(shops || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load shops'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={undefined} />

        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
            <p className="text-sm text-gray-500 mt-1">Browse and purchase from shops</p>
          </div>
          
          {error ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchShops}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : rowData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No shops found</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rowData.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => handlePurchase(shop)}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-br from-green-50 to-gray-50 px-6 py-5 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {shop.shop_name}
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {shop.phone && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                          <p className="text-sm text-gray-900 font-medium break-words">{shop.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {shop.address && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Address</p>
                          <p className="text-sm text-gray-900 font-medium break-words">{shop.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-600 group-hover:text-green-700 transition-colors">
                        Click to Buy
                      </span>
                      <svg className="w-4 h-4 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>

      <PurchaseDialog
        isOpen={isPurchaseDialogOpen}
        onClose={() => {
          setIsPurchaseDialogOpen(false)
          setSelectedShop(null)
        }}
        shop={selectedShop}
      />
    </div>
  )
}

export default ShopsPage

