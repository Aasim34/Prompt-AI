
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { handleGenerateAppPlan } from './actions';
import type { GenerateAppPlanOutput } from '@/ai/flows/generate-app-plan';
import { useToast } from '@/hooks/use-toast';
import { Bot, Check, Code, Copy, FileText, Layers, ListChecks, Wand2, Database, ShieldCheck, Aperture, UploadCloud, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  description: z
    .string()
    .min(20, {
      message: 'Please describe your app idea in at least 20 characters.',
    })
    .max(1000, {
      message: 'Your description is too long. Please keep it under 1000 characters.',
    }),
});

function AppPlanDisplay({ plan }: { plan: GenerateAppPlanOutput }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    let planText = `
App Name: ${plan.appName}
Tagline: ${plan.tagline}

Core Features:
${plan.coreFeatures.map(f => `- ${f}`).join('\n')}

Tech Stack:
- Frontend: ${plan.techStack.frontend}
- Backend: ${plan.techStack.backend}
- Database: ${plan.techStack.database}
- Authentication: ${plan.techStack.authentication}

Data Models:
${plan.dataModels.map(m => `
${m.name}:
${m.properties.map(p => `  - ${p}`).join('\n')}
`).join('')}

Pages:
${plan.pages.map(p => `- ${p.name} (${p.path}): ${p.description}`).join('\n')}
`;

    if (plan.databaseSetup?.length) {
        planText += `\nDatabase Setup:\n${plan.databaseSetup.map(s => `- ${s}`).join('\n')}`;
    }
    if (plan.authenticationSetup?.length) {
        planText += `\nAuthentication Setup:\n${plan.authenticationSetup.map(s => `- ${s}`).join('\n')}`;
    }
    if (plan.apiIntegrations?.length) {
        planText += `\nAPI Integrations:\n${plan.apiIntegrations.map(api => `- ${api.name}: ${api.reason}`).join('\n')}`;
    }
     if (plan.deploymentSteps?.length) {
        planText += `\nDeployment Steps:\n${plan.deploymentSteps.map(s => `- ${s}`).join('\n')}`;
    }

    navigator.clipboard.writeText(planText.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const InstructionList = ({ steps }: { steps: string[] }) => (
    <ul className="list-decimal list-inside bg-secondary/50 p-4 rounded-md space-y-3">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
    </ul>
  );

  return (
    <Card className="prompt-glow">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl">{plan.appName}</CardTitle>
                    <CardDescription>{plan.tagline}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center"><ListChecks className="mr-2 h-5 w-5" />Core Features</h3>
            <ul className="list-disc list-inside bg-secondary/50 p-4 rounded-md space-y-2">
                {plan.coreFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
            </ul>
        </div>
        
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center"><Layers className="mr-2 h-5 w-5" />Tech Stack</h3>
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                    <p className="font-semibold">Frontend</p>
                    <p className="text-muted-foreground">{plan.techStack.frontend}</p>
                </Card>
                <Card className="p-4">
                    <p className="font-semibold">Backend</p>
                    <p className="text-muted-foreground">{plan.techStack.backend}</p>
                </Card>
                 <Card className="p-4">
                    <p className="font-semibold">Database</p>
                    <p className="text-muted-foreground">{plan.techStack.database}</p>
                </Card>
                 <Card className="p-4">
                    <p className="font-semibold">Authentication</p>
                    <p className="text-muted-foreground">{plan.techStack.authentication}</p>
                </Card>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center"><Code className="mr-2 h-5 w-5" />Data Models</h3>
            <div className="space-y-4">
            {plan.dataModels.map((model) => (
                <Card key={model.name}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                         <ul className="list-disc list-inside text-muted-foreground">
                           {model.properties.map((prop, i) => <li key={i}><Badge variant="outline" className="mr-2">{prop.split(':')[1]?.trim()}</Badge> {prop.split(':')[0]}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center"><FileText className="mr-2 h-5 w-5" />Pages & Routes</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plan.pages.map((page) => (
                        <TableRow key={page.path}>
                            <TableCell className="font-medium">{page.name}</TableCell>
                            <TableCell><Badge variant="secondary">{page.path}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{page.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        
        {plan.databaseSetup?.length && (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center"><Database className="mr-2 h-5 w-5" />Database Setup</h3>
                <InstructionList steps={plan.databaseSetup} />
            </div>
        )}

        {plan.authenticationSetup?.length && (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center"><ShieldCheck className="mr-2 h-5 w-5" />Authentication Setup</h3>
                <InstructionList steps={plan.authenticationSetup} />
            </div>
        )}

        {plan.apiIntegrations?.length && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Aperture className="mr-2 h-5 w-5" />
              API Integrations
            </h3>
            <div className="space-y-6">
              {plan.apiIntegrations.map((api) => (
                <Card key={api.name}>
                    <CardHeader>
                        <CardTitle>{api.name}</CardTitle>
                        <CardDescription>{api.reason}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Setup Instructions</h4>
                            <InstructionList steps={api.setupInstructions} />
                        </div>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Security Warning</AlertTitle>
                            <AlertDescription>
                                {api.securityWarning}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {plan.deploymentSteps?.length && (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center"><UploadCloud className="mr-2 h-5 w-5" />Deployment Steps</h3>
                <InstructionList steps={plan.deploymentSteps} />
            </div>
        )}

      </CardContent>
    </Card>
  );
}


export default function BuilderPage() {
  const [loading, setLoading] = useState(false);
  const [appPlan, setAppPlan] = useState<GenerateAppPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAppPlan(null);
    const result = await handleGenerateAppPlan({ description: values.description });
    setLoading(false);

    if (result.success && result.plan) {
      setAppPlan(result.plan);
    } else {
      toast({
        title: 'Error Generating Plan',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  const LoadingState = () => (
    <div className="space-y-8 mt-12">
        <Skeleton className="h-10 w-1/2" />
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
        </div>
         <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
        </div>
         <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-16 w-full" />
        </div>
    </div>
  )

  return (
    <>
      <PageHeader
        title="AI App Builder"
        subtitle="Describe the full-stack application you want to build, and let AI generate the master plan."
      />
      <div className="container max-w-4xl py-12">
        <div className="space-y-8">
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A social media app for sharing book recommendations. Users can create profiles, post reviews, and follow other users."
                            className="min-h-[150px] text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    <Wand2 className="mr-2 h-5 w-5" />
                    {loading ? 'Generating Plan...' : 'Generate App Plan'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {loading && <LoadingState />}

          {appPlan && (
            <div className="mt-12">
              <AppPlanDisplay plan={appPlan} />
            </div>
          )}

          {!loading && !appPlan && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full border border-dashed rounded-lg p-12 mt-8">
                <Bot className="h-12 w-12 mb-4" />
                <p>Your generated application plan will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
