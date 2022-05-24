import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Products = ({ cat, filters, sort }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(
                    cat
                    ? `http://localhost:5000/api/v1/products?category=${cat}`
                    : "http://localhost:5000/api/v1/products"
                );
                setProducts(res.data);
            } catch (err) {}
        };
        getProducts();
    }, [cat]);

    useEffect(() => {
        cat &&
            setFilteredProducts(
                products.filter((item) =>
                        Object.entries(filters).every(([key, value]) =>
                            item[key].includes(value)
                        )
                )
            );
    }, [products, cat, filters]);

    useEffect(() => {
        if (sort === "newest") {
            setFilteredProducts((prev) =>
                [...prev].sort((a, b) => a.createdAt - b.createdAt)
            );
        } else if (sort === "asc") {
            setFilteredProducts((prev) =>
                [...prev].sort((a, b) => a.price - b.price)
            );
        } else {
            setFilteredProducts((prev) =>
                [...prev].sort((a, b) => b.price - a.price)
            );
        }
    }, [sort]);

    return (
        <div style={{textAlign:"center", marginTop:"20px", fontSize:"20px", fontWeight:"none"}}>
            <h2>Productos Destacados</h2>
            <Container>
                {cat
                ? filteredProducts.map((item) => <Product item={item} key={item.id} />)
                : products
                    .slice(0, 12)
                    .map((item) => <Product item={item} key={item.id} />)}
            </Container>
        </div>
    );
};

export default Products;