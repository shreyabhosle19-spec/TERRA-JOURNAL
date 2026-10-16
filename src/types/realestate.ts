export type ArticleCategory =
  | 'All'
  | 'Investment Strategy'
  | 'Luxury Market'
  | 'Finance & Lending'
  | 'Restoration & Heritage'
  | 'Urban Living'
  | 'Sustainable Homes'
  | 'Buyer Playbook';

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

export interface RealEstateArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: Exclude<ArticleCategory, 'All'>;
  readTime: string;
  date: string;
  targetBudgetTier: string;
  recommendedBudgetMax: number;
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
  relatedPropertyIds: string[];
}

export interface PropertyListing {
  id: string;
  title: string;
  tagline: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: 'Single Family' | 'Architectural Modern' | 'Waterfront Villa' | 'Historic Townhouse' | 'Luxury Penthouse' | 'Eco-Passive Residence';
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  image: string;
  yearBuilt: number;
  lotSize: string;
  estimatedHoaMonthly: number;
  propertyTaxAnnual: number;
  description: string;
  features: string[];
  architecturalStyle: string;
  walkScore: number;
  matchingArticleId?: string;
}

export interface BudgetState {
  maxBudget: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyTypeFilter: string;
}

export type FontSize = 'normal' | 'large' | 'larger';
