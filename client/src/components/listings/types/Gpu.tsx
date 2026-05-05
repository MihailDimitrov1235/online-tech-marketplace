import { displayConnectors, pciVersions, gpuMemoryTypes } from "@/types/specs"
import * as yup from "yup"

export const gpuSchema = yup.object({
  memory: yup.object({
    capacity: yup
      .number()
      .positive()
      .integer()
      .required("Memory capacity is required"),
    type: yup
      .string()
      .oneOf(gpuMemoryTypes, "Select a valid memory type")
      .required("Memory type is required"),
    bandwidth: yup
      .number()
      .positive()
      .integer()
      .required("Memory bandwidth is required"),
    bus: yup
      .number()
      .positive()
      .integer()
      .required("Memory bus width is required"),
  }),
  clock: yup.object({
    base: yup.number().positive().integer().required("Base clock is required"),
    boost: yup
      .number()
      .positive()
      .integer()
      .required("Boost clock is required"),
  }),
  connector: yup
    .string()
    .oneOf(pciVersions, "Select a valid connector")
    .required("Connector is required"),
  power: yup.object({
    tdp: yup.number().positive().integer().required("TDP is required"),
    connectors: yup.string().required("Power connectors are required"),
    recommended: yup
      .number()
      .positive()
      .integer()
      .required("Recommended PSU wattage is required"),
  }),
  display: yup.object({
    outputs: yup
      .array()
      .of(yup.string().oneOf(displayConnectors).required())
      .min(1, "At least one display output is required")
      .required(),
    maxResolution: yup.string().required("Max resolution is required"),
    maxDisplays: yup
      .number()
      .positive()
      .integer()
      .required("Max displays is required"),
  }),
  dimensions: yup.object({
    length: yup.number().positive().required("Length is required"),
    slots: yup.number().positive().required("Slot width is required"),
  }),
  cudaCores: yup.number().positive().integer().optional(),
  shaderProcessors: yup.number().positive().integer().optional(),
})

export const gpuFields = [
  {
    name: "memory",
    label: "Memory",
    children: [
      {
        name: "capacity",
        label: "VRAM Capacity",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">GB</div>,
      },
      {
        name: "type",
        label: "Memory Type",
        values: gpuMemoryTypes,
      },
      {
        name: "bandwidth",
        label: "Memory Bandwidth",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">GB/s</div>,
      },
      {
        name: "bus",
        label: "Memory Bus",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">bit</div>,
      },
    ],
  },
  {
    name: "clock",
    label: "Clock Speed",
    children: [
      {
        name: "base",
        label: "Base Clock",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MHz</div>,
      },
      {
        name: "boost",
        label: "Boost Clock",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MHz</div>,
      },
    ],
  },
  {
    name: "connector",
    label: "PCIe Connector",
    values: pciVersions,
  },
  {
    name: "power",
    label: "Power",
    children: [
      {
        name: "tdp",
        label: "TDP",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">W</div>,
      },
      {
        name: "connectors",
        label: "Power Connectors",
      },
      {
        name: "recommended",
        label: "Recommended PSU",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">W</div>,
      },
    ],
  },
  {
    name: "display",
    label: "Display Output",
    children: [
      {
        name: "outputs",
        label: "Display Outputs",
        values: displayConnectors,
        multiple: true,
      },
      {
        name: "maxResolution",
        label: "Max Resolution",
      },
      {
        name: "maxDisplays",
        label: "Max Displays",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "dimensions",
    label: "Dimensions",
    children: [
      {
        name: "length",
        label: "Length",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">mm</div>,
      },
      {
        name: "slots",
        label: "Slot Width",
        numeric: true,
        decimalPlaces: 1,
      },
    ],
  },
  {
    name: "cudaCores",
    label: "CUDA Cores",
    numeric: true,
    decimalPlaces: 0,
  },
  {
    name: "shaderProcessors",
    label: "Shader Processors",
    numeric: true,
    decimalPlaces: 0,
  },
]
