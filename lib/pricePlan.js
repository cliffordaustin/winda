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

export const stayPriceOfPlanLower = (plan, non_resident, stay) => {
  if (stay) {
    return plan === "Standard" && !non_resident
      ? stay.price
      : plan === "Standard" && non_resident
      ? stay.price_non_resident
      : plan === "Deluxe" && !non_resident
      ? stay.deluxe_price
      : plan === "Family Room" && non_resident
      ? stay.family_room_price_non_resident
      : plan === "Family Room" && !non_resident
      ? stay.family_room_price
      : plan === "Deluxe" && non_resident
      ? stay.deluxe_price_non_resident
      : plan === "Super Deluxe" && !non_resident
      ? stay.super_deluxe_price
      : plan === "Super Deluxe" && non_resident
      ? stay.super_deluxe_price_non_resident
      : plan === "Studio" && !non_resident
      ? stay.studio_price
      : plan === "Studio" && non_resident
      ? stay.studio_price_non_resident
      : plan === "Double Room" && !non_resident
      ? stay.double_room_price
      : plan === "Double Room" && non_resident
      ? stay.double_room_price_non_resident
      : plan === "Single Room" && !non_resident
      ? stay.single_room_price
      : plan === "Single Room" && non_resident
      ? stay.single_room_price_non_resident
      : plan === "Tripple Room" && !non_resident
      ? stay.tripple_room_price
      : plan === "Tripple Room" && non_resident
      ? stay.tripple_room_price_non_resident
      : plan === "Quad Room" && !non_resident
      ? stay.quad_room_price
      : plan === "Quad Room" && non_resident
      ? stay.quad_room_price_non_resident
      : plan === "Queen Room" && !non_resident
      ? stay.queen_room_price
      : plan === "Queen Room" && non_resident
      ? stay.queen_room_price_non_resident
      : plan === "King Room" && !non_resident
      ? stay.king_room_price
      : plan === "King Room" && non_resident
      ? stay.king_room_price_non_resident
      : plan === "Twin Room" && !non_resident
      ? stay.twin_room_price
      : plan === "Twin Room" && non_resident
      ? stay.twin_room_price_non_resident
      : stay.price;
  } else {
    return null;
  }
};

export const activityPriceOfPlan = (plan, non_resident, activity) => {
  if (activity) {
    return plan === "PER PERSON" && !non_resident
      ? activity.price
      : plan === "PER PERSON" && non_resident
      ? activity.price_non_resident
      : plan === "PER SESSION" && !non_resident
      ? activity.session_price
      : plan === "PER SESSION" && non_resident
      ? activity.session_price_non_resident
      : plan === "PER GROUP" && !non_resident
      ? activity.group_price
      : plan === "PER GROUP" && non_resident
      ? activity.group_price_non_resident
      : activity.price;
  } else {
    return null;
  }
};

export const activityNumOfGuests = (plan, activity) => {
  if (activity) {
    return plan === "PER PERSON"
      ? activity.number_of_people
      : plan === "PER GROUP"
      ? activity.number_of_groups
      : plan === "PER SESSION"
      ? activity.number_of_sessions
      : 1;
  } else {
    return null;
  }
};

export const activityPricePerPersonResident = (plan, activity) => {
  if (activity) {
    return plan === "PER PERSON"
      ? activity.price
      : plan === "PER GROUP"
      ? activity.group_price
      : plan === "PER SESSION"
      ? activity.session_price
      : activity.price;
  } else {
    return null;
  }
};

export const activityPricePerPersonNonResident = (plan, activity) => {
  if (activity) {
    return plan === "PER PERSON"
      ? activity.price_non_resident
      : plan === "PER GROUP"
      ? activity.group_price_non_resident
      : plan === "PER SESSION"
      ? activity.session_price_non_resident
      : activity.price_non_resident;
  } else {
    return null;
  }
};

export const priceOfAdultResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.price +
          (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "DELUXE"
      ? stay.deluxe_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : stay.price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0);
  } else {
    return null;
  }
};

export const priceOfAdultNonResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.price_non_resident +
          (stay.conservation_or_park
            ? stay.conservation_or_park_price_non_resident
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : stay.price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0);
  } else {
    return null;
  }
};

export const priceOfSingleAdultResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.single_price +
          (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "DELUXE"
      ? stay.deluxe_single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0)
      : stay.single_price +
        (stay.conservation_or_park ? stay.conservation_or_park_price : 0);
  } else {
    return null;
  }
};

export const priceOfSingleAdultNonResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.single_price_non_resident +
          (stay.conservation_or_park
            ? stay.conservation_or_park_price_non_resident
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0)
      : stay.single_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_price_non_resident
          : 0);
  } else {
    return null;
  }
};

export const priceOfChildrenResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.children_price +
          (stay.conservation_or_park
            ? stay.conservation_or_park_children_price
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : stay.children_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0);
  } else {
    return null;
  }
};

export const priceOfChildrenNonResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.children_price_non_resident +
          (stay.conservation_or_park
            ? stay.conservation_or_park_children_price_non_resident
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : stay.children_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0);
  } else {
    return null;
  }
};

export const priceOfSingleChildResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.single_child_price +
          (stay.conservation_or_park
            ? stay.conservation_or_park_children_price
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0)
      : stay.single_child_price +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price
          : 0);
  } else {
    return null;
  }
};

export const priceOfSingleChildNonResident = (plan, stay) => {
  if (stay) {
    return plan === "STANDARD"
      ? stay.single_child_price_non_resident +
          (stay.conservation_or_park
            ? stay.conservation_or_park_children_price_non_resident
            : 0)
      : plan === "DELUXE"
      ? stay.deluxe_single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "FAMILY ROOM"
      ? stay.family_room_single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "EXECUTIVE SUITE ROOM"
      ? stay.executive_suite_room_single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "PRESIDENTIAL SUITE ROOM"
      ? stay.presidential_suite_room_single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : plan === "EMPEROR SUITE ROOM"
      ? stay.emperor_suite_room_single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0)
      : stay.single_child_price_non_resident +
        (stay.conservation_or_park
          ? stay.conservation_or_park_children_price_non_resident
          : 0);
  } else {
    return null;
  }
};
