import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Welcome to the {process.env.appName} &nbsp;
          <code className={styles.code}>
            {"<"}Currently in Development{">"}
          </code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js Logo"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <Container>
        <Row className={styles.search}>
          <InputGroup
            style={{ width: "1000px" }}
            className="mx-auto px-2 input-group-lg"
          >
            <FormControl
              list="datalistOptions"
              id="bookListSearch"
              placeholder="Search Library Books..."
            />
            <datalist id="datalistOptions">
              <option value="Kent's Homeopathy" />
              <option value="Germany" />
              <option value="India" />
              <option value="Homeopathy for Life" />
              <option value="Chicago" />
            </datalist>
            <Button className="btn btn-primary" variant="primary">
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
        </Row>
      </Container>

      <div className={styles.grid}>
        <Link className={styles.card} href="/about">
          <h2>
            About Us <span>-&gt;</span>
          </h2>
          <p>Find more information about us and Contact Info.</p>
        </Link>

        <Link className={styles.card} href="/browse">
          <h2>
            Browse <span>-&gt;</span>
          </h2>
          <p>Explore available Books and Authors.</p>
        </Link>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
