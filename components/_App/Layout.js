import Head from "next/head";
import {
  Container,
  Segment,
  Divider,
  Grid,
  Icon,
  List,
  Button,
} from "semantic-ui-react";
import Header from "./Header";
import Link from "next/link";
import HeadContent from "./HeadContent";

function Layout({ children, user }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta charSet="utf-8" />
        <HeadContent />
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
        />
        <title>LocalDrop.org - Get Local Products - A Virtual Farmers Market Revoluntizing How We Get Food.</title>
        <meta
          name="description"
          content="Get farm fresh food directly to you door. LocalDrop is a Virtal Farmers Market that works directly with local farmers and producers to delivery the freshest food possible, directly to your door. Revoluntionizing how we get food."
        />
        <script src="https://js.stripe.com/v3/" />
        <script
          async
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6fv4xpnTbQpkIBdWtk9yFSsxA084AfFE"
        ></script>
      </Head>
      <Header user={user} />
      <main className="layoutWrap">{children}</main>
      <footer>
        <Segment inverted vertical>
          <Divider inverted section />
          <Container textAlign="left" className="small-text-center">
            <Grid.Row>
              <a
                href="https://twitter.com/localdroporg"
                className="site-header__icon site-header__cart"
              >
                <i aria-hidden="true" className="twitter big icon"></i>
              </a>
              {/* <a href="https://www.youtube.com/channel/UC5NXgel7pKP-vzviHxiDqcA?view_as=subscriber" className="site-header__icon site-header__cart"><i aria-hidden="true" className="youtube big icon"></i></a> */}
            </Grid.Row>
            <List horizontal inverted divided link size="small">
              © 2020 &nbsp;
              <List.Item as="a" href="/">
                Rare Ventures, LLC
              </List.Item>
            </List>
          </Container>
        </Segment>
      </footer>
    </>
  );
}

export default Layout;
