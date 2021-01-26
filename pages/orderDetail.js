import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import {
    Grid,
    Table,
    Container,
    Image,
    Label,
    Segment
} from "semantic-ui-react";

class orderDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleStatus() {
        const status = this.props.status;
        if (status === 'notdelivered') {
            return <Label color='red' className="orderDetailLable">Not Delivered</Label>
        } else {
            return <Label as='a' color='teal' className="orderDetailLable">Delivered</Label>
        }
    }

    render() {
        return (
            <Container>
                <Segment>
                    <Grid columns="equal" stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <h1>Order Detail</h1>
                                {this.handleStatus()}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Table compact celled selectable>
                                    <Table.Header>
                                        <Table.Row textAlign="center">
                                            <Table.HeaderCell>Farm Product</Table.HeaderCell>
                                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                                            <Table.HeaderCell>Included Products</Table.HeaderCell>
                                            <Table.HeaderCell>Image</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.props.products.map((order) => {
                                            return (
                                                <Table.Row textAlign="center" key={order.product._id}>
                                                    <Table.Cell>{order.product.name}</Table.Cell>
                                                    <Table.Cell>{order.quantity}</Table.Cell>
                                                    <Table.Cell>
                                                        <Grid columns={2}>
                                                            {order.product.includedProducts.map((product) => {
                                                                return (
                                                                    <Grid.Row key={product._id}>
                                                                        <Grid.Column><strong>Name:</strong> {product.farmProduct.name}</Grid.Column>
                                                                        <Grid.Column><strong>Quantity:</strong> {product.quantity} {product.unit}</Grid.Column>
                                                                    </Grid.Row>
                                                                );
                                                            })}
                                                        </Grid>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Image className="orderDetailImage" src={order.product.mediaUrl} centered />
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='4'>Total: ${this.props.total}</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        );
    }
}

orderDetail.getInitialProps = async (ctx) => {
    const query = ctx.query;
    const { token } = parseCookies(ctx);

    if (!token) {
        return { orderDetails: [] };
    }

    const payload = { headers: { Authorization: token }, params: query };
    const url = `${baseUrl}/api/orderDetail`;
    const response = await axios.get(url, payload);

    return response.data.orderDetails;
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(orderDetail);
