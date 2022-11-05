export const getRecommendeTripUrl = (router, isSecondTrip = false) => {
  let tags = router.query.tag || "";
  tags = tags.split(",");
  return `${process.env.NEXT_PUBLIC_baseURL}/${
    isSecondTrip ? "curated-trips" : "recommended-trips"
  }/?cultural=${tags.includes("cultural") ? "true" : ""}&weekend_getaway=${
    tags.includes("weekend_getaway") ? "true" : ""
  }&family=${tags.includes("family") ? "true" : ""}&romantic=${
    tags.includes("romantic") ? "true" : ""
  }&road_trip=${tags.includes("road_trip") ? "true" : ""}&day_game_drives=${
    tags.includes("day_game_drives") ? "true" : ""
  }&culinary=${tags.includes("culinary") ? "true" : ""}&day_trips=${
    tags.includes("day_trips") ? "true" : ""
  }&community_owned=${
    tags.includes("community_owned") ? "true" : ""
  }&off_grid=${tags.includes("off_grid") ? "true" : ""}&solo_getaway=${
    tags.includes("solo_getaway") ? "true" : ""
  }&wellness=${
    tags.includes("wellness") ? "true" : ""
  }&unconventional_safaris=${
    tags.includes("unconventional_safaris") ? "true" : ""
  }&walking_hiking=${tags.includes("walking_hiking") ? "true" : ""}&shopping=${
    tags.includes("shopping") ? "true" : ""
  }&art=${tags.includes("art") ? "true" : ""}&watersports=${
    tags.includes("watersports") ? "true" : ""
  }&sailing=${tags.includes("sailing") ? "true" : ""}&night_game_drives=${
    tags.includes("night_game_drives") ? "true" : ""
  }&sustainable=${tags.includes("sustainable") ? "true" : ""}&all_female=${
    tags.includes("all_female") ? "true" : ""
  }&family=${tags.includes("family") ? "true" : ""}&groups=${
    tags.includes("groups") ? "true" : ""
  }&luxury=${tags.includes("luxury") ? "true" : ""}&budget=${
    tags.includes("budget") ? "true" : ""
  }&mid_range=${tags.includes("mid_range") ? "true" : ""}&beach=${
    tags.includes("beach") ? "true" : ""
  }&short_getaways=${
    tags.includes("short_getaways") ? "true" : ""
  }&cross_country=${tags.includes("cross_country") ? "true" : ""}&lake=${
    tags.includes("lake") ? "true" : ""
  }&park_conservancies=${tags.includes("park_conservancies") ? "true" : ""}
  &page=${router.query.page ? router.query.page : 1}&pricing_type=${
    router.query.price === "1"
      ? "REASONABLE"
      : router.query.price === "2"
      ? "MID RANGE"
      : router.query.price === "3"
      ? "LUXURY"
      : ""
  }&old_price=${router.query.deals === "1" ? 1 : ""}&location=${
    router.query.location || ""
  }&has_holiday_package=${router.query.holiday === "1" ? "true" : ""}`;
};
