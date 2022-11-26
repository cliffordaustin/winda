export const stayUrl = (query, allStays = false) => {
  let tags = query.tag || "";
  tags = tags.split(",");

  return `${process.env.NEXT_PUBLIC_baseURL}/${
    allStays ? "all-stays" : "stays"
  }/?search=${query.search ? query.search : ""}&d_search=${
    query.d_search ? query.d_search : ""
  }&page=${query.page ? query.page : 1}&type_of_stay=${
    query.type_of_stay ? query.type_of_stay : ""
  }&pricing_type=${query.pricing_type ? query.pricing_type : ""}&min_capacity=${
    query.min_capacity ? query.min_capacity : ""
  }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
    query.max_price ? query.max_price : ""
  }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
    query.max_rooms ? query.max_rooms : ""
  }&min_beds=${query.min_beds ? query.min_beds : ""}&max_beds=${
    query.max_beds ? query.max_beds : ""
  }&min_bathrooms=${
    query.min_bathrooms ? query.min_bathrooms : ""
  }&max_bathrooms=${query.max_bathrooms ? query.min_bathrooms : ""}&ordering=${
    query.ordering ? query.ordering : ""
  }&tented_camp=${tags.includes("tented_camp") ? "true" : ""}&lodge=${
    tags.includes("lodge") ? "true" : ""
  }&house=${tags.includes("house") ? "true" : ""}&campsite=${
    tags.includes("campsite") ? "true" : ""
  }&weekend_getaway=${
    tags.includes("weekend_getaway") ? "true" : ""
  }&romantic_getaway=${
    tags.includes("romantic_getaway") ? "true" : ""
  }&group_getaway=${tags.includes("group_getaway") ? "true" : ""}&conservancy=${
    tags.includes("conservancy") ? "true" : ""
  }&farmstay=${
    tags.includes("farmstay") ? "true" : ""
  }&national_park_game_reserves=${
    tags.includes("national_park_game_reserves") ? "true" : ""
  }&lakefront=${tags.includes("lakefront") ? "true" : ""}&beachfront=${
    tags.includes("beachfront") ? "true" : ""
  }&luxurious=${tags.includes("luxurious") ? "true" : ""}&beautiful_view=${
    tags.includes("beautiful_view") ? "true" : ""
  }&off_grid=${tags.includes("off_grid") ? "true" : ""}&eco_stay=${
    tags.includes("eco_stay") ? "true" : ""
  }&quirky=${tags.includes("quirky") ? "true" : ""}&honeymoon_spot=${
    tags.includes("honeymoon_spot") ? "true" : ""
  }&unique_experiences=${
    tags.includes("unique_experiences") ? "true" : ""
  }&traditional=${tags.includes("traditional") ? "true" : ""}&mansion=${
    tags.includes("mansion") ? "true" : ""
  }&over_water=${
    tags.includes("over_water") ? "true" : ""
  }&stunning_architecture=${
    tags.includes("stunning_architecture") ? "true" : ""
  }&riverfront=${tags.includes("riverfront") ? "true" : ""}&private_house=${
    tags.includes("private_house") ? "true" : ""
  }&resort=${tags.includes("resort") ? "true" : ""}&boutique_hotel=${
    tags.includes("boutique_hotel") ? "true" : ""
  }&unique_space=${
    tags.includes("unique_space") ? "true" : ""
  }&unique_location=${tags.includes("unique_location") ? "true" : ""}&hotel=${
    tags.includes("hotel") ? "true" : ""
  }&cottage=${tags.includes("cottage") ? "true" : ""}&coworking_spot=${
    tags.includes("coworking_spot") ? "true" : ""
  }&fast_wifi=${tags.includes("fast_wifi") ? "true" : ""}&locally_owned=${
    tags.includes("locally_owned") ? "true" : ""
  }&carbon_neutral=${
    tags.includes("carbon_neutral") ? "true" : ""
  }&owner_operated=${
    tags.includes("owner_operated") ? "true" : ""
  }&community_owned=${tags.includes("community_owned") ? "true" : ""}&popular=${
    tags.includes("popular") ? "true" : ""
  }&wellness_retreat=${
    tags.includes("wellness_retreat") ? "true" : ""
  }&has_holiday_package=${query.holiday === "1" ? "true" : ""}`;
};
