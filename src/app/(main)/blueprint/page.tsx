
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart, BookUser } from "lucide-react";

const PillarCard = ({ icon, title, description, action, result }: { icon: React.ReactNode, title: string, description: string, action: string, result: string }) => (
    <Card className="shadow-lg border-2 border-primary/20 bg-card transform hover:-translate-y-1 transition-transform duration-300">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    {icon}
                </div>
                <div>
                    <CardTitle className="font-headline uppercase text-primary tracking-widest">{title}</CardTitle>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-base text-muted-foreground font-sans">
                {description}
            </p>
            <div className="grid gap-6 md:grid-cols-2 bg-muted/30 p-4 rounded-lg border">
                <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider font-headline text-primary/80 mb-2">Action</h4>
                    <p className="text-sm font-sans">{action}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider font-headline text-accent mb-2">Result</h4>
                    <p className="text-sm font-sans">{result}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function BlueprintPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">The Stability Blueprint</h1>
        <p className="mt-2 text-lg font-sans text-accent tracking-wide">
          When a family separates, the court’s primary concern is stability. Placed.ca provides the structure needed to meet and exceed this standard. Our model focuses on three pillars of verifiable strength:
        </p>
      </div>

      <div className="space-y-6">
        <PillarCard 
            icon={<CheckCircle className="w-8 h-8 text-primary" />}
            title="Pillar 1: Accountability and Fitness"
            description="We guide parents in proactively addressing personal challenges to secure a safe environment for their children."
            action="Documented commitment to self-improvement (e.g., recovery, therapy, mental health work)."
            result="Objective, third-party letters and documentation that affirm the parent's fitness and dedication to long-term stability."
        />
        
        <PillarCard 
            icon={<BarChart className="w-8 h-8 text-primary" />}
            title="Pillar 2: Unalterable Documentation"
            description="We equip parents with tools to shift their case from 'he said/she said' conflict to verifiable fact."
            action="Implementation of a chronological, cloud-based evidence log for all communication and incidents."
            result="A court-ready index of events, demonstrating non-compliance or risk from the opposing party, backed by timestamped, tamper-proof records."
        />
        
        <PillarCard 
            icon={<BookUser className="w-8 h-8 text-primary" />}
            title="Pillar 3: Child-Centric Advocacy"
            description="We shift the focus from the parents' dispute to the child’s thriving life."
            action="Developing a comprehensive, child-specific parenting plan that details routines, educational support, medical care, and consistent engagement."
            result="A compelling case that proves the caregiver is the primary source of safety, consistency, and developmental opportunity, meeting the highest standard of 'best interest of the child.'"
        />
      </div>
    </div>
  );
}
