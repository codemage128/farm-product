// import products from "../../static/products.json";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import calculateDistance from "../../utils/calculateDistance";

connectDb();

function filterProductsWithLatLng(allProducts, lat, lng) {
  let products = allProducts.filter((item) => {
    if (!item.location.lat && !item.location.lng) {
      return;
    }

    let itemLat = item.location.lat;
    let itemLng = item.location.lng;
    let dist = calculateDistance(lat, lng, itemLat, itemLng, "M");

    if (item.deliveryArea >= dist) {
      return item;
    }
  });

  return products;
}

async function getAllProducts(slug) {
  let allProducts = [];

  if (slug) {
    const user = await User.findOne({ storeUrl: slug });
    if (user) {
      allProducts = await Product.find({ owner: user.id, active: true });
    } else {
      allProducts = [];
    }
  } else {
    allProducts = await Product.find({active: true});
  }

  return allProducts;
}

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export default async (req, res) => {
  const { page, size, lat, lng, slug } = req.query;
  // Convert querystring values to numbers
  const pageNum = Number(page);
  const pageSize = Number(size);
  let allProducts = await getAllProducts(slug);
  allProducts = filterProductsWithLatLng(allProducts, lat, lng);

  const totalDocs = allProducts.length;
  const totalPages = Math.ceil(totalDocs / pageSize);

  let products = paginate(allProducts, pageSize, pageNum);

  res.status(200).json({ products, totalPages });
};
