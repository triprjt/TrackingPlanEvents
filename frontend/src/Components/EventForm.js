import React from "react";

const EventForm = ({ event, onChange, error, statusMessage, onSubmit }) => (
  <div className="p-4 container justify-center rounded">
    <div className="flex flex-row mb-2 gap-10 items-center">
      <label className="w-80 text-left text-sm">Name:</label>
      <div className="flex flex-wrap w-3/4">
        <input
          type="text"
          placeholder="Name"
          required
          value={event.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          className="p-2 w-3/4 h-8 font-light text-sm rounded border border-gray-400"
          autoFocus
        />
        {error.name && (
          <span className="text-red-500 text-xs">{error.name}</span>
        )}
      </div>
    </div>
    <div className="flex flex-row gap-10 mb-2 items-center">
      <label className="w-80 text-left text-sm">Description:</label>
      <div className="flex flex-wrap w-3/4">
        <input
          type="text"
          placeholder="Description"
          value={event.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          className="p-2 w-3/4 h-8 font-light text-sm gap-48 border border-gray-400 rounded"
          disabled={!event.name}
        />
      </div>
    </div>
    <div className="flex flex-row gap-10">
      <label className="w-80 text-left text-sm">Rules:</label>
      <div className="flex flex-wrap w-3/4">
        <textarea
          placeholder="Rules (JSON)"
          required
          value={event.rules || ""}
          onChange={(e) => onChange("rules", e.target.value)}
          className="p-2 w-3/4 h-36 font-light text-sm border border-gray-400 rounded resize-none"
          disabled={!event.name}
        />
        {error.json && (
          <span className="text-red-500 text-xs">{error.json}</span>
        )}
      </div>
    </div>
    <div className="flex flex-col justify-center items-center mt-4">
      {error.APIError && (
        <span className="text-red-500 text-xs">{error.APIError}</span>
      )}
      <button
        onClick={onSubmit}
        className="p-2 m-2 bg-green-500 text-white text-sm rounded"
      >
        Create Event
      </button>
    </div>
  </div>
);

export default EventForm;
