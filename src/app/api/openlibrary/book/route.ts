import { NextRequest, NextResponse } from "next/server";

type OpenLibraryBook = {
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

type OpenLibraryDescription = string | { value?: string };

type OpenLibraryEditionResponse = {
  title?: string;
  subtitle?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  physical_format?: string;
  languages?: Array<{ key?: string }>;
  covers?: number[];
  description?: OpenLibraryDescription;
  subjects?: string[];
  authors?: Array<{ key?: string }>;
};

type OpenLibraryAuthorResponse = {
  name?: string;
};

export async function GET(request: NextRequest) {
  const isbn = request.nextUrl.searchParams.get("isbn")?.trim();

  if (!isbn) {
    return NextResponse.json({ error: "Missing isbn query parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`, {
      cache: "no-store",
    });

    const edition = (await response.json()) as OpenLibraryEditionResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Open Library request failed (HTTP ${response.status})`,
        },
        { status: response.status }
      );
    }

    const authorNames = await Promise.all(
      (edition.authors ?? []).map(async (author) => {
        if (!author?.key) return null;

        try {
          const authorRes = await fetch(`https://openlibrary.org${author.key}.json`, {
            cache: "no-store",
          });
          if (!authorRes.ok) return null;
          const authorData = (await authorRes.json()) as OpenLibraryAuthorResponse;
          return authorData.name ?? null;
        } catch {
          return null;
        }
      })
    );

    const description =
      typeof edition.description === "string"
        ? edition.description
        : edition.description?.value;

    const languageCodes = (edition.languages ?? [])
      .map((lang) => lang.key?.split("/").pop())
      .filter(Boolean)
      .join(", ");

    const mappedBook: OpenLibraryBook = {
      title: edition.title,
      title_long: edition.subtitle ? `${edition.title}: ${edition.subtitle}` : edition.title,
      isbn: edition.isbn_10?.[0] ?? isbn,
      isbn13: edition.isbn_13?.[0],
      binding: edition.physical_format,
      publisher: edition.publishers?.[0],
      language: languageCodes || undefined,
      date_published: edition.publish_date,
      pages: edition.number_of_pages,
      image: edition.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${edition.covers[0]}-L.jpg`
        : undefined,
      synopsis: description,
      subjects: edition.subjects,
      authors: authorNames.filter((name): name is string => Boolean(name)),
    };

    return NextResponse.json(mappedBook);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach Open Library service at the moment" },
      { status: 502 }
    );
  }
}
