
// src/lib/blog-data.ts
import placeholderImages from '@/app/lib/placeholder-images.json';

type Post = {
    slug: string;
    title: string;
    summary: string;
    contentHtml: string;
    date: string;
    category: 'Finances' | 'Communication' | 'Legal' | 'Parenting' | 'Wellness' | 'Family' | 'Planning';
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    image?: string;
    dataAiHint?: string;
    audioUrl?: string;
    resources?: {
        title: string;
        url: string;
        type: 'PDF' | 'DOCX';
    }[];
};

const author = {
    name: 'The Harper\'s Place Team',
    avatar: placeholderImages.authorAvatar.url,
    bio: 'Dedicated to providing New Brunswick families with the tools and strategies for child-centered co-parenting and stability.'
};

const posts: Post[] = [
    {
        slug: 'the-reloction-audit',
        title: 'The Longest Bridge: The Relocation Audit',
        summary: 'A move-away is the ultimate test of your co-parenting structure. Learn how to navigate this "heavy load" with the raw, bare-boned honesty of the Steel Bridge philosophy.',
        image: 'https://picsum.photos/seed/bridge/896/400',
        dataAiHint: 'steel bridge',
        contentHtml: `
            <p>The news landed like a structural impact test: one parent got a job offer in Halifax. A great one. In the "covered bridge" days, this would have been a declaration of war. Lawyers would be called, threats would be made, and the bridge would have been torn apart by the "scary as fuck" tension, with Harper caught in the middle.</p>
            <p>But this is 2026. This is the era of the Steel Bridge.</p>
            <p>The parent didn't hide it. They used the <strong>AI Communication Coach</strong> to draft a "no-makeup," legally sound notification: "Per our parenting plan and the NB Family Law Act, I am formally providing notice to discuss a potential relocation and its impact on Harper's best interests."</p>
            <p>There was no drama. There was just data. They used the Harper’s Place platform to conduct a "Structural Audit":</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>The Shared Journal:</strong> A perfect, timestamped record of Harper’s deep community ties in the Valley.</li>
                <li><strong>The Smart Calendar:</strong> An unalterable log of the existing, stable Parenting Time schedule.</li>
                <li><strong>The "Voice of the Child":</strong> At her age, Harper’s own desire to stay near her school and friends was a significant, logged factor.</li>
            </ul>
            <p>They didn’t have to fight. The data on the bridge was so solid, so clear, that it guided the decision. The bridge held, even under this heavy load, because it was built of raw, unshakeable truth.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Raw Steel" Guide to Relocation in New Brunswick</h3>
            <p>You can't just move. A "move-away" is a legal event that requires a specific process.</p>
            <ol class="list-decimal list-inside space-y-2 my-4">
                <li><strong>The 60-Day Notice:</strong> Under the Family Law Act, you must provide 60 days' written notice of a planned relocation. An email isn't steel; use a verifiable method.</li>
                <li><strong>The "Best Interest" Test on Wheels:</strong> A judge won't care about your new job if the move isn't in the child’s best interest. You must prove how the child's stability, schooling, and relationships will be maintained.</li>
                <li><strong>The Burden of Proof is on the Mover:</strong> It is up to the parent who wants to move to show that it is the right thing for the child.</li>
                <li><strong>Don't Burn the Bridge:</strong> Never relocate without consent or a court order. It's the fastest way to have a judge order the child's immediate return to New Brunswick.</li>
            </ol>
        `,
        date: '2026-03-20',
        category: 'Legal',
        author,
    },
    {
        slug: 'the-summer-load',
        title: 'The Summer Load: Navigating the 119 Exit with a Boat in Tow',
        summary: 'Summer vacation can collapse a "covered bridge" of unspoken expectations. Learn how to build a summer plan out of raw, bare-boned steel that can handle the heaviest loads.',
        image: 'https://picsum.photos/seed/summer/896/400',
        dataAiHint: 'summer boat',
        contentHtml: `
            <p>In the old days—Nanny’s days—summer was a "covered bridge" of uncertainty. Mom and Dad would wait until the last week of June to argue about who got the week at the cottage. It was painted over with "we'll just see how it goes," but inside, the stress was scary as fuck for Harper.</p>
            <p>In 2026, we’ve stripped the roof off. The Hammond River Bridge doesn't care about "vibes"; it cares about structure.</p>
            <p>Harper’s parents didn't wait for the heatwave. They used the <strong>Smart Calendar</strong> to lock in summer Parenting Time back in March. They used the <strong>AI Communication Coach</strong> to settle the dates for summer camps. When the machines got heavier—literally, when Dad hooked up the boat to head to the river—there was no drama. The logistics were already riveted into the app. Harper didn’t have to navigate her parents’ conflict; she just had to navigate the river. That is the Safe Harbor standard in action.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Raw Steel" Summer Checklist</h3>
             <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Parenting Time, Not "Visits":</strong> Remember, the law in New Brunswick has moved away from "access" to Parenting Time. This is Harper’s right to a stable relationship with both parents.</li>
                <li><strong>The Section 7 Summer Audit:</strong> Summer camps and swimming lessons are extraordinary expenses. Log these Section 7 costs in the <strong>Finances</strong> tab the moment registration opens to avoid rot in your budget.</li>
                <li><strong>The Duty to Inform:</strong> Under the NB Family Law Act, you must keep the other parent informed about travel logistics. Use the <strong>Shared Journal</strong> to log flight numbers or cottage addresses.</li>
                <li><strong>No Makeup Communication:</strong> Keep holiday requests brief and business-like. If a dispute arises, let the timestamped records speak for themselves.</li>
            </ul>
        `,
        date: '2026-02-25',
        category: 'Planning',
        author,
    },
    {
        slug: 'adding-a-new-beam-new-partners',
        title: 'Adding a New Beam: The Raw Truth About New Partners',
        summary: 'Introducing a new partner is a heavy load for the bridge. Learn how to reinforce the structure with raw honesty, leaving the "covered bridge" of secrets and jealousy behind.',
        image: 'https://picsum.photos/seed/partners/896/400',
        dataAiHint: 'happy couple',
        contentHtml: `
            <p>In the old "covered bridge" days, Dad would have hidden his new girlfriend for a year, terrified of the "scary as fuck" fallout. It was painted over with lies like "Oh, she’s just a friend from work," until the rot of the secret made Harper feel like she couldn't trust her own eyes.</p>
            <p>In 2026, we’ve stripped the roof off. We don’t hide behind the paint.</p>
            <p>When Dad started seeing someone seriously, he used the <strong>AI Communication Coach</strong> to draft a "no-makeup" notification to Mom: "I am introducing a new partner to Harper this weekend. We will be at Meenan’s Cove park for one hour. This is about her stability, not a change in our parenting time."</p>
            <p>Mom didn't have to like it, but because the bridge is made of steel, she respected the structure. She looked at the <strong>Smart Calendar</strong> and saw the routine was the same. Harper wasn't losing a parent; she was just seeing a new beam being riveted onto her bridge. No secrets, no "scary" echoes—just a raw, bare-boned transition that kept her best interests at the center.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Raw Steel" Guide to New Partners</h3>
             <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Safety First:</strong> Under the New Brunswick Family Law Act, ensuring any new partner provides a safe and stable environment is your legal duty.</li>
                <li><strong>The "No-Messenger" Rule:</strong> Never ask your child to keep the new partner a secret; this creates "scary" internal conflict that rots the bridge from the inside.</li>
                <li><strong>Document the Transition:</strong> Use the <strong>Shared Journal</strong> to log how the child is reacting to the new person—not for "spying," but to ensure the child’s emotional wellness remains a priority.</li>
                <li><strong>Parallel Boundaries:</strong> Remember that in a Parallel Parenting model, you do not need the other parent's permission to date, but you do have a duty to ensure the transition doesn't interfere with established Parenting Time.</li>
            </ul>
        `,
        date: '2026-01-30',
        category: 'Parenting',
        author,
    },
    {
        slug: 'the-parent-teacher-standoff',
        title: 'The Structural Audit: The Parent-Teacher Stand-off',
        summary: 'Forget the "covered bridge" awkwardness of sitting in tiny chairs together. We’re moving to the high-tensile strength of Parallel Educational Support.',
        image: 'https://picsum.photos/seed/classroom/896/400',
        dataAiHint: 'teacher classroom',
        contentHtml: `
             <p>In the old days, Nanny thought it was best if both parents sat together at the tiny classroom desk. It was "pretty on the outside" for the teacher, but inside, it was scary as fuck. The tension was so thick the teacher could barely talk about Harper’s math progress.</p>
            <p>In 2026, we’ve stripped the roof off that tradition.</p>
            <p>This year, Harper’s parents didn't do the "fake together" routine. They scheduled separate 10-minute windows. Instead of a "he said, she said" dispute, they used the <strong>Shared Journal</strong> to log the teacher’s feedback. No makeup. No hiding. Just raw data about Harper’s reading level. This is the Safe Harbor standard: the teacher can focus on the student, and the parents can focus on the support.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Raw Steel" Guide to School Logistics</h3>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>The Right to Know:</strong> Under the NB Family Law Act, both parents with Decision-Making Responsibility have the right to school records.</li>
                <li><strong>No Messenger Kids:</strong> Never ask Harper "What did your teacher tell Dad?" Use the app to share school memos.</li>
                <li><strong>Section 7 School Costs:</strong> Field trips and hot lunch programs are extraordinary expenses. Log them in the <strong>Finances</strong> tab the second the permission slip comes home.</li>
                <li><strong>The AI Coach for Emails:</strong> Before you email the teacher, run it through the <strong>AI Communication Coach</strong>. Keep it "no-makeup" and professional.</li>
            </ul>
        `,
        date: '2025-12-20',
        category: 'Communication',
        author,
    },
     {
        slug: 'nannys-guide-to-the-new-bridge',
        title: 'Nanny’s Guide to the New Bridge: Why Steel is Safer than Paint',
        summary: 'This one is for the family members who remember the "Old Way." An explanation of why we stripped off the red paint and wooden roof to reveal the raw steel that keeps Harper safe.',
        image: 'https://picsum.photos/seed/oldbridge/896/400',
        dataAiHint: 'covered bridge',
        contentHtml: `
            <p>Nanny loves a good story, and she loves the old covered bridges that dot the New Brunswick landscape. To her, those bridges represent a time when things were simpler. But Nanny also remembers the "creaks"—the way the air felt inside those covered bridges when Harper’s parents first separated—dark, uncertain, and a little bit scary.</p>
            <p>We had to tell Nanny: "The red paint was beautiful, but the wood couldn't hold the weight anymore."</p>
            <p>The world got heavier. The 2026 legal requirements in New Brunswick aren't about "polite silence"; they are about Decision-Making Responsibility. We showed her the Hammond River Bridge—the raw, bare-boned steel. We explained that by using Harper’s Place, we aren't "hiding" the separation. We are showing her the strength of the connection. Now, when Nanny takes Harper for the weekend, she just looks at the <strong>Smart Calendar</strong> and knows exactly where the bridge leads.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Structural Audit" for 2026</h3>
            <p>As we cross into a new year, it’s time to inspect the rivets:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>The Communication Rivet:</strong> Are you still using the <strong>AI Communication Coach</strong> to keep things "no-makeup" and professional?</li>
                <li><strong>The Financial Beam:</strong> Are Section 7 expenses being logged the moment they happen?</li>
                <li><strong>The "Best Interest" Foundation:</strong> Does the schedule still reflect the child’s best interest?</li>
                <li><strong>The Unalterable Record:</strong> Are you relying on memory, or on timestamped records a New Brunswick judge would respect?</li>
            </ul>
        `,
        date: '2025-12-15',
        category: 'Family',
        author,
    },
    {
        slug: 'the-heavy-load-holidays',
        title: 'The Heavy Load: Surviving the KV Holidays with a Steel Bridge',
        summary: 'We’re stripping away the painted-on "perfect family" expectations and building a holiday strategy out of high-tensile steel. No makeup, no pretending, just a solid plan.',
        image: 'https://picsum.photos/seed/holidays/896/400',
        dataAiHint: 'holiday lights',
        contentHtml: `
            <p>For years, the KV Santa Claus Parade was a source of "covered bridge" anxiety. Nanny wanted everyone in the same row of lawn chairs, wearing matching mittens, pretending the rot wasn't there. It was pretty for the Facebook photos, but inside, the tension was "scary as fuck."</p>
            <p>This year, we’re doing the Steel Bridge version. No more hiding.</p>
            <p>Harper’s parents looked at the <strong>Smart Calendar</strong> three weeks early. They used the <strong>AI Communication Coach</strong> to set a clear, raw boundary: "Dad has Harper for the parade from 5 PM to 7 PM; Mom picks her up at the Q-Plex parking lot for the tree lighting at 7:15 PM." No makeup. No pretending. Just a solid, structural plan that allowed Harper to enjoy the lights without the heavy weight of her parents' unspoken conflict.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The "Raw Steel" Holiday Checklist</h3>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>The Zero-Friction Exchange:</strong> Use a public, neutral spot like the Q-Plex for holiday handovers.</li>
                <li><strong>Section 7 Transparency:</strong> Holidays are a breeding ground for "extraordinary expenses". Log the cost of big-ticket gifts in the <strong>Finances</strong> tab immediately.</li>
                <li><strong>The Stability Blueprint:</strong> Remind the child what stays the same. "Even though we're doing things differently this year, you still have your favorite stockings at both houses."</li>
                <li><strong>Timestamped Peace of Mind:</strong> If the schedule changes because of a New Brunswick snowstorm, log it in the app. Unalterable records prevent "he said/she said" drama.</li>
            </ul>
        `,
        date: '2025-11-20',
        category: 'Planning',
        author,
    },
    {
        slug: 'hammond-river-bridge',
        title: 'The Hammond River Bridge: The Real "Safe Harbor"',
        summary: 'You can\'t talk about a "New Brunswick Blueprint" in Quispamsis without the Hammond River Bridge. This is the literal steel backbone of the Valley and the metaphorical bridge for every family navigating "Two Roofs, One Home."',
        image: 'https://picsum.photos/seed/riverbridge/896/400',
        dataAiHint: 'river bridge',
        contentHtml: `
            <p>For Harper, the Hammond River Bridge is the signal. When she sees those steel trusses reflecting off the water, she knows she’s almost "home," whichever roof that happens to be tonight. It’s the two-minute warning to finish her book and transition from "Dad’s World" to "Mom’s World."</p>
            <p>In the old days, that bridge felt like a gauntlet. But now, her parents treat the bridge like a neutral zone. Because they use <strong>Harper’s Place</strong>, the "business" of parenting stays off the bridge. The <strong>Section 7</strong> expenses for her soccer cleats are already logged. Her <strong>Parenting Time</strong> schedule is synced. By the time the tires hum over the bridge deck, the only thing Harper has to worry about is being a kid.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Maintaining the Bridge: A Fact-Driven Blueprint</h3>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>The Communication Handshake:</strong> Never use the child to "send a message" across the bridge. Keep all logistical talk in the app.</li>
                <li><strong>The "Best Interest" Anchor:</strong> Every decision must be anchored in what is best for the child, as required by the New Brunswick Family Law Act.</li>
                <li><strong>Timestamped Stability:</strong> In NB, "he said/she said" doesn't hold up in court. Use unalterable records to prove you are holding up your end of the parenting time agreement.</li>
            </ul>
        `,
        date: '2025-11-15',
        category: 'Legal',
        author,
    },
    {
        slug: 'harpers-bridge-two-roofs-one-bridge',
        title: 'Two Roofs, One Bridge: Welcome to Harper’s Bridge',
        summary: 'If Harper’s Place is the home, the Bridge is the connection that makes "Two Roofs, One Home" possible. In the "New Brunswick Blueprint," we don’t just focus on where the child sleeps; we focus on the safe passage between those spaces.',
        image: 'https://picsum.photos/seed/tworoofs/896/400',
        dataAiHint: 'two houses',
        contentHtml: `
            <p>In New Brunswick, the "Sunday Drive" is a tradition, but for Harper, it’s the most important part of her week. As she crosses the bridge, she isn't thinking about "custody" or "access"—terms the law has rightfully left behind. She’s thinking about how her life feels like one continuous story, even if the setting changes.</p>
            <p>Because her parents use the <strong>Harper’s Place AI Communication Coach</strong>, the bridge is clear of the "emotional fog" that once made these trips scary. There are no tense conversations at the curb. Instead, there is a "handshake" of data: her medication schedule is logged, her school project is in the backpack, and her parents have already shared a "success note" in the journal about her winning the science fair.</p>
            <p>Harper’s Bridge isn't made of steel; it’s made of consistency, validation, and a calm presence.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Fact-Driven Blueprint: Engineering a Strong Bridge</h3>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Move Away from Old Language:</strong> The law no longer recognizes "custody" and "access"; it focuses on Parenting Time and Decision-Making Responsibility.</li>
                <li><strong>The Duty to Protect:</strong> Parents have a legal obligation to shield children from conflict. Every argument on the "bridge" is a breach of the child's best interests.</li>
                <li><strong>Verifiable Transitions:</strong> Judges value timestamped, unalterable records because they prove a parent’s commitment to a stable routine.</li>
                <li><strong>The Power of Parallelism:</strong> In high-conflict cases, a "bridge" doesn't mean parents have to walk it together. You can use neutral drop-off points to ensure the child never sees a parental dispute.</li>
            </ul>
        `,
        date: '2025-11-12',
        category: 'Communication',
        author,
    },
    {
        slug: 'what-not-to-do-at-exchanges',
        title: 'The Handover Handbook: 7 Things to Never Do at a Custody Exchange',
        summary: 'Custody exchanges are a major source of stress for children. Learn the key mistakes to avoid to ensure every handover is peaceful, positive, and conflict-free.',
        image: 'https://picsum.photos/seed/handshake/896/400',
        dataAiHint: 'handshake deal',
        contentHtml: `
            <p>The moment of exchange—when a child transitions from one parent to the other—is one of the most emotionally charged moments in co-parenting. For a child, this brief interaction can be filled with anxiety and loyalty conflicts. Your number one job is to make it boring, predictable, and safe. Here are 7 things to absolutely avoid.</p>
            <ol class="list-decimal list-inside space-y-3 my-4">
                <li><strong>Don\'t discuss adult topics.</strong> The exchange is not the time to talk about child support, legal matters, or your personal grievances. Keep conversation limited to pleasantries and essential, child-related logistics for the next 24 hours.</li>
                <li><strong>Don\'t use the child as a messenger.</strong> "Tell your mother she needs to call me." This puts the child in the middle and forces them to manage adult responsibilities. Communicate directly through the proper channels, like the Harper\'s Place app.</li>
                <li><strong>Don\'t linger.</strong> A long, drawn-out goodbye can increase a child\'s anxiety. The goal is a quick, warm, and confident transition. A hug, a loving "I\'ll see you on Friday!" and a wave is perfect.</li>
                <li><strong>Don\'t display negative body language.</strong> Eye-rolling, sighing, or refusing to make eye contact with the other parent sends a clear signal of conflict to your child, making them feel unsafe.</li>
                <li><strong>Don\'t interrogate the child.</strong> "Did you have fun? What did you do? Did you eat your vegetables?" Let your child decompress and share information on their own time. The handover should not feel like an inspection.</li>
                <li><strong>Don\'t be late.</strong> Punctuality is a sign of respect and, more importantly, it provides the predictability children need. If you are going to be late, communicate that as early as possible.</li>
                <li><strong>Don\'t make it about you.</strong> The exchange is about the child\'s successful transition between their two homes. Your feelings of sadness or frustration must be managed privately, away from the child.</li>
            </ol>
            <p>By keeping exchanges brief, business-like, and friendly, you fulfill your duty to protect your child from conflict and create the emotional stability they need to thrive.</p>
        `,
        date: '2025-11-10',
        category: 'Parenting',
        author,
    },
    {
        slug: 'helping-children-with-anxiety',
        title: 'Your Child\'s Safe Harbor: 5 Ways to Help a Child Navigate Anxiety',
        summary: 'Separation is stressful for children. Learn five actionable strategies to help your child feel secure, understood, and confident amidst family changes.',
        image: 'https://picsum.photos/seed/harbor/896/400',
        dataAiHint: 'safe harbor',
        contentHtml: `
            <p>Anxiety in children, especially during a family separation, often looks like anger, defiance, or withdrawal. Their world feels unpredictable, and they lack the tools to express their big feelings. Your role is to be their safe harbor—the calm, predictable anchor in their emotional storm. Here are five practical ways to help.</p>
            <ol class="list-decimal list-inside space-y-3 my-4">
                <li><strong>Name the Feeling (and Validate It).</strong> Don\'t say, "Don\'t be sad." Instead, say, "It looks like you\'re feeling sad right now. It\'s okay to feel sad. I\'m here with you." Naming an emotion helps a child understand it, while validation ensures they feel heard and safe.</li>
                <li><strong>Create Predictable Routines.</strong> Anxiety thrives in uncertainty. A consistent routine for mornings, evenings, and especially handovers provides a sense of control and safety. The <strong>Smart Calendar</strong> in Harper\'s Place is a perfect tool for establishing and sharing these routines.</li>
                <li><strong>Focus on What Stays the Same.</strong> While much is changing, many things are not. Remind them: "Even though you\'ll be sleeping at Dad\'s house tonight, you\'ll still have your favorite teddy bear. And I will still be here to talk to on the phone before bed."</li>
                <li><strong>Practice "Externalizing" the Worry.</strong> For slightly older children, give the anxiety a silly name, like "Mr. Worry Monster." You can say, "Is Mr. Worry Monster telling you silly stories again? What\'s he saying this time?" This separates the child from their anxiety and turns it into a manageable, external thing they can confront.</li>
                <li><strong>Model Calm Yourself.</strong> Your child takes their emotional cues from you. If you are anxious, they will be too. It is essential to manage your own stress and model calm, confident behavior, especially during exchanges. Our <strong>AI Communication Coach</strong> can help ensure your written communications are also calm and reassuring, reducing the need for direct verbal interaction and thus lowering the child's anxiety.</li>
            </ol>
            <p>By providing consistency, validation, and a calm presence, you teach your child that while feelings of anxiety are normal, they are also manageable. This is a key factor judges look for when determining a parent's ability to act in the "child's best interest."</p>
        `,
        date: '2025-11-09',
        category: 'Wellness',
        author,
    },
    {
        slug: 'navigating-section-7-expenses',
        title: 'Stop Fighting About Who Pays: Navigating Section 7 Expenses in New Brunswick',
        summary: 'A clear guide to understanding, tracking, and documenting extraordinary expenses to reduce conflict and ensure fairness.',
        image: 'https://picsum.photos/seed/receipts/896/400',
        dataAiHint: 'receipt money',
        contentHtml: `
            <p>One of the most common sources of conflict between co-parents is money—specifically, who pays for what. In New Brunswick, these are often referred to as "Section 7 expenses" or "extraordinary expenses." These are costs that go beyond basic child support, like sports fees, tutoring, or medical bills.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">What Qualifies as a Section 7 Expense?</h3>
            <p>According to the Child Support Guidelines, an extraordinary expense is one that is:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Necessary</strong> for the child’s best interests.</li>
                <li><strong>Reasonable</strong> given the means of the parents and the child.</li>
                <li>Consistent with the family\'s spending patterns before the separation.</li>
            </ul>
            <p>Common examples include hockey fees, piano lessons, braces, or private tutoring.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Harper\'s Place Solution: The Fund</h3>
            <p>Arguing over every receipt is exhausting and damaging. The <strong>Harper\'s Fund</strong> feature in our app provides a transparent, simple solution:</p>
            <ol class="list-decimal list-inside space-y-2 my-4">
                <li><strong>Log Every Expense:</strong> Upload a photo of the receipt and enter the amount.</li>
                <li><strong>AI Categorization:</strong> Our AI automatically suggests the correct category (e.g., "Extracurricular," "Medical").</li>
                <li><strong>Track Contributions:</strong> See a clear, running tally of who has paid what.</li>
                <li><strong>Export for Court:</strong> Generate a clean, professional report of all expenses and contributions, ready for legal review.</li>
            </ol>
            <p>By using a neutral, shared platform, you remove the emotion and focus on the facts. It stops being about who is "right" and becomes about ensuring the child\'s needs are met transparently and accountably.</p>
        `,
        date: '2025-11-08',
        category: 'Finances',
        author,
        audioUrl: 'https://storage.googleapis.com/studioprod-51a82.appspot.com/asset-manager/8e9d5607-e54f-4a43-85f0-62955f7c320d.mp3',
        resources: [
            {
                title: 'Section 7 Expense Tracking Checklist',
                url: '#',
                type: 'PDF'
            },
            {
                title: 'Sample Reimbursement Request Form',
                url: '#',
                type: 'DOCX'
            }
        ]
    },
    {
        slug: 'i-statement-advantage',
        title: 'The "I Statement" Advantage: Fulfilling the Duty to Protect Children from Parental Conflict',
        summary: 'Learn how to rephrase your communication to be more effective, less accusatory, and centered on your child\'s well-being, as required by the Divorce Act.',
        image: 'https://picsum.photos/seed/conversation/896/400',
        dataAiHint: 'calm conversation',
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
            <p>The <strong>AI Communication Coach</strong> in Harper\'s Place is designed to help you make this shift automatically. Here\'s how it works:</p>
            <blockquote class="border-l-4 border-accent pl-4 py-2 my-4">
                <p><strong>Before (Hostile):</strong> "Why are you always late?"</p>
                <p><strong>After (AI-Revised):</strong> "I get worried when the schedule isn\'t met because it disrupts Harper\'s routine. Can we confirm a time that works for you?"</p>
            </blockquote>
            <p>The revised message is impossible to argue with. It states a feeling ("I get worried"), identifies a child-centered problem ("it disrupts Harper\'s routine"), and proposes a collaborative solution ("Can we confirm a time?").</p>
            <p>Using tools like the AI Communication Coach isn\'t just about being polite; it\'s about actively fulfilling your legal duty to shield your child from conflict and demonstrating your fitness as a parent.</p>
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
        image: 'https://picsum.photos/seed/courthouse/896/400',
        dataAiHint: 'courthouse gavel',
        contentHtml: `
            <p>When family court matters become contentious, a judge\'s decision often comes down to credibility. Who can provide the most reliable account of events? Vague recollections and conflicting stories create doubt, but verifiable data provides clarity.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Problem with Screenshots and Emails</h3>
            <p>While better than nothing, screenshots of text messages and printed emails can be challenged. Dates can be altered, context can be removed, and authenticity can be questioned. They often devolve into a "he said, she said" argument, which frustrates the court and pulls focus away from the child\'s best interests.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Power of Immutable, Timestamped Records</h3>
            <p>Harper\'s Place is built on the principle of verifiable documentation. Every single entry—whether a message, an expense, or a daily log—is automatically given a secure, server-verified timestamp that cannot be altered. This creates an unchallengeable chronological record.</p>
            <p>When you use the <strong>Secure Communication Hub</strong> or the <strong>Daily Care Log</strong>, you are building a court-ready record that demonstrates:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Timeliness:</strong> When messages were sent and read.</li>
                <li><strong>Consistency:</strong> A pattern of responsible care and communication over time.</li>
                <li><strong>Accuracy:</strong> A factual log of events as they happened, not as they are remembered weeks later.</li>
            </ul>
            <p>As the New Brunswick justice system moves towards e-filing and digital evidence, presenting a clean, organized, and verifiable log from a neutral platform like Harper\'s Place gives you an enormous credibility advantage. It shows you are organized, transparent, and focused on facts—qualities any judge will appreciate.</p>
        `,
        date: '2025-11-06',
        category: 'Legal',
        author,
    },
    {
        slug: 'parenting-time-vs-decision-making',
        title: 'Beyond the Schedule: Understanding Parenting Time vs. Decision-Making Responsibility in NB',
        summary: 'The law in New Brunswick has changed. It\'s no longer about "custody" and "access." Learn what "parenting time" and "decision-making responsibility" mean for your family.',
        image: 'https://picsum.photos/seed/calendar/896/400',
        dataAiHint: 'calendar schedule',
        contentHtml: `
            <p>The language we use to talk about parenting after separation has changed, and for a good reason. The old terms "custody" and "access" often created a sense of "winning" or "losing." The updated <em>Divorce Act</em> shifts the focus to the child\'s experience by using two new key terms: <strong>Parenting Time</strong> and <strong>Decision-Making Responsibility</strong>.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Parenting Time</h3>
            <p>This is exactly what it sounds like: the time the child spends in the care of each parent. The schedule that outlines this is called a "parenting order." The focus is on the child\'s right to have time with each parent. The <strong>Smart Calendar</strong> in Harper\'s Place is designed to clearly and visually manage this schedule, making handovers and special events easy to track.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Decision-Making Responsibility</h3>
            <p>This refers to who has the right to make significant decisions about the child’s well-being. This can include choices about:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li>Health care</li>
                <li>Education</li>
                <li>Culture, language, religion, and spirituality</li>
                <li>Significant extracurricular activities</li>
            </ul>
            <p>This responsibility can be shared (joint) or sole. The <strong>Daily Care Log</strong> and <strong>Secure Communication Hub</strong> in Harper\'s Place provide the perfect space to discuss these important decisions and document the choices made, ensuring both parents are informed and a clear record is kept.</p>
            <p>This shift in language is more than just semantics; it\'s a move towards a more child-centered approach. It encourages parents to see themselves as a team, working together for their child, even when they are no longer together as a couple.</p>
        `,
        date: '2025-11-05',
        category: 'Legal',
        author,
    },
    {
        slug: 'new-brunswick-blueprint-guide',
        title: 'The New Brunswick Blueprint: Your Guide to Co-Parenting with Our App',
        summary: 'An introduction to the philosophy behind Harper\'s Place and how our tools are designed to build a stable, child-focused future for your family.',
        image: 'https://picsum.photos/seed/blueprint/896/400',
        dataAiHint: 'blueprint plans',
        contentHtml: `
            <p>Welcome to Harper\'s Place. We\'re not just another app; we\'re a comprehensive platform designed with a "child-first" philosophy. Our goal is to provide you with the tools to create what we call a "Stability Blueprint"—a clear, documented, and positive co-parenting plan that stands up to legal scrutiny and, more importantly, supports your child\'s well-being.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Four Pillars of the Stability Blueprint</h3>
            <p>Our features are designed to work together, creating a holistic and verifiable record of your co-parenting life.</p>
            <ol class="list-decimal list-inside space-y-2 my-4">
                <li><strong>AI-Mediated Communication:</strong> Our AI Communication Coach helps you remove conflict before it starts, ensuring your discussions are productive and child-focused. This fulfills your legal duty to protect your child from conflict.</li>
                <li><strong>Verifiable Documentation:</strong> From the Evidence Log to the Daily Care Log, every entry is timestamped and unalterable. This provides a single source of truth for all parenting matters.</li>
                <li><strong>Transparent Financials:</strong> The Harper\'s Fund simplifies Section 7 expenses, making them easy to track, categorize, and report. No more arguments over receipts.</li>
                <li><strong>Child-Centered Scheduling:</strong> The Smart Calendar keeps everyone on the same page, reducing confusion and ensuring your child\'s routine is predictable and stable.</li>
            </ol>
            <p>Whether you are in a high-conflict situation or simply want to be proactive and organized, Harper\'s Place provides the structure you need to build a positive co-parenting future. It\'s not about winning or losing; it\'s about building a better, more stable life for your child.</p>
        `,
        date: '2025-11-04',
        category: 'Parenting',
        author,
    },
    {
        slug: 'peaceful-bedtime-routine',
        title: 'From Chaos to Calm: Creating a Peaceful Bedtime Routine for Your Child',
        summary: 'Tired of bedtime battles? Discover simple, effective strategies to create a calming and consistent bedtime routine that helps your child (and you!) get the rest they need.',
        image: 'https://picsum.photos/seed/bedtime/896/400',
        dataAiHint: 'sleeping child',
        contentHtml: `
            <p>For many parents, bedtime can be the most stressful part of the day. But it doesn\'t have to be. A consistent and calming bedtime routine can make a world of difference, helping your child wind down and prepare for a restful night\'s sleep.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Magic of Consistency</h3>
            <p>Children thrive on routine. A predictable sequence of events helps them feel safe and secure. The key is to do the same things in the same order every night. This signals to your child\'s brain that it\'s time to sleep.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">A Sample Peaceful Bedtime Routine</h3>
            <p>Your routine doesn\'t have to be complicated. A simple 20-30 minute routine can work wonders. Here\'s a sample:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Warm Bath:</strong> A warm bath can be very relaxing and is a great way to start the winding-down process.</li>
                <li><strong>Pajamas and Teeth Brushing:</strong> Keep the lights low and the atmosphere calm.</li>
                <li><strong>Quiet Time:</strong> This is a great time for reading a book together, telling a story, or listening to some soft music. Avoid screens, as the blue light can interfere with sleep.</li>
                <li><strong>Cuddles and Goodnight:</strong> A final cuddle and a loving goodnight can help your child feel secure and loved as they drift off to sleep.</li>
            </ul>
            <p>The <strong>Daily Care Log</strong> in Harper\'s Place can be a great tool to track your child\'s sleep patterns. You can note what time they went to bed, how long it took them to fall asleep, and if they woke up during the night. This can help you identify patterns and see how your new routine is working.</p>
        `,
        date: '2025-11-03',
        category: 'Parenting',
        author,
    },
    {
        slug: 'digital-wellness-for-modern-family',
        title: 'Digital Wellness for the Modern Family: A Guide to Managing Screen Time',
        summary: 'In a world of endless scrolling and constant notifications, learn how to build a healthy relationship with technology for you and your children.',
        image: 'https://picsum.photos/seed/screentime/896/400',
        dataAiHint: 'tablet screen',
        contentHtml: `
            <p>Screens are everywhere. From tablets and TVs to phones and computers, managing technology has become one of the biggest challenges for modern parents. How do you find the right balance? It starts with a plan and a commitment to digital wellness.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Goal Isn\'t to Eliminate Screens, It\'s to Be Intentional</h3>
            <p>Technology is a tool. The key is to use it with purpose, not as a default way to pass the time. Here are some strategies:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Create "Screen-Free" Zones and Times:</strong> The dinner table and bedrooms are great places to start. This encourages more family conversation and better sleep habits.</li>
                <li><strong>Lead by Example:</strong> Put your own phone down when you are interacting with your children. Your habits will become their habits.</li>
                <li><strong>Choose Quality over Quantity:</strong> Not all screen time is created equal. Co-watching a documentary or playing an educational game together is very different from passive, endless scrolling.</li>
                <li><strong>Use Technology to Connect:</strong> Use video calls to connect with grandparents or other family members. Use shared calendars to plan fun family activities.</li>
            </ul>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">How Harper\'s Place Can Help</h3>
            <p>While Harper\'s Place is designed for co-parenting, its principles of intentional communication can benefit any family. By having a dedicated, secure platform for important family logistics, you reduce the need to scroll through distracting social media apps or messy email chains to find that one message about a doctor\'s appointment. It helps you be more organized and purposeful with your digital communication.</p>
        `,
        date: '2025-11-02',
        category: 'Wellness',
        author,
    },
    {
        slug: 'the-oxygen-mask-first-why-parental-self-care-isnt-selfish',
        title: 'The Oxygen Mask First: Why Parental Self-Care Isn\'t Selfish',
        summary: 'You can\'t pour from an empty cup. Learn why taking time for yourself is one of the most important things you can do for your children.',
        image: 'https://picsum.photos/seed/selfcare/896/400',
        dataAiHint: 'relaxing yoga',
        contentHtml: `
            <p>We\'ve all heard the flight attendant\'s instruction: "Secure your own oxygen mask before assisting others." This isn\'t a selfish act; it\'s a practical one. You can\'t help anyone if you are not in a position to do so. The same principle applies to parenting.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Why Parental Burnout is a Real Risk</h3>
            <p>Parenting is a marathon, not a sprint. The constant demands on your time, energy, and emotions can lead to burnout, which can manifest as:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li>Irritability and a short temper</li>
                <li>Feeling overwhelmed and emotionally exhausted</li>
                <li>Withdrawing from your children and partner</li>
                <li>A lack of enjoyment in parenting</li>
            </ul>
            <p>When you are burned out, you are not the parent you want to be. That\'s why self-care is not a luxury; it\'s a necessity.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">What Self-Care Can Look Like</h3>
            <p>Self-care doesn\'t have to mean a spa day (though it can!). It can be any activity that recharges your batteries. Here are some ideas:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Schedule "Me Time":</strong> Put it in your calendar, just like any other appointment. Even 15 minutes of uninterrupted time can make a difference.</li>
                <li><strong>Get Moving:</strong> A walk, a run, a bike ride, or a dance party in your living room can do wonders for your mental and physical health.</li>
                <li><strong>Connect with Other Adults:</strong> Make time for friends and conversation that isn\'t about your children.</li>
                <li><strong>Pursue a Hobby:</strong> Do something you enjoy, just for the sake of doing it.</li>
            </ul>
            <p>Even in a co-parenting situation, it is important to communicate your need for self-care. Using the <strong>Smart Calendar</strong> in Harper\'s Place, you can schedule time for yourself, ensuring that your children are cared for while you take the time you need to recharge.</p>
        `,
        date: '2025-11-01',
        category: 'Wellness',
        author,
    },
    {
        slug: 'picky-eaters-unite',
        title: 'Picky Eaters Unite: Tips and Tricks for Happier, Healthier Mealtimes',
        summary: 'From food chaining to a \'no-pressure\' approach, learn how to navigate the challenges of picky eating and make mealtimes more enjoyable for everyone.',
        image: 'https://picsum.photos/seed/vegetables/896/400',
        dataAiHint: 'vegetables kids',
        contentHtml: `
            <p>Is every meal a battle? You are not alone. Picky eating is a normal phase for many children, but it can be a major source of stress for parents. The good news is that there are strategies you can use to encourage your child to try new foods and make mealtimes more peaceful.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The \'No-Pressure\' Approach</h3>
            <p>The golden rule of feeding children is: <strong>You decide what, when, and where to eat. Your child decides whether and how much to eat.</strong> This is known as the Division of Responsibility in Feeding. When you try to force your child to eat, it can create a power struggle and make them more resistant to trying new things.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Tips for Success</h3>
            <p>Here are some tips to help you navigate the picky eating phase:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Food Chaining:</strong> This is a technique where you introduce new foods that are similar in taste, texture, or color to foods your child already likes. For example, if your child likes French fries, you might try introducing roasted sweet potato wedges.</li>
                <li><strong>Get Them Involved:</strong> Children are more likely to try foods they have helped to prepare. Let them wash vegetables, stir ingredients, or set the table.</li>
                <li><strong>Make it Fun:</strong> Use cookie cutters to make fun shapes, or arrange food in a smiley face. A little creativity can go a long way.</li>
                <li><strong>Family Meals:</strong> Eat together as a family as often as possible. Model healthy eating habits and talk about things other than food.</li>
            </ul>
            <p>The <strong>Daily Care Log</strong> in Harper\'s Place can be a helpful tool for tracking what your child is eating. You can note the foods they have tried, the ones they have enjoyed, and any patterns you notice. This can be especially helpful in a co-parenting situation, allowing both parents to be on the same page and work together to support the child\'s healthy eating habits.</p>
        `,
        date: '2025-10-31',
        category: 'Parenting',
        author,
    },
    {
        slug: 'the-power-of-play',
        title: 'The Power of Play: How Unstructured Play Helps Your Child Thrive',
        summary: 'In a world of scheduled activities, discover the importance of unstructured play for your child\'s development and well-being.',
        image: 'https://picsum.photos/seed/play/896/400',
        dataAiHint: 'kids playing',
        contentHtml: `
            <p>In our increasingly scheduled world, it can be easy to forget the importance of simple, unstructured play. But play is not just a way for children to pass the time; it is essential for their development. It is how they learn about the world, develop social and emotional skills, and build a strong sense of self.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">What is Unstructured Play?</h3>
            <p>Unstructured play is play that is not directed by an adult. It is child-led and open-ended. It can be as simple as building with blocks, playing make-believe, or running around in the backyard. The key is that the child is in charge.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Benefits of Play</h3>
            <p>The benefits of unstructured play are numerous:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Cognitive Development:</strong> Play helps children develop problem-solving skills, creativity, and a love of learning.</li>
                <li><strong>Social and Emotional Skills:</strong> Through play, children learn how to share, take turns, negotiate, and resolve conflicts. They also learn to understand and manage their emotions.</li>
                <li><strong>Physical Health:</strong> Active play is essential for developing strong muscles, a healthy heart, and good coordination.</li>
                <li><strong>Resilience:</strong> Play helps children develop the ability to bounce back from challenges and setbacks.</li>
            </ul>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Making Time for Play</h3>
            <p>In our busy world, it can be hard to find time for unstructured play. But it doesn\'t have to be complicated. Here are some tips:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Schedule Downtime:</strong> Just as you schedule other activities, make sure to schedule time for your child to simply play.</li>
                <li><strong>Provide Open-Ended Toys:</strong> Toys like blocks, art supplies, and dress-up clothes encourage creativity and imagination.</li>
                <li><strong>Get Outside:</strong> Nature is the ultimate playground. A trip to the park or a walk in the woods can provide endless opportunities for play.</li>
                <li><strong>Let Them Be Bored:</strong> Boredom can be a powerful motivator for creativity. Don\'t feel like you have to entertain your child every minute of the day.</li>
            </ul>
            <p>Using the <strong>Smart Calendar</strong> in Harper\'s Place, you can schedule time for play, ensuring that both parents are on the same page and that your child has the time and space they need to thrive.</p>
        `,
        date: '2025-10-30',
        category: 'Parenting',
        author,
    },
    {
        slug: 'talking-about-tough-topics',
        title: 'How to Talk to Your Kids About Tough Topics',
        summary: 'From divorce and death to bullying and bad news, here\'s how to approach difficult conversations in a way that is honest, reassuring, and age-appropriate.',
        image: 'https://picsum.photos/seed/talk/896/400',
        dataAiHint: 'serious talk',
        contentHtml: `
            <p>As a parent, you will inevitably have to talk to your children about difficult topics. Whether it\'s a family separation, a death in the family, or a scary news event, these conversations can be challenging. But with a little preparation and a lot of love, you can navigate them in a way that is honest, reassuring, and age-appropriate.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Create a Safe Space</h3>
            <p>The most important thing is to create a safe and supportive environment for your child to ask questions and share their feelings. Here are some tips:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Choose the Right Time and Place:</strong> Find a time when you won\'t be rushed or interrupted. Choose a place where your child feels comfortable and safe.</li>
                <li><strong>Listen More Than You Talk:</strong> Start by asking your child what they already know and what questions they have. This will help you tailor the conversation to their needs and understanding.</li>
                <li><strong>Validate Their Feelings:</strong> It\'s important to let your child know that whatever they are feeling is okay. Whether they are sad, angry, or scared, validate their emotions and let them know you are there for them.</li>
                <li><strong>Be Honest, But Age-Appropriate:</strong> You don\'t need to share all the details, but it\'s important to be honest. Use simple, concrete language and avoid euphemisms that can be confusing for children.</li>
            </ul>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Power of a United Front</h3>
            <p>In a co-parenting situation, it is crucial to be on the same page when it comes to difficult conversations. The <strong>Secure Communication Hub</strong> in Harper\'s Place can be a great tool for discussing these topics with your co-parent and coming up with a plan. This will ensure that you are both providing consistent and reassuring information to your child, which can make a world of difference in how they cope with difficult news.</p>
        `,
        date: '2025-10-29',
        category: 'Communication',
        author,
    },
    {
        slug: 'the-magic-of-reading-aloud',
        title: 'The Magic of Reading Aloud: More Than Just a Bedtime Story',
        summary: 'Discover the profound impact that reading to your child has on their development, from language and literacy to emotional bonding and a lifelong love of learning.',
        image: 'https://picsum.photos/seed/reading/896/400',
        dataAiHint: 'child reading',
        contentHtml: `
            <p>Reading aloud to your child is one of the most powerful things you can do to support their development. It is a simple act with profound benefits, laying the foundation for a lifelong love of learning and a strong parent-child bond.</p>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">The Many Benefits of Reading Aloud</h3>
            <p>The benefits of reading aloud are numerous and well-documented:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Language and Literacy:</strong> Reading aloud exposes children to new words and sentence structures, building their vocabulary and comprehension skills.</li>
                <li><strong>Brain Development:</strong> Reading aloud stimulates the parts of the brain that are associated with language and imagination.</li>
                <li><strong>Emotional Bonding:</strong> Cuddling up with a book is a wonderful way to connect with your child and create a sense of warmth and security.</li>
                <li><strong>A Love of Learning:</strong> When children associate reading with pleasure and connection, they are more likely to become lifelong learners.</li>
            </ul>
            <h3 class="font-headline uppercase text-xl mt-6 mb-2">Making Reading a Daily Habit</h3>
            <p>Here are some tips for making reading a regular part of your routine:</p>
            <ul class="list-disc list-inside space-y-2 my-4">
                <li><strong>Start Early:</strong> You can start reading to your child from birth. Even newborns benefit from the sound of your voice and the rhythm of the language.</li>
                <li><strong>Make it Fun:</strong> Use different voices for different characters. Ask questions and talk about the pictures.</li>
                <li><strong>Let Them Choose:</strong> Let your child choose the book sometimes. This gives them a sense of ownership and makes reading more enjoyable.</li>
                <li><strong>Don\'t Stop When They Can Read on Their Own:</strong> Continuing to read aloud to older children allows them to enjoy books that are above their reading level, and it provides a great opportunity for connection and conversation.</li>
            </ul>
            <p>The <strong>Daily Care Log</strong> in Harper\'s Place can be a great way to track the books you have read with your child. This can be a fun way to look back on all the stories you have shared and can be a great way to ensure that both parents are involved in this important activity.</p>
        `,
        date: '2025-10-28',
        category: 'Parenting',
        author,
    }
];

export function getallPosts() {
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
    return posts.find((post) => post.slug === slug);
}
