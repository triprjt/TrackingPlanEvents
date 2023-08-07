import React from "react";
import { useState } from "react";

const DropdownList = ({ events, onButtonClick, status }) => {
  const [itemSelect, setItemSelect] = useState("");
  return (
    <div>
      <div className=" flex gap-5">
        <select
          className="text-xs p-1 border border-gray-200 cursor-pointer"
          onChange={(e) => {
            setItemSelect(e.target.value);
          }}
        >
          <option value="">List of all events</option>
          {events.map((event, index) => (
            <option key={index} value={event.name}>
              {event.name}
            </option>
          ))}
        </select>
        <button
          className=" bg-indigo-600 text-white text-xs p-1 rounded"
          onClick={() => {
            onButtonClick(itemSelect);
          }}
        >
          Select Event
        </button>
      </div>
      {status && <label className="text-red-500 text-xs">{status}</label>}
    </div>
  );
};

export default DropdownList;
