import { ContextBlock, RichTextBlock, RichTextStyleable, TableBlock } from '@slack/types';

type PlayerRow = {
  player_name: string | null;
  rank: number;
  score: number;
  oldRank?: number;
  oldScore?: number;
};

const cell = ({ text, style }: { text: string; style?: RichTextStyleable['style'] }): RichTextBlock => ({
  type: 'rich_text',
  elements: [
    {
      type: 'rich_text_section',
      elements: [
        {
          type: 'text',
          text,
          ...(style && { style }),
        },
      ],
    },
  ],
});

const formatDiff = (oldValue: number, newValue: number, direction: 'asc' | 'desc') => {
  const diff = direction === 'asc' ? newValue - oldValue : oldValue - newValue;
  if (Math.abs(diff) <= 0.5) {
    return '';
  }
  return ` (${diff > 0 ? '+' : ''}${diff.toFixed(0)})`;
};

export const formatPlayerRow = ({ player_name, rank, score, oldRank, oldScore }: PlayerRow): RichTextBlock[] => {
  return [
    cell({ text: `${rank}.${oldRank ? formatDiff(oldRank, rank, 'desc') : ''}` }),
    cell({ text: `${player_name}` }),
    cell({ text: `${score.toFixed(0)}${oldScore ? formatDiff(oldScore, score, 'asc') : ''}` }),
  ];
};

export const formatPlayerTable = (rows: PlayerRow[]): TableBlock => ({
  type: 'table',
  rows: [
    [
      cell({ text: 'Rank', style: { bold: true } }),
      cell({ text: 'Player', style: { bold: true } }),
      cell({ text: 'Score', style: { bold: true } }),
    ],
    ...rows.map(formatPlayerRow),
  ],
});

export const formatContext = (text: string): ContextBlock => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text,
    },
  ],
});
