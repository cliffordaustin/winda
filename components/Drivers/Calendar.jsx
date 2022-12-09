import React, { useState } from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Dialogue from "../Home/Dialogue";
import Button from "../ui/Button";
import moment from "moment/moment";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import { createGlobalStyle } from "styled-components";
import { Transition } from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Cookies from "js-cookie";
import PulseLoader from "react-spinners/PulseLoader";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

function Calendar({ trips }) {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    min-width: 20px !important;
    min-height: 20px !important;
  }
  .rdp-button {
    border-radius: 100px !important;
    font-size: 0.8rem !important;
  }
  .rdp-months {
    width: 100% !important;
  }
  .rdp-day_range_middle {
    opacity: 0.5 !important;
  }
`;

  const router = useRouter();

  const [events, setEvents] = useState(trips);

  const [activeEvent, setActiveEvent] = useState(null);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [createActiveEvent, setCreateActiveEvent] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [showEditDate, setShowEditDate] = useState(false);

  const [date, setDate] = useState(null);
  const [editDate, setEditDate] = useState(null);

  const [createTripLoading, setCreateTripLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      location: "",
      note: "",
      agent_name: "",
      passengers: "",
      amount_paid: "",
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .max(200, "This field has a max length of 200")
        .required("This field is required"),
      agent_name: Yup.string().max(200, "This field has a max length of 200"),
      passengers: Yup.number().min(1, "This field has a min value of 1"),
      amount_paid: Yup.number().min(1, "This field has a min value of 1"),
    }),
    onSubmit: (values) => {},
  });

  const formikEdit = useFormik({
    initialValues: {
      location: activeEvent ? activeEvent.location : "",
      note: activeEvent ? activeEvent.note : "",
      agent_name: activeEvent ? activeEvent.agent_name : "",
      passengers: activeEvent ? activeEvent.number_of_guests : "",
      amount_paid: activeEvent ? activeEvent.amount_paid : "",
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .max(200, "This field has a max length of 200")
        .required("This field is required"),
      agent_name: Yup.string().max(200, "This field has a max length of 200"),
      passengers: Yup.number().min(1, "This field has a min value of 1"),
      amount_paid: Yup.number().min(1, "This field has a min value of 1"),
    }),
    onSubmit: (values) => {},
  });

  const createEvent = () => {
    setCreateTripLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-driver-trip/`,
        {
          agent_name: formik.values.agent_name,
          location: formik.values.location,
          number_of_guests: formik.values.passengers,
          amount_paid: formik.values.amount_paid,
          note: formik.values.note,
          date: moment(date).format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        setCreateEventModal(false);
        setCreateTripLoading(false);
        setEvents([...events, res.data]);
        formik.resetForm();
      })
      .catch((err) => {
        setCreateTripLoading(false);
      });
  };

  const [editEventLoading, setEditEventLoading] = useState(false);

  const editEvent = (id) => {
    setEditEventLoading(true);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/driver-trips/${id}/`,
        {
          agent_name: formikEdit.values.agent_name,
          location: formikEdit.values.location,
          number_of_guests: formikEdit.values.passengers,
          amount_paid: formikEdit.values.amount_paid,
          note: formikEdit.values.note,
          date: moment(editDate).format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        setEditEventLoading(false);
        setOpenEventModal(false);
        setEvents(
          events.map((event) => {
            if (event.id === Number(id)) {
              return res.data;
            }
            return event;
          })
        );
        setShowEdit(false);
        setShowEditDate(false);
        formikEdit.resetForm();
      })
      .catch((err) => {
        setEditEventLoading(false);
      });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);

  const deletEvent = (id) => {
    setDeleteLoading(true);
    axios
      .delete(`${process.env.NEXT_PUBLIC_baseURL}/driver-trips/${id}/`, {
        headers: {
          Authorization: "Token " + Cookies.get("token"),
        },
      })
      .then((res) => {
        setDeleteLoading(false);
        setOpenEventModal(false);
        setEvents(events.filter((event) => event.id !== Number(id)));
      })
      .catch((err) => {
        setDeleteLoading(false);
      });
  };

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "3px",
  };

  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <div className="flex md:hidden justify-between px-3 items-center mb-2">
        <div></div>
        <Button
          onClick={() => {
            setDate(new Date());
            setCreateEventModal(true);
          }}
          className="w-fit px-3 flex items-center gap-1 !bg-blue-600 !outline-none !font-bold"
        >
          <span>Add an event</span>
          <Icon icon="ic:baseline-plus" />
        </Button>
      </div>
      <div className="hidden md:block">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          eventClassNames={
            "cursor-pointer !border-l-[6px] !border-t-[0px] !border-r-[0px] !border-b-[0px]"
          }
          eventClick={(info) => {
            setActiveEvent({
              ...info.event._def.extendedProps,
              id: info.event._def.publicId,
              start: info.event._instance.range.start,
              end: info.event._instance.range.end,
            });
            setOpenEventModal(true);
            setEditDate(info.event._instance.range.start);
            formikEdit.setValues({
              location: info.event._def.extendedProps.location,
              note: info.event._def.extendedProps.note,
              agent_name: info.event._def.extendedProps.agent_name,
              passengers: info.event._def.extendedProps.number_of_guests,
              amount_paid: info.event._def.extendedProps.amount_paid,
            });
          }}
          dateClick={(e) => {
            setDate(e.date);
            setCreateActiveEvent(e);
            setCreateEventModal(true);
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={{
            right: "prev,next",
          }}
          events={events.map((event) => {
            return {
              title: `${event.location} - ${event.number_of_guests} guests`,
              start: moment(event.date).format("YYYY-MM-DD"),
              ...event,
              color: event.accepted
                ? "rgba(67, 97, 238, 0.2)"
                : "rgba(252, 163, 17, 0.2)",
            };
          })}
        />
      </div>

      <div className="md:hidden">
        <FullCalendar
          plugins={[listPlugin, interactionPlugin, timeGridPlugin]}
          initialView="listWeek"
          eventClassNames={
            "cursor-pointer !border-l-[6px] !border-t-[0px] !border-r-[0px] !border-b-[0px]"
          }
          views={{
            listDay: { buttonText: "Day" },
            listWeek: { buttonText: "Week" },
            list: {
              listDayAltFormat: "dddd",
              duration: { days: 30 },
            },
          }}
          height="auto"
          eventClick={(info) => {
            setActiveEvent({
              ...info.event._def.extendedProps,
              id: info.event._def.publicId,
              start: info.event._instance.range.start,
              end: info.event._instance.range.end,
            });
            setOpenEventModal(true);
            setEditDate(info.event._instance.range.start);
            formikEdit.setValues({
              location: info.event._def.extendedProps.location,
              note: info.event._def.extendedProps.note,
              agent_name: info.event._def.extendedProps.agent_name,
              passengers: info.event._def.extendedProps.number_of_guests,
              amount_paid: info.event._def.extendedProps.amount_paid,
            });
          }}
          dateClick={(e) => {
            setDate(e.date);
            setCreateActiveEvent(e);
            setCreateEventModal(true);
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={{
            right: "prev,next",
          }}
          events={events.map((event) => {
            return {
              title: `${event.location} - ${event.number_of_guests} guests`,
              start: moment(event.date).format("YYYY-MM-DD"),
              ...event,
              color: event.accepted
                ? "rgba(67, 97, 238, 0.2)"
                : "rgba(252, 163, 17, 0.2)",
            };
          })}
        />
      </div>

      {activeEvent && (
        <Dialogue
          isOpen={openEventModal}
          closeModal={() => {
            setOpenEventModal(false);
          }}
          dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
          outsideDialogueClass="!p-0"
          dialoguePanelClassName={
            "md:!rounded-md !rounded-none !p-0 overflow-y-scroll remove-scroll " +
            (showEdit
              ? "!max-w-xl screen-height-safari md:!min-h-0 md:max-h-[500px]"
              : "!max-w-lg screen-height-safari md:!min-h-0 md:max-h-[500px]")
          }
        >
          <div className="flex justify-between px-3 py-2 bg-gray-100 border">
            <h1 className="font-bold">
              {activeEvent.start &&
                moment(activeEvent.start).format("Do MMM YYYY")}
            </h1>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setOpenEventModal(false);
              }}
              className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          {!showEdit && (
            <div className="mt-4 px-4">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <div
                  className={
                    "px-3 py-1 w-[48%] flex flex-col gap-1 bg-gray-100 border-l-4 rounded-sm " +
                    (activeEvent.accepted
                      ? "border-l-blue-600"
                      : "border-l-yellow-500")
                  }
                >
                  <p className="text-sm font-bold">Location</p>
                  <span className="text-gray-600 text-sm">
                    {activeEvent.location}
                  </span>
                </div>
                <div
                  className={
                    "px-3 py-1 w-[48%] flex flex-col gap-1 bg-gray-100 border-l-4 rounded-sm " +
                    (activeEvent.accepted
                      ? "border-l-blue-600"
                      : "border-l-yellow-500")
                  }
                >
                  <p className="text-sm font-bold">Number of guests</p>
                  <span className="text-gray-600 text-sm">
                    {activeEvent.number_of_guests} guests
                  </span>
                </div>

                <div
                  className={
                    "px-3 py-1 w-[48%] flex flex-col gap-1 bg-gray-100 border-l-4 rounded-sm " +
                    (activeEvent.accepted
                      ? "border-l-blue-600"
                      : "border-l-yellow-500")
                  }
                >
                  <p className="text-sm font-bold">Agent name</p>
                  <span className="text-gray-600 text-sm">
                    {activeEvent.agent_name}
                  </span>
                </div>
                <div
                  className={
                    "px-3 py-1 w-[48%] flex flex-col gap-1 bg-gray-100 border-l-4 rounded-sm " +
                    (activeEvent.accepted
                      ? "border-l-blue-600"
                      : "border-l-yellow-500")
                  }
                >
                  <p className="text-sm font-bold">Price</p>
                  <span className="text-gray-600 text-sm">
                    KES{activeEvent.amount_paid || activeEvent.amount_due}
                  </span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gray-100 my-3"></div>

              <div className="flex flex-col gap-1 mb-4">
                <h1 className="font-bold text-sm">Note</h1>
                <p className="text-gray-600 text-sm">
                  {activeEvent.note ? activeEvent.note : "No data"}
                </p>
              </div>

              <div className="flex justify-between gap-3 mb-2 w-[60%]">
                <Button
                  onClick={() => {
                    deletEvent(activeEvent.id);
                  }}
                  className="w-[48%] flex items-center gap-1 !bg-red-600 !outline-none !font-bold"
                >
                  <span>Delete</span>
                  <PulseLoader
                    color={"#ffffff"}
                    loading={deleteLoading}
                    cssOverride={override}
                    size={7}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Button>
                <Button
                  onClick={() => {
                    setShowEdit(true);
                  }}
                  className="!bg-blue-500 w-[48%] !outline-none !font-bold"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}

          {showEdit && (
            <div className="mt-4 px-2">
              <div
                onClick={() => {
                  setShowEdit(false);
                }}
                className="flex cursor-pointer gap-1 mb-6 items-center"
              >
                <Icon
                  className="w-6 h-6"
                  icon="material-symbols:chevron-left"
                />
                <h1 className="font-bold text-sm">Back</h1>
              </div>
              <div className="px-5 mt-4">
                <form onSubmit={formikEdit.handleSubmit}>
                  <div className="w-full relative">
                    <Input
                      name="location"
                      type="text"
                      value={formikEdit.values.location}
                      placeholder="Location"
                      errorStyle={
                        formikEdit.touched.location &&
                        formikEdit.errors.location
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        formikEdit.handleChange(e);
                      }}
                      className={"w-full placeholder:text-sm "}
                      inputClassName="!text-sm "
                      label="Name of location?"
                    ></Input>
                    {formikEdit.touched.location &&
                    formikEdit.errors.location ? (
                      <span className="text-sm font-bold text-red-400">
                        {formikEdit.errors.location}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-start justify-between mt-2">
                    <div className="w-[58%] relative">
                      <Input
                        name="agent_name"
                        type="text"
                        value={formikEdit.values.agent_name}
                        placeholder="Agent name"
                        errorStyle={
                          formikEdit.touched.agent_name &&
                          formikEdit.errors.agent_name
                            ? true
                            : false
                        }
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Name of agent"
                        {...formikEdit.getFieldProps("agent_name")}
                      ></Input>
                      {formikEdit.touched.agent_name &&
                      formikEdit.errors.agent_name ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.agent_name}
                        </span>
                      ) : null}
                    </div>

                    <div className="w-[38%] relative">
                      <Input
                        name="passengers"
                        type="number"
                        value={formikEdit.values.passengers}
                        placeholder="Passengers"
                        errorStyle={
                          formikEdit.touched.passengers &&
                          formikEdit.errors.passengers
                            ? true
                            : false
                        }
                        className={"w-full placeholder:text-sm "}
                        inputClassName="!text-sm "
                        label="Number of passengers"
                        {...formikEdit.getFieldProps("passengers")}
                      ></Input>
                      {formikEdit.touched.passengers &&
                      formikEdit.errors.passengers ? (
                        <span className="text-sm font-bold text-red-400">
                          {formikEdit.errors.passengers}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setShowEditDate((showEditDate) => !showEditDate);
                    }}
                    className="mt-4 w-fit px-2 py-1 bg-blue-600 bg-opacity-10 cursor-pointer rounded-md"
                  >
                    <span className="text-sm">
                      {moment(editDate).format("dddd, Do MMM YYYY")}
                    </span>
                  </div>

                  <Transition
                    as={React.Fragment}
                    appear
                    show={showEditDate}
                    enter="transition-all duration-500 ease-in-out"
                    enterFrom="opacity-0 max-h-0"
                    enterTo="opacity-100 max-h-[400px]"
                    leave="transition-all duration-500 ease-in-out"
                    leaveFrom="opacity-100 max-h-[400px]"
                    leaveTo="opacity-0 max-h-0"
                  >
                    <div className="">
                      <DayPicker
                        mode="single"
                        selected={editDate}
                        onSelect={(editDate) => {
                          if (editDate) {
                            setEditDate(editDate);
                          }
                        }}
                        className="!w-full p-4"
                      />
                    </div>
                  </Transition>

                  <div className="w-full relative mt-3">
                    <Input
                      name="amount_paid"
                      type="number"
                      value={formikEdit.values.amount_paid}
                      placeholder="Price"
                      errorStyle={
                        formikEdit.touched.amount_paid &&
                        formikEdit.errors.amount_paid
                          ? true
                          : false
                      }
                      className={"w-full placeholder:text-sm "}
                      inputClassName="!text-sm "
                      label="Amount that was paid"
                      {...formikEdit.getFieldProps("amount_paid")}
                    ></Input>
                    {formikEdit.touched.amount_paid &&
                    formikEdit.errors.amount_paid ? (
                      <span className="text-sm font-bold text-red-400">
                        {formikEdit.errors.amount_paid}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col mt-2">
                    <TextArea
                      placeholder="Note"
                      name="note"
                      value={formikEdit.values.note}
                      label="Enter a note"
                      errorStyle={
                        formikEdit.touched.note && formikEdit.errors.note
                          ? true
                          : false
                      }
                      className={"w-full !text-sm placeholder:text-sm "}
                      {...formikEdit.getFieldProps("note")}
                    ></TextArea>

                    {formikEdit.touched.note && formikEdit.errors.note ? (
                      <span className="text-sm font-bold text-red-400">
                        {formikEdit.errors.note}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 mb-3 flex justify-between">
                    <div></div>
                    <Button
                      onClick={() => {
                        formikEdit.setTouched({
                          location: true,
                        });
                        formikEdit.validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) {
                            editEvent(activeEvent.id);
                          }
                        });
                      }}
                      type="submit"
                      className="!bg-blue-600 flex items-center gap-1 w-fit !px-8 !outline-none !font-bold"
                    >
                      <span>Save</span>
                      <PulseLoader
                        color={"#ffffff"}
                        loading={editEventLoading}
                        cssOverride={override}
                        size={7}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Dialogue>
      )}

      <Dialogue
        isOpen={createEventModal}
        closeModal={() => {
          setCreateEventModal(false);
        }}
        dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
        outsideDialogueClass="!p-0"
        dialoguePanelClassName="!rounded-md screen-height-safari md:!min-h-0 md:max-h-[500px] !p-0 !max-w-xl overflow-y-scroll remove-scroll"
      >
        <div className="flex justify-between px-3 py-2 bg-gray-100 border">
          <h1 className="font-bold">
            {createActiveEvent
              ? moment(createActiveEvent.date).format("Do MMM YYYY")
              : "Create Event"}
          </h1>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setCreateEventModal(false);
            }}
            className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <div className="px-5 mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full relative">
              <Input
                name="location"
                type="text"
                value={formik.values.location}
                placeholder="Location"
                errorStyle={
                  formik.touched.location && formik.errors.location
                    ? true
                    : false
                }
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                className={"w-full placeholder:text-sm "}
                inputClassName="!text-sm "
                label="Name of location?"
              ></Input>
              {formik.touched.location && formik.errors.location ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.location}
                </span>
              ) : null}
            </div>
            <div className="flex items-start justify-between mt-2">
              <div className="w-[58%] relative">
                <Input
                  name="agent_name"
                  type="text"
                  value={formik.values.agent_name}
                  placeholder="Agent name"
                  errorStyle={
                    formik.touched.agent_name && formik.errors.agent_name
                      ? true
                      : false
                  }
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Name of agent"
                  {...formik.getFieldProps("agent_name")}
                ></Input>
                {formik.touched.agent_name && formik.errors.agent_name ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.agent_name}
                  </span>
                ) : null}
              </div>

              <div className="w-[38%] relative">
                <Input
                  name="passengers"
                  type="number"
                  value={formik.values.passengers}
                  placeholder="Passengers"
                  errorStyle={
                    formik.touched.passengers && formik.errors.passengers
                      ? true
                      : false
                  }
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Number of passengers"
                  {...formik.getFieldProps("passengers")}
                ></Input>
                {formik.touched.passengers && formik.errors.passengers ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.passengers}
                  </span>
                ) : null}
              </div>
            </div>

            <div
              onClick={() => {
                setShowDate((showDate) => !showDate);
              }}
              className="mt-4 w-fit px-2 py-1 bg-blue-600 bg-opacity-10 cursor-pointer rounded-md"
            >
              <span className="text-sm">
                {moment(date).format("dddd, Do MMM YYYY")}
              </span>
            </div>

            <Transition
              as={React.Fragment}
              appear
              show={showDate}
              enter="transition-all duration-500 ease-in-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-[400px]"
              leave="transition-all duration-500 ease-in-out"
              leaveFrom="opacity-100 max-h-[400px]"
              leaveTo="opacity-0 max-h-0"
            >
              <div className="">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    if (date) {
                      setDate(date);
                    }
                  }}
                  className="!w-full p-4"
                />
              </div>
            </Transition>

            <div className="w-full relative mt-3">
              <Input
                name="amount_paid"
                type="number"
                value={formik.values.amount_paid}
                placeholder="Price"
                errorStyle={
                  formik.touched.amount_paid && formik.errors.amount_paid
                    ? true
                    : false
                }
                className={"w-full placeholder:text-sm "}
                inputClassName="!text-sm "
                label="Amount that was paid"
                {...formik.getFieldProps("amount_paid")}
              ></Input>
              {formik.touched.amount_paid && formik.errors.amount_paid ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.amount_paid}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col mt-2">
              <TextArea
                placeholder="Note"
                name="note"
                value={formik.values.note}
                label="Enter a note"
                errorStyle={
                  formik.touched.note && formik.errors.note ? true : false
                }
                className={"w-full !text-sm placeholder:text-sm "}
                {...formik.getFieldProps("note")}
              ></TextArea>

              {formik.touched.note && formik.errors.note ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.note}
                </span>
              ) : null}
            </div>
            <div className="mt-4 mb-3 flex justify-between">
              <div></div>
              <Button
                onClick={() => {
                  formik.setTouched({
                    location: true,
                  });
                  formik.validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      createEvent();
                    }
                  });
                }}
                type="submit"
                className="!bg-blue-600 flex items-center gap-1 w-fit !px-8 !outline-none !font-bold"
              >
                <span>Save</span>
                <PulseLoader
                  color={"#ffffff"}
                  loading={createTripLoading}
                  cssOverride={override}
                  size={7}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </Button>
            </div>
          </form>
        </div>
      </Dialogue>
    </>
  );
}

Calendar.propTypes = {};

export default Calendar;
