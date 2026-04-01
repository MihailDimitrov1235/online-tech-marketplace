import api from "@/api/axiosInstance"
import { Button } from "@/components/common"
import { paths } from "@/router"
import { useAppSelector } from "@/store/hooks"
import type { User } from "@/types/auth"
import { Divide, Minus, MoveRight, Plus, Trash } from "lucide-react"
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

export default function Cart() {
  const { user } = useAppSelector(state => state.auth)
  const salesTax = 0.1
  const [cartData, setCartData] = useState<cartItems>()
  const [subtotal, setSubtotal] = useState(0)
  useEffect(() => {
    api
      .get<{ cart: cartItems }>("/cart")
      .then(res => {
        console.log(res.data)
        setCartData(res.data.cart)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [user?._id])

  useEffect(() => {
    if (cartData) {
      setSubtotal(
        cartData.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ),
      )
    }
  }, [cartData])

  const handleDeleteItem = (productId: string) => {
    api
      .delete(`/cart/${productId}`)
      .then(res => {
        console.log(res)
        setCartData(p =>
          p
            ? {
                ...p,
                items: p.items.filter(i => i.product._id !== productId),
              }
            : undefined,
        )
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }

  const handleChangeItemQuantity = ({
    productId,
    quantity,
  }: {
    productId: string
    quantity: number
  }) => {
    api
      .patch(`/cart/${productId}`, { quantity })
      .then(res => {
        console.log(res)
        setCartData(p =>
          p
            ? {
                ...p,
                items: p.items
                  .map(i =>
                    i.product._id === productId ? { ...i, quantity } : i,
                  )
                  .filter(i => i.quantity > 0),
              }
            : undefined,
        )
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }
  return (
    <div className="flex flex-col items-center text-contrast p-16">
      <span className="text-2xl font-bold mb-6">Your cart</span>
      {cartData && cartData?.items.length > 0 ? (
        <>
          {" "}
          <table className="w-full mt-4">
            <thead>
              <tr className="border-b border-border text-sm text-contrast/60 uppercase tracking-wide">
                <th className="text-left pb-3">Item</th>
                <th className="text-center pb-3">Price</th>
                <th className="text-center pb-3">Quantity</th>
                <th className="text-right pb-3">Total</th>
                <th className="text-right pb-3"></th>
              </tr>
            </thead>

            <tbody>
              {cartData?.items.map(i => (
                <tr key={i.product._id} className="border-b border-border ">
                  <td className="py-4 flex gap-2">
                    <img
                      className="w-16 h-16 rounded-md object-cover"
                      src={i.product.images[0]}
                    />
                    <div className="flex flex-col">
                      <span>{i.product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">{i.product.price}€</td>
                  <td className="py-4 text-center">
                    <div className="flex gap-4 w-fit mx-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-info"
                        onClick={() => {
                          if (i.quantity > 0) {
                            handleChangeItemQuantity({
                              productId: i.product._id,
                              quantity: i.quantity - 1,
                            })
                          }
                        }}
                      >
                        <Minus size={12} />
                      </Button>
                      <span>{i.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:text-info"
                        onClick={() => {
                          if (i.quantity < i.product.stock) {
                            handleChangeItemQuantity({
                              productId: i.product._id,
                              quantity: i.quantity + 1,
                            })
                          }
                        }}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    {i.product.price * i.quantity}€
                  </td>
                  <td className="py-4 w-16">
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:text-error ml-8"
                      onClick={() => {
                        handleDeleteItem(i.product._id)
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ml-auto w-80 mt-8 flex flex-col gap-2">
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-contrast/60">Subtotal</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-border">
              <span className="text-contrast/60">
                Sales tax ({salesTax * 100}%)
              </span>
              <span>{(subtotal * salesTax).toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-bold text-lg py-2">
              <span>Grand total</span>
              <span>{(subtotal * (1 + salesTax)).toFixed(2)}€</span>
            </div>
          </div>
          <NavLink to={paths.cart.checkout} className="ml-auto mt-4">
            <Button>Checkout</Button>
          </NavLink>{" "}
        </>
      ) : (
        <div className="flex flex-col items-center gap-12 mt-32">
          <span className="text-3xl font-bold">No items found</span>
          <NavLink to={paths.listings}>
            <Button>
              <span>See listings</span>
              <MoveRight className="mt-1 ml-1" size={16} />
            </Button>
          </NavLink>
        </div>
      )}
    </div>
  )
}
