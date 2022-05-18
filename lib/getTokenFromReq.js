export default function getTokenFromReq(req) {
  let token;
  if (req) {
    if (req.headers.cookie) {
      token = req.headers.cookie.split(";").map((element) => element.trim());
      token = token.find((c) => c.startsWith("token="));

      if (token) {
        token = token.split("=")[1];
      }
    }
  }
  return token;
}
