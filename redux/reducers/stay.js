const stayState = {
  stays: [],
  typeOfStay: "lodge",
  describesLodge: [],
  activeStay: null,
  describesCampsite: [],
  describesBoutiqueHotel: [],
  describesUniqueSpace: [],
  describesHouse: [],
  currentSwiperIndex: 1,
  amenities: [],
  viewState: {
    longitude: 36.8172449,
    latitude: -1.2832533,
    zoom: 14,
  },
  stayDetails: {
    rooms: 0,
    bathrooms: 0,
    beds: 0,
    guests: "",
    isEnsuite: false,
  },
  uniqueAboutPlace: "",
  descriptionAboutPlace: "",
  priceConversionRate: null,
  filteredStays: null,
  filterStayLoading: false,
  currentCartItems: [],
};

const stayReducer = (state = stayState, action) => {
  switch (action.type) {
    case "SET_STAYS":
      return { ...state, stays: action.payload };

    case "SET_CURRENT_CART_ITEMS":
      return { ...state, currentCartItems: action.payload };

    case "SET_FILTERED_STAYS_LOADING_FALSE":
      return { ...state, filterStayLoading: false };

    case "SET_FILTERED_STAYS_LOADING_TRUE":
      return { ...state, filterStayLoading: true };

    case "SET_FILTERED_STAYS":
      return { ...state, filteredStays: action.payload };

    case "SET_PRICE_CONVERSION":
      return { ...state, priceConversionRate: action.payload };

    case "SET_ACTIVE_STAY":
      return { ...state, activeStay: action.payload };

    case "TYPE_OF_STAY":
      return { ...state, typeOfStay: action.payload };

    case "DESCRIBES_CAMPSITE":
      return { ...state, describesCampsite: action.payload };

    case "DESCRIBES_LODGE":
      return { ...state, describesLodge: action.payload };

    case "DESCRIBES_UNIQUE_SPACE":
      return { ...state, describesUniqueSpace: action.payload };

    case "DESCRIBES_BOUTIQUE_HOTEL":
      return { ...state, describesBoutiqueHotel: action.payload };

    case "DESCRIBES_HOUSE":
      return { ...state, describesHouse: action.payload };

    case "UPDATE_SWIPER_INDEX":
      return { ...state, currentSwiperIndex: action.payload };

    case "UPDATE_AMENITIES":
      return { ...state, amenities: action.payload };

    case "UPDATE_VIEW_STATE":
      return { ...state, viewState: action.payload };

    case "UPDATE_STAY_DETAILS":
      return { ...state, stayDetails: action.payload };

    case "UPDATE_UNIQUE_ABOUT_PLACE":
      return { ...state, updateUniqueAboutPlace: action.payload };

    case "UPDATE_DESCRIPTION_ABOUT_PLACE":
      return { ...state, updateDescriptionAboutPlace: action.payload };

    default:
      return state;
  }
};

export default stayReducer;
