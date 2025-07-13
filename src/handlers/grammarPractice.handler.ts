import * as fs from 'fs';
import * as path from 'path';

export function handleGrammarPracticeTool() {
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

    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];
    const fileContent = fs.readFileSync(randomFile.path, 'utf8');

    return {
      content: [
        {
          type: 'text',
          text: `Selected file: ${randomFile.name}

Content:
${fileContent}

To validate the knowledge of student generating *ONLY the ONE* grammar practice question based on the provided content.
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