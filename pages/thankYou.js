import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import c from "../utils/constants"
import moment from "moment"

import {
    Container,
    Grid,
    Segment,
    Table,
    Label,
} from "semantic-ui-react";

const DELIVERYMETHODS = c.DELIVERYMETHODS;

function Thankyou(data) {
    const [order, setOrder] = React.useState(data.order)

    return (
        <Container>
            <Grid columns="equal" stackable centered>
                <Grid.Row>
                    <Grid.Column>
                        <h1>Order Received</h1>
                        <Segment>
                            <p>Thank you. Your order has been received.</p>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        <Label content="ORDER NUMBER" />
                                        <p>{order._id}</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Label content="Date" />
                                        <p>{moment(order.updateAt).format("LL")}</p>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Label content="Total" />
                                        <p>$ {order.total}</p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Label content="PAYMENT METHOD" />
                                        <p>Card Payment</p>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Grid columns="equal" stackable>
                                <Grid.Row>
                                    <Grid.Column>
                                        <h3>Order Detail</h3>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Table compact selectable textAlign="center">
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>PRODUCT</Table.HeaderCell>
                                                    <Table.HeaderCell>TOTAL</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {order.products.map(item => {
                                                    return (
                                                        <React.Fragment key={item._id}>
                                                            <Table.Row>
                                                                <Table.Cell colSpan="2"><strong>{item.product.name.toUpperCase()}</strong></Table.Cell>
                                                            </Table.Row>
                                                            <Table.Row>
                                                                <Table.Cell>{item.product.name} x {item.quantity}</Table.Cell>
                                                                <Table.Cell>$ {item.price}</Table.Cell>
                                                            </Table.Row>
                                                            <Table.Row>
                                                                <Table.Cell>
                                                                    {DELIVERYMETHODS.find(d => d.type === item.deliveryType).text + " x " + item.distance.toFixed(2)}
                                                                </Table.Cell>
                                                                <Table.Cell>$ {item.deliveryPrice} / {item.deliveryUnit}</Table.Cell>
                                                            </Table.Row>
                                                            <Table.Row>
                                                                <Table.Cell>SUBTOTAL:</Table.Cell>
                                                                <Table.Cell>$ {(item.price * item.quantity + item.distance * item.deliveryPrice).toFixed(2)}</Table.Cell>
                                                            </Table.Row>
                                                            <Table.Row>
                                                                <Table.Cell>PAYMENT METHOD:</Table.Cell>
                                                                <Table.Cell>Card Payment</Table.Cell>
                                                            </Table.Row>
                                                        </React.Fragment>
                                                    );
                                                })}
                                                <Table.Row>
                                                    <Table.Cell colSpan="2"><strong>TOTAL</strong></Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>TOTAL:</Table.Cell>
                                                    <Table.Cell>$ {order.total}</Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

Thankyou.getInitialProps = async (ctx) => {
    const query = ctx.query;
    const { token } = parseCookies(ctx);

    if (!token) {
        return { data: { order: [] } };
    }

    const payload = { headers: { Authorization: token }, params: query };
    const url = `${baseUrl}/api/myOrderDetail`;
    const response = await axios.get(url, payload);

    return response.data;
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Thankyou);
