// src/ai/flows/co-parenting-actions.ts

/**
 * @fileOverview An AI agent for handling co-parenting scheduling actions.
 *
 * - coParentingActions - A function that analyzes a message and suggests actions.
 * - CoParentingActionsInput - The input type for the coParentingActions function.
 * - CoParentingActionsOutput - The return type for the coParentingActions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const scheduleAction = ai.defineTool(
    {
      name: 'scheduleAction',
      description: 'Use this tool to propose a scheduling action to the other parent, such as requesting time, swapping a date, or confirming a plan. This creates a formal request that can be logged.',
      inputSchema: z.object({
          title: z.string().describe('A short, clear title for the action button, e.g., "Request Weekend Swap" or "Confirm Holiday Plan".'),
          type: z.enum(['request', 'confirm', 'propose_swap']).describe('The type of scheduling action.'),
          details: z.string().describe('A summary of the request details, including dates and times.'),
      }),
      outputSchema: z.void(),
    },
    async () => {} // This is a placeholder; in a real app, this would interact with a database.
);

const CoParentingActionsInputSchema = z.object({
  text: z.string().describe('The user message regarding a scheduling issue or request.'),
});
export type CoParentingActionsInput = z.infer<typeof CoParentingActionsInputSchema>;

const CoParentingActionsOutputSchema = z.object({
    text: z.string().describe("The AI's generated response to the user's message."),
    tool_requests: z.array(z.any()).optional().describe("A list of tool requests, if any, suggested by the AI."),
});
export type CoParentingActionsOutput = z.infer<typeof CoParentingActionsOutputSchema>;

export async function coParentingActions(input: CoParentingActionsInput): Promise<CoParentingActionsOutput> {
  return coParentingActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coParentingActionsPrompt',
  tools: [scheduleAction],
  prompt: `You are an AI mediator for co-parents. Your role is to facilitate clear, actionable communication.
  
  1.  Analyze the user's message.
  2.  If the message involves a specific scheduling request (like swapping dates, asking for a different time, or confirming a plan), you MUST use the 'scheduleAction' tool to create a clear, actionable proposal.
  3.  Generate a brief, supportive response to the user that acknowledges their message.
  
  Example:
  User: "Hey, I have a wedding on the 10th of next month, any chance I could take Harper that weekend instead of my usual one?"
  AI Response: "Of course, planning ahead is great. Here is a formal proposal you can send to make that change."
  AI Tool Call: scheduleAction({ title: "Propose Weekend Swap", type: "propose_swap", details: "Swap scheduled weekend for the weekend of the 10th of next month." })

  User Message:
  "{{{text}}}"
  `,
});

const coParentingActionsFlow = ai.defineFlow(
  {
    name: 'coParentingActionsFlow',
    inputSchema: CoParentingActionsInputSchema,
    outputSchema: CoParentingActionsOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const text = response.text;
    const toolRequests = response.toolRequests;

    return {
        text: text,
        tool_requests: toolRequests?.map(tr => ({name: tr.toolRequest.name, args: tr.toolRequest.input}))
    };
  }
);
