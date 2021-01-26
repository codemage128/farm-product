import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import GoogleMapReact from "google-map-react";
import swal from "sweetalert";
import {
  Icon,
  Grid,
  Table,
  Checkbox,
  Button,
  Container,
  Modal,
} from "semantic-ui-react";

const locationModalStyle = {
  maxWidth: "60%",
};

class FarmOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      mapCenter: {
        lat: 37.09024,
        lng: -95.712891,
      },
      modalShow: false,
      isFullRoute: true,
      directionsDisplay: null,
      directionsService: null,
      isAllChecked: false,
    };
  }

  componentWillMount() {
    let { farmOrders } = this.props;
    let orders = [];
    for (let i in farmOrders) {
      let item = { ...farmOrders[i] };
      item.isChecked = false;
      orders.push(item);
    }
    this.setState({ orders: orders });
  }

  onAllOrderClickedChange() {
    let { orders, isAllChecked } = this.state;
    isAllChecked = !isAllChecked;
    orders.map((order) => {
      order.isChecked = isAllChecked;
    });

    this.setState({ orders, isAllChecked });
  }

  onOrderCheckChange(orderID) {
    const { orders } = this.state;
    const orderIndex = orders.findIndex((order) => order._id === orderID);
    orders[orderIndex].isChecked = !orders[orderIndex].isChecked;

    let isAllChecked = true;
    for (let i in orders) {
      isAllChecked = isAllChecked && orders[i].isChecked;
    }

    this.setState({ orders: orders, isAllChecked: isAllChecked });
  }

  onClickCreateRouteMap() {
    const { location } = this.props.user;

    if (!location) {
      swal("Please set your location in My Farm page.");
      return;
    }

    this.setState({ modalShow: true });
  }

  async onCliCkDelivered(order) {
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

  getMapOptions() {
    return {
      disableDefaultUI: true,
      mapTypeControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    };
  }

  handleGoogleApiLoaded(map, maps) {
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("right-panel"));

    this.setState(
      {
        directionsService: directionsService,
        directionsDisplay: directionsDisplay,
      },
      () => {
        this.drawPath();
      }
    );
  }

  onCliCkFullRote() {
    const { isFullRoute } = this.state;
    this.setState({ isFullRoute: !isFullRoute }, function () {
      this.drawPath();
    });
  }

  drawPath() {
    const {
      directionsService,
      directionsDisplay,
      orders,
      isFullRoute,
    } = this.state;

    const { location } = this.props.user;

    if (!location) {
      return;
    }

    if (!directionsService || !directionsDisplay) return;

    if (orders.length > 0) {
      let waypoints = [];

      orders.forEach((order) => {
        if (order.isChecked) {
          waypoints.push({
            location: order.location,
            stopover: true,
          });
        }
      });

      if (waypoints.length > 0) {
        var start, end;
        if (isFullRoute) {
          start = location;
          end = location;
        } else {
          start = location;
          end = waypoints[waypoints.length - 1].location;
          waypoints = waypoints.slice(0, waypoints.length - 1);
        }

        directionsService.route(
          {
            origin: start,
            destination: end,
            waypoints: waypoints,
            optimizeWaypoints: true,
            provideRouteAlternatives: true,
            travelMode: "DRIVING",
          },
          function (response, status) {
            if (status === "OK") {
              directionsDisplay.setDirections(response);
            } else {
              window.alert("Problem in showing directions due to " + status);
            }
          }
        );
      }
    }
  }

  render() {
    return (
      <Container>
        <Modal
          open={this.state.modalShow}
          dimmer="blurring"
          style={locationModalStyle}
        >
          <Modal.Header>
            Select Location
            <Checkbox
              toggle
              style={{ float: "right" }}
              onClick={() => this.onCliCkFullRote()}
              checked={this.state.isFullRoute}
            />
          </Modal.Header>
          <Modal.Content>
            <div id="google-map-router-wrapper">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyB6fv4xpnTbQpkIBdWtk9yFSsxA084AfFE",
                }}
                defaultCenter={this.state.mapCenter}
                defaultZoom={7}
                options={this.getMapOptions()}
                onGoogleApiLoaded={({ map, maps }) =>
                  this.handleGoogleApiLoaded(map, maps)
                }
              ></GoogleMapReact>
            </div>
            <div id="right-panel"></div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon="save"
              labelPosition="right"
              content="Confirm"
              onClick={() => {
                this.setState({ modalShow: false });
              }}
            />
            <Button
              onClick={() => {
                this.setState({ modalShow: false });
              }}
              content="Cancel"
            />
          </Modal.Actions>
        </Modal>
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column>
              <h1>My Orders</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table compact celled selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="8">
                      <Button
                        floated="right"
                        icon
                        labelPosition="left"
                        primary
                        size="small"
                        onClick={() => this.onClickCreateRouteMap()}
                      >
                        <Icon name="map" /> Create Route Map
                      </Button>
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell>
                      <Checkbox
                        checked={this.state.isAllChecked}
                        onChange={() => this.onAllOrderClickedChange()}
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Item Count</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>Deliver</Table.HeaderCell>
                    <Table.HeaderCell>Detail</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.orders.map((order) => {
                    return (
                      <Table.Row textAlign="center" key={order._id}>
                        <Table.Cell collapsing>
                          <Checkbox
                            checked={order.isChecked}
                            onChange={() => this.onOrderCheckChange(order._id)}
                          />
                        </Table.Cell>
                        <Table.Cell style={{ textTransform: "capitalize" }}>
                          {order.status === "notdelivered"
                            ? "Not Delivered"
                            : "Delivered"}
                        </Table.Cell>
                        <Table.Cell>{order.consumer}</Table.Cell>
                        <Table.Cell>{order.location}</Table.Cell>
                        <Table.Cell>{order.count}</Table.Cell>
                        <Table.Cell>${order.total}</Table.Cell>
                        <Table.Cell>
                          <Button
                            onClick={() => this.onCliCkDelivered(order)}
                            color="blue"
                            disabled={order.status == "delivered"}
                          >
                            Deliver
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                        <Button
                            className="productSalesBtn"
                            icon
                            labelPosition="left"
                            primary
                            size="small"
                            href={`/orderDetail?_id=` + order._id}
                          >
                            <Icon name="eye" /> Detail
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

FarmOrder.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { farmOrders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/farmOrders`;
  const response = await axios.get(url, payload);

  return response.data;
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FarmOrder);
