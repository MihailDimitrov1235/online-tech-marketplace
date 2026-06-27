import { useEffect, useState } from "react"
import { type Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"

import api from "@/api/axiosInstance"
import { paths } from "@/router"
import { Button, Card } from "@/components/common"
import { FormProvider, RHFTextField } from "@/components/form"
import { PartPicker } from "@/components/configurations/PartPicker"
import type { detailedProduct } from "@/types/product"
import type {
  Configuration,
  ConfigurationPartsInput,
} from "@/types/configuraion"

const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
})

type FormSchema = {
  name: string
  description?: string
}

export default function NewConfiguration({
  configurationId,
}: {
  configurationId?: string
}) {
  const navigate = useNavigate()

  const [processor, setProcessor] = useState<detailedProduct[]>([])
  const [motherboard, setMotherboard] = useState<detailedProduct[]>([])
  const [gpu, setGpu] = useState<detailedProduct[]>([])
  const [ram, setRam] = useState<detailedProduct[]>([])
  const [storage, setStorage] = useState<detailedProduct[]>([])
  const [psu, setPsu] = useState<detailedProduct[]>([])
  const [casePart, setCasePart] = useState<detailedProduct[]>([])
  const [partsError, setPartsError] = useState<string>()

  const methods = useForm<FormSchema>({
    defaultValues: { name: "", description: "" },
    resolver: yupResolver(schema) as Resolver<FormSchema>,
  })
  const { handleSubmit, reset, register } = methods

  useEffect(() => {
    if (!configurationId) return

    api
      .get<{ configuration: Configuration }>(
        `/configurations/${configurationId}`,
      )
      .then(res => {
        const { name, description, parts } = res.data.configuration
        reset({ name, description })
        setProcessor([parts.processor])
        setMotherboard([parts.motherboard])
        setGpu(parts.gpu ? [parts.gpu] : [])
        setRam(parts.ram)
        setStorage(parts.storage)
        setPsu([parts.psu])
        setCasePart(parts.case ? [parts.case] : [])
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [configurationId, reset])

  const allSelected = [
    ...processor,
    ...motherboard,
    ...gpu,
    ...ram,
    ...storage,
    ...psu,
    ...casePart,
  ]
  const totalPrice = allSelected.reduce((sum, part) => sum + part.price, 0)

  const onSubmit = handleSubmit(data => {
    if (!processor[0] || !motherboard[0] || !psu[0]) {
      setPartsError(
        "Processor, motherboard and power supply are required.",
      )
      return
    }
    if (ram.length === 0) {
      setPartsError("At least one RAM stick is required.")
      return
    }
    if (storage.length === 0) {
      setPartsError("At least one storage drive is required.")
      return
    }
    setPartsError(undefined)

    const parts: ConfigurationPartsInput = {
      processor: processor[0]._id,
      motherboard: motherboard[0]._id,
      psu: psu[0]._id,
      ram: ram.map(part => part._id),
      storage: storage.map(part => part._id),
      ...(gpu[0] && { gpu: gpu[0]._id }),
      ...(casePart[0] && { case: casePart[0]._id }),
    }

    const request = configurationId
      ? api.patch<{ configuration: { _id: string } }>(
          `/configurations/${configurationId}`,
          { name: data.name, description: data.description, parts },
        )
      : api.post<{ configuration: { _id: string } }>("/configurations", {
          name: data.name,
          description: data.description,
          parts,
        })

    request
      .then(async res => {
        const id = configurationId ?? res.data.configuration._id
        await navigate(paths.configurations.details(id))
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  })

  return (
    <FormProvider
      methods={methods}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-8 px-14 pt-8"
    >
      <button
        onClick={() => {
          void navigate(-1)
        }}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-contrast cursor-pointer w-fit"
        type="button"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <Card className="items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-contrast">
          {configurationId ? "Edit configuration" : "Build a configuration"}
        </h1>
        <Button type="submit" variant="primary" className="ml-auto" size="lg">
          {configurationId ? "Save changes" : "Create configuration"}
        </Button>
      </Card>

      <div className="flex flex-1 gap-8">
        <Card className="w-full h-fit flex-col flex-1 gap-4 min-w-0">
          <h2 className="text-lg font-semibold text-contrast">
            Main fields
          </h2>
          <RHFTextField name="name" label="Name" fullWidth />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-contrast/70">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-800/50 p-3 text-sm text-contrast placeholder:text-muted focus:outline-none focus:border-primary-ring resize-none"
            />
          </div>

          {partsError && (
            <p className="text-xs text-error">{partsError}</p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted">Total price</span>
            <span className="text-lg font-bold text-contrast">
              {totalPrice.toFixed(2)}€
            </span>
          </div>
        </Card>

        <Card className="h-fit flex-1 flex-col gap-4 min-w-0">
          <h2 className="text-lg font-semibold text-contrast">Parts</h2>

          <PartPicker
            type="processor"
            label="Processor"
            selected={processor}
            onChange={setProcessor}
          />
          <PartPicker
            type="motherboard"
            label="Motherboard"
            selected={motherboard}
            onChange={setMotherboard}
          />
          <PartPicker
            type="gpu"
            label="Graphics card"
            selected={gpu}
            onChange={setGpu}
          />
          <PartPicker
            type="ram"
            label="RAM"
            multiple
            selected={ram}
            onChange={setRam}
          />
          <PartPicker
            type="storage"
            label="Storage"
            multiple
            selected={storage}
            onChange={setStorage}
          />
          <PartPicker
            type="psu"
            label="Power supply"
            selected={psu}
            onChange={setPsu}
          />
          <PartPicker
            type="case"
            label="Case"
            selected={casePart}
            onChange={setCasePart}
          />
        </Card>
      </div>
    </FormProvider>
  )
}
