import { Add, Remove } from "@material-ui/icons";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useHistory } from "react-router";

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;

const Wrapper = styled.div`
    padding: 20px;
    ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`;

const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`;

const TopButton = styled.button`
    padding: 10px;
    font-weight: 600;
    cursor: pointer;
    border: ${(props) => props.type === "filled" && "none"};
    background-color: ${(props) =>
        props.type === "filled" ? "black" : "transparent"};
    color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
    ${mobile({ display: "none" })}
`;
const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`;

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
    flex: 3;
`;

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
    flex: 2;
    display: flex;
`;

const Image = styled.img`
    width: 200px;
`;

const Details = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
    ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`;

const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    height: 50vh;
`;

const SummaryTitle = styled.h1`
    font-weight: 200;
`;

const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${(props) => props.type === "total" && "500"};
    font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
    cursor: pointer;
`;

const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const [stripeToken, setStripeToken] = useState(null);
    const history = useHistory();

    const onToken = (token) => {
        setStripeToken(token);
    };

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await userRequest.post("/checkout/payment", {
                    tokenId: stripeToken.id,
                    amount: cart.total * 100,
                });
                history.push("/success", {
                    stripeData: res.data,
                    products: cart,
                });
            } catch {}
        };
        stripeToken && makeRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stripeToken, cart.total, history]);

    return (
        <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
            <Title>TU CARRITO</Title>
            <Top>
                <TopButton>SEGUIR COMPRANDO</TopButton>
                <TopTexts>
                    <TopText>Carrito de compras (2)</TopText>
                    <TopText>Tu lista de deseos (0)</TopText>
                </TopTexts>
                <TopButton type="filled">COMPRAR AHORA</TopButton>
            </Top>
            <Bottom>
                <Info>
                    {cart.products.map((product) => (
                        <Product>
                            <ProductDetail>
                                <Image src={product.img} />
                                <Details>
                                    <ProductName>
                                        <b>Producto:</b> {product.title}
                                    </ProductName>
                                    <ProductId>
                                        <b>ID:</b> {product._id}
                                    </ProductId>
                                </Details>
                            </ProductDetail>
                            <PriceDetail>
                                <ProductAmountContainer>
                                    <Remove />
                                    <ProductAmount>{product.quantity}</ProductAmount>
                                    <Add />
                                </ProductAmountContainer>
                                <ProductPrice>$ {product.price * product.quantity}</ProductPrice>
                            </PriceDetail>
                        </Product>
                    ))}
                    <Hr />
                </Info>
                <Summary>
                    <SummaryTitle>RESUMEN DEL PEDIDO</SummaryTitle>
                    <SummaryItem>
                        <SummaryItemText>Subtotal</SummaryItemText>
                        <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Estimación del envío</SummaryItemText>
                        <SummaryItemPrice>$ 15.000</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Descuento en el envío</SummaryItemText>
                        <SummaryItemPrice>$ -15.000</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem type="total">
                        <SummaryItemText>Total</SummaryItemText>
                        <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <StripeCheckout
                        locale="es"
                        currency="COP"
                        name="Toys"
                        image="https://cdn-icons-png.flaticon.com/512/1245/1245883.png?w=826"
                        billingAddress
                        shippingAddress
                        description={`El total es $${cart.total}`}
                        amount={cart.total * 100}
                        token={onToken}
                        stripeKey={KEY}
                    >
                        <Button>COMPRAR AHORA</Button>
                    </StripeCheckout>
                </Summary>
            </Bottom>
        </Wrapper>
        <Footer />
        </Container>
    );
};

export default Cart;