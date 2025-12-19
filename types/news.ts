export interface NewsArticle {
  id: string,
  title: string;
  description: string;
  url: string;
  image?: string | null;    
  urlToImage?: string | null;  
  publishedAt: string;
  source:{
    name:string
  },
}


export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface FavoriteArticle extends NewsArticle {
  query: string; // "sports" | "science" | ...
}
