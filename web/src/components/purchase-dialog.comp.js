/* eslint-disable */
import React from 'react'
import { Modal, Form, Row, Col, Container, Card, Image} from "react-bootstrap"
import { useState } from "react"
import { Button } from "@chakra-ui/react"

function PurchaseDialog(props) {

  const { item } = props
  const purchaseData = {
    "name": item.name,
    "address": item.address,
    "imageUrl": item.imageUrl,
    "color": item.color,
    "info": item.info,
    "quantity": item.quantity,
    "series": item.series
  }
  const [show, setShow] = useState(false)
  const [nftData] = useState(purchaseData)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onHandleSubmit = (e) => {
    e.preventDefault()
    handleClose()
  };
  const onHandleChange = (e) => {
    e.preventDefault()
    nftData[e.target.name] = e.target.value
  }
  return (
    <>
      <Button colorScheme="blue" size="sm" onClick={handleShow}>
        Buy
      </Button>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>PURCHASE</Modal.Title>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Header>
        <Form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <Card border="dark" className="mb-2 bg-grey">
            <Card.Body>
                <Row>
                    <Col xs={3}><Image src={item.metadata.imageUrl} rounded fluid="true" /></Col>
                    <Col xs={9}>
                        <div className="mb-1">Name: {item.metadata.name}</div>
                        <div className="mb-1">Color: {item.metadata.color}</div>
                        <div className="mb-1">Price: {item.price}$</div>
                        <div className="mb-1">Available: {item.metadata.quantity}</div>
                    </Col>
                </Row>
            </Card.Body>
          </Card>
          <text>You are about to purchase Hand of Fate form Jango. Check information below to proceed.</text>
          <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Quantity:
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="quantity" value={item.metadata.quantity} onChange={onHandleChange} />
              </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Price:
              </Form.Label>
              <Col sm="9">
                <Form.Control type="number" name="price" value={item.price} onChange={onHandleChange} />
              </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button colorScheme="teal" type="submit" onClick={item.buy}>Purchase</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default PurchaseDialog
