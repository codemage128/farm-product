import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import Router, { useRouter } from "next/router";
import baseUrl from "../utils/baseUrl";
import uuidv4 from "uuid/v4";

import {
  Accordion,
  Button,
  Grid,
  Icon,
  Segment,
  Image,
  Feed,
} from "semantic-ui-react";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { farmOrders: "" };
  }

  componentWillReceiveProps(nextProps) { }

  async componentDidMount() {
    if (Router.query.code) {
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };
      const url = `${baseUrl}/api/completePayout`;
      const payload = Router.query;
      await axios.post(url, payload, headers);
    }
  }

  addPremium() { }

  shopURL() {
    return "/shop/" + this.props.user.storeUrl;
  }

  deliverableOrders() {
    var count = 0;
    for (var x = 0; x < this.props.farmOrders.farmOrders.length; x++) {
      if (this.props.farmOrders.farmOrders[x].status === "notdelivered") {
        count++;
      }
    }
    return count;
  }

  stripeConnectURL() {
    const email = this.props.user.email;
    return (
      "https://connect.stripe.com/express/oauth/authorize?suggested_capabilities[]=transfers&client_id=" + process.env.STRIPE_ACCOUNT + "&stripe_user[email]=" +
      email
    );
  }

  render() {
    console.log(this.props.user)
    const isUser =
      this.props.user && Object.assign({}, this.props.user.roles)[0] === "user";
    const isFarmer =
      (this.props.user &&
        Object.assign({}, this.props.user.roles)[0] === "farmer") ||
      this.props.user.roles[0] === "farmerApproved";
    if (isFarmer) {
      return (
        <>
          <Grid columns="2" stackable container>
            <Grid.Column width="10">
              <Segment>
                <h1>{this.props.user.name}</h1>
                <Link centered href={this.shopURL()}>
                  <a>
                    <Image
                      src={this.props.user.mediaUrl}
                      rounded
                      centered
                      size="small"
                    />
                  </a>
                </Link>
                <Link centered href={this.shopURL()}>
                  <a>
                    <center>Go To My Store</center>
                  </a>
                </Link>
                <h3>Number of Orders to Deliver</h3>
                <p>{this.deliverableOrders()}</p>
              </Segment>
            </Grid.Column>
            <Grid.Column width="6">
              <></>
              <Segment>
                <h3>Activity Feed</h3>
                {this.props.activityFeeds.map((feed) => {
                  return (
                    <Feed key={feed._id}>
                      <Feed.Event>
                        {feed.userUrl ?
                          <Feed.Label>
                            <img src={feed.userUrl} />
                          </Feed.Label> :
                          <Feed.Label icon="user" />
                        }
                        <Feed.Content>
                          <Feed.Summary>
                            <p>{feed.message}</p>
                          </Feed.Summary>
                          {feed.mediaUrl &&
                            <Feed.Extra images>
                              <img src={feed.mediaUrl} />
                            </Feed.Extra>
                          }
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  );
                })}
              </Segment>
              <Segment>
                <h3>Things to do</h3>
                {!(this.props.user.stripeId) && (
                  <a href={this.stripeConnectURL()}>
                    Setup Payout Method (so we can pay you!)
                  </a>
                )}
                {!(this.props.user.stripeId) && <br></br>}
                <Link centered href="/addFarmProduct">
                  Add products you produce
                </Link>
                <br></br>
                <Link centered href="/create">
                  Sell a product alone or in a bundle
                </Link>
                <br></br>
                <Link centered href="/myOrders">
                  Check my Orders
                </Link>
              </Segment>
            </Grid.Column>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <Grid columns="equal" stackable container>
            <Grid.Column width="10">
              <Segment>
                <h1>My Dashboard</h1>
                {/* <h3>Number of Orders</h3> 
                <p>{this.userOrders()}</p> */}
              </Segment>
            </Grid.Column>
            <Grid.Column width="6">
              <></>
              <Segment>
                <h3>Activity Feed</h3>
                {this.props.activityFeeds.map((feed) => {
                  return (
                    <Feed key={feed._id}>
                      <Feed.Event>
                        {feed.userUrl ?
                          <Feed.Label>
                            <img src={feed.userUrl} />
                          </Feed.Label> :
                          <Feed.Label icon="user" />
                        }
                        <Feed.Content>
                          <Feed.Summary>
                            <p>{feed.message}</p>
                          </Feed.Summary>
                          {feed.mediaUrl &&
                            <Feed.Extra images>
                              <img src={feed.mediaUrl} />
                            </Feed.Extra>
                          }
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  );
                })}
              </Segment>
              <Segment>
                <h3>Things to do</h3>
                <Link centered href="/shop">
                  Go shopping!
                </Link>
              </Segment>
            </Grid.Column>
          </Grid>
        </>
      );
    }
  }
}

Dashboard.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { farmOrders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url_farmOrders = `${baseUrl}/api/farmOrders`;
  const url_feeds = `${baseUrl}/api/feeds`;

  const farmOrdersData = await axios.get(url_farmOrders, payload);
  const activityFeedsData = await axios.get(url_feeds, payload);

  return { farmOrders: farmOrdersData.data, activityFeeds: activityFeedsData.data };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
