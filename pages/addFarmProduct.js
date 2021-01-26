import React from "react";
import {Form,Icon,Input,Button,Message,Header,Grid,Segment,Container,TextArea} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_FARM_PRODUCT = {
  name: "",
  unit: "",
  description: "",
};

function CreateFarmProduct({user}) {
  const [farmProduct, setFarmProduct] = React.useState(INITIAL_FARM_PRODUCT);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const isFarmProduct = Object.values(farmProduct).every(el => Boolean(el));
    isFarmProduct ? setDisabled(false) : setDisabled(true);
  }, [farmProduct]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFarmProduct(prevState => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()
      setLoading(true)
      setError("")
      setSuccess(false)
      farmProduct.ownerId = user._id
      farmProduct.owner = user.username
      const url = `${baseUrl}/api/farmProduct`
      const { name, owner, unit, ownerId} = farmProduct
      const payload = { name, owner, unit, ownerId }
      await axios.post(url, payload)
      setFarmProduct(INITIAL_FARM_PRODUCT)
      setSuccess(true)
    } catch (error) {
      catchErrors(error, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header as="h2" block>
        <Icon name="add" color="blue" />
        Add Items You Produce
      </Header>
      <Message>
        <p>
          Add all the items that you create, grow, or distribute.
        </p>
      </Message>
      <Segment>
        <Grid columns='equal' stackable container>
            <Grid.Column>
                <Header as="h2" textAlign="center"></Header>
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
                    content="Your product has been created."
                />
                <Form.Group widths="equal">
                    <Form.Field
                    control={Input}
                    name="name"
                    label="Name"
                    placeholder="Name"
                    value={farmProduct.name}
                    onChange={handleChange}
                    />
                  <Form.Field
                    control={Input}
                    name="unit"
                    label="Unit of Measurement"
                    placeholder="oz, lb, each, etc."
                    value={farmProduct.unit}
                    onChange={handleChange}
                    />
                </Form.Group>
                <Form.Field
                  control={TextArea}
                  name="description"
                  label="Description"
                  placeholder="Description"
                  onChange={handleChange}
                  value={farmProduct.description}
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
            </Grid.Column>
        </Grid>
            </Segment>
    </Container>      
  );
}

export default CreateFarmProduct;
