export type Book = {
    id: string;
    author_id: string;
    author_name: string;
    amount: number;
    published_year: number;
    country_origin: string;
    desc: string;
    genre: string;
    type: string;
    digital_link: string;
    date_added: string;
    date_published: string;
    tags: string[];
    status: 'unavailable' | 'present';
  };