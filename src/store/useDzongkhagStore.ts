import { create } from 'zustand';
import { toast } from 'react-toastify';
import type { DzongkhagType, DzongkhagUpdateType } from '../types';
import {
  createDzongkhagApi,
  deleteDzongkhagApi,
  getDzongkhagsApi,
  updateDzongkhagApi,
} from '../api/dzongkhagApi';

type DzongkhagStore = {
  dzongkhags: DzongkhagType[];
  loading: boolean;
  error: string | null;

  fetchDzongkhags: () => Promise<void>;
  createDzongkhag: (payload: DzongkhagUpdateType) => Promise<void>;
  updateDzongkhag: (id: string, payload: DzongkhagUpdateType) => Promise<void>;
  deleteDzongkhag: (id: string) => Promise<void>;
}

export const useDzongkhagStore = create<DzongkhagStore>((set) => ({
  dzongkhags: [],
  loading: false,
  error: null,

  fetchDzongkhags: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getDzongkhagsApi();
      set({ dzongkhags: res.data });
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch dzongkhags';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  createDzongkhag: async (payload: DzongkhagUpdateType) => {
    set({ loading: true, error: null });
    try {
      const res = await createDzongkhagApi(payload);
      set((state) => ({
        dzongkhags: [...state.dzongkhags, res.data],
      }));
      toast.success('Dzongkhag created successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to create dzongkhag';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  updateDzongkhag: async (id: string, payload: DzongkhagUpdateType) => {
    set({ loading: true, error: null });
    try {
      const res = await updateDzongkhagApi({ _id: id, ...payload });
      set((state) => ({
        dzongkhags: state.dzongkhags.map((dz) =>
          dz._id === id ? res.data : dz
        ),
      }));
      toast.success('Dzongkhag updated successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to update dzongkhag';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  deleteDzongkhag: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteDzongkhagApi(id);
      set((state) => ({
        dzongkhags: state.dzongkhags.filter((dz) => dz._id !== id),
      }));
      toast.success('Dzongkhag deleted successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to delete dzongkhag';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },
}));
