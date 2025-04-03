import { api } from './api.instance'
import {
    Order,
    CreateOrderData,
    Product,
    CreateProductData,
    User,
    LoginData,
    RegisterData,
    AuthResponse,
    AnyResponse
} from './api.types'

export const orderService = {
    getOrderById: async (userId: string) => {
        const { data } = await api.get<AnyResponse<Order[]>>(`/order/${userId}`)
        return data.data
    },

    createOrder: async (createOrderData: CreateOrderData) => {
        const { data } = await api.post<AnyResponse<Order>>('/order', createOrderData)
        return data.data
    }
}

export const productService = {
    getProducts: async () => {
        const { data } = await api.get<AnyResponse<Product[]>>('/products')
        return data.data
    },

    createProduct: async (createProductData: CreateProductData) => {
        const { data } = await api.post<AnyResponse<Product>>('/products/create', createProductData)
        return data.data
    }
}

export const userService = {
    getCurrentUser: async () => {
        const { data } = await api.get<AnyResponse<User>>('/user')
        return data.data
    }
}

export const authService = {
    login: async (loginData: LoginData) => {
        const response = await api.post<AuthResponse>('/auth/login', loginData)
        return response.data
    },

    register: async (data: RegisterData) => {
        const response = await api.post<AuthResponse>('/auth/register', data)
        return response.data
    }
}
