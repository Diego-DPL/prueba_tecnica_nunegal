export interface PhoneListItem {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
}

export interface ColorOption {
  code: number;
  name: string;
}

export interface StorageOption {
  code: number;
  name: string;
}

export interface PhoneOptions {
  colors: ColorOption[];
  storages: StorageOption[];
}

export interface PhoneDetail {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  networkTechnology: string;
  networkSpeed: string;
  gprs: string;
  edge: string;
  announced: string;
  status: string;
  dimentions: string;
  weight: string;
  sim: string;
  displayType: string;
  displayResolution: string;
  displaySize: string;
  os: string;
  cpu: string;
  chipset: string;
  gpu: string;
  externalMemory: string;
  internalMemory: string[];
  ram: string;
  primaryCamera: string[];
  secondaryCmera: string[];
  speaker: string;
  audioJack: string;
  wlan: string[];
  bluetooth: string[];
  gps: string;
  nfc: string;
  radio: string;
  usb: string;
  sensors: string[];
  battery: string;
  colors: string[];
  options: PhoneOptions;
}

export interface CartItem {
  phoneId: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  colorCode: number;
  colorName: string;
  storageCode: number;
  storageName: string;
  quantity: number;
}
