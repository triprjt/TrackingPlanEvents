import React from "react";

const DropdownList = ({ events, onChange }) => {
  return (
    <select
      className="text-xs p-2 cursor-pointer"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">List of all events</option>
      {events.map((event, index) => (
        <option key={index} value={event.name}>
          {event.name}
        </option>
      ))}
    </select>
  );
};

export default DropdownList;
