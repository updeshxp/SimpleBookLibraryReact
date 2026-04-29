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

export default function Book({ book }: { book: IsbnDbBookDetails }) {
  const title = book.title_long || book.title || "Untitled";
  const subtitle =
    book.title_long && book.title && book.title_long !== book.title
      ? book.title
      : "";

  return (
    <article className="card shadow-sm border-0">
      <div className="row g-0">
        <div className="col-md-3 p-3 d-flex align-items-start justify-content-center bg-light">
          {book.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.image}
              alt={title}
              className="img-fluid rounded"
              style={{ maxHeight: "320px", objectFit: "contain" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center border rounded text-muted"
              style={{ width: "100%", maxWidth: 180, height: 260 }}
            >
              No cover image
            </div>
          )}
        </div>

        <div className="col-md-9">
          <div className="card-body">
            <h3 className="card-title mb-1">{title}</h3>
            {subtitle ? <p className="text-muted mb-3">{subtitle}</p> : null}

            <p className="mb-2">
              <strong>Author(s): </strong>
              {book.authors?.length ? book.authors.join(", ") : "N/A"}
            </p>

            {book.synopsis ? <p className="card-text mb-3">{book.synopsis}</p> : null}

            <div className="row">
              <div className="col-sm-6">
                <p className="mb-1"><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
                <p className="mb-1"><strong>ISBN-13:</strong> {book.isbn13 || "N/A"}</p>
                <p className="mb-1"><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
                <p className="mb-1"><strong>Published:</strong> {book.date_published || "N/A"}</p>
                <p className="mb-1"><strong>Edition:</strong> {book.edition || "N/A"}</p>
              </div>

              <div className="col-sm-6">
                <p className="mb-1"><strong>Binding:</strong> {book.binding || "N/A"}</p>
                <p className="mb-1"><strong>Language:</strong> {book.language || "N/A"}</p>
                <p className="mb-1"><strong>Pages:</strong> {book.pages ?? "N/A"}</p>
                <p className="mb-1"><strong>Dewey Decimal:</strong> {book.dewey_decimal || "N/A"}</p>
                <p className="mb-1"><strong>MSRP:</strong> {book.msrp ? `$${book.msrp}` : "N/A"}</p>
              </div>
            </div>

            {book.subjects?.length ? (
              <div className="mt-3">
                <strong>Subjects:</strong>
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {book.subjects.map((subject) => (
                    <span key={subject} className="badge rounded-pill text-bg-secondary">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
