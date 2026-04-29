"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Book from "./book";

type ApiBook = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  availableCopies: number;
};

type IsbnDbBookDetails = {
  title?: string;
  title_long?: string;
  isbn?: string;
  isbn13?: string;
  dewey_decimal?: string;
  binding?: string;
  publisher?: string;
  language?: string;
  date_published?: string;
  edition?: string;
  pages?: number;
  image?: string;
  msrp?: number;
  synopsis?: string;
  subjects?: string[];
  authors?: string[];
};

export default function Page() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [selectedBook, setSelectedBook] = useState<ApiBook | null>(null);
  const [bookDetails, setBookDetails] = useState<IsbnDbBookDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
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

  useEffect(() => {
    async function loadBookDetails() {
      if (!selectedBook?.isbn) {
        setBookDetails(null);
        setDetailsError("");
        return;
      }

      setDetailsLoading(true);
      setDetailsError("");

      try {
        const res = await fetch(`/api/openlibrary/book?isbn=${encodeURIComponent(selectedBook.isbn)}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || `Failed to fetch Open Library details (HTTP ${res.status})`);
        }

        setBookDetails(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load Open Library book details";
        setDetailsError(message);
        setBookDetails(null);
      } finally {
        setDetailsLoading(false);
      }
    }

    void loadBookDetails();
  }, [selectedBook]);

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

      {selectedBook ? (
        <section className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Book Details</h4>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setSelectedBook(null);
                setBookDetails(null);
                setDetailsError("");
              }}
            >
              ← Back to list
            </button>
          </div>

          {detailsLoading ? <p>Loading selected book details from Open Library...</p> : null}
          {detailsError ? <p className="text-danger">{detailsError}</p> : null}
          {!detailsLoading && !detailsError && bookDetails ? <Book book={bookDetails} /> : null}
        </section>
      ) : null}

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
                      <td>
                        <button
                          type="button"
                          className="btn btn-link p-0 align-baseline"
                          onClick={() => setSelectedBook(book)}
                          disabled={!book.isbn}
                          title={book.isbn ? "View full details" : "ISBN not available for this book"}
                        >
                          {book.title}
                        </button>
                      </td>
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
