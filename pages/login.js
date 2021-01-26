import React from "react";
import { Button, Form, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import axios from "axios";
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import { handleLogin } from "../utils/auth";
import { Container } from "semantic-ui-react";

const INITIAL_USER = {
  email: "",
  password: ""
};

function Login() {
  const [user, setUser] = React.useState(INITIAL_USER);
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true)
      setError("")
      const url = `${baseUrl}/api/login`
      const payload = { ...user }
      const response = await axios.post(url, payload)
      handleLogin(response.data)
    } catch (error) {
      catchErrors(error, setError)
      setLoading(false)
    } finally {
      
    }
  }

  return (
    <Container>
      <Container className="loginGrid">
      {!error ? <Message
        icon="privacy"
        header="Welcome Back!"
        content="Log in with email and password"
      /> : <></>}
      <Form error={Boolean(error)} loading={loading} onSubmit={handleSubmit}>
        <Message error header="Invalid login attempt." content="Please try again." />
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
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
          />
          <Button
            disabled={disabled || loading}
            icon="sign in"
            type="submit"
            content="Login"
            color="blue"
          />
        </Segment>
      </Form>
      <Message>
        <Link href="/signup">Click here to Register</Link><br></br>
        <Link href="/forgotPassword">Forgot your password?</Link>
      </Message>
      </Container>
    </Container>
  );
}

export default Login;
