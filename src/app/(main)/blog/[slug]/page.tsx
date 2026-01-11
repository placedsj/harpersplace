
// src/app/(main)/blog/[slug]/page.tsx
import { getPostBySlug, getallPosts } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ArrowLeft, FileDown } from 'lucide-react';
import Link from 'next/link';

// Generate static pages for each blog post
export async function generateStaticParams() {
  const posts = getallPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft />
            Back to Blog
        </Link>
      <article>
        <header className="mb-8">
          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h1 className="text-4xl font-headline uppercase tracking-tight text-primary drop-shadow-md">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
            <span>•</span>
            <time dateTime={post.date}>{format(new Date(post.date), 'PPP')}</time>
          </div>
        </header>

        {post.audioUrl && (
          <Card className="mb-8 bg-muted/30">
            <CardContent className="p-4 flex items-center gap-4">
                <h3 className="font-headline uppercase text-lg">Listen to this post:</h3>
                 <audio controls className="w-full">
                    <source src={post.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="prose dark:prose-invert prose-lg max-w-none font-sans md:col-span-2" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          
          <aside className="md:col-span-1 space-y-6">
            {post.resources && post.resources.length > 0 && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="font-headline uppercase text-primary text-base">Court-Ready Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       {post.resources.map(resource => (
                         <a 
                            key={resource.title} 
                            href={resource.url} 
                            download
                            className="flex items-center gap-3 p-3 -mx-3 -my-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                            <FileDown className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm font-semibold text-primary">{resource.title}</p>
                                <p className="text-xs text-muted-foreground">Download {resource.type}</p>
                            </div>
                         </a>
                       ))}
                    </CardContent>
                </Card>
            )}
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline uppercase text-base">About the Author</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{post.author.name}</h3>
                        <p className="text-xs text-muted-foreground">{post.author.bio}</p>
                    </div>
                </CardContent>
            </Card>
          </aside>
        </div>
      </article>

    </div>
  );
}
