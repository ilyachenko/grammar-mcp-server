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

    combinedContent += `Please analyze the above ${files.length} files and provide a comprehensive summary that includes:
1. Main topics and themes discussed
2. Key insights and learnings
3. Common patterns or recurring elements
4. Progress or evolution of topics over time
5. Any notable trends or changes
6. Overall assessment and recommendations

Provide a structured summary that would be useful for understanding the overall content and identifying important points.`;

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