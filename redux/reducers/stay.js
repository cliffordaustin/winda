const stayState = {
  stays: [],
  typeOfStay: "lodge",
  typeOfStayImage: "/images/travel-themes/campsites.jpg",
  describesLodge: [],
  describesCampsite: [],
  describesBoutiqueHotel: [],
  describesUniqueSpace: [],
  describesHouse: [],
  currentSwiperIndex: 1,
  amenities: [],
};

const stayReducer = (state = stayState, action) => {
  switch (action.type) {
    case "TYPE_OF_STAY":
      return { ...state, typeOfStay: action.payload };

    case "TYPE_OF_STAY_IMAGE":
      return { ...state, typeOfStayImage: action.payload };

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

    default:
      return state;
  }
};

export default stayReducer;
