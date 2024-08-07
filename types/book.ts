export interface ICxBook {
  ruid: string;
  title: string;
  author: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  imgUrl: string;
  abstract: string;
}

export interface IBook {
  id: number;
  name: string;
  author: string;
  translator: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  cover: string;
  description: string;
  categoryId?: string;
  mediaType: string[];
}

export interface ICxRes{
  total: number;
  data: ICxBook[];
  publishers: Record<string, number>;
  pubdate: Record<string, number>;
}