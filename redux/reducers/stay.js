const stayState = {
  stays: [
    // {
    //   id: 1,
    //   imagePaths: [
    //     "https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    //     "https://images.unsplash.com/photo-1503174971373-b1f69850bded?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2113&q=80",
    //     "https://images.unsplash.com/photo-1507149833265-60c372daea22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80",
    //     "https://images.unsplash.com/photo-1560185013-ead8277ef8ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80",
    //     "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80",
    //   ],
    //   price: 34000,
    //   rating: 4.5,
    //   numRating: 340,
    //   address: "Syokimau, Nairobi",
    //   longitude: 36.8172449,
    //   latitude: -1.2832533,
    // },
    // {
    //   id: 2,
    //   imagePaths: [
    //     "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80",
    //     "https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //   ],
    //   price: 59600,
    //   rating: 4.1,
    //   numRating: 40,
    //   address: "Kawangware, Nairobi",
    //   longitude: 36.8142449,
    //   latitude: -1.2822533,
    // },
    // {
    //   id: 3,
    //   imagePaths: [
    //     "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1541971875076-8f970d573be6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
    //     "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80",
    //     "https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80",
    //     "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //   ],
    //   price: 19600,
    //   rating: 3.2,
    //   numRating: 90,
    //   address: "Riruta, Nairobi",
    //   longitude: 36.8183449,
    //   latitude: -1.2836533,
    // },
    // {
    //   id: 4,
    //   imagePaths: [
    //     "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80",
    //     "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
    //     "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
    //     "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //     "https://images.unsplash.com/photo-1574643156929-51fa098b0394?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    //   ],
    //   price: 2600,
    //   rating: 4.2,
    //   numRating: 285,
    //   address: "Uthiru-Ruthimitu, Nairobi",
    //   longitude: 36.8164449,
    //   latitude: -1.2832953,
    // },
    // {
    //   id: 5,
    //   imagePaths: [
    //     "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
    //     "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    //     "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    //     "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/545034/pexels-photo-545034.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //   ],
    //   price: 5240,
    //   rating: 3.8,
    //   numRating: 120,
    //   address: "Kibera, Nairobi",
    //   longitude: 36.8172449,
    //   latitude: -1.2835533,
    // },
    // {
    //   id: 6,
    //   imagePaths: [
    //     "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/26139/pexels-photo-26139.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     "https://images.pexels.com/photos/545046/pexels-photo-545046.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //   ],
    //   price: 36000,
    //   rating: 2.3,
    //   numRating: 135,
    //   address: "Laini Saba, Nairobi",
    //   longitude: 36.8179449,
    //   latitude: -1.2832433,
    // },
  ],
  typeOfStay: "lodge",
  typeOfStayImage: "/images/travel-themes/campsites.jpg",
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
  page: "",
};

const stayReducer = (state = stayState, action) => {
  switch (action.type) {
    case "SET_STAYS":
      return { ...state, stays: action.payload };

    case "SET_ACTIVE_STAY":
      return { ...state, activeStay: action.payload };

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
