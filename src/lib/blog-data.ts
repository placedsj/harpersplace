// src/lib/blog-data.ts

type Post = {
    slug: string;
    title: string;
    summary: string;
    contentHtml: string;
    date: string;
    category: 'Finances' | 'Communication' | 'Legal' | 'Parenting';
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    audioUrl?: string;
};

const author = {
    name: 'The Harper\'s Place Team',
    avatar: 'https://picsum.photos/seed/author/100/100',
    bio: 'Dedicated to providing New Brunswick families with the tools and strategies for child-centered co-parenting and stability.'
};

const posts: Post[] = [
    {
        slug: 'navigating-section-7-expenses',
        title: 'Stop Fighting About Who Pays: Navigating Section 7 Expenses in New Brunswick',
        summary: 'A clear guide to understanding, tracking, and documenting extraordinary expenses to reduce conflict and ensure fairness.',
        contentHtml: `
            <p>One of the most common sources of conflict between co-parents is money—specifically, who pays for what. In New Brunswick, these are often referred to as "Section 7 expenses" or "extraordinary expenses." These are costs that go beyond basic child support, like sports fees, tutoring, or medical bills.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">What Qualifies as a Section 7 Expense?</h3>
            <p>According to the Child Support Guidelines, an extraordinary expense is one that is:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Necessary</strong> for the child’s best interests.</li>
                <li><strong>Reasonable</strong> given the means of the parents and the child.</li>
                <li>Consistent with the family's spending patterns before the separation.</li>
            </ul>
            <p>Common examples include hockey fees, piano lessons, braces, or private tutoring.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Harper's Place Solution: The Fund</h3>
            <p>Arguing over every receipt is exhausting and damaging. The <strong>Harper's Fund</strong> feature in our app provides a transparent, simple solution:</p>
            <ol class="list-decimal list-inside space-y-2 my-4">
                <li><strong>Log Every Expense:</strong> Upload a photo of the receipt and enter the amount.</li>
                <li><strong>AI Categorization:</strong> Our AI automatically suggests the correct category (e.g., "Extracurricular," "Medical").</li>
                <li><strong>Track Contributions:</strong> See a clear, running tally of who has paid what.</li>
                <li><strong>Export for Court:</strong> Generate a clean, professional report of all expenses and contributions, ready for legal review.</li>
            </ol>
            <p>By using a neutral, shared platform, you remove the emotion and focus on the facts. It stops being about who is "right" and becomes about ensuring the child's needs are met transparently and accountably.</p>
        `,
        date: '2025-11-08',
        category: 'Finances',
        author,
        audioUrl: 'https://storage.googleapis.com/studioprod-51a82.appspot.com/asset-manager/8e9d5607-e54f-4a43-85f0-62955f7c320d.mp3'
    },
    {
        slug: 'i-statement-advantage',
        title: 'The "I Statement" Advantage: Fulfilling the Duty to Protect Children from Parental Conflict',
        summary: 'Learn how to rephrase your communication to be more effective, less accusatory, and centered on your child\'s well-being, as required by the Divorce Act.',
        contentHtml: `
            <p>The federal <em>Divorce Act</em> places a legal responsibility on parents to protect their children from conflict arising from a separation. Section 7.1 outlines this as a primary duty. But what does that look like in practice? It starts with how you communicate.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Problem with "You Statements"</h3>
            <p>"You statements" are inherently accusatory and immediately put the other person on the defensive. For example:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li>"<strong>You</strong> are always late for pickup."</li>
                <li>"<strong>You</strong> never pack the right clothes."</li>
                <li>"Why did <strong>you</strong> let her stay up so late?"</li>
            </ul>
            <p>This language creates conflict, which is exactly what the law requires you to avoid.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "I Statement" Advantage</h3>
            <p>"I statements" reframe the issue around your feelings and the objective impact, rather than blaming the other person. This opens the door for collaboration.</p>
            <p>The <strong>AI Communication Coach</strong> in Harper's Place is designed to help you make this shift automatically. Here's how it works:</p>
            <blockquote class="border-l-4 border-accent pl-4 py-2 my-4">
                <p><strong>Before (Hostile):</strong> "Why are you always late?"</p>
                <p><strong>After (AI-Revised):</strong> "I get worried when the schedule isn't met because it disrupts Harper's routine. Can we confirm a pickup time that works for you?"</p>
            </blockquote>
            <p>The revised message is impossible to argue with. It states a feeling ("I get worried"), identifies a child-centered problem ("it disrupts Harper's routine"), and proposes a collaborative solution ("Can we confirm a time?").</p>
            <p>Using tools like the AI Communication Coach isn't just about being polite; it's about actively fulfilling your legal duty to shield your child from conflict and demonstrating your fitness as a parent.</p>
        `,
        date: '2025-11-07',
        category: 'Communication',
        author,
        audioUrl: 'https://storage.googleapis.com/studioprod-51a82.appspot.com/asset-manager/8e9d5607-e54f-4a43-85f0-62955f7c320d.mp3'
    },
    {
        slug: 'why-judges-love-timestamps',
        title: 'Why Judges Love Timestamps: Making Your Records Court-Admissible in NB',
        summary: 'In a "he said, she said" dispute, verifiable data wins. Discover why timestamped, unalterable records are your most powerful tool in family court.',
        contentHtml: `
            <p>When family court matters become contentious, a judge's decision often comes down to credibility. Who can provide the most reliable account of events? Vague recollections and conflicting stories create doubt, but verifiable data provides clarity.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Problem with Screenshots and Emails</h3>
            <p>While better than nothing, screenshots of text messages and printed emails can be challenged. Dates can be altered, context can be removed, and authenticity can be questioned. They often devolve into a "he said, she said" argument, which frustrates the court and pulls focus away from the child's best interests.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Power of Immutable, Timestamped Records</h3>
            <p>Harper's Place is built on the principle of verifiable documentation. Every single entry—whether a message, an expense, or a daily log—is automatically given a secure, server-verified timestamp that cannot be altered. This creates an unchallengeable chronological record.</p>
            <p>When you use the <strong>Secure Communication Hub</strong> or the <strong>Daily Care Log</strong>, you are building a court-ready record that demonstrates:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Timeliness:</strong> When messages were sent and read.</li>
                <li><strong>Consistency:</strong> A pattern of responsible care and communication over time.</li>
                <li><strong>Accuracy:</strong> A factual log of events as they happened, not as they are remembered weeks later.</li>
            </ul>
            <p>As the New Brunswick justice system moves towards e-filing and digital evidence, presenting a clean, organized, and verifiable log from a neutral platform like Harper's Place gives you an enormous credibility advantage. It shows you are organized, transparent, and focused on facts—qualities any judge will appreciate.</p>
        `,
        date: '2025-11-06',
        category: 'Legal',
        author,
    },
];

export function getallPosts() {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
    return posts.find((post) => post.slug === slug);
}
