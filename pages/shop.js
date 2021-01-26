import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ProductList from "../components/Index/ProductList";
import ProductPagination from "../components/Index/ProductPagination";
import baseUrl from "../utils/baseUrl";
import { Grid, Modal, Input, Button, Loader, Dimmer } from "semantic-ui-react";
import GoogleMapReact from "google-map-react";

const INIT_LATLNG = {
  isLoad: false,
  lat: 39.75304,
  lng: -104.95737,
};

const locationModalStyle = {
  maxWidth: "60%",
};

const loaderStyle = {
  marginTop: "30vh",
  backgroundColor: "transparent",
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = React.useState(true);
  const [location, setLocation] = useState(INIT_LATLNG);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const mapCenter = {
          isLoad: true,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(mapCenter);
        setModal(false);
      },
      function (error) {
        if (error.code == error.PERMISSION_DENIED)
          console.log("Please turn on your location permission");

        const mapCenter = {
          isLoad: true,
          lat: INIT_LATLNG.lat,
          lng: INIT_LATLNG.lng,
        };

        setLocation(mapCenter);
        setModal(true);
      }
    );
  }, []);

  useEffect(() => {
    if (location.isLoad) {
      getProducts(location)
        .then((response) => {
          setLoading(false);
          setProducts(response.products);
          setTotalPages(response.totalPages);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            let { errors } = err.response.data;
            console.log(errors);
          } else {
            console.log("There is a server connection Error, Try Later.");
          }
        });
    }
  }, [location]);

  function handleMap(event) {
    const { lat, lng } = event;
    let mapCenter = {
      isLoad: true,
      lat: lat,
      lng: lng,
    };

    setLocation(mapCenter);
  }

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

  async function getProducts(location, activePage) {
    let page = 1;

    if (activePage) {
      page = activePage;
    }

    const lat = location.lat;
    const lng = location.lng;
    const size = 9;
    const url = `${baseUrl}/api/products`;
    const payload = { params: { page, size, lat, lng } };
    const response = await axios.get(url, payload);

    return response.data;
  }

  function onPageChange(activePage) {
    setLoading(true);
    getProducts(location, activePage)
      .then((response) => {
        setLoading(false);
        setProducts(response.products);
        setTotalPages(response.totalPages);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          let { errors } = err.response.data;
          console.log(errors);
        } else {
          console.log("There is a server connection Error, Try Later.");
        }
      });
  }

  return (
    <Grid columns="equal" stackable container>
      <Grid.Column>
        <Dimmer active={loading} inverted style={loaderStyle}>
          <Loader size="large">Loading Products in Your Area</Loader>
        </Dimmer>
        <Modal open={modal} dimmer="blurring" style={locationModalStyle}>
          <Modal.Header>Select Your Current Location</Modal.Header>
          <Modal.Content>
            <div
              style={{ height: "60vh", width: "100%" }}
              id="google-map-wrapper"
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyB6fv4xpnTbQpkIBdWtk9yFSsxA084AfFE",
                }}
                defaultCenter={location}
                defaultZoom={zoom}
                options={getMapOptions}
                onClick={(e) => handleMap(e)}
              >
                <Marker
                  lat={location.lat}
                  lng={location.lng}
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
              value={location.lat.toFixed(5) + " | " + location.lng.toFixed(5)}
            />
            <Button
              primary
              icon="save"
              labelPosition="right"
              content="Confirm"
              onClick={() => {
                setModal(false);
                setLocation(location);
              }}
            />
            <Button
              onClick={() => {
                setModal(false);
              }}
              content="Cancel"
            />
          </Modal.Actions>
        </Modal>
        <ProductList products={products} />
        <ProductPagination
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </Grid.Column>
    </Grid>
  );
}

export default Shop;
