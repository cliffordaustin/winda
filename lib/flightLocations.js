export const startingLocationOptions = [
  {
    label: "Nairobi",
    value: "Nairobi",
  },
];

export const flightTypes = [
  {
    value: "ONE WAY",
    label: "One way",
  },
  {
    label: "Return",
    value: "RETURN",
  },
];

export const destinationLocationOptions = [
  {
    label: "Diani",
    value: "Diani",
  },
  {
    label: "Maasai Mara",
    value: "Maasai Mara",
  },

  {
    label: "Samburu",
    value: "Samburu",
  },
];

export const checkFlightPrice = (
  startingLocation,
  destinationLocation,
  flightType
) => {
  return startingLocation == "Nairobi" &&
    destinationLocation == "Diani" &&
    flightType == "ONE WAY"
    ? 190
    : startingLocation == "Nairobi" &&
      destinationLocation == "Diani" &&
      flightType == "RETURN"
    ? 290
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "ONE WAY"
    ? 150
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "RETURN"
    ? 240
    : startingLocation == "Nairobi" &&
      destinationLocation == "Samburu" &&
      flightType == "ONE WAY"
    ? 280
    : startingLocation == "Nairobi" &&
      destinationLocation == "Samburu" &&
      flightType == "RETURN"
    ? 400
    : "";
};
