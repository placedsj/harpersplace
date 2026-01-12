// src/lib/placeholder-data.ts
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * This file contains placeholder data that can be used in the UI for development and demonstration purposes.
 * It's a good practice to keep this data separate from your components.
 */

// Placeholder for grocery items
export const groceryItems = [
    { id: '1', name: 'Milk', checked: true },
    { id: '2', name: 'Bread', checked: false },
    { id: '3', name: 'Eggs', checked: false },
    { id: '4', name: 'Bananas', checked: false },
    { id: '5', name: 'Chicken Breast', checked: false },
];

// Placeholder for Harper's wishlist
export const harperWishlist = [
    { id: 1, name: 'Wooden Building Blocks', description: 'A classic set of colorful wooden blocks for creative play.', link: '#', imageUrl: placeholderImages.wishlist.blocks.url, dataAiHint: placeholderImages.wishlist.blocks.dataAiHint },
    { id: 2, name: 'Plush Storybook Character', description: 'A soft toy of her favorite character from "Goodnight Moon".', link: '#', imageUrl: placeholderImages.wishlist.plushToy.url, dataAiHint: placeholderImages.wishlist.plushToy.dataAiHint },
];

// Placeholder for school supplies wishlist
export const schoolWishlist = [
    { id: 1, name: 'Backpack', description: 'A durable backpack for the new school year.', link: '#', imageUrl: placeholderImages.wishlist.backpack.url, dataAiHint: placeholderImages.wishlist.backpack.dataAiHint },
];
