import cookie from "js-cookie"
import Router from "next/router"

export function handleLogin(token, role) {
  cookie.set("token", token)
  Router.push("/dashboard")
}

export function handleForgotPassword(token) {
  //cookie.set("token", token) //set this if you want to log them out after
  Router.push("/")
  //console.log('password reset email sent')
}

export function redirectUser(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location })
    ctx.res.end()
  } else {
    Router.push(location)
  }
}

export function handleLogout() {
  cookie.remove("token")
  window.localStorage.setItem("logout", Date.now())
  Router.push("/login")
}
