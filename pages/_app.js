import App from "next/app";
import Layout from "../components/_App/Layout";
import { parseCookies, destroyCookie } from "nookies";
import { redirectUser } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import {Provider} from 'react-redux'
import axios from "axios";
import Router from "next/router";
import withRedux from 'next-redux-wrapper'
import { initStore } from '../redux/store'

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      const { token } = parseCookies(ctx);
      
      let pageProps = {};

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }
      
      if (!token) {
        const isProtectedRoute =
          ctx.pathname === "/account" || 
          ctx.pathname === "/create" || 
          ctx.pathname === "/subscription" || 
          ctx.pathname === "/settings" || 
          ctx.pathname === "/approveFarms" || 
          ctx.pathname === "/addFarmProduct" || 
          ctx.pathname === "/dashboard" || 
          ctx.pathname === "/myOrders" || 
          ctx.pathname === "/createFarmProduct" || 
          ctx.pathname === "/myProductsForSale" || 
          ctx.pathname === "/myFarm" || 
          ctx.pathname === "/editProduct" || 
          ctx.pathname === '/cart'
        if (isProtectedRoute) {
          redirectUser(ctx, "/login");
        }
      } else {
        try {
          const payload = { headers: { Authorization: token } };
          const url = `${baseUrl}/api/account`;
          const response = await axios.get(url, payload);
          const user = response.data;
          
          const isRoot = Object.assign({},user.roles)[0] === "root";
          const isAdmin = Object.assign({},user.roles)[0] === "admin";
          const isPremium = Object.assign({},user.roles)[0] === "premium";
          const isFarmer = Object.assign({},user.roles)[0] === "farmer" || Object.assign({},user.roles)[0] === "farmerApproved";
          const isFarmerApproved = Object.assign({},user.roles)[0] === "farmerApproved";
          const isUser = Object.assign({},user.roles)[0] === "user";

          //console.log(isAdmin)
          const dontLoginAgain =
            (user) && (isFarmer) && ctx.pathname === "/login" || ctx.pathname === "/signup";
          if (dontLoginAgain) {
            redirectUser(ctx, "/dashboard");
          }

          //console.log(isAdmin)
          const dontLoginAgain2 =
            (user) && (isUser) && ctx.pathname === "/login" || ctx.pathname === "/signup";
          if (dontLoginAgain2) {
            redirectUser(ctx, "/shop");
          }

          const isNotPermitted5 =
            !(isRoot || isAdmin || isUser) && !user && (ctx.pathname === "/approveFarms");
          if (isNotPermitted5) {
            redirectUser(ctx, "/");
          }
          
          // if authenticated, but not of rolesc 'admin' or 'root', redirect from '/create' page
          const isNotPermitted =
            !(isRoot || isAdmin || isFarmer) && (ctx.pathname === "/addFarmProduct" || ctx.pathname === "/myOrders" || ctx.pathname === "/editProduct");
          if (isNotPermitted) {
            redirectUser(ctx, "/");
          }

          // if authenticated, but not of rolesc 'admin' or 'root', redirect from '/create' page
          const isNotPermitted6 =
            !(isFarmerApproved) && (ctx.pathname === "/create");
          if (isNotPermitted6) {
            redirectUser(ctx, "/dashboard");
          }

          const isNotPermitted2 =
            !(isRoot || isAdmin || isPremium) && ctx.pathname === "/premium";
          if (isNotPermitted2) {
            redirectUser(ctx, "/addPremium");
          }

          const isNotPermitted3 =
            !(isRoot || isAdmin || isPremium) && ctx.pathname === "/subscription";
          if (isNotPermitted3) {
            redirectUser(ctx, "/addPremium");
          }

          const isNotPermitted4 =
            (isPremium) && ctx.pathname === "/addPremium";
          if (isNotPermitted4) {
            redirectUser(ctx, "/subscription");
          }

          pageProps.user = user;
        } catch (error) {
          console.error("Error getting current user", error);
          // 1) Throw out invalid token
          destroyCookie(ctx, "token");
          // 2) Redirect to login
          redirectUser(ctx, "/login");
        }
      }
      return { pageProps };
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    syncLogout = event => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    render() {
      const { Component, pageProps, store } = this.props;
      return (
        <Provider store={store}> 
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      );
    }
  }
)
