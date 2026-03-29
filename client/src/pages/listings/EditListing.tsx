import { useParams } from "react-router"
import NewListing from "./NewListing"

export default function EditListing() {
  const { id } = useParams<{ id: string }>()
  return <NewListing productId={id} />
}
