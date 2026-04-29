import { coolingTypes, radiatorSizes, fanSizes, sockets } from "@/types/specs"
import * as yup from "yup"

export const coolingSchema = yup.object({
  type: yup
    .string()
    .oneOf(coolingTypes, "Select a valid cooling type")
    .required("Cooling type is required"),
  sockets: yup
    .array()
    .of(yup.string().oneOf(sockets).required())
    .min(1, "At least one socket must be supported")
    .required("Supported sockets are required"),
  tdp: yup.number().positive().integer().required("TDP rating is required"),
  noise: yup.object({
    min: yup.number().min(0).required("Min noise level is required"),
    max: yup.number().positive().required("Max noise level is required"),
  }),
  fan: yup.object({
    size: yup
      .string()
      .oneOf(fanSizes, "Select a valid fan size")
      .required("Fan size is required"),
    count: yup.number().positive().integer().required("Fan count is required"),
    minRpm: yup.number().min(0).integer().required("Min RPM is required"),
    maxRpm: yup.number().positive().integer().required("Max RPM is required"),
    bearing: yup.string().required("Bearing type is required"),
  }),
  radiator: yup.object({
    size: yup
      .string()
      .oneOf(radiatorSizes, "Select a valid radiator size")
      .optional(),
    thickness: yup.number().positive().integer().optional(),
  }),
  dimensions: yup.object({
    height: yup.number().positive().required("Height is required"),
    width: yup.number().positive().required("Width is required"),
    depth: yup.number().positive().required("Depth is required"),
  }),
  heatpipes: yup.number().min(0).integer().optional(),
  argb: yup.boolean().default(false),
})

export const coolingFields = [
  {
    name: "type",
    label: "Cooling Type",
    values: coolingTypes,
  },
  {
    name: "sockets",
    label: "Compatible sockets",
    values: sockets,
    multiple: true,
  },
  {
    name: "tdp",
    label: "TDP Rating",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">W</div>,
  },
  {
    name: "noise",
    label: "Noise Level",
    children: [
      {
        name: "min",
        label: "Min Noise",
        numeric: true,
        decimalPlaces: 1,
        trailingIcon: <div className="text-sm">dBA</div>,
      },
      {
        name: "max",
        label: "Max Noise",
        numeric: true,
        decimalPlaces: 1,
        trailingIcon: <div className="text-sm">dBA</div>,
      },
    ],
  },
  {
    name: "fan",
    label: "Fan",
    children: [
      {
        name: "size",
        label: "Fan Size",
        values: fanSizes,
      },
      {
        name: "count",
        label: "Fan Count",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "minRpm",
        label: "Min RPM",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">RPM</div>,
      },
      {
        name: "maxRpm",
        label: "Max RPM",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">RPM</div>,
      },
      {
        name: "bearing",
        label: "Bearing Type",
      },
    ],
  },
  {
    name: "radiator",
    label: "Radiator",
    children: [
      {
        name: "size",
        label: "Radiator Size",
        values: radiatorSizes,
      },
      {
        name: "thickness",
        label: "Thickness",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">mm</div>,
      },
    ],
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
    name: "heatpipes",
    label: "Heatpipes",
    numeric: true,
    decimalPlaces: 0,
  },
  {
    name: "argb",
    label: "ARGB Lighting",
  },
]
