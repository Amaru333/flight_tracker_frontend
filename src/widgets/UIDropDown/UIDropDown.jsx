import OutsideAlerter from "@/common/OutsideAlerter";
import React, { useEffect, useState } from "react";

function UIDropDown({ list, value, onChange, placeholder, label }) {
  const [isListOpen, setIsListOpen] = useState(false);
  const [search, setSearch] = useState(value?.state || "");

  console.log(list, search, "LIST");

  useEffect(() => {
    setSearch(value?.state);
  }, [value]);
  return (
    <div className="w-full max-w-[382px]">
      <p className="text-gray-700 mb-2 text-sm">{label}</p>
      <div className={`bg-white h-14 items-center justify-center flex flex-col rounded-t-xl ${!isListOpen && "rounded-b-xl"} shadow-lg relative px-4 mr-0 sm:mr-4`}>
        <div className="flex items-center justify-start w-full">
          {value && search && <p>({value?.iata})&nbsp;</p>}
          <input
            className="py-2 outline-none border-none w-full"
            placeholder={placeholder}
            onFocus={(e) => {
              setIsListOpen(true);
              e.target.select();
            }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            onClick={() => setIsListOpen(true)}
          />
        </div>
        {isListOpen && (
          <OutsideAlerter func={() => setIsListOpen(false)}>
            <div className="absolute top-14 left-0 bg-white w-full rounded-b-xl shadow-lg max-h-[260px] overflow-y-auto overflow-x-hidden z-10">
              {list
                .filter(
                  (item) =>
                    item?.iata?.toLowerCase().includes(search?.toLowerCase() || "") ||
                    item?.name?.toLowerCase().includes(search?.toLowerCase() || "") ||
                    item?.city?.toLowerCase().includes(search?.toLowerCase() || "") ||
                    item?.state?.toLowerCase().includes(search?.toLowerCase() || "")
                )
                .map((airport, index) => (
                  <div
                    key={index}
                    className={`flex py-2 px-4 cursor-pointer ${value?.iata == airport?.iata ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-white text-black hover:bg-amber-200"}`}
                    onClick={() => {
                      onChange(airport);
                      setSearch(airport?.state);
                      setIsListOpen(false);
                    }}
                  >
                    <div>
                      <p className="w-12">{airport?.iata}</p>
                    </div>
                    <div>
                      <p>{airport?.name}</p>
                      <p className="text-xs">
                        {airport?.city}, {airport?.state}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </OutsideAlerter>
        )}
      </div>
    </div>
  );
}

export default UIDropDown;
