import { Menu, Image, Icon, Dropdown } from "semantic-ui-react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import { handleLogout } from "../../utils/auth";
import { handleForgotPassword } from "../../utils/auth";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import $ from "jquery";
import swal from "sweetalert";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function Header({ user }) {
  function hamclick() {
    var menu = $("#__next .menu");
    var ham = $("#__next .hamburger");

    if (!$(ham).hasClass("active")) {
      $(ham).addClass("active");
      menu.addClass("open");
    } else {
      $(ham).removeClass("active");
      menu.removeClass("open");
    }
    event.preventDefault();
  }
  const router = useRouter();
  const isRoot = user && Object.assign({}, user.roles)[0] === "root";
  const isAdmin = user && Object.assign({}, user.roles)[0] === "admin";
  const isFarmer = user && (Object.assign({}, user.roles)[0] === "farmer" || Object.assign({}, user.roles)[0] === "farmerApproved");
  const isApprovedFarmer =
    user && Object.assign({}, user.roles)[0] === "farmerApproved";
  const isUser = user && Object.assign({}, user.roles)[0] === "user";
  const isRootOrAdmin = isRoot || isAdmin;

  function isActive(route) {
    return route === router.pathname;
  }

  async function sendEmail(event) {
    event.preventDefault();
    try {
      const url = `${baseUrl}/api/forgotPassword`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleForgotPassword(response.data);
    } catch (error) {
      console.error("sendEmail", error);
    } finally {
      swal(
        "Email Sent!",
        "Check your email and click the link inside.",
        "success"
      );
    }
  }

  const menuStyle = {
    marginBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,.08)",
  };

  return (
    <Menu style={menuStyle} inverted attached="top" stackable>
      <a href="/" className="logoLink">
        <img src="/static/images/logo.png" />
      </a>
      {isAdmin && (
        <>
          <Link href="/approveFarms">
            <Menu.Item href="/approveFarms"
              onClick={hamclick.bind(this)}
              active={isActive("/approveFarms")}
            >
              Approve Farms
            </Menu.Item>
          </Link>
        </>
      )}
      
      
      {isFarmer && (
        <>
        <Link href="/dashboard">
            <Menu.Item href="/dashboard"
              onClick={hamclick.bind(this)}
              active={isActive("/dashboard")}
            >
              Dashboard
            </Menu.Item>
          </Link>
          <Dropdown item text='My Farm'>
            <Dropdown.Menu>
              <Link href="/addFarmProduct">
                <Menu.Item href="/addFarmProduct"
                  onClick={hamclick.bind(this)}
                  active={isActive("/addFarmProduct")}
                >
                  Add Items
                </Menu.Item>
              </Link>
              {isApprovedFarmer && (
                <Link href="/create">
                  <Menu.Item href="/create" onClick={hamclick.bind(this)} active={isActive("/create")}>
                    Sell a Product
                  </Menu.Item>
                </Link>
              )}
              <Link href="/myOrders">
                <Menu.Item href="/myOrders" onClick={hamclick.bind(this)} active={isActive("/myOrders")}>
                  My Orders
                </Menu.Item>
              </Link>
              <Link href="/myProductsForSale">
                <Menu.Item href="/myProductsForSale" onClick={hamclick.bind(this)} active={isActive("/myProductsForSale")}>
                Products For Sale
                </Menu.Item>
              </Link>
              <Link href="/myFarm">
                <Menu.Item href="/myFarm" onClick={hamclick.bind(this)} active={isActive("/myFarm")}>
                  Store Information
                </Menu.Item>
              </Link> 
            </Dropdown.Menu>
          </Dropdown>
          {/* <Link href="/account">
            <Menu.Item
              onClick={hamclick.bind(this)}
              active={isActive("/account")}
            >
              Account
            </Menu.Item>
          </Link> */}
        </>
      )}
      {!user && (
        <>
        <Link href="/shop">
          <Menu.Item href="/shop" onClick={hamclick.bind(this)} active={isActive("/shop")}>
            Shop
          </Menu.Item>
        </Link>
        <Link href="/cart">
            <Menu.Item href="/cart" onClick={hamclick.bind(this)} active={isActive("/cart")}>
              Cart
            </Menu.Item>
          </Link>
        </>
      )}
      {isUser && (
        <>
          <Link href="/shop">
            <Menu.Item href="/shop" onClick={hamclick.bind(this)} active={isActive("/shop")}>
              Shop
            </Menu.Item>
          </Link>
          <Link href="/dashboard">
            <Menu.Item href="/dashboard"
              onClick={hamclick.bind(this)}
              active={isActive("/dashboard")}
            >
              Dashboard
            </Menu.Item>
          </Link>
          <Link href="/account">
            <Menu.Item href="/account"
              onClick={hamclick.bind(this)}
              active={isActive("/account")}
            >
              Account
            </Menu.Item>
          </Link>
          <Link href="/cart">
            <Menu.Item href="/cart" onClick={hamclick.bind(this)} active={isActive("/cart")}>
              Cart
            </Menu.Item>
          </Link>
        </>
      )}
      <Menu.Item position="right" className="loginButtonNav">
        {!user ? (
          <Dropdown text="Login/Sign Up" pointing="top right" icon="user">
            <Dropdown.Menu>
              <Link href="/login">
                <Dropdown.Item
                  onClick={hamclick.bind(this)}
                  icon="user"
                  text="Login"
                  exact="true"
                />
              </Link>
              <Link href="/signup">
                <Dropdown.Item
                  onClick={hamclick.bind(this)}
                  icon="add user"
                  text="Sign Up"
                  exact="true"
                  href="/signup"
                />
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Dropdown text={user.username} pointing="top right" icon="user">
            <Dropdown.Menu>
              <Link href="/subscription">
                <Dropdown.Item
                  onClick={hamclick.bind(this)}
                  icon="calendar check outline"
                  text="Subscription"
                  exact="true"
                />
              </Link>
              <Link href="/settings">
                <Dropdown.Item
                  onClick={hamclick.bind(this)}
                  icon="cog"
                  text="Settings"
                  exact="true"
                />
              </Link>
              <Dropdown.Item
                icon="user"
                exact="true"
                text="Change Password"
                onClick={sendEmail}
              />
              <Dropdown.Item
                icon="sign out"
                text="Sign Out"
                exact="true"
                onClick={handleLogout}
              />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Menu.Item>
      <div className="hamburger" onClick={hamclick.bind(this)}>
        <span className="hamburger-bun"></span>
        <span className="hamburger-patty"></span>
        <span className="hamburger-bun"></span>
      </div>
    </Menu>
  );
}

export default Header;
