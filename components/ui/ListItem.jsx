import React from "react";
import PropTypes from "prop-types";

function ListItem({ children }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
      <p className="text-sm">{children}</p>
    </div>
  );
}

ListItem.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ListItem;
