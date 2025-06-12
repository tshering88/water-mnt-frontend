import { create } from 'zustand';
import { toast } from 'react-toastify';
import type { GewogType, GewogUpdateType } from '../types';
import { createGewogApi, deleteGewogApi, getGewogsApi, updateGewogApi } from '../api/gewogApi';



type GewogStore = {
  gewogs: GewogType[];
  gewogsLoading: boolean;
  error: string | null;

  fetchGewogs: () => Promise<void>;
  createGewog: (payload: GewogUpdateType) => Promise<void>;
  updateGewog: (id: string, payload: GewogUpdateType) => Promise<void>;
  deleteGewog: (id: string) => Promise<void>;
}

export const useGewogStore = create<GewogStore>((set) => ({
  gewogs: [],
  gewogsLoading: false,
  error: null,

  fetchGewogs: async () => {
    set({ gewogsLoading: true, error: null });
    try {
      const res = await getGewogsApi();
      set({ gewogs: res.data });
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch gewogs';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ gewogsLoading: false });
    }
  },

  createGewog: async (payload: GewogUpdateType) => {
    set({ gewogsLoading: true, error: null });
    try {
      const res = await createGewogApi(payload);
      set((state) => ({
        gewogs: [...state.gewogs, res.data],
      }));
      toast.success('Gewog created successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to create gewog';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ gewogsLoading: false });
    }
  },

updateGewog: async (id: string, payload: GewogUpdateType) => {
  set({ gewogsLoading: true, error: null });
  try {
    await updateGewogApi({ _id: id, ...payload });

    // ✅ Refetch the whole list to get up-to-date data
    const res = await getGewogsApi();
    set({ gewogs: res.data });

    toast.success('Gewog updated successfully!');
  } catch (err: any) {
    const msg = err.message || 'Failed to update gewog';
    toast.error(msg);
    set({ error: msg });
  } finally {
    set({ gewogsLoading: false });
  }
},


  deleteGewog: async (id: string) => {
    set({ gewogsLoading: true, error: null });
    try {
      await deleteGewogApi(id);
      set((state) => ({
        gewogs: state.gewogs.filter((g) => g._id !== id),
      }));
      toast.success('Gewog deleted successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to delete gewog';
      toast.error(msg);
      set({ error: msg });
    } finally {
      set({ gewogsLoading: false });
    }
  },
}));
