import React, { Component }from 'react';
import { Icon, Image, Label, Menu, Button, Input, Grid, Header, Container, Embed, Segment, List, Divider, Form } from 'semantic-ui-react'
import Link from "next/link";
import Router, { useRouter } from "next/router";
import ReactPlayer from 'react-player'
import e from 'cors';


export default class Index extends Component {
  goToSignup(goToplan){
    if (this.props.user){
      Router.push('/addPremium?plan=' + goToplan)
    }else {
      Router.push('/signup?plan=' + goToplan)
    }
  }

  render() {
    return (
      <div className="App">
        <div className="home">
          <div className="homeHead" style={{width:"100%", textAlign:"center", padding:"100px 0"}}>
            <p style={{color:"#deba13", fontSize: "1.2em"}} >Do you want to eat the healthiest food available?</p>
            <h2 className="h2">Avoid the store, get local food delivered.</h2>
            <h2 style={{fontSize:"1.3em"}} className="h3"></h2>
            <Button href="/shop" inverted size="huge">
              Shop now
              <Icon name="right arrow" />
            </Button>
          </div>
          <Container>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Grid className="rte rte-setting featured-row__subtext">
                  <Header as="h3" style={{ color: "#2d4152", fontSize: "1.6em" }}>
                    We work directly with local farms and producers.
                  </Header>
                  <p>LocalDrop is a virtual farmers market that's revoluntizing how we get food. We partner with farmers and producers who add their products to our marketplace. When you shop at LocalDrop, you only see products that deliver to your area, directly to your door. By ordering directly from local farms you know you're getting the freshest produce, supporting local businesses, and reducing the carbon impact of food transportation.</p>
                  <p>We all know the best food comes from farmers markets, and farmers love feeding people. We bring it all together in a single, easy-to-use, online marketplace.</p>
                  <p style={{color: "#DEBA13", fontWeight:"bold"}}>Get food direct.</p>
                  <p><strong>Sign up now and get a free premium membership when we lauch!</strong></p>
                <p><Button style={{fontSize:"1.2em"}} onClick={() => {this.goToSignup("basic")}} className="btn singup-btn" aria-label="Sign Up" aria-describedby="a11y-external-message">Sign up</Button></p>
                </Grid>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Image width="100%" src="/static/images/beautifulFarm.jpg" width="100%"/>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Image width="100%" src="/static/images/home_truck.jpg" width="100%"/>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Grid className="rte rte-setting featured-row__subtext">
                  <Header as="h3" style={{ color: "#2d4152", fontSize: "1.6em" }}>
                    Traditional supply chains are fragile.
                  </Header>
                  <p>Going to the store and seeing empty shelves is unsettling. LocalDrop is building the supply chain for the next generation: directly from the farm to the consumer.</p>
                  <p>Since most food is delivered from Farms to Businesses, farms are facing issues delivering their products to the overcrowded grocery stores, leading to destruction of perfectly good food. LocalDrop fixes that.</p>
                  <p>We owe it to our farmers to give them a better means to feed the people.</p>
                </Grid>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Grid className="rte rte-setting featured-row__subtext">
                  <Header as="h3" style={{ color: "#2d4152", fontSize: "1.6em" }}>
                    Know where your food comes from.
                  </Header>
                  <p>The food in supermarket grovery stores could have come from anywhere. A store in Colorado could have produce from Michigan. On top of that, the store is charging the consumer for being the middle man.</p>
                  <p>By shopping from LocalDrop you can pick and choose which farms you buy from, while knowing they are all within a drive from your home.</p>
                </Grid>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Image width="100%" src="/static/images/home_grocery.jpg" width="100%"/>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Row>
                <h2 className="h2">How it Works</h2>
              </Grid.Row>
              <Divider
                as="h4"
                className="header"
                horizontal
                style={{ color: "#2d4152", margin: "3em 0em", textTransform: "uppercase" }}>
                #1
              </Divider>
              <Grid.Row className="section-header">      
                <p style={{ fontSize: "1.33em", color: "#2d4152" }}>
                We partner with thousands of farms and other local producers that need a new way to get their products to consumers. We help them to get their products added to our Virtual Farmers Market and ready for delivery. Producers specify the delivery area for each of their products, and only those products eligbile for delivery are shown to shoppers. 
              </p>
              </Grid.Row>
              <Divider
                as="h4"
                className="header"
                horizontal
                style={{ color: "#2d4152", margin: "3em 0em", textTransform: "uppercase" }}>
                #2
              </Divider>
              <Grid.Row className="section-header">      
                <p style={{ fontSize: "1.33em", color: "#2d4152" }}>
                People come to our <a href="/shop">shop</a> and are shown only products that can deliver to their door. That way you know that anything on the site can be delivered to you. Shoppers pick a delivery method: pickup, delivery by the farmer, or LocalDrop Delivery.
              </p>
              </Grid.Row>
              <Divider
                as="h4"
                className="header"
                horizontal
                style={{ color: "#2d4152", margin: "3em 0em", textTransform: "uppercase" }}>
                #3
              </Divider>
              <Grid.Row className="section-header">      
                <p style={{ fontSize: "1.33em", color: "#2d4152" }}>
                Place an order! Shoppers can place a single order with products from multiple producers. We payout each one instantly when the order is placed.
              </p>
              </Grid.Row>
              <Divider
                as="h4"
                className="header"
                horizontal
                style={{ color: "#2d4152", margin: "3em 0em", textTransform: "uppercase" }}>
                #4
              </Divider>
              <Grid.Row className="section-header">      
                <p style={{ fontSize: "1.33em", color: "#2d4152" }}>
                The delivery is made based on the delivery method chosen by the shopper within one week.
              </p>
              </Grid.Row>
              <Divider
                as="h4"
                className="header"
                horizontal
                style={{ color: "#2d4152", margin: "3em 0em", textTransform: "uppercase" }}>
                Thats it!
              </Divider>
              <Grid.Row >
                <h2 className="h2">Shop now for the best selection!</h2>
                <Button href="/shop" inverted size="huge">
                    Shop now
                    <Icon name="right arrow" />
                  </Button>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}