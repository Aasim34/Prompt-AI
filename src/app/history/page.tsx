
'use client';

import { useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, FileText, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormattedPrompt } from '@/components/generator/formatted-prompt';
import { Badge } from '@/components/ui/badge';

function HistoryItemCard({ item, type }: { item: any; type: 'prompt' | 'analysis' }) {
  const isPrompt = type === 'prompt';
  const title = isPrompt ? item.ideaInput : item.mainClaim;
  const timestamp = item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : 'Just now';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <CardTitle className="text-lg flex items-center">
                    {isPrompt ? <FileText className="mr-2 h-5 w-5 text-primary" /> : <BarChart2 className="mr-2 h-5 w-5 text-primary" />}
                    {title}
                </CardTitle>
                <CardDescription>{timestamp}</CardDescription>
            </div>
            {isPrompt && <Badge variant="secondary">{item.outputGoal}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {isPrompt ? (
            <div className="p-4 bg-secondary/50 rounded-md">
                <p className="whitespace-pre-wrap text-sm font-sans">{item.generatedPrompt}</p>
            </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Combined Score:</strong> {item.combinedScore}/100</p>
            <p className="text-muted-foreground text-sm line-clamp-2">{item.personaEvaluations?.[0]?.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const promptsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, `users/${user.uid}/prompts`),
        orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const analysesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, `users/${user.uid}/analyses`),
        orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: prompts, isLoading: promptsLoading } = useCollection(promptsQuery);
  const { data: analyses, isLoading: analysesLoading } = useCollection(analysesQuery);

  const isLoading = isUserLoading || promptsLoading || analysesLoading;

  const renderSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      ))}
    </div>
  );
  
  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-12">
        <Bot className="h-12 w-12 mb-4" />
        <p>{message}</p>
    </div>
  )

  if (!isUserLoading && !user) {
    return (
        <>
            <PageHeader
                title="History"
                subtitle="Your saved prompts and analyses will appear here."
            />
            <div className="container py-12">
                <Alert>
                    <AlertTitle>Please Log In</AlertTitle>
                    <AlertDescription>
                        You need to be logged in to view your history.
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
  }

  return (
    <>
      <PageHeader
        title="My History"
        subtitle="Review your previously generated prompts and analyses."
      />
      <div className="container py-12">
        <Tabs defaultValue="prompts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompts">Generated Prompts</TabsTrigger>
            <TabsTrigger value="analyses">Argument Analyses</TabsTrigger>
          </TabsList>
          <TabsContent value="prompts" className="mt-6">
            {isLoading ? renderSkeleton() : !prompts || prompts.length === 0 ? renderEmptyState("You haven't generated any prompts yet.") : (
              <div className="grid gap-6 md:grid-cols-2">
                {prompts.map((item) => (
                  <HistoryItemCard key={item.id} item={item} type="prompt" />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="analyses" className="mt-6">
             {isLoading ? renderSkeleton() : !analyses || analyses.length === 0 ? renderEmptyState("You haven't analyzed any arguments yet.") : (
              <div className="grid gap-6 md:grid-cols-2">
                {analyses.map((item) => (
                  <HistoryItemCard key={item.id} item={item} type="analysis" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
