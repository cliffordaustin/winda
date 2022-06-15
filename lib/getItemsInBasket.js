import axios from "axios";
import Cookies from "js-cookie";

export const getItemsInBasket = async () => {
  const token = Cookies.get("token");
  const cart = Cookies.get("cart");

  if (token) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const activitiesCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const transportCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const newCart = [];

    data.results.forEach((result) => {
      newCart.push(result.stay);
    });

    const newActivitiesCart = [];

    activitiesCart.data.results.forEach((result) => {
      newActivitiesCart.push(result.activity);
    });

    const newTransportCart = [];

    transportCart.data.results.forEach((result) => {
      newTransportCart.push(result.transport);
    });

    return {
      cart: newCart,
      activitiesCart: newActivitiesCart,
      allItemsInActivityCart: activitiesCart.data.results,
      allItemsInCart: data.results,
      transportCart: newTransportCart,
      allItemsInTransportCart: transportCart.data.results,
    };
  } else if (cart) {
    const cartItems = [];
    const activitiesCart = [];
    const transportCart = [];

    cart = JSON.parse(decodeURIComponent(cart));

    for (const item of cart) {
      if (item.itemCategory === "stays") {
        await axios
          .get(`${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/`)
          .then((res) => {
            cartItems.push({
              ...res.data,
              from_date: item.from_date,
              to_date: item.to_date,
              num_of_adults: item.num_of_adults,
              num_of_children: item.num_of_children,
              plan: item.plan,
              non_resident: item.non_resident,
            });
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else if (item.itemCategory === "activities") {
        await axios
          .get(`${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/`)
          .then((res) => {
            activitiesCart.push({
              ...res.data,
              number_of_people: item.number_of_people,
              number_of_sessions: item.number_of_sessions,
              number_of_groups: item.number_of_groups,
              from_date: item.from_date,
              non_resident: item.non_resident,
              pricing_type: item.pricing_type,
            });
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else if (item.itemCategory === "transport") {
        await axios
          .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/`)
          .then((res) => {
            transportCart.push({
              ...res.data,
              starting_point: item.starting_point,
              destination: item.destination,
              distance: item.distance,
              user_need_a_driver: item.user_need_a_driver,
              from_date: item.from_date,
              number_of_days: item.number_of_days,
            });
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }

    return {
      cart: cartItems,
      userProfile: "",
      activitiesCart: activitiesCart,
      transportCart: transportCart,
      allItemsInActivityCart: [],
      allItemsInCart: [],
      allItemsInTransportCart: [],
    };
  }

  return {
    userProfile: "",
    cart: [],
    activitiesCart: [],
    transportCart: [],
    allItemsInActivityCart: [],
    allItemsInCart: [],
    allItemsInTransportCart: [],
  };
};