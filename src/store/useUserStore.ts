import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import type {
  LoginType,
  AddUserType,
  LoginResponse,
  RegisterResponse,
  UserType,
  UserUpdateType,
} from '../types'
import { deleteUserApi, fetchAllUsersApi, fetchmeApi, loginApi, registerApi, updateUserApi } from '../api/userApi'

type UserStore = {
  user: UserType | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  users: UserType[]
  fetchUsers: () => Promise<void>

  loginUser: (credentials: LoginType) => Promise<void>
  addUser: (payload: AddUserType) => Promise<void>
  logout: () => void
  updateUser: (id: string, payload: UserUpdateType) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  fetchCurrentUser: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      users: [],

      fetchUsers: async () => {
        set({ loading: true, error: null })
        try {
          const res = await fetchAllUsersApi()
          console.log(res, "res")
          set({ users: res.data })
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Failed to fetch users'
          toast.error(msg)
          set({ error: msg })
        } finally {
          set({ loading: false })
        }
      },


      loginUser: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const response: LoginResponse = await loginApi(credentials)
          set({
            token: response.token,
            isAuthenticated: true,
          })

          await useUserStore.getState().fetchCurrentUser()
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>
          const msg = error.response?.data?.message || 'Login failed'
          toast.error(msg)
          set({ error: msg })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      addUser: async (payload) => {
        set({ loading: true, error: null })
        try {
          const res: RegisterResponse = await registerApi(payload)
          set({
            user: res.data,
            isAuthenticated: true,
          })
          await useUserStore.getState().fetchUsers()
          await useUserStore.getState().fetchCurrentUser()
          toast.success('User Added Successfully.')

        } catch (err) {
          const error = err as AxiosError<{ message?: string }>
          const msg = error.response?.data?.message || 'Failed to add user'
          toast.error(msg)
          set({ error: msg })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateUser: async (id: string, payload: UserUpdateType) => {
        set({ loading: true, error: null })
        try {
          const res = await updateUserApi(id, payload)
          set((state) => ({
            users: state.users.map((user) =>
              user._id === id ? res.data : user
            ),
            loading: false,
          }))

          await useUserStore.getState().fetchCurrentUser()
          toast.success('user updated successfully!')
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Failed to update profile'
          toast.error(msg)
          set({ error: msg, loading: false })
        }
      },

      deleteUser: async (id) => {
        set({ loading: true, error: null })
        try {
          await deleteUserApi(id)

          toast.success('Account deleted successfully!')
        } catch (err: any) {
          const msg = err.response?.data?.message || 'Failed to delete account'
          toast.error(msg)
          set({ error: msg, loading: false })
        }
      },

      fetchCurrentUser: async () => {
        try {
          const { data } = await fetchmeApi()
          set({
            user: data,
            isAuthenticated: true,
          })
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>
          const msg = error.response?.data?.message || 'Failed to fetch user'
          toast.error(msg)
          set({
            user: null,
            isAuthenticated: false,
            error: msg,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage-watermntsys',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
