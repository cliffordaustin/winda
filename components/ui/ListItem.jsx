import React from "react";
import PropTypes from "prop-types";

function ListItem({ children, className = "" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
      </div>
      <p className={"text-sm " + className}>{children}</p>
    </div>
  );
}

ListItem.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ListItem;
