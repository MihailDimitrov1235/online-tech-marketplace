import { Button } from "@/components/common"
import { useEffect, useState } from "react"

const mockData = [
  {
    _id: "1234",
    name: "Bazinga",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5iGkP6Y7unsB1-7VgmKBb-ZPffJIOGp4DXg&s",
    ],
    price: 2.42,
    quantity: 4,
  },
  {
    _id: "1234",
    name: "Bazinga",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5iGkP6Y7unsB1-7VgmKBb-ZPffJIOGp4DXg&s",
    ],
    price: 2.42,
    quantity: 4,
  },
  {
    _id: "1234",
    name: "Bazinga",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5iGkP6Y7unsB1-7VgmKBb-ZPffJIOGp4DXg&s",
    ],
    price: 2.42,
    quantity: 4,
  },
]

export default function Cart() {
  const salesTax = 0.1
  const [subtotal, setSubtotal] = useState(0)
  useEffect(() => {
    setSubtotal(
      mockData.reduce((acc, item) => acc + item.price * item.quantity, 0),
    )
  }, [])
  return (
    <div className="flex flex-col items-center text-contrast p-16">
      <span className="text-2xl font-bold mb-6">Your cart</span>
      <table className="w-full mt-4">
        <thead>
          <tr className="border-b border-border text-sm text-contrast/60 uppercase tracking-wide">
            <th className="text-left pb-3">Item</th>
            <th className="text-center pb-3">Price</th>
            <th className="text-center pb-3">Quantity</th>
            <th className="text-right pb-3">Total</th>
          </tr>
        </thead>

        <tbody>
          {mockData.map(p => (
            <tr className="border-b border-border ">
              <td className="py-4 flex gap-2">
                <img
                  className="w-16 h-16 rounded-md object-cover"
                  src={p.images[0]}
                />
                <div className="flex flex-col">
                  <span>{p.name}</span>
                </div>
              </td>
              <td className="py-4 text-center">{p.price}€</td>
              <td className="py-4 text-center">{p.quantity}</td>
              <td className="py-4 text-right">{p.price * p.quantity}€</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto w-80 mt-8 flex flex-col gap-2">
        <div className="flex justify-between text-sm py-2 border-b border-border">
          <span className="text-contrast/60">Subtotal</span>
          <span>{subtotal}€</span>
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
      <Button className="ml-auto mt-4">Checkout</Button>
    </div>
  )
}
