import React, { useEffect, useState } from "react";
import axios from "axios";
import us_airport_list from "../../const/us_airport_list.json";

import { useRouter } from "next/router";
import moment from "moment";
import UIDropDown from "@/widgets/UIDropDown/UIDropDown";
import UICalendar from "@/widgets/UICalendar/UICalendar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loader from "./loader.json";
import Lottie from "react-lottie";
import Head from "next/head";

function FlightsPage() {
  const router = useRouter();
  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [flightData, setFlightData] = useState();
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const origin_data = us_airport_list.filter((airport) => airport?.iata == router.query.src)[0];
  const destination_data = us_airport_list.filter((airport) => airport?.iata == router.query.dest)[0];

  const [selectedOrigin, setSelectedOrigin] = useState(us_airport_list.filter((airport) => airport?.iata == router.query.src)[0]);
  const [selectedDestination, setSelectedDestination] = useState(us_airport_list.filter((airport) => airport?.iata == router.query.dest)[0]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const subscribeUser = () => {
    axios
      .get(
        `http://localhost:5000/flight-price-subscribe?origin=${selectedOrigin?.iata}&destination=${selectedDestination?.iata}&date=${
          moment(date).format("YYYY") + moment(date).format("MM") + moment(date).format("DD")
        }&phone_number=${phNo}&email=${email}`
      )
      .then((res) => (res.data == "Already Subscribed" ? notifyError(res.data) : notifySuccess(res.data)))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/flight-price?origin=${us_airport_list.filter((airport) => airport?.iata == router.query.src)[0]?.iata}&destination=${
          us_airport_list.filter((airport) => airport?.iata == router.query.dest)[0]?.iata
        }&date=${router?.query?.date}`
      )
      .then((res) => {
        setFlightData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        notifyError("Something went wrong. Please try again");
        setLoading(false);
      });
    setSelectedOrigin(us_airport_list.filter((airport) => airport?.iata == router.query.src)[0]);
    setSelectedDestination(us_airport_list.filter((airport) => airport?.iata == router.query.dest)[0]);
    setDate(moment(router.query.date, "YYYYMMDD").toDate());
  }, [router.isReady]);

  const title = `${origin_data?.city} (${origin_data?.iata}) - ${destination_data?.city} (${destination_data?.iata})`;
  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center cursor-default">
        <Lottie options={defaultOptions} width={700} height={290} />
        <p class="animate-pulse">Finding the cheapest flight...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl m-auto px-8">
      <ToastContainer />
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex-row justify-between grid grid-cols-4 gap-5 mt-16">
        <div className="flex items-center justify-center">
          <UIDropDown list={us_airport_list?.filter((air) => air?.iata != selectedDestination?.iata)} value={selectedOrigin} onChange={setSelectedOrigin} placeholder="Origin airport" label="Origin" />
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
        <div className="w-full items-center justify-center flex mt-8">
          <a
            href={"/flights/?src=" + selectedOrigin.iata + "&dest=" + selectedDestination.iata + "&date=" + moment(date).format("YYYY") + moment(date).format("MM") + moment(date).format("DD")}
            target="_blank"
          >
            <button className="p-4 bg-orange-500 text-white hover:bg-orange-400 transition-colors">Search Cheapest Flight</button>
          </a>
        </div>
      </div>

      <div>
        <div className="flex flex-row justify-between my-16 mb-20">
          <div className="flex flex-col items-center">
            <p className="text-sm">
              {moment(flightData?.dept_time?.month, "MM").format("MMMM")}&nbsp;
              {moment(flightData?.dept_time?.day, "DD").format("DD")}, {moment(flightData?.dept_time?.year, "YYYY").format("YYYY")}
            </p>
            <p className="text-4xl font-semibold">
              {moment(flightData?.dept_time?.hour, "h").format("HH")}:{moment(flightData?.dept_time?.minute, "m").format("mm")}
            </p>
            <p>
              <span className="font-semibold text-2xl text-orange-500">{origin_data?.iata} </span>
              {origin_data?.name}
            </p>
            <p className="text-sm">
              {origin_data?.city}, {origin_data?.state} ({origin_data?.country})
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center flex-col mx-16">
            <p className="text-sm mb-1 text-orange-500 font-semibold">
              {moment.duration(flightData?.duration, "minutes").hours()}hrs {moment.duration(flightData?.duration, "minutes").minutes()}mins
            </p>
            <div className="w-full h-px bg-orange-500"></div>
            <p className="text-xs mt-1 text-gray-500">{flightData?.stops} stops</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm">
              {moment(flightData?.arr_time?.month, "MM").format("MMMM")}&nbsp;
              {moment(flightData?.arr_time?.day, "DD").format("DD")}, {moment(flightData?.arr_time?.year, "YYYY").format("YYYY")}
            </p>
            <p className="text-4xl font-semibold">
              {moment(flightData?.arr_time?.hour, "h").format("HH")}:{moment(flightData?.arr_time?.minute, "m").format("mm")}
            </p>
            <p>
              <span className="font-semibold text-2xl text-orange-500">{destination_data?.iata} </span>
              {destination_data?.name}
            </p>
            <p className="text-sm">
              {destination_data?.city}, {destination_data?.state} ({destination_data?.country})
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <div className="flex flex-col items-center justify-self-center">
            <p className="text-sm mb-2">Operated by</p>
            <div className="flex flex-col justify-center">
              <img src={flightData?.carrier?.imageUrl} className="h-16 w-fit" />
              <p className="text-center">
                {flightData?.carrier?.name} ({flightData?.carrier?.iata})
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm mb-4 font-medium">Get notified everytime the price gets cheaper until your journey date</p>
            {/* < */}
            <label for="email" className="text-sm">
              Email
            </label>
            <input className="p-2 outline-none border-none w-full shadow-md mb-3 rounded-lg" id="email" placeholder="abc@xyz.com" onChange={(e) => setEmail(e.target.value)} />
            <label for="phone" className="text-sm">
              Phone No
            </label>
            <input className="p-2 outline-none border-none w-full shadow-md mb-3 rounded-lg" id="phone" type="tel" placeholder="+0000000000" onChange={(e) => setPhNo(e.target.value)} />
            <button className="p-4 py-2 bg-orange-500 text-white hover:bg-orange-400 transition-colors mt-2" onClick={subscribeUser}>
              Subscribe
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col items-center justify-self-center mr-12">
              <p className="text-sm">Cheapest Fare</p>
              <p className="text-xs mt-1">
                {flightData?.currency} <span className="text-4xl font-semibold">{flightData?.tracked_min_price}</span>
              </p>
            </div>
            <div>
              <a href={flightData?.link} target="_blank">
                <button className="p-4 bg-orange-500 text-white hover:bg-orange-400 transition-colors">Book now</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightsPage;
