import styled from "styled-components";
import { categories } from "../data";
import { mobile } from "../responsive";
import CategoryItem from "./CategoryItem";


const Container = styled.div`
    display: flex;
    padding: 20px;
    justify-content: space-between;
    ${mobile({ padding: "0px", flexDirection:"column" })}
`;

const Categories = () => {
    return (
        <div style={{textAlign:"center", marginTop:"20px", fontSize:"20px"}}>
            <h2>Categorias</h2>
            <Container>
                {categories.map((item) => (
                    <CategoryItem item={item} key={item.id}/>
                ))}
            </Container>
        </div>
    );
};

export default Categories;