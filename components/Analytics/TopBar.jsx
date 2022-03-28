import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";

function TopBar() {
  return (
    <div className="flex sticky top-0 z-50 px-12 items-center justify-between h-16 bg-gray-100">
      <Link href="/">
        <a className="font-lobster text-xl relative w-28 h-9 cursor-pointer">
          <Image
            layout="fill"
            alt="Logo"
            src="/images/winda_logo/horizontal-blue-font.png"
            priority
          ></Image>
        </a>
      </Link>
      <div className="flex gap-5 items-center">
        <div className="relative">
          <NotificationsNone />
          <div className="bg-red-600 w-4 h-4 text-white text-sm font-bold top-0 absolute right-0 rounded-full flex justify-center items-center">
            2
          </div>
        </div>
        <div>
          <Language></Language>
        </div>
        <div>
          <Settings></Settings>
        </div>
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            layout="fill"
            alt="Logo"
            className="object-cover"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          ></Image>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
