import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FilePlus2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function JournalEntrySkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg border-2 border-primary/40 h-full">
      <Skeleton className="w-full aspect-video" />
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  )
}

interface JournalEmptyStateProps {
  onCreateEntry?: () => void;
}

export function JournalEmptyState({ onCreateEntry }: JournalEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center col-span-full border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 min-h-[400px]">
      <div className="bg-background p-6 rounded-full mb-6 shadow-sm ring-1 ring-primary/10">
        <FilePlus2 className="h-12 w-12 text-primary/60" />
      </div>
      <h3 className="text-2xl font-bebas tracking-wide text-primary mb-3">No Entries Yet</h3>
      <p className="text-muted-foreground font-montserrat max-w-md mb-8 px-4 text-lg">
        Your journal is waiting for its first story. Capture a precious family moment today!
      </p>
      {onCreateEntry && (
        <Button onClick={onCreateEntry} size="lg" className="shadow-lg hover:shadow-xl transition-all">
          <PlusCircle className="mr-2 h-5 w-5" />
          Start Journaling
        </Button>
      )}
    </div>
  )
}
