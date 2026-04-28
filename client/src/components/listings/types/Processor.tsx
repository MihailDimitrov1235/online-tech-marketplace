import * as yup from "yup"

const sockets = ["LGA1700", "LGA1200", "AM5", "AM4", "AM3+", "LGA2066"]
const architectures = ["x86", "x86-64", "ARM"]

export const processorSchema = yup.object({
  cores: yup.object({
    performance: yup
      .number()
      .positive()
      .integer()
      .required("Performance cores are required"),
    efficiency: yup
      .number()
      .min(0)
      .integer()
      .required("Efficiency cores are required"),
    threads: yup.number().positive().integer().required("Threads are required"),
  }),
  clock: yup.object({
    base: yup.number().positive().required("Base clock is required"),
    boost: yup.number().positive().required("Boost clock is required"),
  }),
  socket: yup
    .string()
    .oneOf(sockets, "Select a valid socket")
    .required("Socket is required"),
  tdp: yup.number().positive().integer().required("TDP is required"),
  memory: yup.object({
    type: yup.string().required("Memory type is required"),
    maxSpeed: yup
      .number()
      .positive()
      .integer()
      .required("Max memory speed is required"),
    maxCapacity: yup
      .number()
      .positive()
      .integer()
      .required("Max memory capacity is required"),
    channels: yup
      .number()
      .positive()
      .integer()
      .required("Memory channels are required"),
  }),
  cache: yup.object({
    l2: yup.number().positive().required("L2 cache is required"),
    l3: yup.number().positive().required("L3 cache is required"),
  }),
  architecture: yup
    .string()
    .oneOf(architectures, "Select a valid architecture")
    .required("Architecture is required"),
  integratedGraphics: yup.string().optional().default(""),
  pcie: yup.object({
    version: yup.string().required("PCIe version is required"),
    lanes: yup
      .number()
      .positive()
      .integer()
      .required("PCIe lanes are required"),
  }),
})

export const processorFields = [
  {
    name: "cores",
    label: "Cores",
    children: [
      {
        name: "performance",
        label: "Performance Cores",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "efficiency",
        label: "Efficiency Cores",
        numeric: true,
        decimalPlaces: 0,
      },
      { name: "threads", label: "Threads", numeric: true, decimalPlaces: 0 },
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
        decimalPlaces: 2,
        trailingIcon: <div className="text-sm">GHz</div>,
      },
      {
        name: "boost",
        label: "Boost Clock",
        numeric: true,
        decimalPlaces: 2,
        trailingIcon: <div className="text-sm">GHz</div>,
      },
    ],
  },
  {
    name: "socket",
    label: "Socket",
    values: sockets,
  },
  {
    name: "tdp",
    label: "TDP",
    numeric: true,
    decimalPlaces: 0,
    trailingIcon: <div className="text-sm">W</div>,
  },
  {
    name: "memory",
    label: "Memory Support",
    children: [
      { name: "type", label: "Memory Type" },
      {
        name: "maxSpeed",
        label: "Max Speed",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MHz</div>,
      },
      {
        name: "maxCapacity",
        label: "Max Capacity",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">GB</div>,
      },
      { name: "channels", label: "Channels", numeric: true, decimalPlaces: 0 },
    ],
  },
  {
    name: "cache",
    label: "Cache",
    children: [
      {
        name: "l2",
        label: "L2 Cache",
        numeric: true,
        decimalPlaces: 1,
        trailingIcon: <div className="text-sm">MB</div>,
      },
      {
        name: "l3",
        label: "L3 Cache",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MB</div>,
      },
    ],
  },
  {
    name: "architecture",
    label: "Architecture",
    values: architectures,
  },
  {
    name: "integratedGraphics",
    label: "Integrated Graphics",
  },
  {
    name: "pcie",
    label: "PCIe",
    children: [
      { name: "version", label: "PCIe Version" },
      { name: "lanes", label: "Lanes", numeric: true, decimalPlaces: 0 },
    ],
  },
]
