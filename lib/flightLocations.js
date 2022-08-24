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
];

export const checkFlightPrice = (
  startingLocation,
  destinationLocation,
  flightType
) => {
  return startingLocation == "Nairobi" &&
    destinationLocation == "Diani" &&
    flightType == "ONE WAY"
    ? 80
    : startingLocation == "Nairobi" &&
      destinationLocation == "Diani" &&
      flightType == "RETURN"
    ? 150
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "ONE WAY"
    ? 110
    : startingLocation == "Nairobi" &&
      destinationLocation == "Maasai Mara" &&
      flightType == "RETURN"
    ? 220
    : "";
};
