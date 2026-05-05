import * as yup from "yup"

const oses = ["Android", "IOS"]

export const smartphoneSchema = yup.object({
  display: yup.object({
    size: yup
      .number()
      .positive("Size should be positive")
      .required("Size is required"),
    resolution: yup.string().required("Resolution is required"),
    type: yup.string().required("Type is required"),
  }),
  processor: yup.object({
    chip: yup.string().required("Chip is required"),
    cores: yup.number().positive().required("Resolution is required"),
  }),
  memory: yup.object({
    ram: yup.number().positive().required("Ram is required"),
    storage: yup.number().positive().required("Storage is required"),
  }),
  os: yup.string().oneOf(oses, "Select a valid OS").required("OS is required"),
})

export const smartphoneFields = [
  {
    name: "display",
    label: "display",
    children: [
      {
        name: "size",
        label: "Size",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">In.</div>,
      },
      {
        name: "resolution",
        label: "Resolution",
        trailingIcon: <div className="text-sm">px.</div>,
      },
      { name: "type", label: "Type" },
    ],
  },
  {
    name: "processor",
    label: "Processor",
    children: [
      { name: "chip", label: "Chip" },
      { name: "cores", label: "Cores", numeric: true, decimalPlaces: 0 },
    ],
  },
  {
    name: "memory",
    label: "Memmory",
    children: [
      {
        name: "ram",
        label: "Ram",
        numeric: true,
        decimalPlaces: 2,
        trailingIcon: <div className="text-sm">GB</div>,
      },
      {
        name: "storage",
        label: "Storage",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">GB</div>,
      },
    ],
  },
  { name: "os", label: "OS", values: oses },
]
