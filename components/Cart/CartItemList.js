import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message,
  Grid,
  Label
} from "semantic-ui-react";
import { useRouter } from "next/router";
import c from "../../utils/constants"

const DELIVERYMETHODS = c.DELIVERYMETHODS;

function CartItemList({ products, user, handleRemoveFromCart, success }) {
  const router = useRouter();

  function mapCartProductsToItems(products) {
    return products.map(p => ({
      childKey: p._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `Delivery: ${DELIVERYMETHODS.find(d => d.type === p.deliveryType).text}  ( $${p.deliveryPrice} / ${p.deliveryUnit} )`,
      description: (
        <Label color="teal">Product Total: {p.quantity} x ${p.product.price} each</Label>
      ),
      fluid: "true",
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      )
    }));
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Segment textAlign="center" placeholder>
        <Header icon>
          <Icon color="grey" name="shopping basket" />
          <div className="sub header">No products in your cart. Add some!</div>
        </Header>
        <div>
          {user ? (
            <Button color="blue" onClick={() => router.push("/shop")}>
              Shop
            </Button>
          ) : (
              <Button color="blue" onClick={() => router.push("/login")}>
                Login to Add Products
              </Button>
            )}
        </div>
      </Segment>
    );
  }

  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
