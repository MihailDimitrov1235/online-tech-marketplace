import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/api/axiosInstance"

type CartProduct = {
  _id: string
  name: string
  images: string[]
  price: number
  stock: number
}

export type CartItem = {
  product: CartProduct
  quantity: number
}

type CartState = {
  isOpen: boolean
  items: CartItem[]
}

const initialState: CartState = {
  isOpen: false,
  items: [],
}

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await api.get<{ cart: { items: CartItem[] } }>("/cart")
  return res.data.cart.items
})

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart(state) {
      state.isOpen = true
    },
    closeCart(state) {
      state.isOpen = false
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.product._id === action.payload.product._id)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product._id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find(i => i.product._id === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.product._id !== action.payload.productId)
        }
      }
    },
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload
    })
  },
})

export const { openCart, closeCart, addItem, removeItem, updateQuantity, setItems } = cartSlice.actions
export default cartSlice.reducer
