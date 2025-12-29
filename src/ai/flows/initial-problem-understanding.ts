'use server';

/**
 * @fileOverview A flow to understand the initial problem of the device using multimedia input.
 *
 * - initialProblemUnderstanding - A function that handles the initial problem understanding process.
 * - InitialProblemUnderstandingInput - The input type for the initialProblemUnderstanding function.
 * - InitialProblemUnderstandingOutput - The return type for the initialProblemUnderstanding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialProblemUnderstandingInputSchema = z.object({
  deviceCategory: z.string().describe('The category of the device (e.g., Phone, Laptop, AC, Fridge, Cooler).'),
  problemDescription: z.string().describe('A description of the problem.'),
  mediaDataUri: z
    .string()
    .optional()
    .describe(
      "A photo or video of the device problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InitialProblemUnderstandingInput = z.infer<typeof InitialProblemUnderstandingInputSchema>;

const InitialProblemUnderstandingOutputSchema = z.object({
  refinedProblemDescription: z.string().describe('A refined description of the problem, incorporating insights from the media.'),
  estimatedPriceRange: z.string().describe('An estimated price range for the repair.'),
});
export type InitialProblemUnderstandingOutput = z.infer<typeof InitialProblemUnderstandingOutputSchema>;

export async function initialProblemUnderstanding(input: InitialProblemUnderstandingInput): Promise<InitialProblemUnderstandingOutput> {
  return initialProblemUnderstandingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialProblemUnderstandingPrompt',
  input: {schema: InitialProblemUnderstandingInputSchema},
  output: {schema: InitialProblemUnderstandingOutputSchema},
  prompt: `You are an expert technician specializing in diagnosing electronic and home appliance issues. Based on the device category, problem description, and any provided media (photo or video), provide a refined problem description and an estimated repair price range.

Device Category: {{{deviceCategory}}}
Problem Description: {{{problemDescription}}}
{{#if mediaDataUri}}
Media: {{media url=mediaDataUri}}
{{/if}}

Refined Problem Description: [A more detailed and accurate description of the problem]
Estimated Price Range: [An estimated price range for the repair, e.g., ₹1,200 - ₹3,000]`,
});

const initialProblemUnderstandingFlow = ai.defineFlow(
  {
    name: 'initialProblemUnderstandingFlow',
    inputSchema: InitialProblemUnderstandingInputSchema,
    outputSchema: InitialProblemUnderstandingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
