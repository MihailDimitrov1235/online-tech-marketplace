import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { closeCart, removeItem, updateQuantity } from "@/store/cartSlice"
import { Button } from "../common"
import { NavLink } from "react-router"
import { paths } from "@/router"
import api from "@/api/axiosInstance"

export const CartDrawer = () => {
  const dispatch = useAppDispatch()
  const { isOpen, items } = useAppSelector(state => state.cart)

  const validItems = items.filter(i => i.product != null)
  const subtotal = validItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  const salesTax = 0.1

  const handleRemove = (productId: string) => {
    api.delete(`/cart/${productId}`).catch(console.log)
    dispatch(removeItem(productId))
  }

  const handleQuantity = (productId: string, quantity: number) => {
    api.patch(`/cart/${productId}`, { quantity }).catch(console.log)
    dispatch(updateQuantity({ productId, quantity }))
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => dispatch(closeCart())}
        />
      )}

      <div className={`
        fixed top-0 right-0 z-50 h-full w-96 flex flex-col
        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl
        border-l border-white/80 dark:border-white/10
        shadow-2xl shadow-black/20
        transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-contrast">Your cart</h2>
            <p className="text-xs text-muted">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-muted hover:text-contrast hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="w-16 h-16 rounded-full bg-primary-tint flex items-center justify-center">
                <ShoppingBag size={24} className="text-primary-on" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-contrast">Cart is empty</p>
                <p className="text-xs text-muted mt-0.5">Add some products to get started</p>
              </div>
            </div>
          ) : (
            validItems.map(i => (
              <div key={i.product._id} className="flex gap-3 items-center rounded-2xl bg-white/60 dark:bg-zinc-800/50 border border-white/80 dark:border-white/10 p-3">
                <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                  <img className="w-full h-full object-contain" src={i.product.images[0]} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-contrast line-clamp-2 leading-snug">{i.product.name}</p>
                  <p className="text-xs text-muted mt-0.5">{i.product.price}€</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleRemove(i.product._id)}
                    className="text-muted hover:text-error cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-white/50 dark:bg-zinc-800/50 px-1 py-0.5">
                    <button
                      onClick={() => handleQuantity(i.product._id, i.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center rounded text-muted hover:text-contrast cursor-pointer"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-4 text-center text-xs font-medium text-contrast">{i.quantity}</span>
                    <button
                      onClick={() => i.quantity < i.product.stock && handleQuantity(i.product._id, i.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center rounded text-muted hover:text-contrast cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-contrast">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax ({salesTax * 100}%)</span>
                <span className="text-contrast">{(subtotal * salesTax).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                <span className="text-contrast">Total</span>
                <span className="text-contrast">{(subtotal * (1 + salesTax)).toFixed(2)}€</span>
              </div>
            </div>
            <NavLink to={paths.cart.checkout} onClick={() => dispatch(closeCart())}>
              <Button variant="primary" className="w-full">Checkout</Button>
            </NavLink>
          </div>
        )}
      </div>
    </>
  )
}
