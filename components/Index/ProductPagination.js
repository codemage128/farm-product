import { useRouter } from "next/router";
import { Container, Pagination } from "semantic-ui-react";

function ProductPagination({ totalPages, onPageChange }) {
  const router = useRouter();

  return (
    <Container textAlign="center" style={{ margin: "2em" }}>
      <Pagination
        defaultActivePage={1}
        totalPages={totalPages}
        onPageChange={(event, data) => {
          onPageChange(data.activePage);
        }}
      />
    </Container>
  );
}

export default ProductPagination;
