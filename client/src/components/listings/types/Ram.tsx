import { ramFormFactors, memoryTypes } from "@/types/specs"
import * as yup from "yup"

export const ramSchema = yup.object({
  type: yup
    .string()
    .oneOf(memoryTypes, "Select a valid memory type")
    .required("Memory type is required"),
  formFactor: yup
    .string()
    .oneOf(ramFormFactors, "Select a valid form factor")
    .required("Form factor is required"),
  capacity: yup.number().positive().integer().required("Capacity is required"),
  speed: yup.number().positive().integer().required("Speed is required"),
  latency: yup.object({
    cl: yup.number().positive().integer().required("CL is required"),
    trcd: yup.number().positive().integer().required("tRCD is required"),
    trp: yup.number().positive().integer().required("tRP is required"),
    tras: yup.number().positive().integer().required("tRAS is required"),
  }),
  voltage: yup.number().positive().required("Voltage is required"),
  ecc: yup.boolean().default(false),
  sticks: yup
    .number()
    .positive()
    .integer()
    .required("Number of sticks is required"),
})

export const ramFields = [
  {
    name: "type",
    label: "Memory Type",
    values: memoryTypes,
  },
  {
    name: "formFactor",
    label: "Form Factor",
    values: ramFormFactors,
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
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">MHz</div>,
  },
  {
    name: "latency",
    label: "Timings",
    children: [
      { name: "cl", label: "CL", numeric: true, decimalPlaces: 0 },
      { name: "trcd", label: "tRCD", numeric: true, decimalPlaces: 0 },
      { name: "trp", label: "tRP", numeric: true, decimalPlaces: 0 },
      { name: "tras", label: "tRAS", numeric: true, decimalPlaces: 0 },
    ],
  },
  {
    name: "voltage",
    label: "Voltage",
    numeric: true,
    decimalPlaces: 2,
    trailingIcon: <div className="text-sm">V</div>,
  },
  {
    name: "ecc",
    label: "ECC Support",
  },
  {
    name: "sticks",
    label: "Number of Sticks",
    numeric: true,
    decimalPlaces: 0,
  },
]
