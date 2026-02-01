
// src/app/(main)/blog/page.tsx
import { getallPosts } from '@/lib/blog-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  const posts = getallPosts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">The New Brunswick Blueprint Blog</h1>
        <p className="text-lg font-sans text-accent mt-1 tracking-wide">
          Actionable co-parenting strategies for New Brunswick families.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
            <Card className="h-full overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:shadow-2xl group-hover:-translate-y-1">
                {post.image && (
                    <div className="overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                            data-ai-hint={post.dataAiHint}
                        />
                    </div>
                )}
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <CardTitle className="font-headline text-2xl uppercase group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription className="font-sans text-sm">{format(new Date(post.date), 'PPP')} • by {post.author.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                <div className="font-headline uppercase text-sm text-primary flex items-center gap-1">
                  Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
