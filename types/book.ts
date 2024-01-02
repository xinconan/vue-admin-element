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

export interface ICxRes{
  total: number;
  data: ICxBook[];
  publishers: object;
  pubdate: object;
}