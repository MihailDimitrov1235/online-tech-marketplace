import {
  storageFormFactors,
  storageInterfaces,
  storageTypes,
} from "@/types/specs"
import * as yup from "yup"

export const storageSchema = yup.object({
  type: yup
    .string()
    .oneOf(storageTypes, "Select a valid storage type")
    .required("Storage type is required"),
  formFactor: yup
    .string()
    .oneOf(storageFormFactors, "Select a valid form factor")
    .required("Form factor is required"),
  interface: yup
    .string()
    .oneOf(storageInterfaces, "Select a valid interface")
    .required("Interface is required"),
  capacity: yup.number().positive().integer().required("Capacity is required"),
  speed: yup.object({
    read: yup.number().positive().integer().required("Read speed is required"),
    write: yup
      .number()
      .positive()
      .integer()
      .required("Write speed is required"),
  }),
  cache: yup.number().min(0).integer().required("Cache is required"),
  tbw: yup.number().positive().integer().required("TBW is required"),
})

export const storageFields = [
  {
    name: "type",
    label: "Storage Type",
    values: storageTypes,
  },
  {
    name: "formFactor",
    label: "Form Factor",
    values: storageFormFactors,
  },
  {
    name: "interface",
    label: "Interface",
    values: storageInterfaces,
  },
  {
    name: "capacity",
    label: "Capacity",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">GB</div>,
  },
  {
    name: "speed",
    label: "Speed",
    children: [
      {
        name: "read",
        label: "Read Speed",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MB/s</div>,
      },
      {
        name: "write",
        label: "Write Speed",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MB/s</div>,
      },
    ],
  },
  {
    name: "cache",
    label: "Cache",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">MB</div>,
  },
  {
    name: "tbw",
    label: "TBW",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">TB</div>,
  },
]
