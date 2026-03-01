// src/app/(main)/communication-platform/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Video, 
  MessageSquare, 
  Shield, 
  FileText, 
  Clock, 
  DollarSign, 
  Users, 
  Gavel,
  CheckCircle,
  Play,
  Pause,
  Phone,
  Camera,
  Mic,
  MicOff,
  VideoOff
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CommunicationPlatformPage() {
  const [activeDemo, setActiveDemo] = useState<string>('messaging');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [costCalculation, setCostCalculation] = useState({
    users: 2,
    monthlyMessages: 100,
    monthlyCalls: 10,
    callDuration: 15
  });

  // Simulate call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    const baseCost = 15000; // Base development cost
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
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Child-Centered Communication Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Keep your child's best interests at the heart of every conversation. Professional, documented communication that prioritizes your child's emotional well-being, stability, and safety above all else.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="text-sm">👶 Child-First Approach</Badge>
          <Badge variant="secondary" className="text-sm">🏛️ Court Approved</Badge>
          <Badge variant="secondary" className="text-sm">💝 Emotional Safety</Badge>
          <Badge variant="secondary" className="text-sm">🤖 Conflict Resolution</Badge>
        </div>
      </div>

      {/* Interactive Demos */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messaging">📱 Messaging</TabsTrigger>
          <TabsTrigger value="video">🎥 Video Calls</TabsTrigger>
          <TabsTrigger value="legal">⚖️ Legal Export</TabsTrigger>
          <TabsTrigger value="security">🔐 Security</TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Child-Focused Messaging Demo</CardTitle>
              <CardDescription>AI ensures every message keeps your child's best interests and emotional well-being at the center</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock message thread */}
                <div className="border rounded-lg p-4 bg-muted/20 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">D</div>
                      <div className="flex-1">
                        <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">Hi! Could you pick up Harper today? I'm running late from work but want to make sure she gets home safely. Thank you!</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">2:15 PM</span>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">✓ Read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 justify-end">
                      <div className="flex-1">
                        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 max-w-xs ml-auto">
                          <p className="text-sm">Absolutely! I'll be there by 3:30. Should I take Harper to soccer practice so she doesn't miss it? I know how much she loves it.</p>
                          <div className="flex items-center gap-2 mt-1 justify-end">
                            <Badge variant="outline" className="text-xs">� Child-focused</Badge>
                            <span className="text-xs text-muted-foreground">2:16 PM</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">M</div>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Every message is analyzed for child-focused language, encrypted for privacy, and stored to demonstrate your commitment to your child's best interests in court.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Child-Safe Video Conversations</CardTitle>
              <CardDescription>Face-to-face discussions about your child's needs, with professional documentation for their protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock video call interface */}
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                  {isCallActive ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        🔴 Recording • {formatTime(callDuration)}
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl px-8">
                          <div className="bg-blue-500/30 rounded-lg p-8 text-center text-white">
                            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">D</div>
                            <p className="text-sm">Dad</p>
                          </div>
                          <div className="bg-purple-500/30 rounded-lg p-8 text-center text-white">
                            <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">M</div>
                            <p className="text-sm">Mom</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video Call Ready</p>
                      <p className="text-sm opacity-70">Click start to begin secure call</p>
                    </div>
                  )}
                </div>

                {/* Call controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isCallActive ? "destructive" : "default"}
                    onClick={() => {
                      setIsCallActive(!isCallActive);
                      if (!isCallActive) setCallDuration(0);
                    }}
                    className="gap-2"
                  >
                    {isCallActive ? <Phone className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {isCallActive ? 'End Call' : 'Start Call'}
                  </Button>
                  
                  <Button variant="outline" size="icon" disabled={!isCallActive} aria-label="Toggle Microphone">
                    <Mic className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" disabled={!isCallActive} aria-label="Toggle Camera">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {isCallActive && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Recording with consent to ensure child safety discussions are documented. All conversations are analyzed for child-focused content and emotional safety.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Child Welfare Documentation</CardTitle>
              <CardDescription>Professional reports showing your commitment to your child's best interests for court review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock legal document */}
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 bg-muted/10">
                    <div className="space-y-4">
                    <div className="text-center border-b pb-4">
                      <h3 className="font-bold text-lg">HARPER'S PLACE</h3>
                      <p className="text-sm text-muted-foreground">Child-Centered Communication Analysis</p>
                      <p className="text-xs text-muted-foreground">Document ID: HP-2025-10-22-001</p>
                    </div>                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Parties:</span>
                        <span>Parent A & Parent B</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Period:</span>
                        <span>October 1-22, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Messages:</span>
                        <span>47</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Child-Focused Response Rate:</span>
                        <span className="text-green-600">94% (Excellent)</span>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Child's Best Interest Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-700 dark:text-green-300">Child Safety Focus: 92%</span>
                          <Progress value={92} className="mt-1 h-2" />
                        </div>
                        <div>
                          <span className="text-green-700 dark:text-green-300">Emotional Stability: 87%</span>
                          <Progress value={87} className="mt-1 h-2" />
                        </div>
                        <div>
                          <span className="text-green-700 dark:text-green-300">Collaborative Tone: 89%</span>
                          <Progress value={89} className="mt-1 h-2" />
                        </div>
                        <div>
                          <span className="text-green-700 dark:text-green-300">Child-Centered Language: 76%</span>
                          <Progress value={76} className="mt-1 h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="gap-2">
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Gavel className="w-4 h-4" />
                    Legal Package
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Architecture</CardTitle>  
              <CardDescription>Bank-level security protecting your family's communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Security layers visualization */}
                <div className="relative">
                  {[
                    { name: 'End-to-End Encryption', desc: 'Messages encrypted before leaving your device', color: 'bg-red-500' },
                    { name: 'Transport Security', desc: 'TLS 1.3 encryption in transit', color: 'bg-orange-500' },
                    { name: 'Storage Security', desc: 'AES-256 encryption at rest', color: 'bg-yellow-500' },
                    { name: 'Access Control', desc: 'Multi-factor authentication required', color: 'bg-green-500' },
                    { name: 'Audit Trail', desc: 'Immutable logging with digital signatures', color: 'bg-blue-500' }
                  ].map((layer, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-muted-foreground/20">
                      <div className={`w-4 h-4 rounded-full ${layer.color}`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{layer.name}</h4>
                        <p className="text-sm text-muted-foreground">{layer.desc}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All security measures meet or exceed HIPAA, SOC 2, and family court requirements for sensitive communications.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cost Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Development Cost Calculator
          </CardTitle>
          <CardDescription>Estimate your custom communication platform investment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Family Members (Parents & Guardians)</Label>
                <Slider
                  value={[costCalculation.users]}
                  onValueChange={(value) => setCostCalculation(prev => ({ ...prev, users: value[0] }))}
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
                  onValueChange={(value) => setCostCalculation(prev => ({ ...prev, monthlyMessages: value[0] }))}
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
                  onValueChange={(value) => setCostCalculation(prev => ({ ...prev, monthlyCalls: value[0] }))}
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
                  onValueChange={(value) => setCostCalculation(prev => ({ ...prev, callDuration: value[0] }))}
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
                <p>� <strong>Child Impact:</strong> Reduced conflict means better emotional stability for your child</p>
                <p>�💡 <strong>ROI:</strong> Avoiding one contentious court hearing ($10k-20k) pays for the entire platform</p>
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
          <CardDescription>Visual timeline of platform development phases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {index < phases.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-20 bg-muted-foreground/20"></div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
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
            Create a communication platform that prioritizes your child's emotional safety, stability, and well-being in every interaction
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
            <p>� Child-first design principles • �🚀 First phase ready in 3 weeks • � Emotional safety guaranteed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}