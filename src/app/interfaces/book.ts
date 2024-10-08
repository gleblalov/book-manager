export interface IBook {
  id: number
  title: string;
  author: string;
  year?: string;
  image?: string | ArrayBuffer | null;
  description?: string;
}

export interface IBookApi {
  title: string;
  author: string;
  year?: string;
  image?: string | ArrayBuffer | null;
  description?: string;
}
