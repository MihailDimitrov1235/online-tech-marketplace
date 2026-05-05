import jsPDF from "jspdf"
import type { order, orderItem } from "@/types/order"

const resolutionLabels: Record<string, string> = {
  repair: "Repair Only",
  repair_replace: "Repair or Replace",
  full: "Full (including refund)",
}

const line = (doc: jsPDF, y: number) => {
  doc.setDrawColor(229, 231, 235)
  doc.line(15, y, 195, y)
}

const section = (doc: jsPDF, title: string, y: number) => {
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(30, 30, 30)
  doc.text(title, 15, y)
  return y + 6
}

const row = (doc: jsPDF, label: string, value: string, y: number) => {
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(80, 80, 80)
  doc.text(label, 15, y)
  doc.setTextColor(30, 30, 30)
  doc.text(value, 80, y)
  return y + 6
}

export const generateWarrantyPdf = (item: orderItem, order: order) => {
  const doc = new jsPDF()
  const { warranty, product } = item
  if (!warranty) {
    return
  }

  let y = 20

  // Header
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(30, 30, 30)
  doc.text("WARRANTY CERTIFICATE", 105, y, { align: "center" })
  y += 8

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(120, 120, 120)
  doc.text(
    `Issued: ${new Date().toLocaleDateString("en-UK", { year: "numeric", month: "long", day: "numeric" })}`,
    105,
    y,
    { align: "center" },
  )
  y += 5
  doc.text(`Order: #${order._id.slice(-8).toUpperCase()}`, 105, y, {
    align: "center",
  })
  y += 8

  line(doc, y)
  y += 8

  // Product
  y = section(doc, "Product", y)
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(30, 30, 30)
  doc.text(product.name, 15, y)
  y += 10

  // Warranty Period
  y = section(doc, "Warranty Period", y)
  const startDate = new Date(order.createdAt)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + warranty.durationMonths)
  y = row(
    doc,
    "Start date",
    startDate.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    y,
  )
  y = row(
    doc,
    "End date",
    endDate.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    y,
  )
  y = row(doc, "Duration", `${String(warranty.durationMonths)} months`, y)
  y += 4

  // Coverage
  y = section(doc, "Coverage", y)
  y = row(doc, "Manufacturing defects", "Yes", y)
  y = row(doc, "Accidental damage", warranty.accidentalDamage ? "Yes" : "No", y)
  y = row(doc, "Wear & tear", warranty.wearAndTear ? "Yes" : "No", y)
  y += 4

  // Resolution
  y = section(doc, "Resolution", y)
  y = row(doc, "Type", resolutionLabels[warranty.resolution], y)
  y = row(
    doc,
    "Shipping covered by",
    warranty.shipping === "seller" ? "Seller" : "Buyer",
    y,
  )
  y += 4

  // Exclusions
  y = section(doc, "Exclusions", y)
  const { exclusions } = warranty
  const activeExclusions = [
    exclusions.misuse && "Misuse or negligence",
    exclusions.unauthorizedRepairs && "Unauthorized repairs",
    exclusions.wearAndTear && "Normal wear and tear",
    exclusions.consumables && "Consumable parts",
    exclusions.cosmetic && "Cosmetic damage",
  ].filter(Boolean) as string[]

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(80, 80, 80)
  activeExclusions.forEach(exclusion => {
    doc.text(`• ${exclusion}`, 20, y)
    y += 6
  })
  y += 4

  // Footer
  line(doc, y)
  y += 6
  doc.setFontSize(9).setTextColor(120, 120, 120)
  doc.text(`Buyer: ${order.buyer.firstName} ${order.buyer.lastName}`, 15, y)
  doc.text(
    `Seller: ${product.seller.firstName} ${product.seller.lastName}`,
    195,
    y,
    { align: "right" },
  )

  doc.save(`warranty-${product.name.replace(/\s+/g, "-")}.pdf`)
}
