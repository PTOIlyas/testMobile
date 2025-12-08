export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image?: string | null;    
  urlToImage?: string | null;  
  publishedAt: string;
}


export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}
