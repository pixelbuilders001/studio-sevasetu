'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting the most suitable technician for a repair request.
 *
 * It uses the problem description and technician availability to make the prediction.
 *
 * @module src/ai/flows/technician-assignment-prediction
 *
 * @typedef {object} TechnicianAssignmentInput
 * @property {string} problemDescription - A description of the problem reported by the user.
 *
 * @typedef {object} TechnicianAssignmentOutput
 * @property {string} technicianId - The ID of the most suitable technician.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechnicianAssignmentInputSchema = z.object({
  problemDescription: z.string().describe('A description of the problem reported by the user.'),
});
export type TechnicianAssignmentInput = z.infer<typeof TechnicianAssignmentInputSchema>;

const TechnicianAssignmentOutputSchema = z.object({
  technicianId: z.string().describe('The ID of the most suitable technician.'),
});
export type TechnicianAssignmentOutput = z.infer<typeof TechnicianAssignmentOutputSchema>;

export async function predictTechnicianAssignment(input: TechnicianAssignmentInput): Promise<TechnicianAssignmentOutput> {
  return technicianAssignmentFlow(input);
}

const technicianAssignmentPrompt = ai.definePrompt({
  name: 'technicianAssignmentPrompt',
  input: {schema: TechnicianAssignmentInputSchema},
  output: {schema: TechnicianAssignmentOutputSchema},
  prompt: `You are an expert in assigning technicians to repair requests.

  Given the following problem description, determine the most suitable technician ID.

  Problem Description: {{{problemDescription}}}

  Consider technician availability and expertise when making your decision.

  Return only the technicianId.`,
});

const technicianAssignmentFlow = ai.defineFlow(
  {
    name: 'technicianAssignmentFlow',
    inputSchema: TechnicianAssignmentInputSchema,
    outputSchema: TechnicianAssignmentOutputSchema,
  },
  async input => {
    const {output} = await technicianAssignmentPrompt(input);
    return output!;
  }
);
