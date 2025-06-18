import axios from 'axios';
import api from '../lib/api';

import type {
  GetConsumersResponse,
  CreateUpdateConsumerResponse,
  GetConsumersParams,
  CreateConsumerPayload,
} from '../types';

// Get all Consumers (with optional pagination, filters, search)
export const getConsumers = async (
  params: GetConsumersParams = {}
): Promise<GetConsumersResponse> => {
  try {
    const { data } = await api.get<GetConsumersResponse>('/consumer', { params });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || 'Fetching consumers failed';
    }
    throw error;
  }
};

// Create Consumer
export const createConsumer = async (
  payload: CreateConsumerPayload
): Promise<CreateUpdateConsumerResponse> => {
  try {
    const { data } = await api.post<CreateUpdateConsumerResponse>('/consumer', payload);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || 'Consumer creation failed';
    }
    throw error;
  }
};

// Update Consumer
export const updateConsumer = async (
  id: string,
  payload: CreateConsumerPayload
): Promise<CreateUpdateConsumerResponse> => {
  try {
    const { data } = await api.patch<CreateUpdateConsumerResponse>(`/consumer/${id}`, payload);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || 'Updating consumer failed';
    }
    throw error;
  }
};

// Delete Consumer
export const deleteConsumer = async (id: string): Promise<{ message: string }> => {
  try {
    const { data } = await api.delete<{ message: string }>(`/consumer/${id}`);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || 'Deleting consumer failed';
    }
    throw error;
  }
};
