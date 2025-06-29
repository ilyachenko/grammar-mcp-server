export function handleGrammarPracticeTool(args: any) {
  try {
    if (!args?.file_content) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: file_content is required',
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `To validate the knowledge of student generating *ONLY the ONE* grammar practice question based on the provided content.
          The question should be clear and concise, focusing on a specific grammar point.
          The question should be in the form of a fill-in-the-blank or multiple-choice format.
          The question should be relevant to the content provided, but not directly copied from it.
          The question should be clear and concise, and should not contain any unnecessary information or distractions.
          If student answers the question correctly, provide a brief explanation of why the answer is correct and ask next question.
          If student answers the question incorrectly, provide a brief explanation of why the answer is incorrect and ask next question.`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to generate questions: ${error}`,
        },
      ],
      isError: true,
    };
  }
}