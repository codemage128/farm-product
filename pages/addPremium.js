import React from 'react'
import { Container, Form, Grid, Icon, Message, Segment } from 'semantic-ui-react'
import axios from "axios"
import { parseCookies } from "nookies"
import baseUrl from "../utils/baseUrl"
import handleSignup from '../modules/signup'
import cookie from "js-cookie"
import Plans from '../components/Plan/Plans'
import Card from '../components/Plan/Card'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updatePlan } from '../redux/store';
import { Elements, StripeProvider } from "react-stripe-elements"
import $ from 'jquery'
import Router from 'next/router'
/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class AddPremium extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stripe: null, isDisabled: true, loggedIn: false, firstname: '', lastname: '', email: '', password: '', error: '', redirectToReferer: false }
  }

  componentWillMount() {
    if (this.props.signupPlan){
      this.props.updatePlan(this.props.signupPlan)
    } else {
      this.props.updatePlan("basic")
    }
    // const isUser = Object.values(this.state.user).every(el => Boolean(el));
    // isUser ? this.setState({disabled:false}) : this.setState({disabled:true});
  }

  isTrial(){// fix this
    if (this.props.customers != []){
      return true
    } else {
      return false
    } 
  }

  stateCallback(state){
    this.setState({ isDisabled: state })
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = () => {
    this.setState({ isDisabled: false })
  }

  getUserData = () => ({
    email: this.props.user.username,
    plan: document.querySelector('[name="plan"]:checked').value,
    trial: this.isTrial(),
    profile: {
      name: {
        fullname: this.props.user.name || "Full Name",
      },
    },
  });

  getUserEmail() {
    return this.props.user.username
  }

  async addPremium(customer) {
    try {
      this.setState({loading: true, error: '', success: false});
      const url = `${baseUrl}/api/addPremium`
      const token = cookie.get("token")
      const payload = { customer }
      const headers = { headers: { Authorization: token } }
      await axios.post(url, payload, headers)
      this.setState({ success: true});
    } catch (e) {
      this.setState({loading: false, success: false, error: e.response.data });
      console.error(e)
    } finally {
      this.setState({loading: false});
      Router.push("/dashboard")
    }
  }

  async handleDelete(_id) {
    Router.reload()
  }

  submit = () => {
    if(typeof window != undefined){
      $('.ccButton').addClass('disabled')
      window.stripe.createToken(window.card).then((token) => {
        const user = this.getUserData()
        if(token.token != undefined){
          this.addPremium({source: token.token.id, user})
        } else{
          Router.reload()
        }
      })
    }
  }

  componentDidMount() {
    handleSignup({ component: this })
  }

  render() {
    const { loading, error, success } = this.state;
    return (
      <div className="Signup">
        <Container>
          <Container>
            <h1>Get LocalDrop Premium!</h1>
            <Grid columns='equal' stackable container>
              <Grid.Column>
                Coming Soon!
              </Grid.Column>
              <Grid.Column>
              <div className="stickyWrap">
              {!this.state.error ? <Message>
                
                <Message.Content>
                  
                    <ul>
                      <li>Pick a payment plan and enter your credit card information.</li>
                      <li>Your subscription will begin after a <span className="bold">FREE</span> two day trial (if you haven't already used the trial).</li>
                      <li>Your card won't be charged until after the trial period ends.</li>
                      <li>Cancel anytime with just one click.</li>
                    </ul>
                    </Message.Content>
                      
                  </Message> : <></>}
                <Form loading={loading} error={Boolean(error)} success={success} onSubmit={this.submit}>
                  <Segment stacked>
                  {/* <Form.Group widths='equal'>
                    <Form.Input
                        label="First Name"
                        icon="user"
                        iconPosition="left"
                        name="firstname"
                        placeholder="First Name"
                        
                      />
                      <Form.Input
                        label="Last Name"
                        icon="user"
                        iconPosition="left"
                        name="lastname"
                        placeholder="Last Name"
                        
                        
                      /> 
                    </Form.Group> */}
                      <Form.Input
                        label="Billing Email"
                        icon="user"
                        className="hide"
                        iconPosition="left"
                        name="email"
                        type="email"
                        defaultValue={this.getUserEmail()}
                      />
                  
                  <Plans plans={this.props.plan}/>
                  <StripeProvider stripe={this.state.stripe}>
                    <Elements>
                      <Card isDisabled={this.state.isDisabled} ref={card => (this.card = card)} />
                    </Elements>
                  </StripeProvider>
                  <Form.Button icon="thumbs up outline" color="blue" className={`ccButton ${this.state.isDisabled ? 'disabled':''}`} content="Submit"/>
                  </Segment>
                </Form>
                {this.state.error === '' ? (
                  ''
                ) : (
                  <Message
                    error
                    header="Registration was not successful"
                    content={this.state.error}
                  />
                )}
                </div>
              </Grid.Column>
            </Grid>
          </Container>
        </Container>
      </div>
    )
  }
}

AddPremium.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx)
  if (!token) {
    return { customers: [] }
  }
  let signupPlan = ctx.query.plan
  const payload = { headers: { Authorization: token } }
  const url = `${baseUrl}/api/plan`
  const response = await axios.get(url, payload)
  if (!response.data) {
    return { customers: [] }
  } else {
    if (signupPlan){
      response.data.signupPlan = signupPlan
    }
    return response.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePlan: bindActionCreators(updatePlan, dispatch),
  }
}

const mapStateToProps = state => {
  return {
    planState: state.plan,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPremium)
