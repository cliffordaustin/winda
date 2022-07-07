import axios from "axios";

export const responseGoogle = async (response) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    access_token: response.access_token,
  });
};

export const failureResponseGoogle = async (response) => {
  console.log(response);
};
