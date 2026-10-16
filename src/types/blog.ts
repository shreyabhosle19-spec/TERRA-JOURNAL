export type Category = 
  | 'All'
  | 'Architecture'
  | 'Field Notes'
  | 'Material Craft'
  | 'Urban Ecology'
  | 'Essays'
  | 'Interviews';

export interface ArticleSection {
  id: string;
  heading?: string;
  paragraphs: string[];
  callout?: {
    type: 'quote' | 'margin-note' | 'stat';
    text: string;
    citation?: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, 'All'>;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  image: string;
  imageCaption: string;
  pullQuote: string;
  pullQuoteAuthor?: string;
  excerpt: string;
  tableOfContents: { id: string; title: string }[];
  sections: ArticleSection[];
  likes: number;
  tags: string[];
  featuredTier: 'lead' | 'secondary' | 'standard';
}

export type ThemeMode = 'archival' | 'gallery' | 'noir';
export type FontSize = 'normal' | 'large' | 'larger';
