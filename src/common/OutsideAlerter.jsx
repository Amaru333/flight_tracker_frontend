import React, { useEffect, useRef } from "react";

function OutsideAlerter(props) {
  function useOutsideAlerter(ref, func) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          func();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.func);

  return <div ref={wrapperRef}>{props.children}</div>;
}

export default OutsideAlerter;
