"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ApiBook = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  availableCopies: number;
};

export default function Page() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }

    void loadBooks();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return books;

    return books.filter((book) => {
      const values = [
        book.title,
        book.author,
        book.id,
        book.isbn,
        book.publishedYear,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [books, query]);

  return (
    <section>
      <h2 className="mb-3">Books</h2>

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search by title, author, ISBN, or id..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading ? <p>Loading books...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!isLoading && !error ? (
        filteredBooks.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Published Year</th>
                  <th>Available Copies</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => {
                  const id = book.id ?? `book-${index}`;
                  return (
                    <tr key={String(id)}>
                      <td>{book.id}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.publishedYear}</td>
                      <td>{book.availableCopies}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No books found.</p>
        )
      ) : null}
    </section>
  );
}
