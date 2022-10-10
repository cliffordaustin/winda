import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import PropTypes from "prop-types";

const Dialogue = ({
  isOpen,
  closeModal,
  title,
  children,
  dialoguePanelClassName = "",
  dialogueTitleClassName = "",
  outsideDialogueClass = "",
  backgroundClassName = "",
  panelBackgroundClassName = "",
}) => {
  return (
    <>
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            closeModal();
          }}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={
                "fixed inset-0 bg-black bg-opacity-25 " + backgroundClassName
              }
            ></div>
          </Transition.Child>

          <div
            className={
              "fixed inset-0 overflow-y-auto " + panelBackgroundClassName
            }
          >
            <div
              className={
                "flex min-h-full items-center justify-center p-4 text-center " +
                outsideDialogueClass
              }
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={
                    "w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all " +
                    dialoguePanelClassName
                  }
                >
                  <Dialog.Title
                    as="h3"
                    className={
                      "text-lg font-medium leading-6 text-gray-900 " +
                      dialogueTitleClassName
                    }
                  >
                    {title}
                  </Dialog.Title>
                  <>{children}</>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

Dialogue.propTypes = {};

export default Dialogue;
