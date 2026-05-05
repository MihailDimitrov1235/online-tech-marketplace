// dashboard/data/Products.tsx
import { useEffect, useState } from "react"
import { Table, type Column } from "@/components/common/Table"
import type { pagination } from "@/types/pagination"
import type { detailedProduct } from "@/types/product"
import api from "@/api/axiosInstance"
import { NavLink } from "react-router"
import { paths } from "@/router"

const columns: Column<detailedProduct>[] = [
  {
    key: "_id",
    label: "ID",
    render: row => (
      <span className="font-mono text-xs text-contrast/50">
        {row._id.slice(-8).toUpperCase()}
      </span>
    ),
  },
  {
    key: "name",
    label: "Product",
    render: row => (
      <NavLink
        to={paths.listings.details(row._id)}
        className="flex items-center gap-3 hover:text-primary transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-neutral border border-border overflow-hidden shrink-0">
          <img
            src={row.images[0]}
            className="w-full h-full object-contain p-0.5"
          />
        </div>
        <span className="font-medium">{row.name}</span>
      </NavLink>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: row => <span className="capitalize">{row.type}</span>,
  },
  {
    key: "price",
    label: "Price",
    render: row => (
      <span className="font-semibold">€{row.price.toFixed(2)}</span>
    ),
  },
  {
    key: "stock",
    label: "Stock",
    render: row => (
      <span
        className={`font-medium ${row.stock === 0 ? "text-error" : row.stock < 5 ? "text-amber-500" : "text-emerald-500"}`}
      >
        {row.stock}
      </span>
    ),
  },
  {
    key: "condition",
    label: "Condition",
    render: row => (
      <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-neutral border border-border">
        {row.condition}
      </span>
    ),
  },
  {
    key: "seller",
    label: "Seller",
    render: row => (
      <span className="text-xs text-contrast/60">{row.seller.username}</span>
    ),
  },
]

export default function Products() {
  const [products, setProducts] = useState<detailedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const fetchProducts = (page: number) => {
    setLoading(true)
    api
      .get<{ products: detailedProduct[]; pagination: pagination }>(
        `/products?page=${String(page)}`,
      )
      .then(res => {
        setProducts(res.data.products)
        setPages(res.data.pagination.pages)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts(page)
  }, [page])

  return (
    <Table
      columns={columns}
      data={products}
      keyExtractor={row => row._id}
      loading={loading}
      emptyMessage="No products found"
      pagination={{ page, pages }}
      onPageChange={p => {
        setPage(p)
      }}
    />
  )
}
