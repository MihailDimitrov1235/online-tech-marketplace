import { useParams } from "react-router"
import NewConfiguration from "./NewConfiguration"

export default function EditConfiguration() {
  const { id } = useParams<{ id: string }>()
  return <NewConfiguration configurationId={id} />
}
