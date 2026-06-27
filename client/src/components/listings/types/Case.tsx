import {
  caseFormFactors,
  caseFrontPorts,
  formFactors,
  radiatorSizes,
  sidePanelTypes,
} from "@/types/specs"
import * as yup from "yup"

export const caseSchema = yup.object({
  formFactor: yup
    .string()
    .oneOf(caseFormFactors, "Select a valid case form factor")
    .required("Case form factor is required"),

  supportedFormFactors: yup
    .array()
    .of(yup.string().oneOf(formFactors).required())
    .min(1, "At least one supported motherboard size must be selected")
    .required("Supported motherboard sizes are required"),

  maxGpuLength: yup.number().positive().integer().optional(),
  maxCoolerHeight: yup.number().positive().integer().optional(),
  maxPsuLength: yup.number().positive().integer().optional(),

  driveBays: yup.object({
    bay35: yup.number().min(0).integer().required("3.5\" bay count is required"),
    bay25: yup.number().min(0).integer().required("2.5\" bay count is required"),
  }),

  expansionSlots: yup
    .number()
    .min(0)
    .integer()
    .required("Expansion slot count is required"),

  radiatorSupport: yup.object({
    front: yup.string().oneOf(radiatorSizes).optional(),
    top: yup.string().oneOf(radiatorSizes).optional(),
    rear: yup.string().oneOf(radiatorSizes).optional(),
  }),

  frontPorts: yup.array().of(yup.string().oneOf(caseFrontPorts).required()),

  includedFans: yup
    .number()
    .min(0)
    .integer()
    .required("Included fan count is required"),

  dimensions: yup.object({
    height: yup.number().positive().required("Height is required"),
    width: yup.number().positive().required("Width is required"),
    depth: yup.number().positive().required("Depth is required"),
  }),

  sidePanel: yup
    .string()
    .oneOf(sidePanelTypes, "Select a valid side panel type")
    .required("Side panel type is required"),
})

export const caseFields = [
  {
    name: "formFactor",
    label: "Case Form Factor",
    values: caseFormFactors,
  },
  {
    name: "supportedFormFactors",
    label: "Supported motherboard sizes",
    values: formFactors,
    multiple: true,
  },
  {
    name: "maxGpuLength",
    label: "Max GPU Length",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">mm</div>,
  },
  {
    name: "maxCoolerHeight",
    label: "Max Cooler Height",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">mm</div>,
  },
  {
    name: "maxPsuLength",
    label: "Max PSU Length",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">mm</div>,
  },
  {
    name: "driveBays",
    label: "Drive Bays",
    children: [
      {
        name: "bay35",
        label: '3.5" Bays',
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "bay25",
        label: '2.5" Bays',
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "expansionSlots",
    label: "Expansion Slots",
    numeric: true,
    decimalPlaces: 0,
  },
  {
    name: "radiatorSupport",
    label: "Radiator Support",
    children: [
      {
        name: "front",
        label: "Front",
        values: radiatorSizes,
      },
      {
        name: "top",
        label: "Top",
        values: radiatorSizes,
      },
      {
        name: "rear",
        label: "Rear",
        values: radiatorSizes,
      },
    ],
  },
  {
    name: "frontPorts",
    label: "Front Panel Ports",
    values: caseFrontPorts,
    multiple: true,
  },
  {
    name: "includedFans",
    label: "Included Fans",
    numeric: true,
    decimalPlaces: 0,
  },
  {
    name: "dimensions",
    label: "Dimensions",
    children: [
      {
        name: "height",
        label: "Height",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">mm</div>,
      },
      {
        name: "width",
        label: "Width",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">mm</div>,
      },
      {
        name: "depth",
        label: "Depth",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">mm</div>,
      },
    ],
  },
  {
    name: "sidePanel",
    label: "Side Panel",
    values: sidePanelTypes,
  },
]
