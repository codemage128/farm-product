import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parseCookies, setCookie } from "nookies";
import Card from "../components/Plan/Card";
import calculateCartTotal from "../utils/calculateCartTotal";
import { StripeProvider, Elements, CardElement } from "react-stripe-elements";
import $ from "jquery";
import Router from "next/router";
import cookie from "js-cookie";
import baseUrl from "../utils/baseUrl";
import c from "../utils/constants";
import calculateDistance from "../utils/calculateDistance"
import {
  Accordion,
  Button,
  Grid,
  Icon,
  Form,
  Label,
  Message,
  Segment,
  Item,
  Divider,
  Input,
} from "semantic-ui-react";
import stripe from "../utils/stripe";


const DELIVERYMETHODS = c.DELIVERYMETHODS;

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stripe: null,
      cardElement: null,
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      error: "",
      success: true,
      disabled: false,
      isDisabled: true,
      loading: false,
      cartAmount: 0,
      location: null,
    };
  }

  async componentWillMount() {
    const { cartTotal } = calculateCartTotal(this.props.products);
    this.setState({ cartAmount: cartTotal, cartProducts: this.props.products });
  }

  async componentDidMount() {
    const stripe = window.Stripe(process.env.STRIPE_PUBLIC_KEY, {
      betas: ["payment_intent_beta_3"],
    });
    this.setState({ stripe: stripe });
  }

  handleChange(e) {
    let { ...values } = this.state;
    values[e.target.name] = e.target.value;

    this.setState(values, () => { this.getGeolocationFromAddress(); });
  }

  handleValidate() {
    const { firstName, lastName, address1, city, state, zip, location } = this.state;
    const isDisabled = firstName !== "" && lastName !== "" && address1 !== "" && city !== "" && zip !== "" &&
      state !== "" && location;

    this.setState({ isDisabled: !isDisabled });
  }

  calculateDistanceOnProducts() {
    let { cartProducts, location } = this.state;

    for (let i in cartProducts) {
      let cartProduct = cartProducts[i];
      const p_location = cartProduct.product.location;
      if (!location) {
        cartProduct.distance = null;
      } else {
        cartProduct.distance = calculateDistance(location.lat, location.lng, p_location.lat, p_location.lng, "M");
      }
    }
    const { cartTotal } = calculateCartTotal(cartProducts);

    this.setState({ cartProducts, cartAmount: cartTotal })

  };

  getGeolocationFromAddress() {
    let { address1, city, state, zip } = this.state;
    if (address1 && city && state && zip) {
      const address = address1 + " " + city + " " + state + " " + zip;
      const geocoder = new google.maps.Geocoder();
      const self = this;

      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();

          self.setState({
            location: {
              lat, lng
            }
          }, () => { self.calculateDistanceOnProducts(); self.handleValidate(); })
        } else {
          self.setState({ location: null }, () => { self.calculateDistanceOnProducts(); self.handleValidate(); });
        }
      });
    } else {
      this.setState({ location: null }, () => { this.calculateDistanceOnProducts(); this.handleValidate(); });
    }
  }

  handleCardReady(element) {
    this.setState({ cardElement: element });
  }

  async getPaymentIntent(cartTotal) {
    try {
      this.setState({ loading: true, error: "", success: false });

      const url = `${baseUrl}/api/paymentIntent`;
      const token = cookie.get("token");
      const payload = { cartTotal };
      const headers = { headers: { Authorization: token } };
      const { data } = await axios.post(url, payload, headers);
      this.setState({ success: true, loading: false });
      return data;
    } catch (e) {
      this.setState({ loading: false, success: false, error: e.response.data });
      return null;
    }
  }

  getCheckoutData = (groupID) => ({
    firstName: this.state.firstName,
    lastName: this.state.lastName,
    address1: this.state.address1,
    address2: this.state.address2,
    city: this.state.city,
    state: this.state.state,
    zip: this.state.zip,
    email: this.props.user.email,
    profile: {
      name: {
        fullname: this.state.firstName + " " + this.state.lastName,
      },
    },
    location: this.state.location,
    groupID: groupID,
  });

  async completeOrder(order) {
    try {
      this.setState({ loading: true, error: "", success: false });
      const url = `${baseUrl}/api/completeOrder`;
      const token = cookie.get("token");
      const payload = { order };
      const headers = { headers: { Authorization: token } };
      const response = await axios.post(url, payload, headers);
      this.setState({ success: true });
      Router.push("/thankYou?_id=" + response.data.newOrderId);
    } catch (e) {
      this.setState({ loading: false, success: false, error: e.response.data });
    }
  }

  submit = async () => {
    const {
      firstName,
      lastName,
      address1,
      city,
      state,
      zip,
      cartAmount,
      cardElement,
      stripe,
    } = this.state;

    if (
      firstName === "" ||
      lastName === "" ||
      address1 === "" ||
      city === "" ||
      state === "" ||
      zip === ""
    ) {
      this.setState({ error: "Please complete all the fields." });
      this.setState({ success: false });
      return false;
    }

    let { paymentIntent, groupID } = await this.getPaymentIntent(cartAmount);

    if (paymentIntent && stripe && cardElement) {
      this.setState({ loading: true, error: "", success: false });

      const paymentIntentResult = await stripe.handleCardPayment(
        paymentIntent.client_secret,
        cardElement
      );

      this.setState({ success: true, loading: false });

      if (paymentIntentResult.error) {
        this.setState({
          loading: false,
          success: false,
          error: paymentIntentResult.error.message,
        });
      } else if (
        paymentIntentResult.paymentIntent &&
        paymentIntentResult.paymentIntent.status === "succeeded"
      ) {
        this.setState({ success: true, loading: false });

        const order = this.getCheckoutData(groupID);
        await this.completeOrder({ order });
      }
    }
  };

  mapCartProductsToItems(products) {
    return products.map((p) => ({
      childKey: p._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => Router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${DELIVERYMETHODS.find(d => d.type === p.deliveryType).text}  ( $${p.deliveryPrice} / ${p.deliveryUnit} )`,
      description: (
        <>
          <Label color="teal">Product Total: {p.quantity} x ${p.product.price}</Label>
          {p.distance ? <Label color="teal">Delivery Total: {p.distance.toFixed(2)} miles x ${p.deliveryPrice} per mile</Label> : <Label color="red">Calculating</Label>}
        </>
      ),
      fluid: "true",
    }));
  }

  render() {
    const { loading, error, success, isDisabled, cartProducts, cartAmount } = this.state;

    return (
      <>
        <Grid columns="equal" stackable container>
          <Grid.Column>
            <Form
              error={Boolean(error)}
              loading={loading}
              onSubmit={this.submit.bind(this)}
            >
              <Message error header="Oops!" content={error} />
              <Segment>
                <h1>Checkout</h1>
                <h3>Delivery Info</h3>
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={this.state.firstname}
                  onChange={this.handleChange.bind(this)}
                />
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={this.state.lastname}
                  onChange={this.handleChange.bind(this)}
                />
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="address1"
                  name="address1"
                  type="text"
                  placeholder="Address 1"
                  value={this.state.address1}
                  onChange={this.handleChange.bind(this)}
                />
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="address2"
                  name="address2"
                  type="text"
                  placeholder="Address 2"
                  value={this.state.address2}
                  onChange={this.handleChange.bind(this)}
                />
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleChange.bind(this)}
                />
                <Form.Input
                  control={Input}
                  className="form-control"
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleChange.bind(this)}
                />

                <Form.Input
                  control={Input}
                  className="form-control"
                  id="zip"
                  name="zip"
                  type="text"
                  placeholder="Zip Code"
                  value={this.state.zip}
                  onChange={this.handleChange.bind(this)}
                />
                <h3>Payment Info</h3>
                <StripeProvider stripe={this.state.stripe}>
                  <Elements>
                    <CardElement onReady={(e) => this.handleCardReady(e)} />
                  </Elements>
                </StripeProvider>
              </Segment>

              <Form.Button
                icon="thumbs up outline"
                color="blue"
                disabled={isDisabled}
                content="Complete Checkout"
              />
            </Form>
          </Grid.Column>
          <Grid.Column className="checkoutRightCol">
            <></>
            <Segment>
              <h3>Items</h3>
              <Item.Group
                divided
                items={this.mapCartProductsToItems(cartProducts)}
              />
              <strong>Total:</strong> ${cartAmount}
              <br></br>
              <br></br>
            </Segment>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

Checkout.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { products: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/cart`;
  const response = await axios.get(url, payload);
  return { products: response.data };
};

export default Checkout;
