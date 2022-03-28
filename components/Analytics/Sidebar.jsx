import React from "react";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  Person,
  Storefront,
  AttachMoney,
  Assessment,
  MailOutline,
  ChatBubbleOutline,
  DynamicFeed,
  Report,
  EventNote,
} from "@material-ui/icons";
import Link from "next/link";
import styles from "../../styles/Sidebar.module.css";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 py-4 overflow-y-scroll fixed w-[20%]">
      <div className="mb-6 px-4">
        <h1 className="text-base font-bold text-gray-600">Dashboard</h1>
        <div className="mt-2 ml-2">
          <Link href="/">
            <a
              className={
                styles.list + (router.pathname === "/" ? " !bg-purple-100" : "")
              }
            >
              <LineStyle></LineStyle>
              <p>Home</p>
            </a>
          </Link>

          <div className={styles.list}>
            <Timeline></Timeline>
            <p>Analytics</p>
          </div>
          <div className={styles.list}>
            <TrendingUp></TrendingUp>
            <p>Sales</p>
          </div>
        </div>
      </div>
      <div className="mb-6 px-4">
        <h1 className="text-base font-bold text-gray-600">Quick Menu</h1>
        <div className="mt-2 ml-2">
          <Link href="/user-list">
            <a
              className={
                styles.list +
                (router.pathname === "/user-list" ||
                router.pathname === "/user-list/[id]" ||
                router.pathname === "/new-user"
                  ? " !bg-purple-100"
                  : "")
              }
            >
              <Person></Person>
              <p>User</p>
            </a>
          </Link>
          <div className={styles.list}>
            <Storefront></Storefront>
            <p>Products</p>
          </div>
          <div className={styles.list}>
            <AttachMoney></AttachMoney>
            <p>Transactions</p>
          </div>
          <div className={styles.list}>
            <Assessment></Assessment>
            <p>Reports</p>
          </div>
        </div>
      </div>
      <div className="mb-6 px-4">
        <h1 className="text-base font-bold text-gray-600">Notification</h1>
        <div className="mt-2 ml-2">
          <div className={styles.list + " "}>
            <MailOutline></MailOutline>
            <p>Mail</p>
          </div>
          <div className={styles.list}>
            <DynamicFeed></DynamicFeed>
            <p>Feedbacks</p>
          </div>
          <div className={styles.list}>
            <ChatBubbleOutline></ChatBubbleOutline>
            <p>Messages</p>
          </div>
        </div>
      </div>
      <div className="mb-6 px-4">
        <h1 className="text-base font-bold text-gray-600">Staffs</h1>
        <div className="mt-2 ml-2">
          <div className={styles.list + " "}>
            <EventNote></EventNote>
            <p>Manage</p>
          </div>
          <div className={styles.list}>
            <Timeline></Timeline>
            <p>Analytics</p>
          </div>
          <div className={styles.list}>
            <Report></Report>
            <p>Reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
