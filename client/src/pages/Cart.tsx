import api from "@/api/axiosInstance"
import { Button } from "@/components/common"
import { paths } from "@/router"
import { useAppSelector } from "@/store/hooks"
import type { User } from "@/types/auth"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router"

type cartItem = {
  product: {
    _id: string
    name: string
    images: string[]
    price: number
    stock: number
  }
  quantity: number
}
type cartItems = {
  user: User
  items: cartItem[]
}

function CartSkeleton() {
  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-white/10 shadow-sm p-4 animate-pulse">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-zinc-200/80 dark:bg-zinc-700/50" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-2/3 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
              <div className="h-3 w-1/4 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
            </div>
            <div className="w-24 h-8 rounded-xl bg-zinc-200/80 dark:bg-zinc-700/50" />
            <div className="w-16 h-3.5 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
            <div className="w-8 h-8 rounded-lg bg-zinc-200/80 dark:bg-zinc-700/50" />
          </div>
        ))}
      </div>

      <div className="w-80 shrink-0 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-white/80 dark:border-white/10 shadow-lg p-6 flex flex-col gap-4 animate-pulse">
        <div className="h-4 w-1/2 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
        <div className="flex flex-col gap-3">
          <div className="h-3 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
          <div className="h-3 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
          <div className="h-px bg-border" />
          <div className="h-4 rounded-full bg-zinc-200/80 dark:bg-zinc-700/50" />
        </div>
        <div className="h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-700/50" />
      </div>
    </div>
  )
}

export default function Cart() {
  const { user } = useAppSelector(state => state.auth)
  const salesTax = 0.1
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<cartItems>()
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    api
      .get<{ cart: cartItems }>("/cart")
      .then(res => setCartData(res.data.cart))
      .catch((err: unknown) => console.log(err))
      .finally(() => setLoading(false))
  }, [user?._id])

  useEffect(() => {
    if (cartData) {
      setSubtotal(
        cartData.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      )
    }
  }, [cartData])

  const handleDeleteItem = (productId: string) => {
    api
      .delete(`/cart/${productId}`)
      .then(() => {
        setCartData(p => p ? { ...p, items: p.items.filter(i => i.product._id !== productId) } : undefined)
      })
      .catch((err: unknown) => console.log(err))
  }

  const handleChangeItemQuantity = ({ productId, quantity }: { productId: string; quantity: number }) => {
    api
      .patch(`/cart/${productId}`, { quantity })
      .then(() => {
        setCartData(p =>
          p ? {
            ...p,
            items: p.items
              .map(i => i.product._id === productId ? { ...i, quantity } : i)
              .filter(i => i.quantity > 0),
          } : undefined,
        )
      })
      .catch((err: unknown) => console.log(err))
  }

  const isEmpty = !cartData || cartData.items.length === 0

  return (
    <div className="flex flex-col w-full">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-border px-14 py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-40%] right-[-5%] w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl" />
          <div className="absolute bottom-[-40%] left-[10%] w-48 h-48 rounded-full bg-pink-300/15 dark:bg-pink-600/10 blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-xs font-medium text-primary-on uppercase tracking-widest mb-1">Checkout</p>
          <h1 className="text-3xl font-semibold tracking-tight text-contrast">Your cart</h1>
          {!isEmpty && (
            <p className="text-sm text-muted mt-1">{cartData.items.length} item{cartData.items.length !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      <div className="px-14 py-8">
        {loading ? (
          <CartSkeleton />
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-6 py-32">
            <div className="w-20 h-20 rounded-full bg-primary-tint flex items-center justify-center">
              <ShoppingBag size={32} className="text-primary-on" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-contrast">Your cart is empty</p>
              <p className="text-sm text-muted mt-1">Add some products to get started</p>
            </div>
            <NavLink to={paths.listings.root}>
              <Button variant="primary">Browse listings</Button>
            </NavLink>
          </div>
        ) : (
          <div className="flex gap-8 items-start">
            <div className="flex-1 flex flex-col gap-3">
              {cartData.items.map(i => (
                <div
                  key={i.product._id}
                  className="flex gap-4 items-center rounded-2xl bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm p-4"
                >
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-50/80 dark:bg-zinc-800/50">
                    <img className="w-full h-full object-contain" src={i.product.images[0]} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-contrast line-clamp-2">{i.product.name}</p>
                    <p className="text-sm text-muted mt-0.5">{i.product.price}€ each</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white/50 dark:bg-zinc-800/50 px-1 py-1">
                    <button
                      onClick={() => handleChangeItemQuantity({ productId: i.product._id, quantity: i.quantity - 1 })}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-700/60 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-contrast">{i.quantity}</span>
                    <button
                      onClick={() => i.quantity < i.product.stock && handleChangeItemQuantity({ productId: i.product._id, quantity: i.quantity + 1 })}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-700/60 cursor-pointer disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <p className="w-20 text-right text-sm font-semibold text-contrast shrink-0">
                    {(i.product.price * i.quantity).toFixed(2)}€
                  </p>

                  <button
                    onClick={() => handleDeleteItem(i.product._id)}
                    className="text-muted hover:text-error cursor-pointer p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-80 shrink-0 sticky top-20 rounded-2xl bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg shadow-zinc-200/40 dark:shadow-black/20 p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold text-contrast">Order summary</p>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-contrast">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sales tax ({salesTax * 100}%)</span>
                  <span className="text-contrast">{(subtotal * salesTax).toFixed(2)}€</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                  <span className="text-contrast">Total</span>
                  <span className="text-contrast">{(subtotal * (1 + salesTax)).toFixed(2)}€</span>
                </div>
              </div>

              <NavLink to={paths.cart.checkout}>
                <Button variant="primary" className="w-full">Checkout</Button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
