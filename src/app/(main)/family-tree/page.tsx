
// src/app/(main)/family-tree/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';


export const familyMembers = {
    harper: { name: "Harper Ryan", dob: "11/12/2024" },
    parents: [
        { name: "Dad (Craig)", dob: "03/23/1990", side: 'paternal' as const },
        { name: "Mom (Jules)", dob: "07/21/1992", side: 'maternal' as const },
    ],
    maternalGrandparents: [
        { name: "Nanny Ryan (Jane)", side: 'maternal' as const },
        { name: "Grampy Ryan (Sonny)", side: 'maternal' as const },
    ],
    paternalGrandparents: [
        { name: "Grammy Campbell (Stacey)", side: 'paternal' as const },
    ],
    maternalAuntsUncles: [
        { name: "Aunt Amber", side: 'maternal' as const },
        { name: "Aunt Marissa", side: 'maternal' as const },
        { name: "Uncle Nick", side: 'maternal' as const },
        { name: "Uncle Matt", side: 'maternal' as const },
    ],
    paternalAuntsUncles: [
    ],
    maternalCousins: [
        { name: "Cousin Logan", side: 'maternal' as const },
        { name: "Cousin Wyatt", side: 'maternal' as const },
    ],
    paternalCousins: [
    ]
};

type FamilyMember = {
    name: string;
    dob?: string;
};

const FamilyMemberCard = ({ name, dob, side }: FamilyMember & { side: 'maternal' | 'paternal' | 'child' }) => (
    <div className={cn(
        "flex flex-col items-center text-center p-3 rounded-lg shadow-sm w-full",
        side === 'child' && 'bg-accent/20 border-2 border-accent',
        side === 'maternal' && 'bg-mom/10 border border-mom/20',
        side === 'paternal' && 'bg-dad/10 border border-dad/20',
    )}>
        <div className="leading-tight">
            <p className="font-semibold font-sans">{name}</p>
            {dob && <p className="text-xs text-muted-foreground">{dob}</p>}
        </div>
    </div>
);


const FamilyBranch = ({ title, members, side }: { title: string, members: FamilyMember[], side: 'maternal' | 'paternal' }) => {
    if (members.length === 0) return null;
    return (
        <div className="space-y-3">
            <h3 className={cn(
                "font-headline uppercase text-center text-sm tracking-wider pb-1 border-b-2",
                side === 'maternal' ? 'border-mom text-mom' : 'border-dad text-dad'
            )}>{title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {members.map(member => <FamilyMemberCard key={member.name} {...member} side={side} />)}
            </div>
        </div>
    );
}

export default function FamilyTreePage() {
  const paternalParent = familyMembers.parents.find(p => p.side === 'paternal');
  const maternalParent = familyMembers.parents.find(p => p.side === 'maternal');

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">FAMILY TREE</h1>
            <p className="text-lg font-sans text-accent mt-1 tracking-wide">
                A visual map of Harper's loving family and support system.
            </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
            {/* Child */}
            <div className="w-48">
                 <FamilyMemberCard name={familyMembers.harper.name} dob={familyMembers.harper.dob} side="child" />
            </div>

             {/* Connecting Lines to Parents */}
            <div className="h-10 w-px bg-muted-foreground/30 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-muted-foreground/30"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-5 bg-muted-foreground/30"></div>
            </div>

            {/* Parents */}
            <div className="w-full max-w-md grid grid-cols-2 gap-8 relative">
                 {paternalParent && <FamilyMemberCard {...paternalParent} />}
                 {maternalParent && <FamilyMemberCard {...maternalParent} />}
            </div>
            
            {/* Connecting Lines to Grandparents etc. */}
            <div className="w-full max-w-md grid grid-cols-2 gap-8">
                <div className="h-10 w-px bg-muted-foreground/30 mx-auto"></div>
                <div className="h-10 w-px bg-muted-foreground/30 mx-auto"></div>
            </div>

            {/* Grandparents & Aunts/Uncles/Cousins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <Card className="bg-dad/5 border-dad/20">
                    <CardHeader>
                        <CardTitle className="text-center text-dad font-headline uppercase tracking-widest">Dad's Family</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FamilyBranch title="Grandparents" members={familyMembers.paternalGrandparents} side="paternal" />
                        <FamilyBranch title="Aunts & Uncles" members={familyMembers.paternalAuntsUncles} side="paternal" />
                        <FamilyBranch title="Cousins" members={familyMembers.paternalCousins} side="paternal" />
                    </CardContent>
                </Card>

                 <Card className="bg-mom/5 border-mom/20">
                    <CardHeader>
                        <CardTitle className="text-center text-mom font-headline uppercase tracking-widest">Mom's Family</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <FamilyBranch title="Grandparents" members={familyMembers.maternalGrandparents} side="maternal" />
                       <FamilyBranch title="Aunts & Uncles" members={familyMembers.maternalAuntsUncles} side="maternal" />
                       <FamilyBranch title="Cousins" members={familyMembers.maternalCousins} side="maternal" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
