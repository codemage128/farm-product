import React from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
  Container,
  Segment,
} from "semantic-ui-react";
import { parseCookies } from "nookies";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_DATA = {
  _id: "",
  location: "",
  storeUrl: "",
  media: "",
};

function MyFarm({ user }) {
  const [userData, setUserData] = React.useState(INITIAL_DATA);
  const [mediaPreview, setMediaPreview] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let { location, mediaUrl, _id, name, storeUrl } = user;
    location = location ? location : "";
    storeUrl = storeUrl ? storeUrl : "";
    setUserData({ location, _id, storeUrl, name, media: mediaUrl });
    setMediaPreview(mediaUrl);
  }, [user]);

  React.useEffect(() => {
    const isUserData = userData.location && userData.media && userData.storeUrl && userData.name;
    isUserData ? setDisabled(false) : setDisabled(true);
  }, [userData]);

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "media") {
      if (files[0]) {
        setUserData((prevState) => ({ ...prevState, media: files[0] }));
        setMediaPreview(window.URL.createObjectURL(files[0]));
      }
    } else {
      setUserData((prevState) => ({ ...prevState, [name]: value }));
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", userData.media);
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
      setSuccess(false);
      const { location, _id, storeUrl, name, media } = userData;
      let mediaUrl = null;
      if (typeof media != "string") mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/myFarm`;
      const payload = {
        _id,
        location,
        name,
        storeUrl,
        mediaUrl,
      };
      await axios.put(url, payload);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Segment>
        <Header as="h2" block>
          My Store
        </Header>
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
            content="Your store has been updated."
          />
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="name"
              label="Name"
              placeholder="My Amazing Farm"
              value={userData.name}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              name="location"
              label="Location"
              placeholder="Location"
              value={userData.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              name="storeUrl"
              label="My Store URL"
              placeholder="My Store URL"
              value={userData.storeUrl}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
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

export default MyFarm;
