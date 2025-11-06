
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-headline uppercase tracking-tight text-primary drop-shadow-md">OUR MISSION</h1>
        <p className="mt-2 text-lg font-sans text-accent tracking-wide">
          Transforming crisis into stability for parents and their children.
        </p>
      </div>

      <Card className="shadow-lg border-2 border-primary/40">
        <CardHeader>
          <CardTitle className="font-headline uppercase text-primary tracking-widest">THE ELEVATOR PITCH</CardTitle>
        </CardHeader>
        <CardContent className="text-lg font-sans text-foreground">
          <p>
            Harper&apos;s Place provides essential structure and strategy for
            parents navigating high-conflict separation. We are a resource hub
            dedicated to transforming crisis into stability by providing tools
            for verifiable, court-admissible documentation, personal
            accountability, and child-centered planning. We help parents
            stabilize their own lives so they can secure their childs future.{" "}
            <strong className="text-accent">Our only interest is your child&apos;s best interest.</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-accent/40">
        <CardHeader>
          <CardTitle className="font-headline uppercase text-accent tracking-widest">THE FOUNDER&apos;S COMMITMENT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg font-sans text-foreground">
          <h3 className="font-semibold text-primary">WHY HARPER&apos;S PLACE?</h3>
          <p>
            This organization was founded on the belief that a child&apos;s right
            to safety and stability must be non-negotiable. Our namesake,
            Harper, represents every child caught in the unpredictable chaos of
            family breakdown. We exist to provide the resources and backbone
            necessary for every parent to successfully build a secure and
            thriving &quot;place&quot; for their child, just as we have done.
          </p>
          <p className="font-semibold text-accent">
            Our mission is personal, our standards are professional, and{" "}
            <strong className="text-primary">our only interest is your child&apos;s best interest.</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
