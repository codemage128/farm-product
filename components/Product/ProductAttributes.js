import React from "react";
import { Header, Button, Modal, Image } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { useRouter } from "next/router";

function ProductAttributes(products) {
  const { description, _id, owner, mediaUrl } = products.product
  const user = products.user
  const [modal, setModal] = React.useState(false);
  const router = useRouter();
  const isRoot = user && Object.assign({},user.roles)[0] === "root";
  const isAdmin = user && Object.assign({},user.roles)[0] === "admin";
  const isOwner = user && user.id === owner;
  const isRootOrAdmin = isRoot || isAdmin;

  async function handleDelete() {
    const url = `${baseUrl}/api/product`;
    const payload = { params: { _id } };
    await axios.delete(url, payload);
    router.push("/");
  }

  return (
    <>
      <Image src={mediaUrl} size="large" />
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      {isRoot && (
        <>
          <Button
            icon="trash alternate outline"
            color="red"
            content="Delete Product"
            onClick={() => setModal(true)}
          />
          <Modal open={modal} dimmer="blurring">
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete this product?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setModal(false)} content="Cancel" />
              <Button
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={handleDelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductAttributes;
