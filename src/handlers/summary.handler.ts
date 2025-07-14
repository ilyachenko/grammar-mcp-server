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

    combinedContent += `Please analyze the above ${files.length} files and provide a comprehensive summary covering:

1. Main grammar topics and patterns identified
2. Common errors or areas needing practice  
3. Key learning themes from the content
4. Recommended focus areas for improvement

Provide specific examples from the analyzed content to support your findings.`;

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