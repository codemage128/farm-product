import { Card } from "semantic-ui-react";

function ProductList({ products }) {
  function mapProductsToItems(products) {
    return products.map(product => ({
      header: product.name,
      product: product.farm,
      image: product.mediaUrl,
      description: `$${product.price}`,
      id: product._id,
      color: "teal",
      fluid: true,
      childKey: product._id,
      href: `/product?_id=${product._id}`,
      extra:(
        <a>{product.farmer}</a>
      )
    }));
  }

  return (
    <Card.Group
      stackable
      itemsPerRow="3"
      centered
      items={mapProductsToItems(products)}
    />
  );
}

export default ProductList;
