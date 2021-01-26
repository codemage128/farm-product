import { Label, Table } from 'semantic-ui-react';
import { parseCookies } from "nookies";
import { epochToHuman } from '../../utils/dates';
import baseUrl from "../../utils/baseUrl";
import centsToDollars from '../../utils/cents-to-dollars';
import axios from "axios";
import { render } from 'react-dom';

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

class InvoiceList extends React.Component {
    render(){
    if (isEmpty(this.props.invoices)){
      var invoices = []
    } else {
      var invoices = this.props.invoices
    }
    return (
      <div className="Invoices">
        <h3 className="page-header">Invoices</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {invoices.map(({ _id, paid, created, total }) => {
            return (
              <Table.Row key={_id}>
                <Table.Cell>{paid ?
                  <Label color="green">Paid</Label> :
                  <Label color="red">Due</Label>}
                </Table.Cell>
                <Table.Cell>
                  {epochToHuman(created)}
                </Table.Cell>
                <Table.Cell>
                  {centsToDollars(total)}
                </Table.Cell>
              </Table.Row>);
          })}
        </Table.Body>
        </Table>
    </div>
    )}
}


export default InvoiceList;

