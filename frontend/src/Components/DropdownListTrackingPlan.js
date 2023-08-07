import React, { useState } from "react";

const DropdownListTrackingPlan = ({ trackingplans, onButtonClick, status }) => {
  const [itemSelect, setItemSelect] = useState("");
  return (
    <div>
      <div className=" flex gap-5">
        <select
          className="text-xs border border-gray-200 p-1 cursor-pointer"
          onChange={(e) => setItemSelect(e.target.value)}
        >
          <option value="">List of all Tracking Plans</option>
          {trackingplans.map((event, index) => (
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
          Select Plan
        </button>
      </div>
      {status && <label className="text-red-500 text-xs">{status}</label>}
    </div>
  );
};

export default DropdownListTrackingPlan;
