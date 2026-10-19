import apiClient from './client';

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status?: string;
  method?: string;
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    const { data } = await apiClient.get<Payment[]>('/payment');
    return data;
  },

  getById: async (id: number): Promise<Payment> => {
    const { data } = await apiClient.get<Payment>(`/payment/${id}`);
    return data;
  },
};
