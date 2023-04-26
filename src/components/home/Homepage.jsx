import React, { useState } from "react";
import UICalendar from "@/widgets/UICalendar/UICalendar";
import UIDropDown from "@/widgets/UIDropDown/UIDropDown";

import us_airport_list from "../../const/us_airport_list.json";
import { useRouter } from "next/router";
import moment from "moment/moment";
import Head from "next/head";

function Homepage() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [selectedOrigin, setSelectedOrigin] = useState();
  const [selectedDestination, setSelectedDestination] = useState();

  const redirectToFlights = () => {
    router.push({
      pathname: "/flights",
      query: {
        src: selectedOrigin.iata,
        dest: selectedDestination.iata,
        date: moment(date).format("YYYY") + moment(date).format("MM") + moment(date).format("DD"),
      },
    });
  };
  return (
    <div>
      <Head>
        <title>Fly Frenzy</title>
      </Head>
      <div className="relative">
        <img src="/cover.png" className="w-full max-h-[550px] object-cover" />
        <div className="absolute top-0 left-0 w-full">
          <div className="max-w-screen-2xl m-auto px-8">
            <div>
              <img src="/logo.png" className="w-60 cursor-pointer" />
            </div>
            <div className="px-4 py-16 shadow-lg bg-white-900 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-100 rounded-lg mt-72">
              <div className="flex-row justify-between grid grid-cols-3 gap-5">
                <div className="flex items-center justify-center">
                  <UIDropDown
                    list={us_airport_list?.filter((air) => air?.iata != selectedDestination?.iata)}
                    value={selectedOrigin}
                    onChange={setSelectedOrigin}
                    placeholder="Origin airport"
                    label="Origin"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <UIDropDown
                    list={us_airport_list?.filter((air) => air?.iata != selectedOrigin?.iata)}
                    value={selectedDestination}
                    onChange={setSelectedDestination}
                    placeholder="Destination airport"
                    label="Destination"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <UICalendar value={date} onChange={setDate} label="Travel Date" />
                </div>
              </div>
              <div className="w-full items-center justify-center flex mt-8">
                <button className="p-4 bg-orange-500 text-white hover:bg-orange-400 transition-colors" onClick={redirectToFlights}>
                  Search Cheapest Flight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
