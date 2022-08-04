import axios from "axios";

export const typeOfStay = (payload) => (dispatch) => {
  dispatch({ type: "TYPE_OF_STAY", payload: payload });
};

export const describesHouse = (payload) => (dispatch) => {
  dispatch({ type: "DESCRIBES_HOUSE", payload: payload });
};

export const describesLodge = (payload) => (dispatch) => {
  dispatch({ type: "DESCRIBES_LODGE", payload: payload });
};

export const describesBoutiqueHotel = (payload) => (dispatch) => {
  dispatch({ type: "DESCRIBES_BOUTIQUE_HOTEL", payload: payload });
};

export const describesUniqueSpace = (payload) => (dispatch) => {
  dispatch({ type: "DESCRIBES_UNIQUE_SPACE", payload: payload });
};

export const describesCampsite = (payload) => (dispatch) => {
  dispatch({ type: "DESCRIBES_CAMPSITE", payload: payload });
};

export const updateCurrentSwiperState = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_SWIPER_INDEX", payload: payload });
};

export const updateAmenities = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_AMENITIES", payload: payload });
};

export const updateViewState = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_VIEW_STATE", payload: payload });
};

export const updateStayDetails = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_STAY_DETAILS", payload: payload });
};

export const updateUniqueAboutPlace = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_UNIQUE_ABOUT_PLACE", payload: payload });
};

export const updateDescriptionAboutPlace = (payload) => (dispatch) => {
  dispatch({ type: "UPDATE_DESCRIPTION_ABOUT_PLACE", payload: payload });
};

export const setActiveStay = (payload) => (dispatch) => {
  dispatch({ type: "SET_ACTIVE_STAY", payload: payload });
};

export const setStays = (payload) => (dispatch) => {
  dispatch({ type: "SET_STAYS", payload: payload });
};

export const setFilteredStays = (router) => async (dispatch) => {
  try {
    dispatch({
      type: "SET_FILTERED_STAYS_LOADING_TRUE",
    });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
        router.query.search ? router.query.search : ""
      }&type_of_stay=${
        router.query.type_of_stay ? router.query.type_of_stay : ""
      }&min_price=${
        router.query.min_price ? router.query.min_price : ""
      }&max_price=${
        router.query.max_price ? router.query.max_price : ""
      }&min_rooms=${
        router.query.min_rooms ? router.query.min_rooms : ""
      }&max_rooms=${
        router.query.max_rooms ? router.query.max_rooms : ""
      }&ordering=${router.query.ordering}`
    );
    dispatch({ type: "SET_FILTERED_STAYS", payload: response.data.results });
    dispatch({
      type: "SET_STAYS",
      payload: response.data.results,
    });
    dispatch({
      type: "SET_FILTERED_STAYS_LOADING_FALSE",
    });
  } catch (error) {
    console.log(error);
  }
};
