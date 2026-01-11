// src/app/(main)/emergency/page.tsx
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, User, Stethoscope, ShieldAlert, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, doc, updateDoc, deleteDoc, Timestamp, setDoc } from 'firebase/firestore';

// Schemas
const medicalContactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  relation: z.string().min(1, 'Relation is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
});

const medicalNotesSchema = z.object({
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    currentMedications: z.string().optional(),
});


// Types
type MedicalContact = z.infer<typeof medicalContactSchema> & { id: string };
type EmergencyContact = z.infer<typeof emergencyContactSchema> & { id: string };
type MedicalNotes = z.infer<typeof medicalNotesSchema>;

export default function EmergencyPage() {
    const { user } = useAuth();
    const { db } = useFirestore();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = React.useState<string | false>(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<any>(null);

    // Data fetching
    const { data: medicalContacts, loading: medicalLoading } = useCollection<MedicalContact>(user && db ? query(collection(db, `users/${user.uid}/medicalContacts`)) : null);
    const { data: emergencyContacts, loading: emergencyLoading } = useCollection<EmergencyContact>(user && db ? query(collection(db, `users/${user.uid}/emergencyContacts`)) : null);
    const { data: medicalNotes, loading: notesLoading } = useDoc<MedicalNotes>(user && db ? doc(db, `users/${user.uid}/medicalNotes`, 'main') : null);

    const formMedical = useForm<MedicalContact>({ resolver: zodResolver(medicalContactSchema) });
    const formEmergency = useForm<EmergencyContact>({ resolver: zodResolver(emergencyContactSchema) });
    const formNotes = useForm<MedicalNotes>({ resolver: zodResolver(medicalNotesSchema) });

    React.useEffect(() => {
        if(medicalNotes) {
            formNotes.reset(medicalNotes);
        }
    }, [medicalNotes, formNotes]);

    const handleOpenDialog = (type: string, item?: any) => {
        setCurrentItem(item);
        if (item) {
            if (type === 'medical') formMedical.reset(item);
            if (type === 'emergency') formEmergency.reset(item);
            if (type === 'notes') formNotes.reset(item);
        } else {
            formMedical.reset({ name: '', role: '', phone: '' });
            formEmergency.reset({ name: '', relation: '', phone: '' });
        }
        setDialogOpen(type);
    };
    
    const handleCloseDialog = () => setDialogOpen(false);

    const onSubmit = async (values: any) => {
        if (!user || !db) return;
        setIsSubmitting(true);
        const type = dialogOpen;

        try {
            if (type === 'medical') {
                const coll = collection(db, `users/${user.uid}/medicalContacts`);
                if (currentItem) await updateDoc(doc(coll, currentItem.id), values);
                else await addDoc(coll, { ...values, timestamp: serverTimestamp() });
            } else if (type === 'emergency') {
                const coll = collection(db, `users/${user.uid}/emergencyContacts`);
                if (currentItem) await updateDoc(doc(coll, currentItem.id), values);
                else await addDoc(coll, { ...values, timestamp: serverTimestamp() });
            } else if (type === 'notes') {
                await setDoc(doc(db, `users/${user.uid}/medicalNotes`, 'main'), values);
            }

            toast({ title: 'Success', description: `Information has been ${currentItem ? 'updated' : 'added'}.` });
            handleCloseDialog();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save information.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (type: string, id: string) => {
        if (!user || !db || !window.confirm('Are you sure you want to delete this contact?')) return;
        
        let path = '';
        if (type === 'medical') path = `users/${user.uid}/medicalContacts`;
        if (type === 'emergency') path = `users/${user.uid}/emergencyContacts`;

        try {
            await deleteDoc(doc(db, path, id));
            toast({ title: 'Contact Deleted' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete contact.' });
        }
    };


  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Emergency Information</h1>
        <p className="text-muted-foreground mt-1">
            Quick access to critical contacts and information.
        </p>
       </div>
       <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope />
                            <span>Medical Contacts</span>
                        </CardTitle>
                        <CardDescription>Key healthcare providers for Harper.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog('medical')}><PlusCircle className="mr-2"/> Add</Button>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {medicalLoading && <Loader2 className="animate-spin" />}
                        {medicalContacts?.map((contact) => (
                            <li key={contact.id} className="flex items-center justify-between group">
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog('medical', contact)}><Edit /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete('medical', contact.id)}><Trash2 /></Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`tel:${contact.phone}`}><Phone /><span>Call</span></a>
                                    </Button>
                                </div>
                            </li>
                        ))}
                         {!medicalLoading && medicalContacts?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No medical contacts added.</p>}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <User />
                            <span>Emergency Contacts</span>
                        </CardTitle>
                        <CardDescription>Family and caregivers to contact in an emergency.</CardDescription>
                    </div>
                     <Button variant="ghost" size="sm" onClick={() => handleOpenDialog('emergency')}><PlusCircle className="mr-2"/> Add</Button>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-4">
                        {emergencyLoading && <Loader2 className="animate-spin" />}
                        {emergencyContacts?.map((contact) => (
                            <li key={contact.id} className="flex items-center justify-between group">
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog('emergency', contact)}><Edit /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete('emergency', contact.id)}><Trash2 /></Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`tel:${contact.phone}`}><Phone /><span>Call</span></a>
                                    </Button>
                                </div>
                            </li>
                        ))}
                         {!emergencyLoading && emergencyContacts?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No emergency contacts added.</p>}
                    </ul>
                </CardContent>
            </Card>
       </div>
       <Card className="border-destructive/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <ShieldAlert />
                        <span>Allergies & Medical Notes</span>
                    </CardTitle>
                    <CardDescription>Important health information for caregivers.</CardDescription>
                </div>
                 <Button variant="ghost" size="sm" onClick={() => handleOpenDialog('notes', medicalNotes)}><Edit className="mr-2"/> Edit</Button>
            </CardHeader>
            <CardContent>
                {notesLoading && <Loader2 className="animate-spin" />}
                {!notesLoading && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Allergies</h3>
                            <p className="text-sm text-muted-foreground">{medicalNotes?.allergies || "No known allergies."}</p>
                        </div>
                         <div className="space-y-2">
                            <h3 className="font-semibold">Medical Conditions</h3>
                            <p className="text-sm text-muted-foreground">{medicalNotes?.medicalConditions || "None."}</p>
                        </div>
                         <div className="space-y-2">
                            <h3 className="font-semibold">Current Medications</h3>
                            <p className="text-sm text-muted-foreground">{medicalNotes?.currentMedications || "None."}</p>
                        </div>
                    </div>
                )}
            </CardContent>
       </Card>

        {/* Dialog for adding/editing */}
        <Dialog open={!!dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentItem ? 'Edit' : 'Add'} {dialogOpen} Information</DialogTitle>
                </DialogHeader>
                {dialogOpen === 'medical' && (
                    <Form {...formMedical}>
                        <form onSubmit={formMedical.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={formMedical.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formMedical.control} name="role" render={({ field }) => (<FormItem><FormLabel>Role (e.g., Pediatrician)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formMedical.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}</Button></DialogFooter>
                        </form>
                    </Form>
                )}
                 {dialogOpen === 'emergency' && (
                    <Form {...formEmergency}>
                        <form onSubmit={formEmergency.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={formEmergency.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formEmergency.control} name="relation" render={({ field }) => (<FormItem><FormLabel>Relation (e.g., Grandmother)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formEmergency.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}</Button></DialogFooter>
                        </form>
                    </Form>
                )}
                 {dialogOpen === 'notes' && (
                    <Form {...formNotes}>
                        <form onSubmit={formNotes.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={formNotes.control} name="allergies" render={({ field }) => (<FormItem><FormLabel>Allergies</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Peanuts, Penicillin" /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formNotes.control} name="medicalConditions" render={({ field }) => (<FormItem><FormLabel>Medical Conditions</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Asthma" /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formNotes.control} name="currentMedications" render={({ field }) => (<FormItem><FormLabel>Current Medications</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Ventolin Inhaler, as needed" /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Save'}</Button></DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>

    </div>
  );
}
