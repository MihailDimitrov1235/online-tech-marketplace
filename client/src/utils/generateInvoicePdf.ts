// utils/generateInvoicePdf.ts
import jsPDF from "jspdf"
import type { order, orderItem } from "@/types/order"

const line = (doc: jsPDF, y: number) => {
  doc.setDrawColor(229, 231, 235)
  doc.line(15, y, 195, y)
}

export const generateInvoicePdf = (order: order) => {
  const doc = new jsPDF()
  let y = 20

  // Header
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(30, 30, 30)
  doc.text("INVOICE", 15, y)

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(120, 120, 120)
  doc.text(`#${order._id.slice(-8).toUpperCase()}`, 195, y, { align: "right" })
  y += 6
  doc.text(
    new Date(order.createdAt).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    195,
    y,
    { align: "right" },
  )
  y += 10

  line(doc, y)
  y += 8

  // Buyer & Shipping
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(30, 30, 30)
  doc.text("Bill To", 15, y)
  doc.text("Ship To", 105, y)
  y += 6

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(80, 80, 80)
  doc.text(`${order.buyer.firstName} ${order.buyer.lastName}`, 15, y)
  doc.text(order.shippingAddress.street, 105, y)
  y += 5
  doc.text(
    `${order.shippingAddress.city}, ${String(order.shippingAddress.zip)}`,
    105,
    y,
  )
  y += 5
  doc.text(order.shippingAddress.country, 105, y)
  y += 12

  line(doc, y)
  y += 8

  // Table header
  doc.setFillColor(249, 250, 251)
  doc.rect(15, y - 4, 180, 10, "F")
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(100, 100, 100)
  doc.text("PRODUCT", 17, y + 2)
  doc.text("SELLER", 95, y + 2)
  doc.text("QTY", 140, y + 2, { align: "right" })
  doc.text("UNIT PRICE", 165, y + 2, { align: "right" })
  doc.text("TOTAL", 193, y + 2, { align: "right" })
  y += 12

  // Group items by seller
  const grouped = order.items.reduce<Record<string, orderItem[]>>(
    (acc, item) => {
      const sellerId = item.product.seller._id
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[sellerId]) {
        acc[sellerId] = []
      }
      acc[sellerId].push(item)
      return acc
    },
    {},
  )

  Object.values(grouped).forEach(items => {
    items.forEach(item => {
      const total = item.product.price * item.quantity

      doc
        .setFont("helvetica", "normal")
        .setFontSize(10)
        .setTextColor(30, 30, 30)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      doc.text(doc.splitTextToSize(item.product.name, 70)[0] as string, 17, y)

      doc.setTextColor(80, 80, 80)
      doc.text(item.product.seller.username, 95, y)
      doc.setTextColor(30, 30, 30)
      doc.text(String(item.quantity), 140, y, { align: "right" })
      doc.text(`€${item.product.price.toFixed(2)}`, 165, y, { align: "right" })
      doc.text(`€${total.toFixed(2)}`, 193, y, { align: "right" })
      y += 8
    })

    line(doc, y)
    y += 6
  })

  y += 4

  // Totals
  const subtotal = order.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  )

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(80, 80, 80)
  doc.text("Subtotal", 150, y)
  doc.setTextColor(30, 30, 30)
  doc.text(`€${subtotal.toFixed(2)}`, 193, y, { align: "right" })
  y += 7

  line(doc, y)
  y += 7

  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(30, 30, 30)
  doc.text("Total", 150, y)
  doc.text(`€${order.total.toFixed(2)}`, 193, y, { align: "right" })
  y += 12

  // Footer
  line(doc, y)
  y += 6
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(150, 150, 150)
  doc.text("Thank you for your purchase.", 105, y, { align: "center" })

  doc.save(`invoice-${order._id.slice(-8).toUpperCase()}.pdf`)
}
