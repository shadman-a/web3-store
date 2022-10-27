import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useWeb3React } from "@web3-react/core";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";


export default function ProductCard(product) {
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBuy=()=>{
      setShow(false)  
      const rawResponse = fetch('http://localhost:3000/Orders', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({productid: product.product.id, aactId: account})
    });
     
    }
  

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
        src={product.product.image}
      />
      <Card.Body>
        <Card.Title>{product.product.title}</Card.Title>
        <Card.Text>
          {product.product.price}
        </Card.Text>
        {!active ? (
                <Button >Log in to buy</Button>
              ) : (
                <Button onClick={handleShow} variant="success">Buy This</Button>
              )}
        
      </Card.Body>
      <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body> `Buy {product.product.title} for ${product.product.price}` </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBuy}>
            Buy Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    </Card>
    <br/>
    </>
  );
}
