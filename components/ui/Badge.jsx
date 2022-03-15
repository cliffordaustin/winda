import React from "react";

function Badge({ children, className = "" }) {
  return (
    <div
      className={
        "bg-[#303960] w-8 h-4 rounded-full text-white font-bold text-xs flex items-center justify-center " +
        className
      }
    >
      {children}
    </div>
  );
}

export default Badge;
