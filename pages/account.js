import AccountHeader from "../components/Account/AccountHeader";
import AccountOrders from "../components/Account/AccountOrders";
import AccountPermissions from "../components/Account/AccountPermissions";
import { parseCookies } from "nookies";
import { Container } from "semantic-ui-react";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Account({ user, orders }) {
  return (
    <Container>
      <AccountHeader {...user} />
      <AccountOrders orders={orders} />
      {Object.assign({},user.roles)[0] === "admin" && <AccountPermissions />}
    </Container>
  );
}

Account.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { orders: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;
};

export default Account;
