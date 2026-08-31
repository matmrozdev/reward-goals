export type GoalAccent = 'primary' | 'success';

export type GoalPreviewIcon =
  | 'book-open-page-variant'
  | 'chat-processing'
  | 'notebook-outline'
  | 'shoe-sneaker';

export type GoalPreview = {
  accent: GoalAccent;
  completed: boolean;
  icon: GoalPreviewIcon;
  id: string;
  latestTodayProgressEntryId?: string | null;
  metadata?: string;
  metadataIcon?: 'clock-outline' | 'fire';
  progress?: {
    current: number;
    target: number;
  };
  scheduleLabel: string;
  title: string;
};
