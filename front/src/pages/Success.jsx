import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";

const Success = () => {
    const location = useLocation();
    const data = location.state.stripeData;
    const cart = location.state.cart;
    const currentUser = useSelector((state) => state.user.currentUser);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const createOrder = async () => {
            try {
                const res = await userRequest.post("/orders", {
                    userId: currentUser._id,
                    products: cart.products.map((item) => ({
                        productId: item._id,
                        quantity: item._quantity,
                    })),
                    amount: cart.total,
                    address: data.billing_details.address,
                });
                setOrderId(res.data._id);
            } catch {}
        };
        data && createOrder();
    }, [cart, data, currentUser]);

    return (
        <div
        style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        {orderId
            ? `El pedido se ha creado con éxito. Su número de pedido es ${orderId}`
            : `Completado con éxito. Su pedido se está preparando...`}
        <Link to={"/"}>
            <button style={{ padding: 10, marginTop: 20 }}>Ir a la pagina principal</button>
        </Link>
        </div>
    );
};

export default Success;