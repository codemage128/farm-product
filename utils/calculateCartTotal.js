function calculateCartTotal(products) {
  const total = products.reduce((acc, el) => {
    if (el.distance) {
      acc += el.price * el.quantity + el.distance * el.deliveryPrice;
    } else {
      acc += el.price * el.quantity
    }
    return acc
  }, 0)
  const cartTotal = ((total * 100) / 100).toFixed(2)
  const stripeTotal = Number((total * 100).toFixed(2))

  return { cartTotal, stripeTotal }
}

export default calculateCartTotal
