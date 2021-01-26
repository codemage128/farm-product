import { Item, Label, Divider, Header, Grid } from "semantic-ui-react";
import AddProductToCart from "./AddProductToCart";

function ProductSummary(products) {
  const { name, _id, price, sku, includedProducts, inventoryQuantity, deliveryMethods } = products.product;
  const user = products.user
  const farmProduct = products.farmProduct;

  return (
    <Item.Group>
      <Item>
        <Item.Content>
          <Item.Header><h1>{name}</h1></Item.Header>
          <Item.Description>
            <p>${price}</p>
            <Label>SKU: {sku}</Label>
          </Item.Description>
          <Item.Extra>
            <AddProductToCart 
              user={user} 
              productId={_id}
              price={price}
              deliveryMethods={deliveryMethods}
            />
          </Item.Extra>
          <Divider hidden />
          <Item.Description>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header>Included Products</Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                {includedProducts.map((item, index) => {
                  return (
                    <Grid.Column key={item._id}>
                      <p>{farmProduct[index].name}</p>
                      <p>{item.quantity} {item.unit}</p>
                      <Divider />
                    </Grid.Column>
                  );
                })}
              </Grid.Row>
            </Grid>
            <Label>Quantity in Inventory: {inventoryQuantity}</Label>
          </Item.Description>
        </Item.Content>
      </Item >
    </Item.Group >
  );
}

export default ProductSummary;
