import * as fs from 'fs';
import * as path from 'path';

export function handleSummaryTool() {
  try {
    const dataDir = path.join(__dirname, '../../data');

    if (!fs.existsSync(dataDir)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Data directory does not exist',
          },
        ],
        isError: true,
      };
    }

    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        name: file,
        path: path.join(dataDir, file),
        mtime: fs.statSync(path.join(dataDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .slice(0, 10);

    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No files found in data directory',
          },
        ],
      };
    }

    let combinedContent = `Last ${files.length} files content for analysis:\n\n`;

    files.forEach((file, index) => {
      const content = fs.readFileSync(file.path, 'utf8');
      combinedContent += `=== File ${index + 1}: ${file.name} ===\n`;
      combinedContent += `${content}\n\n`;
    });

    combinedContent += `Please analyze the above ${files.length} files and then create an interactive grammar game based on your analysis. Follow this structure:

FIRST: Provide a brief analysis summary covering:
1. Main grammar topics and patterns identified
2. Common errors or areas needing practice
3. Key learning themes from the content

SECOND: Generate a React component for an interactive grammar game. Create 20 practice questions that target grammar gaps identified in the analysis:
- Focus on the grammar areas where mistakes or confusion were found in the files
- Create NEW practice questions that test understanding of these problem areas (don't copy exact sentences from the files)
- Design questions that help reinforce the correct usage of identified weak points
- Include proper explanations for each answer that address the specific grammar concepts
- Are categorized by grammar topic (e.g., "Articles", "Verb Tenses", "Prepositions")
- Have appropriate priority levels (HIGH, MEDIUM-HIGH, MEDIUM, LOW) based on how frequently errors appear in the content

IMPORTANT: Add keyboard controls to the game:
- Use keys 'a', 's', 'd', 'f' to select answer options (A, B, C, D respectively)
- Use 'Enter' key to go to the next question after an answer is selected
- Add visual indicators showing which key corresponds to which answer option
- Ensure keyboard controls work throughout the game

The game should be a complete React component that can be copied and used immediately. Make sure to:
- Replace the sample questions with questions derived from your analysis
- Set an appropriate title and description based on the content themes
- Include detailed explanations that reference the analyzed material
- Ensure questions test understanding of the specific grammar points found in the files

Format the React component as a code block for easy copying.`;

    return {
      content: [
        {
          type: 'text',
          text: combinedContent,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to generate summary: ${error}`,
        },
      ],
      isError: true,
    };
  }
}