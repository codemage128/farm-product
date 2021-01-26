import React from "react";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import axios from "axios";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { Container } from "semantic-ui-react";
import  Router  from "next/router";

const INITIAL_USER_RESET_PW = {
  password: "",
};

function ResetPassword ({tokenResponse}) {
  //console.log(tokenResponse)
  const [user, setUser] = React.useState(INITIAL_USER_RESET_PW);
  const [disabled, setDisabled] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
    tokenResponse ? setDisabled(false) : setDisabled(true)
    tokenResponse ? setError('') : setError('Invalid token.')
    tokenResponse ? setError('') : Router.push('/')
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  }

  async function updatePassword(event) {
    if(tokenResponse.message === 'token valid'){
      try {
        event.preventDefault();
        setLoading(true);
        setError("");

        const newPassword = user.password
        const username = tokenResponse.username
        const token = tokenResponse.token

        const url = `${baseUrl}/api/resetPasswordViaEmail`;
        const payload = { username, newPassword, token };
        //await console.log("PAYLOAD",payload)
        await axios.put(url, payload);
        await setSuccess(true);
      } catch (error) {
        catchErrors(error, setError);
      } finally {
        setUser(INITIAL_USER_RESET_PW); 
        setLoading(false);
        Router.push('/login')
      }
    } else {
      console.log("lol nice try")
    }
  }

  return (
    <Container>
      <Container className="loginGrid">
        <Form error={Boolean(error)} loading={loading} onSubmit={updatePassword}>
          <Message error header="Oops!" content={error} />
          <Segment stacked>
            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              value={user.email}
              onChange={handleChange}
            />
            <Button
              disabled={disabled || loading}
              icon="sign in"
              type="submit"
              color="blue"
              content="Change Password"
            />
          </Segment>
        </Form>
      </Container>
    </Container>
  )
};

export default ResetPassword;

ResetPassword.getInitialProps = async ({ query: { token } }) => {
  try{
    const payload = { params: { token } }
    const url = `${baseUrl}/api/reset`
    const response = await axios.get(url, payload)
    return { tokenResponse: response.data };
  } catch(e) {
    console.error("Invalid token",e)
  }
};