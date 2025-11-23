import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { shopService } from '../services/shopService'
import { userService } from '../services/userService'
import { createShopSchema, type CreateShopFormData } from '../validator/createShopSchema'
import { updateShopSchema, type UpdateShopFormData } from '../validator/updateShopSchema'

ModuleRegistry.registerModules([AllCommunityModule])

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

interface ActionMenuParams {
  data?: Shop;
  node?: { data?: Shop };
  onEdit?: (shop: Shop) => void;
  onDelete?: (shop: Shop) => void;
  onManageManagers?: (shop: Shop) => void;
  cellRendererParams?: {
    onEdit?: (shop: Shop) => void;
    onDelete?: (shop: Shop) => void;
    onManageManagers?: (shop: Shop) => void;
  };
}

const DescriptionCellRenderer = (params: any) => {
  const description = params.value || ''
  const maxLength = 50
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [arrowLeft, setArrowLeft] = useState(0)
  const cellRef = useRef<HTMLSpanElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  if (!description || description === '-') {
    return <span>-</span>
  }
  
  const truncated = description.length > maxLength 
    ? description.substring(0, maxLength) + '...' 
    : description
  
  const shouldShowTooltip = description.length > maxLength
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!shouldShowTooltip || !cellRef.current) return
    
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    
    tooltipTimeoutRef.current = setTimeout(() => {
      if (!cellRef.current) return
      
      const rect = cellRef.current.getBoundingClientRect()
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      
      const tooltipWidth = Math.min(384, window.innerWidth - 40)
      let left = rect.left + scrollX
      
      const margin = 20
      if (left + tooltipWidth > window.innerWidth - margin + scrollX) {
        left = window.innerWidth - tooltipWidth - margin + scrollX
      }
      if (left < margin + scrollX) {
        left = margin + scrollX
      }
      
      const cellCenter = rect.left + scrollX + (rect.width / 2)
      const arrowPosition = cellCenter - left
      
      setTooltipPosition({
        top: rect.top + scrollY,
        left: left
      })
      setArrowLeft(Math.max(16, Math.min(arrowPosition, tooltipWidth - 16)))
      setShowTooltip(true)
    }, 200)
  }
  
  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
    setShowTooltip(false)
  }
  
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [])
  
  return (
    <>
      <span 
        ref={cellRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`cursor-default ${shouldShowTooltip ? 'hover:text-gray-700 transition-colors' : ''}`}
      >
        {truncated}
      </span>
      {showTooltip && shouldShowTooltip && createPortal(
        <div
          className="fixed bg-gray-900 text-gray-100 text-sm px-4 py-3 rounded-lg shadow-2xl max-w-md pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateY(-100%) translateY(-8px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 999999,
            opacity: 1,
            transition: 'opacity 0.2s ease-out'
          }}
        >
          <div className="whitespace-pre-wrap break-words leading-relaxed">{description}</div>
          <div 
            className="absolute top-full w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-900"
            style={{ 
              left: `${arrowLeft}px`,
              transform: 'translateX(-50%)',
              marginTop: '-1px', 
              filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))' 
            }}
          />
        </div>,
        document.body
      )}
    </>
  )
}

const ActionMenu = (params: ActionMenuParams) => {
  const data = params.data || params.node?.data
  const onEdit = params.onEdit || params.cellRendererParams?.onEdit
  const onDelete = params.onDelete || params.cellRendererParams?.onDelete
  const onManageManagers = params.onManageManagers || params.cellRendererParams?.onManageManagers
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

  const handleManageManagersClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(false)
    if (onManageManagers && data) {
      onManageManagers(data)
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
        onClick={handleManageManagersClick}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Manage Managers
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

function ShopsManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rowData, setRowData] = useState<Shop[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateShopUserDialogOpen, setIsCreateShopUserDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isManageManagersDialogOpen, setIsManageManagersDialogOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const gridRef = useRef<AgGridReact>(null)

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (shop: Shop) => {
    setSelectedShop(shop)
    setIsDeleteDialogOpen(true)
  }

  const handleManageManagers = (shop: Shop) => {
    setSelectedShop(shop)
    setIsManageManagersDialogOpen(true)
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

  const columnDefs = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    { 
      field: 'shop_name', 
      headerName: 'Shop Name', 
      width: 250, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 300, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      cellRenderer: DescriptionCellRenderer
    },
    { 
      field: 'address', 
      headerName: 'Address', 
      width: 250, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => params.value || '-'
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueFormatter: (params: any) => params.value || '-'
    },
    { 
      field: 'user_id', 
      headerName: 'Users', 
      width: 200, 
      sortable: true, 
      filter: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
      valueGetter: (params: any) => {
        if (!params.data?.users || !Array.isArray(params.data.users) || params.data.users.length === 0) return '-'
        return params.data.users.map((u: any) => `${u.name} ${u.last_name}`).join(', ')
      },
      valueFormatter: (params: any) => params.value || '-'
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
        onDelete: handleDelete,
        onManageManagers: handleManageManagers
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 pt-16">
        <Header onMenuClick={() => setSidebarOpen(true)} dateRange={undefined} />

        <main className="p-4 lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Shops</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all shops ({rowData.length} total)</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateShopUserDialogOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Create Shop Manager
              </button>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Shop
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchShops}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : rowData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No shops found</div>
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

      <CreateShopDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={fetchShops}
      />

      <EditShopDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedShop(null)
        }}
        onSuccess={fetchShops}
        shop={selectedShop}
      />

      <DeleteShopDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedShop(null)
        }}
        onSuccess={fetchShops}
        shop={selectedShop}
      />

      <ManageManagersDialog
        isOpen={isManageManagersDialogOpen}
        onClose={() => {
          setIsManageManagersDialogOpen(false)
          setSelectedShop(null)
        }}
        onSuccess={fetchShops}
        shop={selectedShop}
      />

      <CreateShopUserDialog
        isOpen={isCreateShopUserDialogOpen}
        onClose={() => setIsCreateShopUserDialogOpen(false)}
        onSuccess={fetchShops}
      />
    </div>
  )
}

export default ShopsManagementPage

