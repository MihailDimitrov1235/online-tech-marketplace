import mongoose from "mongoose";

import "../loadEnvironments.js";
import UserModel from "../models/User.model.js";
import ProductModel from "../models/Product.model.js";
import ConfigurationModel from "../models/Configuration.model.js";

const TEMPLATES = [
  {
    name: "Ryzen 9 Powerhouse",
    description: "High-end AM5 workstation/gaming build with a 4090 and tons of storage.",
    processor: "AMD Ryzen 9 7950X",
    motherboard: "Gigabyte B650 Aorus Elite AX",
    gpu: "NVIDIA GeForce RTX 4090",
    ram: ["Corsair Dominator Platinum DDR5 64GB (2x32GB) 6000MHz"],
    storage: ["WD Black SN850X 2TB NVMe SSD", "Samsung 870 EVO 2TB SSD"],
    psu: "ASUS ROG Thor 1200W",
    case: "Lian Li O11 Dynamic",
  },
  {
    name: "Budget AM4 Build",
    description: "Affordable AM4 gaming PC that still punches above its weight.",
    processor: "AMD Ryzen 5 5600",
    motherboard: "MSI PRO B550M-VC",
    gpu: "AMD Radeon RX 6650 XT",
    ram: ["G.Skill Ripjaws V DDR4 16GB (2x8GB) 3600MHz"],
    storage: ["Kingston NV2 500GB NVMe SSD"],
    psu: "Cooler Master MWE Gold 650",
    case: "NZXT H510",
  },
  {
    name: "Intel Z790 Creator",
    description: "Content creation rig built around the i7-13700K with fast dual NVMe storage.",
    processor: "Intel Core i7-13700K",
    motherboard: "ASUS ROG Strix Z790-E Gaming",
    gpu: "NVIDIA GeForce RTX 4080",
    ram: ["Kingston Fury Renegade DDR5 32GB (2x16GB) 7200MHz"],
    storage: [
      "Samsung 980 Pro 1TB NVMe SSD",
      "Sabrent Rocket 4 Plus 4TB NVMe SSD",
      "Crucial MX500 1TB SSD",
    ],
    psu: "be quiet! Straight Power 12 1000W",
    case: "Corsair 4000D Airflow",
  },
  {
    name: "Compact ITX Gamer",
    description: "Small form factor build that doesn't compromise on performance.",
    processor: "AMD Ryzen 7 7800X3D",
    motherboard: "ASUS ROG Strix B650E-I",
    gpu: "NVIDIA GeForce RTX 4070",
    ram: ["ADATA XPG Lancer DDR5 16GB (2x8GB) 6000MHz"],
    storage: ["WD Black SN850X 2TB NVMe SSD"],
    psu: "Corsair SF750",
    case: "Cooler Master NR200",
  },
  {
    name: "No-GPU Budget Office",
    description: "Quiet, cheap build for office work relying on integrated graphics. No case included — pick your own.",
    processor: "Intel Core i3-13100",
    motherboard: "MSI MAG B760 Tomahawk",
    gpu: null,
    ram: ["ADATA XPG Lancer DDR5 16GB (2x8GB) 6000MHz"],
    storage: ["Crucial P3 1TB NVMe SSD"],
    psu: "MSI MPG A750GF",
    case: null,
  },
  {
    name: "AMD X670E Workstation",
    description: "Modern AM5 workstation with a Radeon flagship and mixed storage.",
    processor: "AMD Ryzen 5 7600X",
    motherboard: "ASUS TUF Gaming X670E-Plus",
    gpu: "AMD Radeon RX 7900 XTX",
    ram: ["Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz"],
    storage: [
      "Seagate FireCuda 530 2TB NVMe SSD",
      "Seagate Barracuda 2TB HDD",
      "WD Blue 4TB HDD",
    ],
    psu: "Thermaltake Toughpower GF3 850W",
    case: "Phanteks Eclipse P500A",
  },
  {
    name: "AM4 Gaming X570",
    description: "Last-gen AM4 platform paired with a capable mid-range GPU.",
    processor: "AMD Ryzen 5 5600",
    motherboard: "Gigabyte X570 Aorus Pro",
    gpu: "AMD Radeon RX 7800 XT",
    ram: ["Corsair Vengeance LPX DDR4 32GB (2x16GB) 3200MHz"],
    storage: ["Samsung 870 EVO 2TB SSD"],
    psu: "NZXT C850",
    case: "Thermaltake Core P3",
  },
  {
    name: "Intel Flagship Z690",
    description: "No-compromise Intel flagship build with the 13900K and a 4090.",
    processor: "Intel Core i9-13900K",
    motherboard: "MSI MPG Z690 Carbon WiFi",
    gpu: "NVIDIA GeForce RTX 4090",
    ram: ["G.Skill Trident Z5 RGB DDR5 32GB (2x16GB) 6400MHz"],
    storage: ["Seagate FireCuda 530 2TB NVMe SSD", "Samsung 870 EVO 2TB SSD"],
    psu: "ASUS ROG Thor 1200W",
    case: "Hyte Y60",
  },
];

