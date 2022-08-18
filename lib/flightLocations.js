export const startingLocationOptions = [
  {
    label: "Nairobi",
    value: "Nairobi",
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
    label: "Malindi",
    value: "Malindi",
  },
  {
    label: "Lamu",
    value: "Lamu",
  },
  {
    label: "Samburu",
    value: "Samburu",
  },
  {
    label: "Nanyuki",
    value: "Nanyuki",
  },
  {
    label: "Arusha",
    value: "Arusha",
  },
  {
    label: "Dar-es-Salaam",
    value: "Dar-es-Salaam",
  },
  {
    label: "Kigali",
    value: "Kigali",
  },
  {
    label: "Serengeti",
    value: "Serengeti",
  },
  {
    label: "Kampala",
    value: "Kampala",
  },
];

export const checkFlightPrice = (startingLocation, destinationLocation) => {
  return startingLocation == "Nairobi" && destinationLocation == "Diani"
    ? 80
    : startingLocation == "Nairobi" && destinationLocation == "Malindi"
    ? 300
    : startingLocation == "Nairobi" && destinationLocation == "Maasai Mara"
    ? 110
    : startingLocation == "Nairobi" && destinationLocation == "Lamu"
    ? 500
    : startingLocation == "Nairobi" && destinationLocation == "Samburu"
    ? 600
    : startingLocation == "Nairobi" && destinationLocation == "Nanyuki"
    ? 700
    : startingLocation == "Nairobi" && destinationLocation == "Arusha"
    ? 800
    : startingLocation == "Nairobi" && destinationLocation == "Dar-es-Salaam"
    ? 900
    : startingLocation == "Nairobi" && destinationLocation == "Kigali"
    ? 1000
    : startingLocation == "Nairobi" && destinationLocation == "Serengeti"
    ? 1100
    : startingLocation == "Nairobi" && destinationLocation == "Kampala"
    ? 1200
    : "";
};
