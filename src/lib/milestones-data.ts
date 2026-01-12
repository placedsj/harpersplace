
// src/lib/milestones-data.ts

export const MilestoneCategory = [
    'Cognitive',
    'Social & Emotional',
    'Language & Communication',
    'Motor Skills',
] as const;

export type MilestoneItem = {
    title: string;
    description: string;
};

type AgeGroup = {
    range: string;
    milestones: {
        [key in typeof MilestoneCategory[number]]: MilestoneItem[];
    };
};

type YearData = {
    year: string;
    description: string;
    ageGroups: { [key: string]: AgeGroup };
};

export const allMilestones: { [key: string]: YearData } = {
    firstYear: {
        year: 'The First Year',
        description: 'The first year is a time of incredible growth and change. From tiny newborn to a babbling, crawling, and sometimes even walking little person, here are the key milestones to watch for.',
        ageGroups: {
            '2months': {
                range: 'By 2 Months',
                milestones: {
                    'Social & Emotional': [
                        { title: 'Begins to smile at people', description: 'Can briefly calm himself (may bring hands to mouth and suck on hand).' },
                        { title: 'Tries to look at parent', description: 'Shows early signs of social engagement.' },
                    ],
                    'Language & Communication': [
                        { title: 'Coos, makes gurgling sounds', description: 'Early vocalization.' },
                        { title: 'Turns head toward sounds', description: 'Reacts to auditory stimuli.' },
                    ],
                    'Cognitive': [
                        { title: 'Pays attention to faces', description: 'Begins to recognize familiar faces and objects.' },
                        { title: 'Follows things with eyes', description: 'Tracks objects and people in their line of sight.' },
                    ],
                    'Motor Skills': [
                        { title: 'Can hold head up', description: 'Begins to make smoother movements with arms and legs.' },
                        { title: 'Tummy time push-ups', description: 'Starts to push up when lying on tummy.' },
                    ],
                },
            },
            '6months': {
                range: 'By 6 Months',
                milestones: {
                    'Social & Emotional': [
                        { title: 'Knows familiar faces', description: 'Gets excited by familiar people and may cry around strangers.' },
                        { title: 'Likes to play with others', description: 'Especially parents, and responds to others\' emotions.' },
                    ],
                    'Language & Communication': [
                        { title: 'Responds to sounds by making sounds', description: 'Babbles with vowels like “ah,” “eh,” “oh”.' },
                        { title: 'Responds to own name', description: 'Recognizes their name being called.' },
                    ],
                    'Cognitive': [
                        { title: 'Brings things to mouth', description: 'Uses mouth for exploration.' },
                        { title: 'Shows curiosity about things', description: 'Tries to get things that are out of reach.' },
                    ],
                    'Motor Skills': [
                        { title: 'Rolls over in both directions', description: 'From front to back and back to front.' },
                        { title: 'Begins to sit without support', description: 'Develops core strength to sit upright.' },
                    ],
                },
            },
            '12months': {
                range: 'By 1 Year',
                milestones: {
                    'Social & Emotional': [
                        { title: 'Is shy or nervous with strangers', description: 'Shows preference for caregivers.' },
                        { title: 'Has favorite things and people', description: 'Shows clear attachments.' },
                    ],
                    'Language & Communication': [
                        { title: 'Uses simple gestures', description: 'Like shaking head “no” or waving “bye-bye”.' },
                        { title: 'Says “mama” and “dada”', description: 'May say other simple words like "uh-oh".' },
                    ],
                    'Cognitive': [
                        { title: 'Finds hidden things easily', description: 'Understands object permanence.' },
                        { title: 'Copies gestures', description: 'Starts to imitate actions they see.' },
                    ],
                    'Motor Skills': [
                        { title: 'Pulls up to stand', description: 'May be taking steps holding on (“cruising”).' },
                        { title: 'May stand alone or take a few steps', description: 'Beginning of walking.' },
                    ],
                },
            },
        }
    },
    secondYear: {
        year: 'The Second Year',
        description: 'The second year is all about exploration, independence, and a huge leap in language. Your toddler is learning to navigate the world on their own two feet and express their personality.',
        ageGroups: {
            '18months': {
                range: 'By 18 Months',
                milestones: {
                    'Social & Emotional': [
                        { title: 'May have temper tantrums', description: 'A normal part of expressing frustration and independence.' },
                        { title: 'Plays simple pretend', description: 'Such as feeding a doll.' },
                    ],
                    'Language & Communication': [
                        { title: 'Says several single words', description: 'Vocabulary expands beyond mama/dada.' },
                        { title: 'Points to show someone what they want', description: 'Uses non-verbal communication to express needs.' },
                    ],
                    'Cognitive': [
                        { title: 'Points to get the attention of others', description: 'Understands they can direct others\' attention.' },
                        { title: 'Knows what ordinary things are for', description: 'For example, telephone, brush, spoon.' },
                    ],
                    'Motor Skills': [
                        { title: 'Walks alone', description: 'May walk up steps and run.' },
                        { title: 'Eats with a spoon', description: 'Developing fine motor skills for self-feeding.' },
                    ],
                },
            },
            '24months': {
                range: 'By 2 Years',
                milestones: {
                    'Social & Emotional': [
                        { title: 'Gets excited when with other children', description: 'Shows more and more independence.' },
                        { title: 'Shows defiant behavior', description: 'Doing what he has been told not to do.' },
                    ],
                    'Language & Communication': [
                        { title: 'Says sentences with 2 to 4 words', description: 'Begins to form simple sentences.' },
                        { title: 'Repeats words overheard in conversation', description: 'Actively learning new vocabulary.' },
                    ],
                    'Cognitive': [
                        { title: 'Begins to sort shapes and colors', description: 'Develops early problem-solving skills.' },
                        { title: 'Follows two-step instructions', description: 'Such as "Pick up your shoes and put them in the closet."' },
                    ],
                    'Motor Skills': [
                        { title: 'Kicks a ball', description: 'Stands on tiptoe.' },
                        { title: 'Makes or copies straight lines and circles', description: 'Fine motor skills continue to improve.' },
                    ],
                },
            },
        }
    }
};
