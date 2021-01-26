import React from "react";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";
import { useRouter } from "next/router";

function CartSummary({ products, success }) {
  const router = useRouter();
  const [cartAmount, setCartAmount] = React.useState(0);
  const [isCartEmpty, setCartEmpty] = React.useState(false);

  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total:</strong> ${cartAmount}
        <Button
          icon="cart"
          disabled={isCartEmpty || success}
          color="blue"
          floated="right"
          content="Checkout"
          onClick={() => router.push(`/checkout`)}
        />
      </Segment>
    </>
  );
}

export default CartSummary;
