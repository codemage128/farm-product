import React from 'react';
import axios from "axios";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { parseCookies } from "nookies";
import Router from 'next/router'
import baseUrl from "../utils/baseUrl";
import { Accordion, Button, Grid, Icon } from 'semantic-ui-react';

class MyStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = { farmOrders: '' }
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentWillMount() {
    
  }

  addPremium(){
    Router.push('/addPremium?plan=plan_GFh51xG8CBkoOP')
  }

  render() {

  return (
    <>
      <Grid columns='equal' stackable container>
        <Grid.Column>
          <h1>My Dashboard</h1>
          <p>Check back soon!</p>
        </Grid.Column>
      </Grid>
    </>
    );
  }
}

MyStore.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload)
  return response.data;
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

const mapStateToProps = state => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStore)