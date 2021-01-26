import React from "react";
import { Segment, Container } from "semantic-ui-react";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import { parseCookies } from "nookies";
import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

function Cart({ products, user }) {
  const [cartProducts, setCartProducts] = React.useState(products);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleRemoveFromCart(productId) {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get("token");
    const payload = {
      params: { productId },
      headers: { Authorization: token },
    };
    const response = await axios.delete(url, payload);
    setCartProducts(response.data);
  }

  return (
    <Container>
      <Segment loading={loading}>
        <CartItemList
          handleRemoveFromCart={handleRemoveFromCart}
          user={user}
          products={cartProducts}
          success={success}
        />
        <CartSummary products={cartProducts} success={success} user={user} />
      </Segment>
    </Container>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const url = `${baseUrl}/api/cart`;
  const payload = { headers: { Authorization: token } };
  const response = await axios.get(url, payload);
  return { products: response.data };
};

export default Cart;
