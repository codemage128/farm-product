import React from "react";
import GoogleMapReact from "google-map-react";
import {
  Form,
  Dropdown,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
  Container,
  Modal,
  Label,
  Select,
  Segment,
} from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";
import c from "../utils/constants";


const DELIVERYMETHODS = c.DELIVERYMETHODS;

const INITIAL_PRODUCT = {
  name: "",
  price: 0,
  media: "",
  description: "",
  location: { lat: 0, lng: 0 },
  deliveryArea: "",
  inventoryQuantity: 0,
  includedProducts: [],
  deliveryMethods: [],
};

const locationModalStyle = {
  maxWidth: "60%",
};

function CreateProduct({ user, farmProducts }) {
  let INIT_PRECENTER = {
    lat: 37.09024,
    lng: -95.712891,
  };

  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [preCenter, setPreCenter] = React.useState(INIT_PRECENTER);
  const [zoom, setZoom] = React.useState(5);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [modal, setModal] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");
  const [productSelect, setProductSelect] = React.useState("");
  const [deliverySelect, setDeliverySelect] = React.useState("");

  React.useEffect(() => {
    const isProduct = Object.values(product).every((el) => Boolean(el));
    const isInCludedProducts = product.includedProducts.length > 0;
    const isDeliveryMethods = product.deliveryMethods.length > 0;
    isProduct && isInCludedProducts && isDeliveryMethods ? setDisabled(false) : setDisabled(true);
  }, [product]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const mapCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setPreCenter(mapCenter);
      setProduct((prevState) => ({ ...prevState, location: mapCenter }));
    });
  }, []);

  function Marker(props) {
    const { color, name, id } = props;
    return (
      <div>
        <div
          className="pin bounce"
          style={{ backgroundColor: color, cursor: "pointer" }}
          title={name}
        />
        <div className="pulse" />
      </div>
    );
  }

  function getMapOptions(maps) {
    return {
      disableDefaultUI: true,
      mapTypeControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    };
  }

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct((prevState) => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({ ...prevState, [name]: value }));
    }
  }

  function handleMap(event) {
    const { lat, lng } = event;
    let mapCenter = {
      lat: lat,
      lng: lng,
    };

    setPreCenter(mapCenter);
  }

  function handleAddProductSelect(event, data) {
    setProductSelect(data.value);
  }

  function handleProductQuantityChange(p, data) {
    p.quantity = data.value;

    let includedProducts = product.includedProducts;

    setProduct((prevState) => ({
      ...prevState,
      includedProducts: includedProducts,
    }));
  }

  function addProduct(event) {
    event.preventDefault();
    if (productSelect) {
      let includedProducts = product.includedProducts;
      let isExist = includedProducts.some(
        (product) => product._id == productSelect
      );

      if (!isExist) {
        let product = farmProducts.find((p) => p._id === productSelect);
        includedProducts.push({ ...product, quantity: 0 });
        setProduct((prevState) => ({
          ...prevState,
          includedProducts: includedProducts,
        }));
      }
    }
  }

  function handleProductDelete(p) {
    event.preventDefault();

    let includedProducts = product.includedProducts;

    includedProducts = includedProducts.filter((item) => {
      if (item._id !== p._id) {
        return item
      }
    })

    setProduct((prevState) => ({
      ...prevState,
      includedProducts: includedProducts,
    }));
  }

  function handleAddDeliverySelect(event, data) {
    setDeliverySelect(data.value);
  }

  function addDelivery(event) {
    event.preventDefault();
    if (deliverySelect) {
      let deliveryMethods = product.deliveryMethods;
      let isExist = deliveryMethods.some(
        (delivery) => delivery.type == deliverySelect
      );

      if (!isExist) {
        let delivery = DELIVERYMETHODS.find((d) => d.type === deliverySelect);
        deliveryMethods.push({ ...delivery, price: 0, unit: "mi" });
        setProduct((prevState) => ({
          ...prevState,
          deliveryMethods: deliveryMethods,
        }));
      }
    }
  }

  function handleDeliveryPriceChange(d, data) {
    d.price = data.value;

    let deliveryMethods = product.deliveryMethods;

    setProduct((prevState) => ({
      ...prevState,
      deliveryMethods: deliveryMethods,
    }));
  }

  function handleDeliveryDelete(d) {
    event.preventDefault();

    let deliveryMethods = product.deliveryMethods;

    deliveryMethods = deliveryMethods.filter((item) => {
      if (item.type !== d.type) {
        return item
      }
    })

    setProduct((prevState) => ({
      ...prevState,
      deliveryMethods: deliveryMethods,
    }));
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("upload_preset", "rtpdev");
    data.append("cloud_name", "dmjkli4q4");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.secure_url;
    return mediaUrl;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const {
        name,
        price,
        description,
        includedProducts,
        location,
        deliveryArea,
        inventoryQuantity,
        deliveryMethods
      } = product;

      const payload = {
        name,
        price,
        description,
        includedProducts,
        deliveryMethods,
        location,
        deliveryArea,
        inventoryQuantity,
        mediaUrl,
        owner: user.id,
        farmer: user.name,
      };
      await axios.post(url, payload);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Header as="h2" block>
        <Icon name="add" color="blue" />
        Sell a Product on the Shop
      </Header>
      <Message>
        <p>
          Create products with one or more of your Farm Produce items, which will appear on the shop
        </p>
      </Message>
      <Modal open={modal} dimmer="blurring" style={locationModalStyle}>
        <Modal.Header>Select Location</Modal.Header>
        <Modal.Content>
          <div
            style={{ height: "60vh", width: "100%" }}
            id="google-map-wrapper"
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyB6fv4xpnTbQpkIBdWtk9yFSsxA084AfFE",
              }}
              defaultCenter={preCenter}
              defaultZoom={zoom}
              options={getMapOptions}
              onClick={(e) => handleMap(e)}
            >
              <Marker
                lat={preCenter.lat}
                lng={preCenter.lng}
                name="My Marker"
                color="blue"
              />
            </GoogleMapReact>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Input
            name="location"
            label="Location"
            placeholder="Location"
            value={preCenter.lat.toFixed(5) + " | " + preCenter.lng.toFixed(5)}
          />
          <Button
            primary
            icon="save"
            labelPosition="right"
            content="Confirm"
            onClick={() => {
              setModal(false);
              setProduct((prevState) => ({
                ...prevState,
                location: preCenter,
              }));
            }}
          />
          <Button
            onClick={() => {
              setModal(false);
              setProduct((prevState) => ({
                ...prevState,
                location: product.location,
              }));
              setPreCenter(product.location);
            }}
            content="Cancel"
          />
        </Modal.Actions>
      </Modal>
      <Segment>
        <Form
          loading={loading}
          error={Boolean(error)}
          success={success}
          onSubmit={handleSubmit}
        >
          <Message error header="Oops!" content={error} />
          <Message
            success
            icon="check"
            header="Success!"
            content="Your product has been posted"
          />
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="name"
              label="Name"
              placeholder="Name"
              value={product.name}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="price"
              label="Price"
              placeholder="Price"
              min="0.00"
              step="0.01"
              type="number"
              value={product.price}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="inventoryQuantity"
              label="Quantity In Inventory"
              placeholder="Quantity In Inventory"
              min="0.00"
              step="0.01"
              type="number"
              value={product.inventoryQuantity}
              onChange={handleChange}
            />
          </Form.Group>
          <label style={{ fontWeight: "bold", marginRight: "14px" }}>
            Add Product
          </label>
          <Select
            placeholder="Add Product"
            options={farmProducts.map((farmProduct) => {
              return {
                key: farmProduct._id,
                text: farmProduct.name,
                value: farmProduct._id,
              };
            })}
            onChange={handleAddProductSelect}
          />
          <Button
            primary
            style={{
              marginLeft: "30px",
              marginBottom: "15px",
              marginTop: "15px",
            }}
            onClick={addProduct}
          >
            ADD
          </Button>
          {product.includedProducts.map((p) => {
            return (
              <Form.Group widths="equal" key={p._id}>
                <Form.Field
                  control={Input}
                  name="name"
                  placeholder="Name"
                  value={p.name}
                  readOnly={true}
                />
                <Form.Field
                  control={Input}
                  name="quantity"
                  placeholder="Quantity"
                  min="0.00"
                  step="0.01"
                  type="number"
                  value={p.quantity}
                  onChange={(e, data) => handleProductQuantityChange(p, data)}
                />
                <Form.Field
                  control={Input}
                  name="unit"
                  placeholder={p.unit}
                  type="text"
                  value={p.unit}
                  readOnly={true}
                />
                <Form.Field
                  control={Button}
                  color="blue"
                  icon="trash alternate"
                  content="Delete"
                  onClick={(e) => handleProductDelete(p)}
                />
              </Form.Group>
            );
          })}<br />
          <label style={{ fontWeight: "bold", marginRight: "12px" }}>
            Add Delivery
          </label>
          <Select
            placeholder="Add Delivery"
            options={DELIVERYMETHODS.map((delivery) => {
              return {
                key: delivery.type,
                text: delivery.text,
                value: delivery.type,
              };
            })}
            onChange={handleAddDeliverySelect}
          />
          <Button
            primary
            style={{
              marginLeft: "30px",
              marginBottom: "15px",
              marginTop: "15px",
            }}
            onClick={addDelivery}
          >
            ADD
          </Button>
          {product.deliveryMethods.map((d) => {
            if (d.type === "localdrop_delivery") {
              d.price = 1;
            }
            return (
              <Form.Group widths="equal" key={d.type}>
                <Form.Field
                  control={Input}
                  name="d_text"
                  placeholder="Type"
                  value={d.text}
                  readOnly={true}
                />
                <Form.Field
                  control={Input}
                  name="d_price"
                  placeholder="Price"
                  min="0.00"
                  step="0.01"
                  type="number"
                  value={d.price}
                  onChange={(e, data) => handleDeliveryPriceChange(d, data)}
                  readOnly={d.type === "customer_pickup" || d.type === "localdrop_delivery"}
                />
                <Form.Field
                  control={Input}
                  name="d_unit"
                  placeholder={d.unit}
                  type="text"
                  value={d.unit}
                  readOnly={true}
                />
                <Form.Field
                  control={Button}
                  color="blue"
                  icon="trash alternate"
                  content="Delete"
                  onClick={(e) => handleDeliveryDelete(d)}
                />
              </Form.Group>
            );
          })}
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="location"
              label="Location"
              placeholder="Location"
              value={
                product.location.lat.toFixed(5) +
                " | " +
                product.location.lng.toFixed(5)
              }
              onClick={(e) => {
                e.keydown = false;
                setModal(true);
              }}
              icon={{ name: "map", circular: true, link: true }}
            />
            <Form.Field
              control={Input}
              type="number"
              name="deliveryArea"
              label="Delivery Area"
              placeholder="Delivery Area"
              value={product.deliveryArea}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
            <Form.Field
              control={Input}
              name="media"
              type="file"
              label="Image"
              accept="image/*"
              content="Select Image"
              onChange={handleChange}
            />
          </Form.Group>

          <Image src={mediaPreview} rounded centered size="small" />
          <Form.Field
            control={TextArea}
            name="description"
            label="Description"
            placeholder="Description"
            onChange={handleChange}
            value={product.description}
          />
          <Form.Field
            control={Button}
            disabled={disabled || loading}
            color="blue"
            icon="pencil alternate"
            content="Submit"
            type="submit"
          />
        </Form>
      </Segment>
    </Container>
  );
}

CreateProduct.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { farmProducts: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/farmProducts`;
  const response = await axios.get(url, payload);

  return response.data;
};

export default CreateProduct;
