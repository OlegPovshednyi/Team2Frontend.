import apiClient from './client';
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  RegisterSellerDto,
  User,
} from '../types';

// Пока бэка нет, true. Когда бэк будет готов, поменять на false
const USE_MOCK = true;

function buildUser(res: AuthResponse): User {
  return {
    name: res.name,
    email: res.email,
    role: res.role,
  };
}

export const authApi = {
  login: async (dto: LoginDto): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto);
    return { token: data.token, user: buildUser(data) };
  },

  register: async (dto: RegisterDto): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    return { token: data.token, user: buildUser(data) };
  },

  firebaseLogin: async (idToken: string): Promise<{ token: string; user: User }> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/firebase-login', { idToken });
    return { token: data.token, user: buildUser(data) };
  },

  // TODO(бэк): уточнить адрес эндпоинта и формат тела.
  // Роль "seller" должен выставлять сервер, а не фронт.
  registerSeller: async (
    idToken: string,
    dto: RegisterSellerDto,
  ): Promise<{ token: string; user: User }> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500)); // имитация задержки
      return {
        token: 'mock-seller-token',
        user: { name: dto.shopName, email: 'seller@mock.com', role: 'seller', phone: dto.phone },
      };
    }

    const { data } = await apiClient.post<AuthResponse>('/auth/register-seller', {
      idToken,
      shopName: dto.shopName,
      phone: dto.phone,
    });
    return { token: data.token, user: buildUser(data) };
  },
};