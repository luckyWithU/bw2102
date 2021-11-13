import React, { useState } from 'react'
import { Modal, Form, Row, Col, Container } from "react-bootstrap"
import { Button, Spacer } from "@chakra-ui/react"
import {useAccountItems} from "../hooks/use-account-items.hook"
import {useInitialized} from "../hooks/use-initialized.hook"

const PublishForm = (props) => {
  const { user } = props
  const init = useInitialized(user.addr)

  const initialNftData = {
    "name": "",
    "address": user.addr,
    "imageUrl": "r52hb.png",
    "color": "",
    "info": "",
    "quantity": "1",
    "series": "1"
  }
  const [show, setShow] = useState(false)
  const [nftData] = useState(initialNftData)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  
  const items = useAccountItems(user.addr)
  

  const onHandleSubmit = (e) => {
    e.preventDefault()
    handleClose()
    items.mint(nftData)
  };

  const onHandleChange = (e) => {
    e.preventDefault();
    nftData[e.target.name] = e.target.value
  }
  return (
    <>
      <Container className="mt-4 mb-1">
        <Button disabled={!init.isInitialized} colorScheme="pink" variant="outline" onClick={handleShow}>
          Mint
        </Button>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Mint a NFT</Modal.Title>
          <Button variant="" onClick={handleClose}> Close </Button>
        </Modal.Header>
        <Form onSubmit={onHandleSubmit}>
        <Modal.Body>
            {/* ------------- Name ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Name
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="name" placeholder="Name" onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Address ----------------- */}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3">
                Address
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="address" value={user.addr} placeholder="Address" onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Image URL ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Image URL
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="imageUrl" placeholder="ImageURL" value={initialNftData.imageUrl} onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Color ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Color
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="color" placeholder="Color" onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Info ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Info
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="info" placeholder="Info" onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Quantity  ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Quantity
              </Form.Label>
              <Col sm="9">
                <Form.Control type="number" name="quantity" placeholder="Quantity" value={initialNftData.quantity} onChange={onHandleChange} required />
              </Col>
            </Form.Group>

            {/* ------------- Series  ----------------- */}
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm="3">
                Series
              </Form.Label>
              <Col sm="9">
                <Form.Control type="name" name="series" placeholder="Series" value={initialNftData.series} onChange={onHandleChange} required />
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Spacer />
          <Button colorScheme="teal" isLoading={props.isSubmitting} type="submit"> submit to chain </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default PublishForm
