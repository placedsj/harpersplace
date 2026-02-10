import { z } from "zod";

/**
 * ORIGINAL SCHEMA (Legacy)
 * previously stored complex addons as a JSON string.
 *
 * const LegacyShedDesignSchema = z.object({
 *   sidingType: z.string(),
 *   addonsJson: z.string(), // "JSON stringify complex objects for simplicity in v1"
 *   specJson: z.string(),
 * });
 */

/**
 * REFACTORED SCHEMA
 * Break out the addons into a structured object.
 */

// Define the individual addon structures
export const WindowSchema = z.object({
  width: z.number().min(12).max(72),
  height: z.number().min(12).max(72),
  quantity: z.number().int().min(1).default(1),
  location: z.enum(["front", "back", "left", "right"]).optional(),
});

export const RampSchema = z.object({
  width: z.number().min(36).max(96),
  material: z.enum(["wood", "composite", "aluminum"]).default("wood"),
  isPortable: z.boolean().default(false),
});

export const VentSchema = z.object({
  type: z.enum(["gable", "ridge", "soffit"]),
  quantity: z.number().int().min(1).default(2),
});

// The main Addons schema object
export const ShedAddonsSchema = z.object({
  ramp: RampSchema.optional(),
  vents: VentSchema.optional(),
  flowerBoxes: z.number().int().min(0).max(10).default(0),
  shutters: z.boolean().default(false),
  customWindows: z.array(WindowSchema).optional(),
  extraShelving: z.boolean().default(false),
});

// The full ShedDesign schema with the refactored addons field
export const ShedDesignSchema = z.object({
  id: z.string().uuid().optional(),
  sidingType: z.enum(["vinyl", "wood", "metal", "lp_smartside"]),

  // REFACTORED: Instead of 'addonsJson', we use a structured object
  addons: ShedAddonsSchema.default({}),

  // Still keeping specJson as a string if it's truly a complex backup,
  // or we could refactor this too, but the task focused on addons.
  specJson: z.string().min(1, "Spec JSON is required"),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ShedAddons = z.infer<typeof ShedAddonsSchema>;
export type ShedDesign = z.infer<typeof ShedDesignSchema>;
