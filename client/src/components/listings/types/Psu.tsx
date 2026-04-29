import {
  psuEfficiencyRatings,
  psuFormFactors,
  psuModularTypes,
} from "@/types/specs"
import * as yup from "yup"

export const psuSchema = yup.object({
  wattage: yup.number().positive().integer().required("Wattage is required"),
  formFactor: yup
    .string()
    .oneOf(psuFormFactors, "Select a valid form factor")
    .required("Form factor is required"),
  efficiency: yup
    .string()
    .oneOf(psuEfficiencyRatings, "Select a valid efficiency rating")
    .required("Efficiency rating is required"),
  modular: yup
    .string()
    .oneOf(psuModularTypes, "Select a valid modular type")
    .required("Modular type is required"),
  connectors: yup.object({
    eps: yup.number().min(0).integer().required("EPS connectors are required"),
    pcie8pin: yup
      .number()
      .min(0)
      .integer()
      .required("PCIe 8-pin connectors are required"),
    pcie16pin: yup
      .number()
      .min(0)
      .integer()
      .required("PCIe 16-pin connectors are required"),
    sata: yup
      .number()
      .min(0)
      .integer()
      .required("SATA connectors are required"),
    molex: yup
      .number()
      .min(0)
      .integer()
      .required("Molex connectors are required"),
  }),
  protection: yup.object({
    ovp: yup.boolean().default(false),
    uvp: yup.boolean().default(false),
    ocp: yup.boolean().default(false),
    opp: yup.boolean().default(false),
    scp: yup.boolean().default(false),
    otp: yup.boolean().default(false),
  }),
  fanSize: yup.number().positive().integer().required("Fan size is required"),
  length: yup.number().positive().integer().required("Length is required"),
})

export const psuFields = [
  {
    name: "wattage",
    label: "Wattage",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">W</div>,
  },
  {
    name: "formFactor",
    label: "Form Factor",
    values: psuFormFactors,
  },
  {
    name: "efficiency",
    label: "Efficiency Rating",
    values: psuEfficiencyRatings,
  },
  {
    name: "modular",
    label: "Modular Type",
    values: psuModularTypes,
  },
  {
    name: "connectors",
    label: "Connectors",
    children: [
      {
        name: "eps",
        label: "EPS (CPU) Connectors",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "pcie8pin",
        label: "PCIe 8-pin Connectors",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "pcie16pin",
        label: "PCIe 16-pin Connectors",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "sata",
        label: "SATA Connectors",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "molex",
        label: "Molex Connectors",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "protection",
    label: "Protection Features",
    children: [
      { name: "ovp", label: "Over Voltage Protection" },
      { name: "uvp", label: "Under Voltage Protection" },
      { name: "ocp", label: "Over Current Protection" },
      { name: "opp", label: "Over Power Protection" },
      { name: "scp", label: "Short Circuit Protection" },
      { name: "otp", label: "Over Temperature Protection" },
    ],
  },
  {
    name: "fanSize",
    label: "Fan Size",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">mm</div>,
  },
  {
    name: "length",
    label: "Length",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">mm</div>,
  },
]
