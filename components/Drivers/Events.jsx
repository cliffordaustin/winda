import React from "react";
import { createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import Table from "./Table";
import moment from "moment";

function Events({ trips }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (row) => {
          return row.row.index + 1;
        },
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => {
          return moment(value).format("Do MMM, YYYY");
        },
        style: {
          cursor: "pointer",
          fontWeight: 700,
          color: "blue",
        },
      },
      {
        Header: "Agent",
        accessor: "agent_name",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Passengers",
        accessor: "number_of_guests",
      },
      {
        Header: "Amount paid",
        accessor: "amount_paid",
        Cell: ({ value }) => {
          return `KES ${value || 0}`;
        },
      },
    ],
    []
  );

  const GlobalStyle = createGlobalStyle`
    table {
      border-spacing: 0;


      tr {
        :last-child {
          td {
            border-bottom: 0;
          }
        }
      }

      th,
      td {
        margin: 4;
        padding: 0.5rem;

        :last-child {
          border-right: 0;
        }
      }
    }
  `;

  const data = React.useMemo(() => trips, [trips]);
  return (
    <div className="px-2 overflow-x-scroll">
      <GlobalStyle></GlobalStyle>

      <div className="w-full">
        <Table columns={columns} data={data}></Table>
      </div>
    </div>
  );
}

Events.propTypes = {};

export default Events;
