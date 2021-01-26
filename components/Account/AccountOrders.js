import {
  Header,
  Accordion,
  Label,
  Segment,
  Icon,
  Button,
  List,
  Image,
  Grid
} from "semantic-ui-react";
import { useRouter } from "next/router";
import formatDate from "../../utils/formatDate";

function AccountOrders({ orders }) {
  const router = useRouter();

  function mapOrdersToPanels(orders) {
    return orders.map(order => ({
      key: order._id,
      title: {
        content: <Label color="blue" content={formatDate(order.createdAt)} />
      },
      content: {
        content: (
          <>
            <List.Header as="h3">
              Total: ${order.total}
              <Label
                content={order.email}
                icon="mail"
                basic
                horizontal
                style={{ marginLeft: "1em" }}
              />
            </List.Header>
            <List>
              {order.products.map(p => (
                <List.Item key={p.product._id}>
                  <Image avatar src={p.product.mediaUrl} />
                  <List.Content>
                    <List.Header>{p.product.name}</List.Header>
                    <List.Description>
                      <p>Product Total:  {p.quantity} · ${p.price}</p>
                      <p>Delivery Total: ${(p.distance * p.deliveryPrice).toFixed(2)}</p>
                    </List.Description>
                  </List.Content>
                  <List.Content floated="right">
                    <Label tag color="red" size="tiny">
                      {p.product.sku}
                    </Label>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </>
        )
      }
    }));
  }

  return (
    <>
      <Header as="h2">
        <Icon name="folder open" />
        Order History
      </Header>
      {orders.length === 0 ? (
        <Segment textAlign="center">
          <Header icon>
            <Icon name="copy outline" color="grey" />
            <div className="sub header">No past orders.</div>
          </Header>
          <div>
            <Button onClick={() => router.push("/shop")} color="blue">
              Shop
            </Button>
          </div>
        </Segment>
      ) : (
          <Accordion
            fluid
            styled
            exclusive={false}
            panels={mapOrdersToPanels(orders)}
          />
        )}
    </>
  );
}

export default AccountOrders;
