import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import PropTypes from "prop-types";

function PopoverBox({
  children,
  btnPopover,
  btnClassName = "",
  panelClassName = "",
  popoverClassName = "",
}) {
  return (
    <Popover className={"relative " + popoverClassName}>
      <Popover.Button className={"outline-none " + btnClassName}>
        {btnPopover}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className={"absolute z-[30] " + panelClassName}>
          {({ close }) => (
            <>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    close: close,
                  });
                }
                return child;
              })}
            </>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

PopoverBox.propTypes = {
  children: PropTypes.node.isRequired,
  btnPopover: PropTypes.node.isRequired,
};

export default PopoverBox;
