const activitiesState = {
  activities: [],
  activeActivity: null,
  filterActivitiesLoading: false,
};

const activitiesReducer = (state = activitiesState, action) => {
  switch (action.type) {
    case "SET_ACTIVITIES":
      return { ...state, activities: action.payload };

    case "SET_ACTIVE_ACTIVITY":
      return { ...state, activeActivity: action.payload };

    case "SET_FILTERED_ACTIVITIES_LOADING_FALSE":
      return { ...state, filterActivitiesLoading: false };

    case "SET_FILTERED_ACTIVITIES_LOADING_TRUE":
      return { ...state, filterActivitiesLoading: true };

    default:
      return state;
  }
};

export default activitiesReducer;
