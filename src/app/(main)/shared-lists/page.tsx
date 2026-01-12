// src/app/(main)/shared-lists/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, ShoppingCart, Gift, School, X, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// --- Schemas & Types ---

const groceryItemSchema = z.object({
    name: z.string().min(1, 'Item name is required.'),
});

const wishlistItemSchema = z.object({
    name: z.string().min(1, 'Item name is required.'),
    description: z.string().min(1, 'Description is required.'),
    link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
    dataAiHint: z.string().optional(),
});

type GroceryItem = {
    id: string;
    name: string;
    checked: boolean;
    userId: string;
    timestamp: Timestamp;
};

type WishlistItem = {
    id: string;
    name: string;
    description: string;
    link?: string;
    imageUrl?: string;
    dataAiHint?: string;
    userId: string;
    timestamp: Timestamp;
};

// --- Main Component ---

export default function SharedListsPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { toast } = useToast();

    // --- Data Fetching ---
    const { data: groceries, loading: groceriesLoading } = useCollection<GroceryItem>(
        user && db ? query(collection(db, `users/${user.uid}/groceries`), orderBy('timestamp', 'asc')) : null
    );
    const { data: harperWishlist, loading: harperLoading } = useCollection<WishlistItem>(
        user && db ? query(collection(db, `users/${user.uid}/harperWishlist`), orderBy('timestamp', 'desc')) : null
    );
    const { data: schoolWishlist, loading: schoolLoading } = useCollection<WishlistItem>(
        user && db ? query(collection(db, `users/${user.uid}/schoolWishlist`), orderBy('timestamp', 'desc')) : null
    );

    // --- Grocery List Logic ---
    const [newGroceryItem, setNewGroceryItem] = React.useState('');
    const [isAddingGrocery, setIsAddingGrocery] = React.useState(false);

    const handleAddGrocery = async () => {
        if (newGroceryItem.trim() === '' || !user || !db) return;
        
        setIsAddingGrocery(true);
        const newItem = {
            name: newGroceryItem,
            checked: false,
            userId: user.uid,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, `users/${user.uid}/groceries`), newItem);
            setNewGroceryItem('');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error adding item.'});
        } finally {
            setIsAddingGrocery(false);
        }
    };
    
    const toggleGrocery = async (id: string, checked: boolean) => {
        if (!user || !db) return;
        const itemRef = doc(db, `users/${user.uid}/groceries`, id);
        try {
            await updateDoc(itemRef, { checked: !checked });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error updating item.'});
        }
    };

    const deleteGrocery = async (id: string) => {
        if (!user || !db) return;
        const itemRef = doc(db, `users/${user.uid}/groceries`, id);
        try {
            await deleteDoc(itemRef);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error deleting item.' });
        }
    };

    // --- Wishlist Component ---
    const WishlistComponent = ({ title, items, collectionName, icon: Icon, loading }: { title: string, items: WishlistItem[] | null, collectionName: string, icon: React.ElementType, loading: boolean }) => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Icon /> {title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading && [...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="w-full h-40 rounded-t-lg" />
                        <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                ))}
                {!loading && items?.map(item => (
                    <Card key={item.id} className="group relative">
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => deleteWishlistItem(collectionName, item.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Image src={item.imageUrl || 'https://picsum.photos/seed/placeholder/200/200'} alt={item.name} data-ai-hint={item.dataAiHint} width={200} height={200} className="w-full h-40 object-cover rounded-t-lg" />
                        <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{item.description}</p>
                            <Button asChild variant="outline" className="w-full">
                                <a href={item.link || '#'} target="_blank" rel="noopener noreferrer">View Item</a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                <AddWishlistItemDialog collectionName={collectionName} />
            </div>
        </div>
    );

    const deleteWishlistItem = async (collectionName: string, id: string) => {
        if (!user || !db || !window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/${collectionName}`, id));
            toast({ title: 'Item Deleted' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error deleting item.' });
        }
    };
    
    // --- Add Wishlist Item Dialog ---
    const AddWishlistItemDialog = ({ collectionName }: { collectionName: string }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const form = useForm<z.infer<typeof wishlistItemSchema>>({
            resolver: zodResolver(wishlistItemSchema),
            defaultValues: { name: '', description: '', link: '', imageUrl: '', dataAiHint: '' },
        });

        const handleAddItem = async (values: z.infer<typeof wishlistItemSchema>) => {
            if (!user || !db) return;
            const newItem = { ...values, userId: user.uid, timestamp: serverTimestamp() };
            try {
                await addDoc(collection(db, `users/${user.uid}/${collectionName}`), newItem);
                toast({ title: 'Wishlist Item Added' });
                form.reset();
                setIsOpen(false);
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Error adding item.'});
            }
        };

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Card className="flex items-center justify-center border-dashed hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        <div className="flex flex-col h-full w-full items-center justify-center gap-2 p-8">
                            <PlusCircle className="w-8 h-8 text-muted-foreground" />
                            <span className="text-muted-foreground font-semibold">Add Item</span>
                        </div>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Wishlist Item</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="link" render={({ field }) => (<FormItem><FormLabel>Link to Item (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Add Item'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        );
    };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Shared Lists</h1>
        <p className="text-muted-foreground mt-1">
          Coordinate groceries, wishlists, and other shared needs.
        </p>
      </div>
      <Tabs defaultValue="groceries">
        <TabsList>
          <TabsTrigger value="groceries">Grocery List</TabsTrigger>
          <TabsTrigger value="wishlists">Wishlists</TabsTrigger>
        </TabsList>

        <TabsContent value="groceries" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Shared Grocery List</CardTitle>
                    <CardDescription>Add items we need for the house. Anyone can view and check things off.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input 
                            placeholder="e.g., Bananas"
                            value={newGroceryItem}
                            onChange={(e) => setNewGroceryItem(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGrocery()}
                            disabled={isAddingGrocery}
                        />
                        <Button onClick={handleAddGrocery} disabled={isAddingGrocery}>
                            {isAddingGrocery ? <Loader2 className="animate-spin" /> : <PlusCircle />}
                            <span>Add</span>
                        </Button>
                    </div>
                    {groceriesLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 flex-grow" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {groceries && groceries.length > 0 ? groceries.map(item => (
                                <li key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                                    <Checkbox 
                                        id={`item-${item.id}`}
                                        checked={item.checked}
                                        onCheckedChange={() => toggleGrocery(item.id, item.checked)}
                                    />
                                    <label 
                                        htmlFor={`item-${item.id}`}
                                        className={`flex-grow text-sm cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                        {item.name}
                                    </label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteGrocery(item.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No groceries on the list yet.</p>
                            )}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="wishlists" className="mt-6">
            <div className="space-y-8">
                <WishlistComponent title="Harper's Wishlist" items={harperWishlist} collectionName="harperWishlist" icon={Gift} loading={harperLoading} />
                <WishlistComponent title="School Supplies" items={schoolWishlist} collectionName="schoolWishlist" icon={School} loading={schoolLoading} />
            </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
