'''
import { z } from 'zod';
import { defineFlow, action } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/googleai';
import { geminiPro } from 'genkitx-googleai';

// 1. Define the output schema with Zod
const TransitionSummarySchema = z.object({
  title: z.string().describe("A brief, neutral title for the summary. e.g., 'Summary of Sunday with Dad' or 'Weekend Update'."),
  childsMood: z.string().describe("A one-sentence, neutral summary of the child's overall mood and well-being during the transition period."),
  activities: z.array(z.string()).describe("A bulleted list of the main activities the child participated in."),
  healthAndWellness: z.string().describe("Any notes on health, meals, sleep, or medication. State 'No issues to report' if none were mentioned."),
  headsUpForTheWeek: z.string().describe("A forward-looking summary of things the other parent should know for the upcoming week (e.g., 'Harper mentioned a school project due Friday' or 'Seems a bit tired, might need an early night'). State 'Nothing specific to note' if not applicable."),
  fullSummary: z.string().describe("A concise, neutral, paragraph-form summary of the day, written in a friendly but non-emotional tone, suitable for sharing directly with a co-parent.")
});

// 2. Define the Genkit flow
export const generateTransitionSummaryFlow = defineFlow(
  {
    name: 'generateTransitionSummaryFlow',
    inputSchema: z.string().describe("The parent's free-form text or 'ramble' about their time with the child."),
    outputSchema: TransitionSummarySchema.describe("The structured, neutral summary of the transition period."),
  },
  async (prompt) => {

    const llmResponse = await action(
        {
            name: 'createTransitionSummary',
            inputSchema: z.string(),
            outputSchema: TransitionSummarySchema,
        },
        async (prompt) => {
            // 3. Configure the model and the prompt
            const llm = googleAI({ model: geminiPro });
            const result = await llm.generate({
                prompt: `You are an expert co-parenting communication assistant. Your purpose is to help parents in high-conflict situations share important information about their child in a neutral, factual, and child-focused manner.

                    A parent will provide a free-form "ramble" about their time with their child. Your task is to transform this ramble into a structured, easy-to-read transition summary for the other parent.

                    The summary MUST be:
                    - **Neutral:** Do not use emotional, accusatory, or subjective language.
                    - **Factual:** Stick to the events and information provided.
                    - **Child-Focused:** The summary should be about the child's experience, not the parent's.
                    - **Brief and Clear:** Use simple language and the structured format required.

                    Analyze the following parent's notes and generate the transition summary based on the schema.

                    PARENT'S NOTES:
                    "${prompt}"
                `,
                output: {
                    schema: TransitionSummarySchema,
                }
            });

            return result.output()!;
        }
    )(prompt);

    return llmResponse;
  }
);
'''