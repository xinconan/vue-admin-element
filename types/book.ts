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
  id: number | string;
  name: string;
  author: string;
  translator?: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  cover: string;
  description: string;
  categoryId?: string;
  mediaType: string[];
}

export interface ICxRes {
  total: number;
  data: ICxBook[];
  publishers: Record<string, number>;
  pubdate: Record<string, number>;
}

export interface ICmpBook {
  id: number;
  isbn: string;
  name: string;
  writer: string;
  publishdate: string;
  cover: string;
}

export interface ICmpRes {
  module: ICmpBook[];
  otherResult: {
    count: number;
  };
}
