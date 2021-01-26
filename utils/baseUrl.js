const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://localdrop.org"
    : "http://localhost:3000"

    
export default baseUrl
