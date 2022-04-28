export default function getCart(context) {
  let cart;
  if (context.req) {
    if (context.req.headers.cookie) {
      cart = context.req.headers.cookie
        .split(";")
        .map((element) => element.trim());
      cart = cart.find((c) => c.startsWith("cart="));

      if (cart) {
        cart = cart.split("=")[1];
      }
    }
  }

  return cart;
}
