import React from "react";

const DropdownListTrackingPlan = ({ trackingplans, onChange }) => {
  return (
    <select
      className="text-xs p-2 cursor-pointer"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">List of all Tracking Plans</option>
      {trackingplans.map((event, index) => (
        <option key={index} value={event.name}>
          {event.name}
        </option>
      ))}
    </select>
  );
};

export default DropdownListTrackingPlan;
