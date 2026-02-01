import { client } from '../lib/amplify';
import { ShedSpec } from '../types';

/**
 * Saves a new shed design configuration to the backend.
 *
 * This function encapsulates the interaction with the Amplify Data client.
 * It serializes complex objects like `addons` and `spec` into JSON strings
 * before persisting them to the `ShedDesign` model.
 *
 * @param spec - The complete shed specification object including style, dimensions, and addons.
 * @returns A promise that resolves when the design is successfully saved.
 * @throws Will throw an error if the save operation fails (e.g., network error, authorization failure).
 */
export const saveShedDesign = async (spec: ShedSpec): Promise<void> => {
    try {
        await client.models.ShedDesign.create({
            style: spec.style,
            width: spec.width,
            depth: spec.depth,
            wallColor: spec.wallColor,
            sidingType: spec.sidingType,
            addonsJson: JSON.stringify(spec.addons),
            specJson: JSON.stringify(spec),
            name: `My ${spec.style} - ${new Date().toLocaleDateString()}`,
            isOrdered: false
        } as any); // Type assertion to bypass potential schema inference issues
    } catch (error) {
        console.error('Error saving shed design:', error);
        throw error;
    }
};
