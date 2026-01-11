
// src/app/(main)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  weightLb: z.coerce.number().optional(),
  weightOz: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export interface Profile extends Omit<ProfileFormValues, 'dob'> {
    dob: Timestamp;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { db } = useFirestore();

  const profileRef = user && db ? doc(db, `users/${user.uid}/profile`, 'main') : null;
  const { data: profile, loading: profileLoading } = useDoc<Profile>(profileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Harper Ryan",
      dob: new Date("2024-11-12"),
      weightLb: undefined,
      weightOz: undefined,
      height: undefined,
      eyeColor: "",
      hairColor: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
          ...profile,
          dob: profile.dob.toDate(),
      });
    }
  }, [profile, form]);


  async function onSubmit(values: ProfileFormValues) {
    if (!profileRef) return;
    setIsLoading(true);
    
    try {
        const dataToSave = {
            ...values,
            dob: Timestamp.fromDate(values.dob),
        };
        await setDoc(profileRef, dataToSave, { merge: true });
        toast({
            title: "Profile Saved",
            description: "Harper's information has been updated.",
        });
    } catch (error) {
        console.error("Failed to save profile", error);
        toast({
            variant: 'destructive',
            title: "Save Failed",
            description: "Could not update profile information.",
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  if (profileLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extra-bold uppercase tracking-tight">Harper's Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage Harper's core information here.
        </p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Child Information</CardTitle>
          <CardDescription>This information will be used throughout the app to provide personalized insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Harper June" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="weightLb"
                      render={({ field }) => (
                        <FormControl>
                          <div className="relative">
                            <Input type="number" placeholder="lbs" {...field} value={field.value ?? ''} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">lbs</span>
                          </div>
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weightOz"
                      render={({ field }) => (
                         <FormControl>
                          <div className="relative">
                            <Input type="number" placeholder="oz" {...field} value={field.value ?? ''} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">oz</span>
                          </div>
                        </FormControl>
                      )}
                    />
                  </div>
                </FormItem>
                 <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                       <FormControl>
                          <div className="relative">
                            <Input type="number" placeholder="inches" {...field} value={field.value ?? ''} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">in</span>
                          </div>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="eyeColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eye Color</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select eye color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Blue">Blue</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Green">Green</SelectItem>
                          <SelectItem value="Hazel">Hazel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="hairColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hair Color</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hair color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Blonde">Blonde</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Red">Red</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                <span>Save Changes</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
