export const stayPriceOfPlan = (plan, non_resident, stay) => {
  return plan === "STANDARD" && !non_resident
    ? stay.price
    : plan === "STANDARD" && non_resident
    ? stay.price_non_resident
    : plan === "DELUXE" && !non_resident
    ? stay.deluxe_price
    : plan === "FAMILY ROOM" && non_resident
    ? stay.family_room_price_non_resident
    : plan === "FAMILY ROOM" && !non_resident
    ? stay.family_room_price
    : plan === "DELUXE" && non_resident
    ? stay.deluxe_price_non_resident
    : plan === "SUPER DELUXE" && !non_resident
    ? stay.super_deluxe_price
    : plan === "SUPER DELUXE" && non_resident
    ? stay.super_deluxe_price_non_resident
    : plan === "STUDIO" && !non_resident
    ? stay.studio_price
    : plan === "STUDIO" && non_resident
    ? stay.studio_price_non_resident
    : plan === "DOUBLE ROOM" && !non_resident
    ? stay.double_room_price
    : plan === "DOUBLE ROOM" && non_resident
    ? stay.double_room_price_non_resident
    : plan === "SINGLE ROOM" && !non_resident
    ? stay.single_room_price
    : plan === "SINGLE ROOM" && non_resident
    ? stay.single_room_price_non_resident
    : plan === "TRIPPLE ROOM" && !non_resident
    ? stay.tripple_room_price
    : plan === "TRIPPLE ROOM" && non_resident
    ? stay.tripple_room_price_non_resident
    : plan === "QUAD ROOM" && !non_resident
    ? stay.quad_room_price
    : plan === "QUAD ROOM" && non_resident
    ? stay.quad_room_price_non_resident
    : plan === "QUEEN ROOM" && !non_resident
    ? stay.queen_room_price
    : plan === "QUEEN ROOM" && non_resident
    ? stay.queen_room_price_non_resident
    : plan === "KING ROOM" && !non_resident
    ? stay.king_room_price
    : plan === "KING ROOM" && non_resident
    ? stay.king_room_price_non_resident
    : plan === "TWIN ROOM" && !non_resident
    ? stay.twin_room_price
    : plan === "TWIN ROOM" && non_resident
    ? stay.twin_room_price_non_resident
    : stay.price;
};
