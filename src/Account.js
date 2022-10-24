import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function AccountPage() {
  return (
    <>
    <Card style={{ width: "18rem" }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
        crossorigin="anonymous"
      />
      <Card.Img
        variant="top"
        src="https://media-cdn.tripadvisor.com/media/photo-p/11/a3/c2/a7/photo1jpg.jpg"
      />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="success">Buy This</Button>
      </Card.Body>
    </Card>
    <br/>
    </>
  );
}
