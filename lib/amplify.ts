import { generateClient } from 'aws-amplify/data';
// import type { Schema } from '../amplify/data/resource'; // Temporarily removed to decouple frontend from backend definitions

export const client = generateClient<any>();
