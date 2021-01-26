import React from "react";
import { Input, Modal, Button, Header, Grid, Select, Divider, Label } from "semantic-ui-react";
import { useRouter } from "next/router";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import c from "../../utils/constants";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";
import cookie from "js-cookie";


const DELIVERYMETHODS = c.DELIVERYMETHODS;
const locationModalStyle = {
  maxWidth: "25%",
};

function AddProductToCart({ user, price, productId, deliveryMethods }) {
  const [quantity, setQuantity] = React.useState(1);
  const [options, setOptions] = React.useState([]);
  const [optionSelect, setOptionSelect] = React.useState('');
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  React.useEffect(() => {
    let optionList = [];
    deliveryMethods.map(item => {
      return DELIVERYMETHODS.filter(d => {
        if (item.type === d.type) {
          return optionList.push({
            key: d.type,
            text: d.text + " ( $" + item.price + "/" + item.unit + " )"
          });
        }
      });
    });
    setOptions(optionList);
  }, []);

  function handleModal() {
    setModal(true);
  }

  function handleDeliverySelect(e, data) {
    setOptionSelect(data.value)
  }

  async function handleAddProductToCart() {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const userId = user.id
      const payload = {
        quantity,
        productId,
        deliveryMethod: optionSelect,
        userId,
        price
      };
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
      router.push("/cart")
    }
  }

  return (
    <>
      <Modal open={modal} dimmer="blurring" style={locationModalStyle}>
        <Modal.Header>Select Delivery Method</Modal.Header>
        <Modal.Content>
          <Select
            placeholder="Please Select Delivery Method"
            options={options.map(item => {
              return {
                key: item.key,
                text: item.text,
                value: item.key
              }
            })}
            onChange={handleDeliverySelect}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            icon="save"
            labelPosition="right"
            content="Confirm"
            disabled={optionSelect === ''}
            onClick={() => {
              setModal(false);
              handleAddProductToCart();
            }}
          />
          <Button
            onClick={() => {
              setModal(false);
              setOptionSelect('')
            }}
            content="Cancel"
          />
        </Modal.Actions>
      </Modal>
      <Input
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={event => setQuantity(Number(event.target.value))}
        action={
          user && success
            ? {
              color: "blue",
              content: "Item Added!",
              icon: "plus cart",
              disabled: true
            }
            : user
              ? {
                color: "red",
                content: "Add to Cart",
                icon: "plus cart",
                loading,
                disabled: loading,
                onClick: handleModal
              }
              : {
                color: "blue",
                content: "Sign Up",
                icon: "signup",
                onClick: () => router.push("/signup")
              }
        }
      />
    </>
  );
}

export default AddProductToCart;
