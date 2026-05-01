import { useForm, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormProvider, RHFTextField } from "@/components/form"
import { Button } from "../common"
import { RHFCheckbox } from "../form/RHFCheckbox"
import { RHFRadio } from "../form/RHFRadio"
import api from "@/api/axiosInstance"
import { useEffect } from "react"
import { useAppSelector } from "@/store/hooks"
import type { SellerData } from "@/types/seller"
import { RHFRadioGroup } from "../form/RHFRadioGroup"

const schema = yup.object({
  address: yup.object({
    country: yup.string().required("Country is required"),
    city: yup.string().required("City is required"),
    street: yup.string().required("Street is required"),
    zip: yup.string().required("Zip code is required"),
  }),
  phone: yup
    .string()
    .matches(/^[0-9+()\-\s]+$/, "Invalid phone number")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
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
      misuse: yup.boolean().default(false),
      unauthorizedRepairs: yup.boolean().default(false),
      wearAndTear: yup.boolean().default(false),
      consumables: yup.boolean().default(false),
      cosmetic: yup.boolean().default(false),
    }),
  }),
})

export default function SellerInfo() {
  const { user } = useAppSelector(state => state.auth)
  const methods = useForm<SellerData>({
    defaultValues: {
      address: { country: "", city: "", street: "", zip: "" },
      phone: "",
      email: "",
      warranty: {
        durationMonths: undefined,
        accidentalDamage: false,
        wearAndTear: false,
        resolution: undefined,
        shipping: undefined,
        exclusions: {
          misuse: false,
          unauthorizedRepairs: false,
          wearAndTear: false,
          consumables: false,
          cosmetic: false,
        },
      },
    },
    resolver: yupResolver(schema) as Resolver<SellerData>,
  })

  const { handleSubmit, reset } = methods
  useEffect(() => {
    if (!user?._id) return
    api
      .get<{ seller: SellerData }>(`/sellers/me`)
      .then(res => {
        reset(res.data.seller)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  }, [user, reset])
  const onSubmit = handleSubmit(data => {
    api
      .post("/sellers", data)
      .then(res => {
        console.log(res)
      })
      .catch((err: unknown) => {
        console.log(err)
      })
  })

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-6 px-14 py-8"
    >
      <h1 className="text-2xl font-bold text-contrast">Seller Setup</h1>

      <div className="flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/50 mb-4">
          Contact Information
        </h2>
        <RHFTextField name="phone" label="Phone number" fullWidth />
        <RHFTextField name="email" label="Email address" fullWidth />
        <h2 className="text-xs font-semibold uppercase tracking-widest text-contrast/50 mt-4 mb-2">
          Address
        </h2>
        <RHFTextField name="address.street" label="Street" fullWidth />
        <div className="flex gap-4">
          <RHFTextField name="address.city" label="City" fullWidth />
          <RHFTextField name="address.zip" label="Zip Code" className="w-32" />
        </div>
        <RHFTextField name="address.country" label="Country" fullWidth />
      </div>

      <div className="flex-col gap-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-contrast/50 mb-4">
          Warranty Information
        </h2>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">Duration</p>
          <div className="flex gap-6">
            <RHFRadioGroup name="warranty.durationMonths" label="Duration">
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
            </RHFRadioGroup>
          </div>
        </div>

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

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-contrast">
            Shipping Covered By
          </p>
          <div className="flex gap-6">
            <RHFRadio name="warranty.shipping" value="buyer" label="Buyer" />
            <RHFRadio
              name="warranty.shipping"
              value="seller"
              label="Seller (Me)"
            />
          </div>
        </div>

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
        Request verification
      </Button>
    </FormProvider>
  )
}
