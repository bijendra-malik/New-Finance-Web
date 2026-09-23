export interface DocSection {
  id: string;
  title: string;
  docs: { name: string; note?: string }[];
}
