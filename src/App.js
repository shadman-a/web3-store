import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box,
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import ProductCard from "./productCard";
import MainCarousel from "./carousel";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import Modal from "react-bootstrap/Modal";
import { fetchJson } from "ethers/lib/utils";
import Table from "react-bootstrap/Table";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const [productJson, setProductJson] = useState([]);
  const [orderJson, setOrderJson] = useState([]);
  const [show, setShow] = useState(false);
  const [userOrderJson, setUserOrderJson] = useState([]);

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const fetchProducts = () => {
    fetch("http://localhost:3000/Products")
      .then((response) => response.json())
      .then((data) => setProductJson(data));
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account],
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };
  const handleClose = () => {setShow(false)
    setUserOrderJson([])
  };

  const modalHelper = () => {
    setShow(true);

    fetch("http://localhost:3000/Orders")
      .then((response) => response.json())
      .then((data) => setOrderJson(data));

    orderJson.map((order) =>
      order.aactId === account ? userOrderJson.push(order) : null
    );
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
    fetchProducts();
  }, []);

  return (
    <>
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">
              <Text
                margin="0"
                lineHeight="1.15"
                fontSize={[".25em", ".5em", "1.5/2em", "1em"]}
                fontWeight="200"
                sx={{
                  background:
                    "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Web3-React
              </Text>
            </Navbar.Brand>
            <Nav className="me-auto">
              {!active ? (
                <br />
              ) : (
                <Nav.Link
                  onClick={() => {
                    modalHelper();
                  }}
                >
                  My Orders
                </Nav.Link>
              )}
            </Nav>
            <HStack>
              {!active ? (
                <br />
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <Button>Account</Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>{account}</PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        {active && (
                          <HStack
                            justifyContent="flex-start"
                            alignItems="flex-start"
                          >
                            <Box
                              maxW="sm"
                              borderWidth="1px"
                              borderRadius="lg"
                              overflow="hidden"
                              padding="10px"
                            >
                              <VStack>
                                <Button
                                  onClick={switchNetwork}
                                  isDisabled={!network}
                                >
                                  Switch Network
                                </Button>
                                <Select
                                  placeholder="Select network"
                                  onChange={handleNetwork}
                                >
                                  <option value="3">Ropsten</option>
                                  <option value="4">Rinkeby</option>
                                  <option value="42">Kovan</option>
                                  <option value="1666600000">Harmony</option>
                                  <option value="42220">Celo</option>
                                </Select>
                              </VStack>
                            </Box>
                            <Box
                              maxW="sm"
                              borderWidth="1px"
                              borderRadius="lg"
                              overflow="hidden"
                              padding="10px"
                            >
                              <VStack>
                                <Button
                                  onClick={signMessage}
                                  isDisabled={!message}
                                >
                                  Sign Message
                                </Button>
                                <Input
                                  placeholder="Set Message"
                                  maxLength={20}
                                  onChange={handleInput}
                                  w="140px"
                                />
                                {signature ? (
                                  <Tooltip label={signature} placement="bottom">
                                    <Text>{`Signature: ${truncateAddress(
                                      signature
                                    )}`}</Text>
                                  </Tooltip>
                                ) : null}
                              </VStack>
                            </Box>
                            <Box
                              maxW="sm"
                              borderWidth="1px"
                              borderRadius="lg"
                              overflow="hidden"
                              padding="10px"
                            >
                              <VStack>
                                <Button
                                  onClick={verifyMessage}
                                  isDisabled={!signature}
                                >
                                  Verify Message
                                </Button>
                                {verified !== undefined ? (
                                  verified === true ? (
                                    <VStack>
                                      <CheckCircleIcon color="green" />
                                      <Text>Signature Verified!</Text>
                                    </VStack>
                                  ) : (
                                    <VStack>
                                      <WarningIcon color="red" />
                                      <Text>Signature Denied!</Text>
                                    </VStack>
                                  )
                                ) : null}
                              </VStack>
                            </Box>
                          </HStack>
                        )}
                      </PopoverBody>
                      <PopoverFooter></PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover>
              )}
            </HStack>
            <br />
            <HStack>
              {!active ? (
                <Button onClick={onOpen}>Connect Wallet</Button>
              ) : (
                <Button onClick={disconnect}>Disconnect</Button>
              )}
            </HStack>
          </Container>
        </Navbar>
      </>
      <MainCarousel />
      <VStack justifyContent="center" alignItems="center">
        <HStack marginBottom="10px"></HStack>
        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {active ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>

          <Tooltip label={account} placement="right">
            <Text>{`Account: ${truncateAddress(account)}`}</Text>
          </Tooltip>
          <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
        </VStack>

        <Text>{error ? error.message : null}</Text>
        <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
        <Container>
          <Row>
            {productJson.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Row>
        </Container>
      </VStack>
      <>
        {" "}
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Orders</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              {userOrderJson.map((order) => (
                <tbody>
                  <tr>
                    <td>{order.id}</td>
                    <td>{order.aactId}</td>
                    <td>{order.productid}</td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}
