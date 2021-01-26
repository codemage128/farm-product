import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { parseCookies } from "nookies";
import { Link } from 'next/link'
import baseUrl from "../utils/baseUrl";
import GoogleMapReact from "google-map-react";
import swal from "sweetalert";
import {
  Icon,
  Grid,
  Table,
  Image,
  Button,
  Container,
} from "semantic-ui-react";


class myProductsForSale extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  async handleProductView() {
    const url = `${baseUrl}/api/farmOrder`;

    order.status = "delivered";

    const payload = {
      order,
    };

    try {
      await axios.put(url, payload);
      this.setState({ orders: this.state.orders });
    } catch (e) {}
  }

  render() {
    return (
      <Container>
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column>
              <h1>Products For Sale</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table compact celled selectable>
                <Table.Header>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell>SKU</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Image</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Quantity in Inventory</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.props.productSales.map((product) => {
                    return (
                      <Table.Row textAlign="center" key={product._id}>
                        <Table.Cell>{product.sku}</Table.Cell>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>
                          <Image src={product.mediaUrl} size='small' centered />
                        </Table.Cell>
                        <Table.Cell>{product.description}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>{product.inventoryQuantity}</Table.Cell>
                        <Table.Cell>
                          <Button
                            className="productSalesBtn"
                            icon
                            labelPosition="left"
                            primary
                            size="small"
                            href={`/product?_id=` + product._id}
                          >
                            <Icon name="eye" /> View
                          </Button>
                          <Button
                            className="productSalesBtn"
                            icon
                            labelPosition="left"
                            secondary
                            size="small"
                            href={`/editProduct?_id=` + product._id}
                          >
                            <Icon name="pencil" /> Edit
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

myProductsForSale.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/myProductsForSale`;
  const response = await axios.get(url, payload);
  
  return response.data;
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(myProductsForSale);
