export const getRecommendeTripUrl = (router) => {
  return `${process.env.NEXT_PUBLIC_baseURL}/recommended-trips/?honeymoon=${
    router.query.tag === "honeymoon" ? "true" : ""
  }&family=${router.query.tag === "family" ? "true" : ""}&cultural=${
    router.query.tag === "cultural" ? "true" : ""
  }&weekend_getaway=${
    router.query.tag === "weekend_getaway" ? "true" : ""
  }&road_trip=${
    router.query.tag === "road_trip" ? "true" : ""
  }&romantic_getaway=${
    router.query.tag === "romantic_getaway" ? "true" : ""
  }&active=${router.query.tag === "active" ? "true" : ""}&lake=${
    router.query.tag === "lake" ? "true" : ""
  }&cycling=${router.query.tag === "cycling" ? "true" : ""}&walking=${
    router.query.tag === "walking" ? "true" : ""
  }&friends=${router.query.tag === "friends" ? "true" : ""}&couples=${
    router.query.tag === "couples" ? "true" : ""
  }&beach=${router.query.tag === "beach" ? "true" : ""}&game=${
    router.query.tag === "game" ? "true" : ""
  }&caves=${router.query.tag === "caves" ? "true" : ""}&surfing=${
    router.query.tag === "surfing" ? "true" : ""
  }&tropical=${router.query.tag === "tropical" ? "true" : ""}&camping=${
    router.query.tag === "camping" ? "true" : ""
  }&hiking=${router.query.tag === "hiking" ? "true" : ""}&mountain=${
    router.query.tag === "mountain" ? "true" : ""
  }&cabin=${router.query.tag === "cabin" ? "true" : ""}&lake=${
    router.query.tag === "lake" ? "true" : ""
  }&desert=${router.query.tag === "desert" ? "true" : ""}&treehouse=${
    router.query.tag === "treehouse" ? "true" : ""
  }&boat=${router.query.tag === "boat" ? "true" : ""}&creative_space=${
    router.query.tag === "creative space" ? "true" : ""
  }&months=${router.query.month || ""}&pricing_type=${
    router.query.price === "1"
      ? "REASONABLE"
      : router.query.price === "2"
      ? "MID RANGE"
      : router.query.price === "3"
      ? "LUXURY"
      : ""
  }&location=${router.query.location || ""}`;
};
