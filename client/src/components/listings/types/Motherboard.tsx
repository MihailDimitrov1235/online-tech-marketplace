import { formFactors, memoryTypes, pciVersions, sockets } from "@/types/specs"
import * as yup from "yup"

export const motherboardSchema = yup.object({
  socket: yup
    .string()
    .oneOf(sockets, "Select a valid socket")
    .required("Socket is required"),

  chipset: yup.string().required("Chipset is required"),

  formFactor: yup
    .string()
    .oneOf(formFactors, "Select a valid form factor")
    .required("Form factor is required"),

  memory: yup.object({
    type: yup
      .string()
      .oneOf(memoryTypes, "Select a valid memory type")
      .required("Memory type is required"),
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
    slots: yup
      .number()
      .positive()
      .integer()
      .required("Memory slots are required"),
  }),

  pci: yup.object({
    version: yup
      .string()
      .oneOf(pciVersions, "Select a valid PCIe version")
      .required("PCIe version is required"),
    x16Slots: yup
      .number()
      .min(0)
      .integer()
      .required("PCIe x16 slots are required"),
    x1Slots: yup
      .number()
      .min(0)
      .integer()
      .required("PCIe x1 slots are required"),
  }),

  storage: yup.object({
    sataPorts: yup
      .number()
      .min(0)
      .integer()
      .required("SATA ports are required"),
    m2Slots: yup.number().min(0).integer().required("M.2 slots are required"),
    raidSupport: yup.boolean().default(false),
  }),

  power: yup.object({
    cpuPowerConnector: yup.string().required("CPU power connector is required"),
    phases: yup
      .number()
      .positive()
      .integer()
      .required("VRM phases are required"),
  }),

  networking: yup.object({
    ethernetSpeed: yup.string().required("Ethernet speed is required"),
    wifi: yup.boolean().default(false),
    bluetooth: yup.boolean().default(false),
  }),

  usb: yup.object({
    usb2: yup.number().min(0).integer().required("USB 2.0 ports required"),
    usb3: yup.number().min(0).integer().required("USB 3.x ports required"),
    usbC: yup.number().min(0).integer().required("USB-C ports required"),
  }),

  audio: yup.object({
    channels: yup.string().required("Audio channels required"),
    chipset: yup.string().required("Audio chipset required"),
  }),
})

export const motherboardFields = [
  {
    name: "socket",
    label: "CPU Socket",
    values: sockets,
  },
  {
    name: "chipset",
    label: "Chipset",
  },
  {
    name: "formFactor",
    label: "Form Factor",
    values: formFactors,
  },
  {
    name: "memory",
    label: "Memory Support",
    children: [
      {
        name: "type",
        label: "Memory Type",
        values: memoryTypes,
      },
      {
        name: "maxSpeed",
        label: "Max Memory Speed",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">MHz</div>,
      },
      {
        name: "maxCapacity",
        label: "Max Memory Capacity",
        numeric: true,
        decimalPlaces: 0,
        trailingIcon: <div className="text-sm">GB</div>,
      },
      {
        name: "slots",
        label: "Memory Slots",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "pci",
    label: "PCIe Expansion",
    children: [
      {
        name: "version",
        label: "PCIe Version",
        values: pciVersions,
      },
      {
        name: "x16Slots",
        label: "PCIe x16 Slots",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "x1Slots",
        label: "PCIe x1 Slots",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "storage",
    label: "Storage",
    children: [
      {
        name: "sataPorts",
        label: "SATA Ports",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "m2Slots",
        label: "M.2 Slots",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "raidSupport",
        label: "RAID Support",
      },
    ],
  },
  {
    name: "power",
    label: "Power Delivery",
    children: [
      {
        name: "cpuPowerConnector",
        label: "CPU Power Connector",
      },
      {
        name: "phases",
        label: "VRM Phases",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "networking",
    label: "Networking",
    children: [
      {
        name: "ethernetSpeed",
        label: "Ethernet Speed",
      },
      {
        name: "wifi",
        label: "WiFi Support",
      },
      {
        name: "bluetooth",
        label: "Bluetooth Support",
      },
    ],
  },
  {
    name: "usb",
    label: "USB Ports",
    children: [
      {
        name: "usb2",
        label: "USB 2.0 Ports",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "usb3",
        label: "USB 3.x Ports",
        numeric: true,
        decimalPlaces: 0,
      },
      {
        name: "usbC",
        label: "USB-C Ports",
        numeric: true,
        decimalPlaces: 0,
      },
    ],
  },
  {
    name: "audio",
    label: "Audio",
    children: [
      {
        name: "channels",
        label: "Audio Channels",
      },
      {
        name: "chipset",
        label: "Audio Chipset",
      },
    ],
  },
]
