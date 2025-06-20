import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { useUserStore } from '../store/useUserStore'
import { Edit, Trash2, Users, Phone, IdCard, MoreVertical } from 'lucide-react'
import { getRoleBadgeColor } from '../lib/utils'
import { ConfirmDialog } from './ConfirmationDialog'
import { UserRole } from '../lib/constant'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'



interface UserListProps {
  onAddUserClick: () => void
  onEditUser: (user: any) => void // Adjust the type to match your actual user schema
}

const UserList = ({ onAddUserClick, onEditUser }: UserListProps) => {
  const { user, users, fetchUsers, deleteUser, loading } = useUserStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null)

  // Check if current user has admin privileges
  const hasAdminPrivileges = user?.role === UserRole.SUPER_ADMIN

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [fetchUsers])

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedUser({ id, name })
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id)
      await fetchUsers()
      setDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const cancelDelete = () => {
    setDialogOpen(false)
    setSelectedUser(null)
  }

  // Mobile Card Component
  const UserCard = ({ u }: { u: any }) => {
    const role = u.role ?? 'unknown'
    const isCurrentUser = user?._id === u._id

    return (
      <div
        className={`p-4 rounded-lg border transition-all duration-200 ${isCurrentUser
          ? 'bg-green-50 border-green-200 shadow-md'
          : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
          }`}
      >
        <div className="flex items-start justify-between">
          {/* User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-lg">
                {u.name}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <IdCard size={14} />
                <span className="truncate">{u.cid}</span>
              </div>
              {u.phone && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{u.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {hasAdminPrivileges && (
            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-gray-400">
      <MoreVertical size={16} />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-32 bg-gray-400 text-white">
    <DropdownMenuItem onClick={() => onEditUser(u)}>
      <Edit size={14} className="mr-2 " />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => handleDeleteClick(u._id, u.name)}
      disabled={isCurrentUser}
      className="text-red-500 focus:text-red-100"
    >
      <Trash2 size={14} className="mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          )}
        </div>

        {/* Role Badge */}
        <div className="mt-3 flex justify-between items-center">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(role)}`}>
            {role}
          </span>
          {isCurrentUser && (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              You
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Responsive Container */}
      <div className="bg-white rounded-none sm:rounded-xl shadow-sm sm:shadow-lg border-0 sm:border">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />

              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">User Management</h2>
                <p className="text-blue-100 text-sm sm:text-base hidden sm:block">
                  Manage all registered users in your system
                </p>
              </div>
            </div>
            {hasAdminPrivileges && (
              <Button
                onClick={onAddUserClick}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                size="sm"
              >
                <Users size={16} className="mr-2 sm:hidden" />
                Add User
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-gray-400 text-sm mt-1">Users will appear here once added</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block lg:hidden">
                <div className="space-y-4">
                  {users.map((u) => (
                    <UserCard key={u._id} u={u} />
                  ))}
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[40%]' : 'w-[50%]'}`}>
                        User Details
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[25%]' : 'w-[30%]'}`}>
                        Contact
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[15%]' : 'w-[20%]'}`}>
                        Role
                      </th>
                      {hasAdminPrivileges && (
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => {
                      const role = u.role ?? 'unknown'
                      const isCurrentUser = user?._id === u._id

                      return (
                        <tr
                          key={u._id}
                          className={`transition-colors duration-150 group ${isCurrentUser ? 'bg-green-50 border-l-4 border-l-green-500' : 'hover:bg-gray-50'
                            }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="leading-tight">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">{u.name}</p>
                                  {isCurrentUser && (
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">ID: {u.cid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-400" />
                              <div>
                                <p className="text-gray-900">{u.phone ?? '-'}</p>
                                <p className="text-xs text-gray-500">Mobile</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(role)}`}>
                              {role}
                            </span>
                          </td>
                          {hasAdminPrivileges && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => onEditUser(u)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(u._id, u.name)}
                                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  disabled={isCurrentUser}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* User Count */}
              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {users.length} user{users.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        title={`Delete ${selectedUser?.name}?`}
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default UserList