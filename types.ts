
export type WeatherType = 'clear' | 'rain' | 'snow';
export type MaterialType = 'Vinyl' | 'Cedar' | 'Metal';
export type ShedStyleType = 'A-Frame' | 'Modern Studio' | 'Gable' | 'Quaker' | 'Lofted Barn' | 'Utility';
export type TerrainType = 'grass' | 'gravel' | 'concrete';
export type ViewMode = 'exterior' | 'interior';
export type RenderMode = '3D' | 'BLUEPRINT';
export type SidingType = 'lap' | 'board';
export type DoorType = 'single' | 'double' | 'french';
export type BuilderAppMode = 'BUILDER' | 'QUOTE' | 'CHECKOUT' | 'TRACKING' | 'HANDBOOK' | 'CALCULATOR';

export interface ROIResult {
  totalSavings: number;
  breakEvenMonths: number;
  isProfitable: boolean;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  image: string;
  isFeatured?: boolean;
}

export interface RoofingJoke {
  question: string;
  answer: string;
  icon: string;
}

export interface MaterialEstimate {
  studs: number;
  sheathing: number;
  shingles: number;
  trim: number;
  joists?: number;
  dripEdge?: number;
  feltSquares?: number;
}

export interface CostEstimate {
  material: number;
  labor: number;
  total: number;
}

export interface LandscapeItem {
  id: string;
  x: number;
  y: number;
  scale: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sqft: number;
  icon: string;
  path: string;
}

export interface ShedAddons {
  ramp: boolean;
  solar: boolean;
  ac: boolean;
  loft: boolean;
  workbench: boolean;
  shedLoo: boolean;
  power_20a: boolean;
  power_30a: boolean;
  power_50a: boolean;
  shedcare: boolean;
}

export interface ShedSpec {
  style: ShedStyleType;
  material: MaterialType;
  terrain: TerrainType;
  time: number; // 0 to 100
  viewMode: ViewMode;
  renderMode: RenderMode;
  inventory: InventoryItem[];
  landscape: LandscapeItem[];
  addons: ShedAddons;
  pitch: number;
  wallColor: string;
  trimColor: string;
  sidingType: SidingType;
  doorType: DoorType;
  width: number;
  depth: number;
  electricalTier: '20A' | '30A' | 'offgrid' | null;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface ShedData {
  price: number;
  rVal: number;
  walls: string;
  roof: string;
  gable: string;
  floor: string;
  baseArea: number;
}

export interface UpgradeItem {
  id: keyof ShedAddons;
  name: string;
  cost: number;
  icon: string;
  description: string;
}

export interface TerrainData {
  id: TerrainType;
  name: string;
  color: string;
  noise: number;
}

export interface NatureAsset {
  id: string;
  name: string;
  type: 'flora' | 'structure' | 'flat';
  path: string;
  color: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar: string;
}
