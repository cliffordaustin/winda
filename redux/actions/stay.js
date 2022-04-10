export const typeOfStay = (payload) => (dispatch) => {
  dispatch({ type: "TYPE_OF_STAY", payload: payload });
};

export const typeOfStayImage = (payload) => (dispatch) => {
  dispatch({ type: "TYPE_OF_STAY_IMAGE", payload: payload });
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
