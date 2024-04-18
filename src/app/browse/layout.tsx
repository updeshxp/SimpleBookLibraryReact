import SideNav from "@/app/browse/sidenav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="p-3">
      <Row>
        <Col xs={4}>
          <SideNav />
        </Col>
        <Col xs={8}>{children}</Col>
      </Row>
    </Container>
  );
}
