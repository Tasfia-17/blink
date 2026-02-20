export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isPinned: boolean;
  template?: string;
}
