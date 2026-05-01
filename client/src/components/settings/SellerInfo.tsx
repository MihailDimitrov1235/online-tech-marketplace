import { useForm, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { Button } from "../common"
import { RHFCheckbox } from "../form/RHFCheckbox"
import { RHFRadio } from "../form/RHFRadio"

const schema = yup.object({
  address: yup.object({
    country: yup.string().required("Country is required"),
    city: yup.string().required("City is required"),
    street: yup.string().required("Street is required"),
    zip: yup.string().required("Zip code is required"),
  }),
  warranty: yup.object({
    durationMonths: yup
      .number()
      .transform((val: number) => (isNaN(val) ? undefined : val))
      .oneOf([24, 36, 60], "Select a valid duration")
      .required("Select a duration"),
    accidentalDamage: yup.boolean().default(false),
    wearAndTear: yup.boolean().default(false),
    resolution: yup
      .string()
      .oneOf(["repair", "repair_replace", "full"])
      .required("Select a resolution type"),
    shipping: yup
      .string()
      .oneOf(["buyer", "seller"])
      .required("Select who covers shipping"),
    exclusions: yup.object({
      misuse: yup.boolean().default(true),
      unauthorizedRepairs: yup.boolean().default(true),
      wearAndTear: yup.boolean().default(true),
      consumables: yup.boolean().default(true),
      cosmetic: yup.boolean().default(false),
    }),
  }),
})

type SellerForm = {
  address: {
    country: string
    city: string
    street: string
    zip: string
  }
  warranty: {
    durationMonths: number
    accidentalDamage: boolean
    wearAndTear: boolean
    resolution: string
    shipping: string
    exclusions: {
      misuse: boolean
      unauthorizedRepairs: boolean
      wearAndTear: boolean
      consumables: boolean
      cosmetic: boolean
    }
  }
}

export default function SellerInfo() {
  const methods = useForm<SellerForm>({
    defaultValues: {
      address: { country: "", city: "", street: "", zip: "" },
      warranty: {
        durationMonths: undefined,
        accidentalDamage: false,
        wearAndTear: false,
        resolution: undefined,
        shipping: undefined,
        exclusions: {
          misuse: true,
          unauthorizedRepairs: true,
          wearAndTear: true,
          consumables: true,
          cosmetic: false,
        },
      },
    },
    resolver: yupResolver(schema) as Resolver<SellerForm>,
  })

  const { handleSubmit } = methods
  const onSubmit = handleSubmit(data => {
    console.log(data)
  })

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-6 px-14 py-8"
    >
      <h1 className="text-2xl font-bold text-contrast">Seller Setup</h1>

      {/* Address */}
      <div className="flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/50">
          Address
        </h2>
        <RHFTextField name="address.street" label="Street" fullWidth />
        <div className="flex gap-4">
          <RHFTextField name="address.city" label="City" fullWidth />
          <RHFTextField name="address.zip" label="Zip Code" className="w-32" />
        </div>
        <RHFTextField name="address.country" label="Country" fullWidth />
      </div>

      {/* Warranty */}
      <div className="flex-col gap-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/50">
          Warranty Information
        </h2>

        {/* Duration */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">Duration</p>
          <div className="flex gap-6">
            <RHFRadio
              name="warranty.durationMonths"
              value="24"
              label="24 months"
            />
            <RHFRadio
              name="warranty.durationMonths"
              value="36"
              label="36 months"
            />
            <RHFRadio
              name="warranty.durationMonths"
              value="60"
              label="60 months"
            />
          </div>
        </div>

        {/* Coverage */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">Coverage</p>
          <div className="flex gap-6">
            <RHFCheckbox
              name="warranty.accidentalDamage"
              label="Accidental Damage"
            />
            <RHFCheckbox name="warranty.wearAndTear" label="Wear & Tear" />
          </div>
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">Resolution Type</p>
          <div className="flex gap-6">
            <RHFRadio
              name="warranty.resolution"
              value="repair"
              label="Repair only"
            />
            <RHFRadio
              name="warranty.resolution"
              value="repair_replace"
              label="Repair or Replace"
            />
            <RHFRadio
              name="warranty.resolution"
              value="full"
              label="Full (incl. refund)"
            />
          </div>
        </div>

        {/* Shipping */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">
            Shipping Covered By
          </p>
          <div className="flex gap-6">
            <RHFRadio name="warranty.shipping" value="buyer" label="Buyer" />
            <RHFRadio name="warranty.shipping" value="seller" label="Seller" />
          </div>
        </div>

        {/* Exclusions */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">Exclusions</p>
          <div className="grid grid-cols-2 gap-2">
            <RHFCheckbox
              name="warranty.exclusions.misuse"
              label="Misuse or negligence"
            />
            <RHFCheckbox
              name="warranty.exclusions.unauthorizedRepairs"
              label="Unauthorized repairs"
            />
            <RHFCheckbox
              name="warranty.exclusions.wearAndTear"
              label="Wear & tear"
            />
            <RHFCheckbox
              name="warranty.exclusions.consumables"
              label="Consumables"
            />
            <RHFCheckbox
              name="warranty.exclusions.cosmetic"
              label="Cosmetic damage"
            />
          </div>
        </div>
      </div>

      <Button className="w-fit ml-auto" type="submit" variant="primary">
        Save seller info
      </Button>
    </FormProvider>
  )
}
