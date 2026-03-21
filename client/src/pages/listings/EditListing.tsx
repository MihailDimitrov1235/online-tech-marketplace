import { useParams } from "react-router"

export default function EditListing() {
  const { id } = useParams<{ id: string }>()
  return <div>EditListing {id}</div>
}
