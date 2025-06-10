import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { useUserStore } from '../store/useUserStore'
import { Edit, Trash2, Users } from 'lucide-react'
import { getRoleBadgeColor } from '../lib/utils'
import { ConfirmDialog } from './ConfirmationDialog'
import { UserRole } from '../lib/constant'

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
    fetchUsers()
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

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">User Management</h2>
            <p className="text-blue-100">Manage all registered users in your system</p>
          </div>
        </div>
        {hasAdminPrivileges && (
          <Button onClick={onAddUserClick} className="bg-green-600 hover:bg-green-700">
            Add User
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="px-8 py-6 w-full overflow-x-auto">
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
            </div>
          </div>
        ) : (
          <table className="text-sm w-full rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[40%]' : 'w-[50%]'}`}>
                  User Details
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[25%]' : 'w-[30%]'}`}>
                  Contact
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${hasAdminPrivileges ? 'w-[15%]' : 'w-[20%]'}`}>
                  Role
                </th>
                {hasAdminPrivileges && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
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
                    className={`transition-colors duration-150 group ${
                      isCurrentUser ? 'bg-green-300 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="leading-tight">
                          <p className="font-medium text-gray-900 truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 truncate">ID: {u.cid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-gray-900">{u.phone ?? '-'}</p>
                      <p className="text-xs text-gray-500">Mobile</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(role)}`}>
                        {role}
                      </span>
                    </td>
                    {hasAdminPrivileges && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600"
                            onClick={() => onEditUser(u)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(u._id, u.name)}
                            className="text-gray-600 hover:text-red-600"
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
        )}
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