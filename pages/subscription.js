import React from 'react';
import { Container, Button, Message } from 'semantic-ui-react';
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import axios from "axios";
import PlansDom from '../components/Plan/PlansLoad';
import Plans from '../components/Plan/Plans'
import Card from '../components/Plan/Card';
import { epochToHuman } from '../utils/dates';
import Invoices from '../components/Plan/Invoices';
import _ from 'underscore';
import $ from 'jquery'
import Router from 'next/router';
import catchErrors from "../utils/catchErrors";

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { invoices: [], changingPlan: false, updatingPayment: false };

    this.handleChangeSubscription = this.handleChangeSubscription.bind(this);
    this.handleCancelSubscription = this.handleCancelSubscription.bind(this);
    this.handleUpdatePayment = this.handleUpdatePayment.bind(this);
    this.getSubscription = this.getSubscription.bind(this);
    this.renderSubscriptionStatus = this.renderSubscriptionStatus.bind(this);
    this.renderChangePlan = this.renderChangePlan.bind(this);
    this.renderUpdatePayment = this.renderUpdatePayment.bind(this);
  }

  async changeSubscription(customer) {
    try {
      const url = `${baseUrl}/api/changePremiumPlan`
      const token = cookie.get("token")
      const payload = { customer }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
    } catch (error) {
      this.setState({ changingPlan: false })
      console.error(error)
    } finally {
      this.setState({ changingPlan: false })
      $('.ccButton').removeClass('disabled')
      Router.reload()
    }
  }

  async cancelSubscription() {
    try {
      const url = `${baseUrl}/api/cancelPremium`
      const token = cookie.get("token")
      const userId = this.props.user._id
      const payload = { userId }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
    } catch (error) {
      console.error(error)
    } finally {
      $('.ccButton').removeClass('disabled')
      Router.reload()
    }
  }
  
  async updatePayment(stripeToken) {
    try {
      const url = `${baseUrl}/api/updatePayment`
      const token = cookie.get("token")
      const payload = { stripeToken }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
    } catch (error) {
      console.error(error)
    } finally {
      $('.ccButton').removeClass('disabled')
      Router.reload()
    }
  }  

  handleChangeSubscription(event) {
    event.preventDefault()
    const planId = document.querySelector('[name="plan"]:checked').value
    const newPlan = _.findWhere(this.props.plans, { planId })
    if (confirm(`Are you sure? This will change your plan to the ${newPlan.label}. If you're upgrading, your card will be charged any difference in price immediately.`)) {
      this.changeSubscription(planId)
    }
  }

  handleCancelSubscription(event) {
    event.preventDefault();
    const subscription = this.getSubscription();
    if (confirm(`Are you sure? You\'ll have access to LocalDrop until ${subscription.current_period_end}`)) {
      this.cancelSubscription()
    }
  }

  handleUpdatePayment(event) {
    event.preventDefault();
    window.stripe.createToken(window.card)
    .then(({ token }) => {
      this.updatePayment(token.id)
    })
    .catch((error) => {
      //Bert.alert(error.reason, 'danger');
    });
  }

  getSubscription() {
    const { customers, plans } = this.props;
    //console.log(this.props.customers);
    return {
      status: this.props.customers.subscription.status,
      plan: _.findWhere(plans, { planId: this.props.customers.subscription.plan }) || { label: 'None' },
      current_period_end: epochToHuman(this.props.customers.subscription.current_period_end),
    };
  }

  renderSubscriptionStatus() {
    const subscription = this.getSubscription();
    const message = {
      active: {
        style: 'success',
        text: <p>Your subscription is <strong>active</strong> and <strong>will renew on {subscription.current_period_end}</strong>. <a className="cancel-link" href="#" onClick={this.handleCancelSubscription}>Cancel Subscription</a></p>,
      },
      cancelling: { style: 'warning', text: <p>Your subscription <strong>will end on {subscription.current_period_end}</strong>.</p> },
      canceled: { style: 'danger', text: <p>Your subscription ended on {subscription.current_period_end}.</p> },
      none: { style: 'info', text: <p>You don't have a plan. Dang! <a href="/#/addPremium" onClick={this.handleSubscribe}>Subscribe now</a>.</p> },
      trialing: { style: 'success', text: <p>You're trialing until {subscription.current_period_end}! <a className="cancel-link" href="#" onClick={this.handleCancelSubscription}>Cancel Subscription</a></p> },
      comped: { style: 'comped', text: <p>You're lucky! You have a comped account and it doesn't end!</p> },
    }[subscription.status];
    return (<Message>{message.text}</Message>);
  }

  renderUpdatePayment() {
    const { customers } = this.props;
    const card = this.props.customers.card;
    return (<div className="UpdatePayment">
      <Card ref={cardForm => (this.cardForm = cardForm)} />
      <Button onClick={this.handleUpdatePayment}>Update Payment</Button>
    </div>);
  }

  renderChangePlan() {
    const { customer } = this.props;
    return (<div className="ChangePlan">
      <Plans currentPlan={this.props.customers.subscription.plan}  plans={this.props.plans}/>
      <Button onClick={this.handleChangeSubscription}>
        {this.props.customers.subscription.status === 'cancelling' ? 'Resubscribe' : 'Change Plan'}
      </Button>
    </div>);
  }

  render() {
    const subscription = this.getSubscription();
    const { customer } = this.props;
    const isCancelling = subscription.status === 'cancelling' ? `until ${subscription.current_period_end}` : '';
    return (<div className="Subscription">
     <Container>
      <PlansDom/>
        {this.renderSubscriptionStatus()}
        <p><h1>Your Plan</h1></p>
        <p>You're subscribed to the <strong>{subscription.plan.label}</strong> plan {isCancelling}</p>
        {this.props.customers.subscription.status !== "comped" ? <Button onClick={() => { this.setState({ changingPlan: !this.state.changingPlan }); }}>
        {this.state.changingPlan ? 'Cancel' : 'Change Plan'}</Button> : true}
        {this.state.changingPlan ? this.renderChangePlan() : ''}
        <div className="subscriptionPayment">
          <p><h1>Payment Method</h1></p>
          <p><strong>{this.props.customers.card.brand}</strong> ending in <strong>{this.props.customers.card.last4}</strong></p>
          {this.props.customers.subscription.status !== "comped" ?  <Button onClick={() => { this.setState({ updatingPayment: !this.state.updatingPayment }); }}>
          {this.state.updatingPayment ? 'Cancel' : 'Update Payment'}</Button> : true }
          {this.state.updatingPayment ? this.renderUpdatePayment() : ''}
        </div>
        <Invoices invoices={this.props.invoices}/>
      </Container>
    </div>);
  }
}

Subscription.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { customers: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/subscription`;
  const response = await axios.get(url, payload);
  //console.log(response.data);
  return response.data;
}

export default Subscription;