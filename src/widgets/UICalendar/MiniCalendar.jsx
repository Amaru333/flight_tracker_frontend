import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import "../../styles/calendar.css";

export default function MiniCalendar({ value, onChange, close }) {
  return (
    <Calendar
      onChange={(val, event) => {
        onChange(val);
        close(false);
      }}
      value={value}
      selectRange={false}
      view={"month"}
      minDate={new Date()}
    />
  );
}
