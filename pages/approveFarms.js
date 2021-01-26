import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { parseCookies } from "nookies";
import { Link } from 'next/link'
import baseUrl from "../utils/baseUrl";
import swal from "sweetalert";
import {
  Icon,
  Grid,
  Table,
  Image,
  Button,
  Container,
} from "semantic-ui-react";
import formatDate from "../utils/formatDate";



class approveUsers extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      farmers:[],
    };
  }

  componentWillMount() {
    this.setState({ farmers: this.props.farmers });
  }

  async onClickApprove(farmer) {
    const url = `${baseUrl}/api/farmer`;

    farmer.roles[0] = "farmerApproved";

    const payload = {
      farmer,
    };

    try {
      await axios.put(url, payload);
      this.setState({ farmers: this.state.farmers });
    } catch (e) {}
  }

  render() {
    return (
      <Container>
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column>
              <h1>Farms to Approve</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table compact celled selectable>
                <Table.Header>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell>Farm Logo</Table.HeaderCell>
                    <Table.HeaderCell>Farm Name</Table.HeaderCell>
                    <Table.HeaderCell>Username</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Stripe Account</Table.HeaderCell>
                    <Table.HeaderCell>Date Registered</Table.HeaderCell>
                    <Table.HeaderCell>Approve</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                {this.state.farmers.map((farmer) => {
                    return (
                      <Table.Row textAlign="center" key={farmer._id}>
                        <Table.Cell>
                          <Image src={farmer.mediaUrl} size='small' centered />
                        </Table.Cell>
                        <Table.Cell>{farmer.name}</Table.Cell>
                        <Table.Cell>{farmer.username}</Table.Cell>
                        <Table.Cell>{farmer.location}</Table.Cell>
                        <Table.Cell>{farmer.stripeId}</Table.Cell>
                        <Table.Cell>{formatDate(farmer.createdAt)}</Table.Cell>
                        <Table.Cell>
                        <Button
                            onClick={() => this.onClickApprove(farmer)}
                            color="blue"
                            disabled={farmer.roles[0] == "farmerApproved"}
                          >
                            Approve
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

approveUsers.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { farmers: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/farmers`;
  const response = await axios.get(url, payload);
  console.log(response.data)
  return {farmers: response.data};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(approveUsers);
