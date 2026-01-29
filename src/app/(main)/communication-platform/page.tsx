// src/app/(main)/communication-platform/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  MessageSquare,
  FileText,
  Clock,
  DollarSign,
  Users,
  CalendarDays,
  Phone,
} from 'lucide-react';

export default function CommunicationPlatformPage() {
  
  const [costCalculation, setCostCalculation] = useState({
    users: 2,
    monthlyMessages: 100,
    monthlyCalls: 10,
    callDuration: 15
  });

  const calculateCost = () => {
    const baseCost = 15000;
    const userMultiplier = costCalculation.users * 500;
    const complexityMultiplier = 
      (costCalculation.monthlyMessages > 500 ? 5000 : 0) +
      (costCalculation.monthlyCalls > 50 ? 8000 : 0) +
      (costCalculation.callDuration > 30 ? 3000 : 0);
    
    return {
        baseCost,
        userCost: userMultiplier,
        messageCost: costCalculation.monthlyMessages > 500 ? 5000 : 0,
        callVolumeCost: costCalculation.monthlyCalls > 50 ? 8000 : 0,
        callDurationCost: costCalculation.callDuration > 30 ? 3000 : 0,
        total: baseCost + userMultiplier + complexityMultiplier
    };
  };

  const calculatedCosts = calculateCost();

  const phases = [
    {
      name: 'Enhanced Messaging',
      duration: '3 weeks',
      cost: '$8,000',
      features: ['Encrypted messaging', 'Read receipts', 'AI tone analysis', 'Export to PDF'],
      color: 'bg-blue-500'
    },
    {
      name: 'Video/Audio Calls',
      duration: '6 weeks', 
      cost: '$15,600',
      features: ['WebRTC video calls', 'Call recording', 'Screen sharing', 'Transcription'],
      color: 'bg-purple-500'
    },
    {
      name: 'Legal Features',
      duration: '4 weeks',
      cost: '$10,400', 
      features: ['Court exports', 'Digital evidence', 'Compliance tracking', 'Audit trails'],
      color: 'bg-green-500'
    },
    {
      name: 'Security Hardening',
      duration: '3 weeks',
      cost: '$7,800',
      features: ['End-to-end encryption', 'Security audits', 'Legal compliance', 'Performance'],
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Platform Vision & Investment
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Estimate the development cost for a custom, child-centered communication platform and review the implementation roadmap.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="text-sm">👶 Child-First Approach</Badge>
          <Badge variant="secondary" className="text-sm">🏛️ Court Approved</Badge>
          <Badge variant="secondary" className="text-sm">💝 Emotional Safety</Badge>
          <Badge variant="secondary" className="text-sm">🤖 Conflict Resolution</Badge>
        </div>
      </div>

      {/* Cost Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Development Cost Calculator
          </CardTitle>
          <CardDescription>Estimate your custom communication platform investment by adjusting the sliders based on your expected usage and complexity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label htmlFor="users-slider" className="flex items-center gap-2 mb-2"><Users />Family Members (Parents & Guardians)</Label>
                <Slider
                  id="users-slider"
                  value={[costCalculation.users]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, users: value[0]}))}
                  max={10}
                  min={2}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2 parents</span>
                  <span className="font-medium">{costCalculation.users} members</span>
                  <span>Extended family</span>
                </div>
              </div>

              <div>
                <Label htmlFor="messages-slider" className="flex items-center gap-2 mb-2"><MessageSquare />Monthly Child-Focused Messages</Label>
                <Slider
                  id="messages-slider"
                  value={[costCalculation.monthlyMessages]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, monthlyMessages: value[0]}))}
                  max={1000}
                  min={50}
                  step={50}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Minimal</span>
                  <span className="font-medium">{costCalculation.monthlyMessages} messages</span>
                  <span>High collaboration</span>
                </div>
              </div>

              <div>
                <Label htmlFor="calls-slider" className="flex items-center gap-2 mb-2"><Phone />Monthly Child Planning Calls</Label>
                <Slider
                  id="calls-slider"
                  value={[costCalculation.monthlyCalls]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, monthlyCalls: value[0]}))}
                  max={100}
                  min={5}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Basic needs</span>
                  <span className="font-medium">{costCalculation.monthlyCalls} calls</span>
                  <span>Intensive planning</span>
                </div>
              </div>

              <div>
                <Label htmlFor="duration-slider" className="flex items-center gap-2 mb-2"><Clock />Average Call Duration (minutes)</Label>
                <Slider
                  id="duration-slider"
                  value={[costCalculation.callDuration]}
                   onValueChange={(value) => setCostCalculation(prev => ({...prev, callDuration: value[0]}))}
                  max={60}
                  min={5}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span className="font-medium">{costCalculation.callDuration} min</span>
                  <span>60+ min</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-lg border border-primary/20">
              <div className="text-center space-y-2">
                <p className="text-sm uppercase text-primary font-semibold tracking-wider">Total Estimated Development Cost</p>
                <h3 className="text-5xl font-bold font-headline">${calculatedCosts.total.toLocaleString()}</h3>
              </div>
              <div className="text-sm space-y-2 mt-6 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Base Platform:</span>
                    <span className="font-semibold">${calculatedCosts.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Scaling:</span>
                    <span className="font-semibold">+${calculatedCosts.userCost.toLocaleString()}</span>
                  </div>
                  {calculatedCosts.messageCost > 0 && (
                    <div className="flex justify-between text-primary/80">
                      <span>High Message Volume:</span>
                      <span className="font-semibold">+${calculatedCosts.messageCost.toLocaleString()}</span>
                    </div>
                  )}
                  {calculatedCosts.callVolumeCost > 0 && (
                    <div className="flex justify-between text-primary/80">
                      <span>Video Infrastructure:</span>
                      <span className="font-semibold">+${calculatedCosts.callVolumeCost.toLocaleString()}</span>
                    </div>
                  )}
                  {calculatedCosts.callDurationCost > 0 && (
                    <div className="flex justify-between text-primary/80">
                      <span>Extended Call Capacity:</span>
                      <span className="font-semibold">+${calculatedCosts.callDurationCost.toLocaleString()}</span>
                    </div>
                  )}
              </div>
               <div className="text-xs text-muted-foreground space-y-1 mt-6 text-center">
                    <p>✨ Avoiding one contentious court hearing ($10k-$20k) pays for the entire platform.</p>
                    <p>🚀 Total development timeline: 12-16 weeks.</p>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Phases Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarDays />Development Roadmap</CardTitle>
          <CardDescription>A visual timeline of the platform development phases, from core messaging to advanced legal features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 relative pl-6">
             <div className="absolute left-12 top-6 bottom-6 w-0.5 bg-border -translate-x-1/2"></div>
            {phases.map((phase, index) => (
              <div key={index} className="relative flex items-start gap-6">
                  <div className="relative z-10 w-12 h-12 flex-shrink-0">
                    <div className={`absolute inset-0 ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-lg -translate-x-1/2`}>
                        {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-semibold text-lg">{phase.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{phase.duration}</div>
                      <div className="flex items-center gap-1 font-medium"><DollarSign className="w-3.5 h-3.5" />{phase.cost}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to Put Your Child's Best Interests First?</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Create a communication platform that prioritizes your child's emotional safety, stability, and well-being in every interaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Development
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <FileText className="w-5 h-5" />
              Download Specs
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground pt-2">
            <p>👶 Child-first design principles • 🚀 First phase ready in 3 weeks • 💝 Emotional safety guaranteed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