async function getOrCreateUser(username, firstName, lastName, roles) {
  let user = await UserModel.findOne({ username });
  if (!user) {
    user = await UserModel.create({
      username,
      password: "DemoPass123!",
      firstName,
      lastName,
      roles,
    });
    console.log(`Created ${username} user`);
  }
  return user;
}

async function resolveProduct(sellerId, type, name) {
  if (!name) return null;
  const product = await ProductModel.findOne({ seller: sellerId, type, name });
  if (!product) {
    throw new Error(`Could not find seeded product "${name}" of type "${type}". Run seedDemoProducts.js first.`);
  }
  return product._id;
}

async function seed() {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected to MongoDB");

  const seller = await getOrCreateUser("demo_seller", "Demo", "Seller", ["seller"]);
  const buyer = await getOrCreateUser("demo_buyer", "Demo", "Buyer", ["buyer"]);

  const createdIds = [];

  for (const template of TEMPLATES) {
    const exists = await ConfigurationModel.findOne({
      author: seller._id,
      name: template.name,
    });
    if (exists) {
      createdIds.push(exists._id);
      continue;
    }

    const parts = {
      processor: await resolveProduct(seller._id, "processor", template.processor),
      motherboard: await resolveProduct(seller._id, "motherboard", template.motherboard),
      psu: await resolveProduct(seller._id, "psu", template.psu),
      gpu: await resolveProduct(seller._id, "gpu", template.gpu),
      case: await resolveProduct(seller._id, "case", template.case),
      ram: await Promise.all(
        template.ram.map((name) => resolveProduct(seller._id, "ram", name)),
      ),
      storage: await Promise.all(
        template.storage.map((name) => resolveProduct(seller._id, "storage", name)),
      ),
    };

    const configuration = await ConfigurationModel.create({
      name: template.name,
      description: template.description,
      author: seller._id,
      clonedFrom: null,
      parts,
    });
    createdIds.push(configuration._id);
    console.log(`Created configuration: ${template.name}`);
  }

  const forkSourceId = createdIds[0];
  const forkSource = await ConfigurationModel.findById(forkSourceId);
  const forkName = `${forkSource.name} (copy)`;
  const forkExists = await ConfigurationModel.findOne({
    author: buyer._id,
    name: forkName,
  });
  if (!forkExists) {
    await ConfigurationModel.create({
      name: forkName,
      description: forkSource.description,
      author: buyer._id,
      clonedFrom: forkSource._id,
      parts: forkSource.parts,
    });
    console.log(`Created forked configuration: ${forkName} (by demo_buyer)`);
  }

  console.log(`Seeding complete: ${String(createdIds.length)} templates ready`);
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
