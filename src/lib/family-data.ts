export const familyMembers = {
    harper: { name: "Harper Ryan", dob: "11/12/2024" },
    parents: [
        { name: "Dad (Craig)", dob: "03/23/1990", side: 'paternal' as const },
        { name: "Mom (Emma)", dob: "12/15/1995", side: 'maternal' as const },
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
