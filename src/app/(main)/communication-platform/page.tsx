
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
    
    return baseCost + userMultiplier + complexityMultiplier;
  };

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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Family Members (Parents & Guardians)</Label>
                <Slider
                  value={[costCalculation.users]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, users: value[0]}))}
                  max={10}
                  min={2}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>2 parents</span>
                  <span className="font-medium">{costCalculation.users} family members</span>
                  <span>Extended family</span>
                </div>
              </div>

              <div>
                <Label>Monthly Child-Focused Messages</Label>
                <Slider
                  value={[costCalculation.monthlyMessages]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, monthlyMessages: value[0]}))}
                  max={1000}
                  min={50}
                  step={50}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Minimal</span>
                  <span className="font-medium">{costCalculation.monthlyMessages} messages</span>
                  <span>High collaboration</span>
                </div>
              </div>

              <div>
                <Label>Monthly Child Planning Calls</Label>
                <Slider
                  value={[costCalculation.monthlyCalls]}
                  onValueChange={(value) => setCostCalculation(prev => ({...prev, monthlyCalls: value[0]}))}
                  max={100}
                  min={5}
                  step={5}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Basic needs</span>
                  <span className="font-medium">{costCalculation.monthlyCalls} calls</span>
                  <span>Intensive planning</span>
                </div>
              </div>

              <div>
                <Label>Average Call Duration (minutes)</Label>
                <Slider
                  value={[costCalculation.callDuration]}
                   onValueChange={(value) => setCostCalculation(prev => ({...prev, callDuration: value[0]}))}
                  max={60}
                  min={5}
                  step={5}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span className="font-medium">{costCalculation.callDuration} min</span>
                  <span>60+ min</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 rounded-lg border border-primary/20">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">${calculateCost().toLocaleString()}</h3>
                  <p className="text-muted-foreground">Total Development Cost</p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Platform:</span>
                      <span>$15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Scaling:</span>
                      <span>+${(costCalculation.users * 500).toLocaleString()}</span>
                    </div>
                    {costCalculation.monthlyMessages > 500 && (
                      <div className="flex justify-between text-orange-600">
                        <span>High Volume:</span>
                        <span>+$5,000</span>
                      </div>
                    )}
                    {costCalculation.monthlyCalls > 50 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Video Infrastructure:</span>
                        <span>+$8,000</span>
                      </div>
                    )}
                    {costCalculation.callDuration > 30 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Extended Calls:</span>
                        <span>+$3,000</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>👶 <strong>Child Impact:</strong> Reduced conflict means better emotional stability for your child</p>
                <p>💡 <strong>ROI:</strong> Avoiding one contentious court hearing ($10k-20k) pays for the entire platform</p>
                <p>⚡ <strong>Timeline:</strong> 12-16 weeks total development</p>
                <p>🔒 <strong>Includes:</strong> Child safety audits, legal compliance, 1-year family support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Phases Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Development Roadmap</CardTitle>
          <CardDescription>A visual timeline of the platform development phases, from core messaging to advanced legal features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {index < phases.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-muted-foreground/20"></div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 grid gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="font-semibold text-lg">{phase.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {phase.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <DollarSign className="w-4 h-4" />
                        {phase.cost}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap gap-2">
                        {phase.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-br from-primary/5 to-purple-50 dark:from-primary/10 dark:to-purple-900/20 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to Put Your Child's Best Interests First?</CardTitle>
          <CardDescription className="text-lg">
            Create a communication platform that prioritizes your child's emotional safety, stability, and well-being in every interaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          <div className="text-sm text-muted-foreground">
            <p>👶 Child-first design principles • 🚀 First phase ready in 3 weeks • 💝 Emotional safety guaranteed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    