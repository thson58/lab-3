import {Container,Button,Nav,Navbar,NavDropdown,Row,Carousel,Col,Card,Modal,Alert,} from "react-bootstrap";
import img1 from "./Images/pizza1.jpg";
import img2 from "./Images/pizza2.jpg";
import img3 from "./Images/pizza3.jpg";
import img4 from "./Images/pizza4.jpg";
import menu1 from "./Images/menu1.jpg";
import menu2 from "./Images/menu2.jpg";
import menu3 from "./Images/menu3.jpg";
import menu4 from "./Images/menu4.jpg";
import { useEffect, useState, useReducer } from "react";

const initialState = {
  cart: [],
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": // Add product to cart
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };

    case "INCREMENT_QUANTITY": // Increase the number of products in the cart
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREMENT_QUANTITY": // Reduce the number of products in the cart
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };

    case "REMOVE_FROM_CART": // Remove product from cart
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
};
// END REDUCER

// SHOW MODAL
function MyVerticallyCenteredModal({
  cart,
  show,
  onHide,
  dispatch,
  setShowAlert,
}) {
 // Function to calculate the total of all products
  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       {/* Check if there are any products in the cart */}
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <Row key={item.id} className="mb-3">
                <Col md={3}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                </Col>
                <Col md={5}>
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                  <p>
                    Price:{" "}
                    <span style={{ color: "red", fontWeight: "500" }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </p>{" "}
                </Col>
                <Col md={4} className="d-flex align-items-center">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      dispatch({ type: "DECREMENT_QUANTITY", payload: item.id })
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      dispatch({ type: "INCREMENT_QUANTITY", payload: item.id })
                    }
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => {
                      dispatch({ type: "REMOVE_FROM_CART", payload: item.id });
                      setShowAlert(true);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <h5>
              Total Price:{" "}
              <span
                style={{ color: "red", fontSize: "30px", fontWeight: "500" }}
              >
                {calculateTotalPrice()}$
              </span>
            </h5>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
// END SHOW MODAL

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Notification status

  const [state, dispatch] = useReducer(reducer, initialState);

 // After 3 seconds the notification will turn off automatically
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
      <Container>
        {/* Alert Notification */}
        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            Product removed from cart successfully!
          </Alert>
        )}

        {/* NAVBAR */}
        <Row>
          <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
              <Navbar.Brand href="#">Pizza House</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">About us</Nav.Link>
                  <NavDropdown title="Contact" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                  Order now:{" "}
                  <span>
                    {state.cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </Button>
                <MyVerticallyCenteredModal
                  cart={state.cart}
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  dispatch={dispatch}
                  setShowAlert={setShowAlert} // Show notification
                />
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>
        {/*END NAVBAR */}

        {/*Carousel */}
        <Row>
          <Carousel slide={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={img1} alt="First slide" />
              <Carousel.Caption>
                <h3>Neapolitan Pizza</h3>
                <p>
                  if you are looking for a traditional Italian pizza, the
                  Neapolitan is the best option
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={img2} alt="Second slide" />
              <Carousel.Caption>
                <h3>Neapolitan Pizza</h3>
                <p>
                  if you are looking for a traditional Italian pizza, the
                  Neapolitan is the best option
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={img3} alt="Third slide" />
              <Carousel.Caption>
                <h3>Neapolitan Pizza</h3>
                <p>
                  if you are looking for a traditional Italian pizza, the
                  Neapolitan is the best option
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={img4} alt="Third slide" />
              <Carousel.Caption>
                <h3>Neapolitan Pizza</h3>
                <p>
                  if you are looking for a traditional Italian pizza, the
                  Neapolitan is the best option
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
        {/*END Carousel */}

        {/* CARD  */}
        <div className="container p-5">
          <h1 className="text-left p-3">Our Menu</h1>
          <div className="d-flex">
            <Card style={{ width: "18rem" }} className="mx-3">
              <Card.Img variant="top" src={menu1} />
              <Card.Body>
                <Card.Title>Margenrita Pizza</Card.Title>
                <Card.Text>Price: $19.99</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        id: 1,
                        title: "Margenrita Pizza",
                        description: "Margenrita Pizza",
                        price: 19.99,
                        thumbnail: menu1,
                      },
                    })
                  }
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
            <Card style={{ width: "18rem" }} className="mx-3">
              <Card.Img variant="top" src={menu2} />
              <Card.Body>
                <Card.Title>Mushroom Pizza</Card.Title>
                <Card.Text>Price: $19.99</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        id: 2,
                        title: "Mushroom Pizza",
                        description: "Mushroom Pizza",
                        price: 19.99,
                        thumbnail: menu2,
                      },
                    })
                  }
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
            <Card style={{ width: "18rem" }} className="mx-3">
              <Card.Img variant="top" src={menu3} />
              <Card.Body>
                <Card.Title>Hawaiian Pizza</Card.Title>
                <Card.Text>Price: $19.99</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        id: 3,
                        title: "Hawaiian Pizza",
                        description: "Hawaiian Pizza",
                        price: 19.99,
                        thumbnail: menu3,
                      },
                    })
                  }
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
            <Card style={{ width: "18rem" }} className="mx-3">
              <Card.Img variant="top" src={menu4} />
              <Card.Body>
                <Card.Title>Pesto Pizza</Card.Title>
                <Card.Text>Price: $19.99</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: {
                        id: 4,
                        title: "Pesto Pizza",
                        description: "Pesto Pizza",
                        price: 19.99,
                        thumbnail: menu4,
                      },
                    })
                  }
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* END CARD  */}
      </Container>
    </>
  );
}

export default App;
