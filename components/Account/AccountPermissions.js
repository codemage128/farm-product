import React from "react";
import axios from "axios";
import { Header, Checkbox, Table, Icon } from "semantic-ui-react";
import cookie from "js-cookie";
import baseUrl from "../../utils/baseUrl";
import formatDate from "../../utils/formatDate";

function AccountPermissions() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const url = `${baseUrl}/api/users`;
    const token = cookie.get("token");
//    console.log(token);
    const payload = { headers: { Authorization: token } };
    const response = await axios.get(url, payload);
    setUsers(response.data);
//    console.log(response.data);
  }

  return (
    <div style={{ margin: "2em 0" }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Roles</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map(user => (
            <UserPermission key={user._id} user={user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ user }) {
  const [premium, setPremium] = React.useState(Object.assign({},user.roles)[0] === "premium");
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    updatePermission();
  }, [premium]);

  function handleChangePermission() {
    setPremium(prevState => !prevState);
  }

  async function updatePermission() {
    const url = `${baseUrl}/api/account`;
    const payload = { _id: user._id, roles: premium ? ["premium"] : ["user"] };
    await axios.put(url, payload);
  }

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={premium} toggle onChange={handleChangePermission} />
      </Table.Cell>
      <Table.Cell>{user.username}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{premium ? "premium" : "user"}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
