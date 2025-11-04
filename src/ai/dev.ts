
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-prompt.ts';
import '@/ai/flows/refine-generated-prompt.ts';
import '@/ai/flows/analyze-argument.ts';
