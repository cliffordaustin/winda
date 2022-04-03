import React, { useEffect } from "react";
import { logout } from "../../redux/actions/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout(router));
  }, []);
  return <div></div>;
}

export default LogoutPage;
