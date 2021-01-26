import React from "react";
import { Button, Form, Icon, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { handleForgotPassword } from "../utils/auth";
import { Container } from "semantic-ui-react";
import swal from 'sweetalert'

const INITIAL_USER_RESET_PW = {
  email: "",
};

function ForgotPassword() {
  const [user, setUser] = React.useState(INITIAL_USER_RESET_PW);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  }

  async function sendEmail (event){
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const url = `${baseUrl}/api/forgotPassword`;
      const payload = { ... user };
      const response = await axios.post(url, payload);
      handleForgotPassword(response.data);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      swal('Email Sent!', 'Check your email and click the link inside.', 'success')
      setLoading(false);
    }
  }

  return (
    <Container>
      <Container className="loginGrid">
      {!error ? <Message
        attached
        icon="privacy"
        header="Forgot your password?"
        content="Enter your email below and we'll email you a link to reset it."
      /> : <></>}
      <Form error={Boolean(error)} loading={loading} onSubmit={sendEmail}>
        <Message error header="Oops!" content={error} />
        <Segment stacked>
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="sign in"
            type="submit"
            color="blue"
            content="Send password reset email"
          />
        </Segment>
      </Form>
      <Message>
        <Link href="/signup">Click here to Register</Link><br></br>
      </Message>
    </Container>
  </Container>
)};

export default ForgotPassword;