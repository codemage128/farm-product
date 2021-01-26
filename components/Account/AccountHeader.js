import { Header, Icon, Segment, Label, Image, Input } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";
import formatDate from "../../utils/formatDate";

const mediaInputStyle = {
  display: "none"
}

const mediaImageStyle = {
  width: "140px",
  height: "auto",
  display: "inline-block"
}

function AccountHeader({ _id, roles, email, name, createdAt, mediaUrl, stripeId }) {
  const [media, setMedia] = React.useState("");
  const [mediaPreview, setMediaPreview] = React.useState(mediaUrl);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if(media) handleSubmit();
  }, [media]);

  function handleChange(event) {
    const { files } = event.target;
    setMedia(files[0]);
    setMediaPreview(window.URL.createObjectURL(files[0]));
  }

  async function handleSubmit() {
    try {
      const userUrl = await handleImageUpload();
      const url = `${baseUrl}/api/account`;
      const payload = {
        _id,
        userUrl,
      };
      await axios.post(url, payload);
    } catch (error) {
      catchErrors(error, setError);
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", media);
    data.append("upload_preset", "rtpdev");
    data.append("cloud_name", "dmjkli4q4");
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.secure_url;
    return mediaUrl;
  }

  return (
    <Segment>
      <Label
        color="blue"
        size="large"
        ribbon
        icon="privacy"
        style={{ textTransform: "capitalize" }}
        content={roles}
      />
      <Header textAlign="center" as="h1" icon>
        <label title="Change Your Image">
          {mediaPreview ?
            <>
              <Image
                src={mediaPreview}
                alt="avatar"
                style={mediaImageStyle}
              />
              <br />
            </> :
            <Icon name="user" color="grey" />
          }
          <Input
            type="file"
            name="media"
            label="Image"
            accept="image/*"
            content="Select Image"
            onChange={handleChange}
            style={mediaInputStyle}
          />
        </label>
        {name}
        <Header.Subheader>{email}</Header.Subheader>
      </Header>
    </Segment >
  );
}

export default AccountHeader;
