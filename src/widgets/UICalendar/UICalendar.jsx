import OutsideAlerter from "@/common/OutsideAlerter";
import React, { useState } from "react";
import MiniCalendar from "./MiniCalendar";
import moment from "moment/moment";

function UICalendar({ value, onChange, label }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  console.log(value);
  return (
    <div className="w-96">
      <p className="text-gray-700 mb-2 text-sm">{label}</p>
      <div className="relative h-14">
        <div className={["bg-white rounded-xl shadow-lg w-[382px] cursor-pointer absolute top-0 left-0"].join(" ")}>
          <OutsideAlerter func={() => setCalendarOpen(false)}>
            <div className="p-4" onClick={() => setCalendarOpen(!calendarOpen)}>
              <p>
                {moment(value).format("MMMM")} {moment(value).format("DD")}, {moment(value).format("YYYY")}
              </p>
            </div>
            {calendarOpen && (
              <div className="p-4 pt-0 z-20">
                <MiniCalendar value={value} onChange={onChange} close={setCalendarOpen} />
              </div>
            )}
          </OutsideAlerter>
        </div>
      </div>
    </div>
  );
}

export default UICalendar;
