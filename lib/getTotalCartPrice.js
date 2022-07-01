import {
  priceOfAdultResident,
  priceOfAdultNonResident,
  priceOfChildrenResident,
  priceOfChildrenNonResident,
  priceOfSingleAdultResident,
  priceOfSingleAdultNonResident,
  priceOfSingleChildResident,
  priceOfSingleChildNonResident,
} from "./pricePlan";

import {
  activityPricePerPersonResident,
  activityPricePerPersonNonResident,
} from "./pricePlan";

export const getStayPrice = (
  plan,
  stay,
  numOfAdults,
  numOfChildren,
  numOfChildrenNonResident,
  numOfAdultsNonResident
) => {
  const priceAdultResident = priceOfAdultResident(plan.toUpperCase(), stay);

  const priceAdultNonResident = priceOfAdultNonResident(
    plan.toUpperCase(),
    stay
  );

  const priceChildResident = priceOfChildrenResident(plan.toUpperCase(), stay);

  const priceChildNonResident = priceOfChildrenNonResident(
    plan.toUpperCase(),
    stay
  );

  const priceSingleAdultNonResident = priceOfSingleAdultNonResident(
    plan.toUpperCase(),
    stay
  );

  const priceSingleAdultResident = priceOfSingleAdultResident(
    plan.toUpperCase(),
    stay
  );

  const priceSingleChildNonResident = priceOfSingleChildNonResident(
    plan.toUpperCase(),
    stay
  );

  const priceSingleChildResident = priceOfSingleChildResident(
    plan.toUpperCase(),
    stay
  );

  return (
    (numOfAdults === 1 ? priceSingleAdultResident : priceAdultResident) *
      numOfAdults +
    (numOfAdultsNonResident === 1
      ? priceSingleAdultNonResident
      : priceAdultNonResident) *
      numOfAdultsNonResident +
    (numOfChildren === 1 ? priceSingleChildResident : priceChildResident) *
      numOfChildren +
    (numOfChildrenNonResident === 1
      ? priceSingleChildNonResident
      : priceChildNonResident) *
      numOfChildrenNonResident
  );
};

export const getActivityPrice = (
  plan,
  activity,
  numOfPeople,
  numOfSession,
  numOfGroups,
  numOfPeopleNonResident,
  numOfSessionNonResident,
  numOfGroupsNonResident
) => {
  const priceOfResident = activityPricePerPersonResident(
    plan.toUpperCase(),
    activity
  );

  const priceOfNonResident = activityPricePerPersonNonResident(
    plan.toUpperCase(),
    activity
  );

  return (
    priceOfResident *
      (plan.toUpperCase() === "PER PERSON"
        ? numOfPeople
        : plan === "PER SESSION"
        ? numOfSession
        : plan === "PER GROUP"
        ? numOfGroups
        : 1) +
    priceOfNonResident *
      (plan.toUpperCase() === "PER PERSON"
        ? numOfPeopleNonResident
        : plan === "PER SESSION"
        ? numOfSessionNonResident
        : plan === "PER GROUP"
        ? numOfGroupsNonResident
        : 1)
  );
};
