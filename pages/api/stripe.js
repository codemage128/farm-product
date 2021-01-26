import Plan from "../../models/Plan";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";
import e from "cors";

import customerSubscriptionDeleted from './webhooks/customer.subscription.deleted'
import customerSubscriptionUpdated from './webhooks/customer.subscription.updated'
import invoicePaymentSucceeded from './webhooks/invoice.payment_succeeded'

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePostRequest(req, res) {
  try {
    if (req.body.type === "invoice.payment_succeeded"){
      await invoicePaymentSucceeded(req.body)
    } else if (req.body.type === "customer.subscription.deleted"){
      await customerSubscriptionDeleted(req.body)
    } else if (req.body.type === "customer.subscription.updated"){
      await customerSubscriptionUpdated(req.body)
    } 
    res.writeHead(200);
    res.end('[200] Webhook received.');
  } catch (error) {
    console.error(error);
    res.writeHead(404).send(error)
  }
}

async function handleGetRequest(req, res) {
  try {
    res.writeHead(200);
    res.end('[200] Webhook received, but this API endpoint doesnt support a GET request.');
  } catch (error) {
    console.error(error);
    res.writeHead(404).send(error)
  }
}

async function handlePutRequest(req, res) {
  try {
    res.writeHead(200);
    res.end('[200] Webhook received, but this API endpoint doesnt support a PUT request.');
  } catch (error) {
    console.error(error);
    res.writeHead(404).send(error)
  }
}

async function handleDeleteRequest(req, res) {
  try {
    res.writeHead(200);
    res.end('[200] Webhook received, but this API endpoint doesnt support a DELETE request..');
  } catch (error) {
    console.error(error);
    res.writeHead(404).send(error)
  }
}


