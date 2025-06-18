import { create } from 'zustand'
import { toast } from 'react-toastify'
import type { Consumer, CreateConsumerPayload, GetConsumersParams, MetaType } from '../types'
import { createConsumer, deleteConsumer, getConsumers, updateConsumer } from '../api/consumerApi'



type ConsumerStore ={
  consumers: Consumer[]
  meta: MetaType | null
  loading: boolean
  error: string | null
  fetchConsumers: (params?: GetConsumersParams) => Promise<void>
  addConsumer: (payload: CreateConsumerPayload) => Promise<void>
  updateConsumer: (id: string, payload: CreateConsumerPayload) => Promise<void>
  deleteConsumer: (id: string) => Promise<void>
}

export const useConsumerStore = create<ConsumerStore>((set) => ({
  consumers: [],
  meta: null,
  loading: false,
  error: null,

  fetchConsumers: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getConsumers(params)
      set({ consumers: res.data, meta: res.meta, loading: false })
    } catch (err: any) {
      const message = err.message || 'Failed to fetch Consumers'
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  addConsumer: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await createConsumer(payload)
      set((state) => ({
        consumers: [res.data, ...state.consumers],
        loading: false,
      }))
      toast.success('Consumer created successfully!')
    } catch (err: any) {
      const message = err.message || 'Failed to create Consumer'
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  updateConsumer: async (id, payload) => {
    set({ loading: true, error: null })
    try {
      const res = await updateConsumer(id, payload)
      set((state) => ({
        consumers: state.consumers.map((consumer) =>
          consumer._id === id ? res.data : consumer
        ),
        loading: false,
      }))
      toast.success('Consumer updated successfully!')
    } catch (err: any) {
      const message = err.message || 'Failed to update Consumer'
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  deleteConsumer: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteConsumer(id)
      set((state) => ({
        consumers: state.consumers.filter((consumer) => consumer._id !== id),
        loading: false,
      }))
      toast.success('Consumer deleted successfully!')
    } catch (err: any) {
      const message = err.message || 'Failed to delete Consumer'
      toast.error(message)
      set({ error: message, loading: false })
    }
  },
}))
