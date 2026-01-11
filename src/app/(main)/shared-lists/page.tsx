// src/app/(main)/shared-lists/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, ShoppingCart, Gift, School, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { harperWishlist, schoolWishlist } from '@/lib/placeholder-data';
import { Skeleton } from '@/components/ui/skeleton';

type GroceryItem = {
    id: string;
    name: string;
    checked: boolean;
    userId: string;
    timestamp: Timestamp;
};

type WishlistItem = {
    id: number;
    name: string;
    description: string;
    link: string;
    imageUrl: string;
    dataAiHint: string;
};


export default function SharedListsPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { data: groceries, loading } = useCollection<GroceryItem>(
        user && db ? query(collection(db, `users/${user.uid}/groceries`), orderBy('timestamp', 'asc')) : null
    );

    const [newGroceryItem, setNewGroceryItem] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const { toast } = useToast();

    const handleAddGrocery = async () => {
        if (newGroceryItem.trim() === '' || !user || !db) return;
        
        setIsAdding(true);
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
            setIsAdding(false);
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

    const WishlistComponent = ({ title, items, icon: Icon }: { title: string, items: WishlistItem[], icon: React.ElementType }) => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Icon /> {title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map(item => (
                    <Card key={item.id}>
                        <Image src={item.imageUrl} alt={item.name} data-ai-hint={item.dataAiHint} width={200} height={200} className="w-full h-40 object-cover rounded-t-lg" />
                        <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                            <Button asChild variant="outline" className="w-full">
                                <a href={item.link} target="_blank" rel="noopener noreferrer">View Item</a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                 <Card className="flex items-center justify-center border-dashed">
                    <Button variant="ghost" className="flex flex-col h-auto gap-2 p-8">
                        <PlusCircle className="w-8 h-8 text-muted-foreground" />
                        <span className="text-muted-foreground">Add Item</span>
                    </Button>
                </Card>
            </div>
        </div>
    );

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
                            disabled={isAdding}
                        />
                        <Button onClick={handleAddGrocery} disabled={isAdding}>
                            {isAdding ? <Loader2 className="animate-spin" /> : <PlusCircle />}
                            <span>Add</span>
                        </Button>
                    </div>
                    {loading ? (
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
                <WishlistComponent title="Harper's Wishlist" items={harperWishlist} icon={Gift} />
                <WishlistComponent title="School Supplies" items={schoolWishlist} icon={School} />
            </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
