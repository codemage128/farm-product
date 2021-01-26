import axios from "axios";
import ProductSummary from "../components/Product/ProductSummary";
import ProductAttributes from "../components/Product/ProductAttributes";
import baseUrl from "../utils/baseUrl";
import { Container, Grid, Segment } from "semantic-ui-react";

function Product(data) {
  const { user } = data
  
  return (
    <Container>
      <Segment>
        <Container>
          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <ProductAttributes user={user} {...data} />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <ProductSummary user={user} {...data} />
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    </Container>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product`;
  const payload = { params: { _id } };
  const response = await axios.get(url, payload);
  
  return response.data;
};

export default Product;


