"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

type ApiBook = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  availableCopies: number;
};

export default function HomeBookSearch() {
  const router = useRouter();
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      setError("");

      try {
        const res = await fetch("http://localhost:8080/api/books", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch books (HTTP ${res.status})`);
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load books";
        setError(message);
        setBooks([]);
      }
    }

    void loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return books;

    return books.filter((book) => {
      const values = [book.title, book.author, book.id, book.isbn, book.publishedYear];
      return values.some((value) =>
        String(value)
          .toLowerCase()
          .includes(term)
      );
    });
  }, [books, query]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/browse/books?query=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputGroup style={{ width: "1000px" }} className="mx-auto px-2 input-group-lg">
          <FormControl
            list="datalistOptions"
            id="bookListSearch"
            placeholder="Search Library Books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <datalist id="datalistOptions">
            {filteredBooks.slice(0, 10).map((book) => (
              <option key={book.id} value={book.title}>
                {book.author}
              </option>
            ))}
          </datalist>
          <Button className="btn btn-primary" variant="primary" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </Button>
        </InputGroup>
      </form>

      {error ? <p className="text-danger mt-2 mb-0 text-center">{error}</p> : null}
    </>
  );
}