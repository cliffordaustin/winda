import React, { useEffect } from "react";
import { logout } from "../../redux/actions/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout(router));
  }, []);
  return (
    <div>
      <Head>
        <title>Logout</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  );
}

export default LogoutPage;
