import { useState } from 'react'
import { toast } from 'react-toastify'
import { useUserStore } from '../../store/useUserStore'
import UserList from '../../components/UserList'
import type { UserFormValues, UserType } from '../../types'
import UserAddEdit from '../../components/UserAddEdit'

const UserManagement = () => {
  const { addUser, updateUser, loading } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserFormValues | null>(null)

  

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true)
    try {
      if (editingUser) {
        await updateUser(editingUser._id, data)
      } else {
        await addUser({
          name: data.name!,
          cid: data.cid!,
          phone: data.phone!,
          password: data.password,
          role: data.role

        })
      }
      setDialogOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed in User')
    } finally {
      setIsLoading(false)
    }
  }

  const onAddUserClick = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const onEditUser = (user: UserType) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingUser(null)
  }

  return (
    <>
      <UserAddEdit
        open={dialogOpen}
        closeDialog={closeDialog}
        loading={isLoading || loading}
        onSubmit={onSubmit}
        initialValues={editingUser}
        key={editingUser?._id || 'new-user'}
      />
      <UserList onAddUserClick={onAddUserClick} onEditUser={onEditUser} />
    </>
  )
}

export default UserManagement
