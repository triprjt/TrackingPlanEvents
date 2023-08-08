import React, { useState } from "react";
import DBService from "../Service/DBService";
import DropdownListTrackingPlan from "./DropdownListTrackingPlan";

const TrackingPlan = ({
  trackingPlan,
  onChange,
  error,
  trackinPlanNameRef,
  onNameChange,
  trackingplans,
  statusDropdown,
}) => {
  const [sourceInput, setSourceInput] = useState(trackingPlan.source || "");
  const [isEditingSource, setIsEditingSource] = useState(false);
  const [status, setStatus] = useState({});
  const handleAddSourceClick = () => {
    setIsEditingSource(true);
  };

  const handleCloseClick = () => {
    setIsEditingSource(false);
    setSourceInput("");
    setStatus({ ...status, source: "" });
  };

  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  const handleCancel = () => {};
  const handleDropdownbuttonClick = (nameDropdown) => {
    onNameChange(nameDropdown);
  };
  const checkSourceAvailable = async (source_name) => {
    try {
      let res = await DBService.getSourceByName(source_name);

      if (res.success) {
        setStatus({
          ...status,
          source: "This source is already assigned to a Tracking Plan.",
        });
      }
    } catch (error) {
      if (sourceInput) {
        setStatus({
          ...status,
          source: "This source name is not assigned to any Tracking Plan",
        });
      } else {
        setStatus({ ...status, source: "Field cannot be empty" });
      }
    }
  };

  const checkTrackingNameAvailable = async (nameInput) => {
    try {
      let { success, data, error } = await DBService.fetchData(
        `trackingplans/${nameInput}/`
      );
      if (success) {
        console.log("////" + nameInput);
        onNameChange(nameInput);
        setStatus({
          ...status,
          name: "Tracking Plan with this name is present already",
        });
      }
    } catch (error) {
      setStatus({
        ...status,
        name: "Tracking Plan with this name available",
      });
    }
  };

  const handleSaveSource = async (sourceName) => {
    const sourceData = {
      name: sourceName, // add other fields as required
    };
    try {
      const response = await DBService.saveSourceToDB(sourceData);

      setTimeout(() => {
        onChange("source", sourceName);
      }, 0);
    } catch (error) {
      // Display the error message
      // setAPIError(error.message);
    }
  };
  const debouncedSourceCheck = debounce(checkSourceAvailable, 800);
  const debouncedNameCheck = debounce(checkTrackingNameAvailable, 800);

  const handleSourceInputChange = (e) => {
    e.preventDefault();
    // setError(null);
    const value = e.target.value;
    if (value.length === 0) {
      // setError("Name cannot be null");
    } else {
      debouncedSourceCheck(value);
    }
    setSourceInput(value);
  };
  const handleNameInputChange = (e) => {
    let value = e.target.value;
    if (value.length === 0) {
      setStatus({ ...status, name: "Name cannot be null" });
    } else {
      debouncedNameCheck(value);
    }

    onChange("name", value);
  };

  return (
    <div>
      <div className="p-4 container justify-center rounded">
        <div className="flex items-center flex-row gap-10">
          <label className="w-56 text-left text-sm">Name:</label>
          <div className="flex flex-wrap w-3/4">
            <input
              ref={trackinPlanNameRef}
              type="text"
              placeholder="Name"
              required
              value={trackingPlan.name}
              onChange={handleNameInputChange}
              className="p-2 w-full m-2 h-8 font-light text-sm rounded border border-gray-400"
            />
            {status.name && (
              <label className=" block text-xs text-red-600">
                {status.name}
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-12  items-center">
          <label className="w-72 text-left text-sm">Description:</label>
          <input
            type="text"
            placeholder="Description"
            value={trackingPlan.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="p-2 w-full m-2 h-8 font-light text-sm border border-gray-400 rounded"
          />
        </div>
        <div className="flex gap-6 flex-row ">
          <label className="w-48 mt-4 text-left text-sm">Source:</label>
          {trackingPlan.source ? (
            <label>{trackingPlan.source}</label>
          ) : isEditingSource ? (
            <>
              <div className="flex m-2 flex-col ">
                <input
                  type="text"
                  placeholder="source"
                  value={sourceInput}
                  onChange={handleSourceInputChange}
                  className="p-2 w-full h-8 font-light text-sm border border-gray-400 rounded"
                />

                {status.source && (
                  <label className=" w-full text-xs text-red-600">
                    {status.source}
                  </label>
                )}

                <div className=" flex flex-wrap gap-5 ">
                  <button
                    onClick={() => {
                      handleSaveSource(sourceInput);
                    }}
                    disabled={
                      !sourceInput.trim() ||
                      status.source ===
                        "This source is already assigned to a Tracking Plan."
                    }
                    className={`bg-blue-500 text-white rounded ${
                      !sourceInput.trim() ||
                      status.source ===
                        "This source is already assigned to a Tracking Plan."
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCloseClick}
                    className=" bg-red-600 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-8 p-1 rounded">
                <label className="mr-2">None</label>
                <div className="flex gap-3 items-center flex-wrap">
                  <button
                    onClick={handleAddSourceClick}
                    className="bg-blue-500 items-center hover:bg-blue-700 transition-colors duration-200 w-5 h-5 text-white rounded text-center leading-5"
                  >
                    +
                  </button>
                  <label
                    className="block text-blue-500 text-xs cursor-pointer"
                    onClick={handleAddSourceClick}
                  >
                    Add source
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
        <span className=" text-red-500 text-xs ">{error}</span>
      </div>
      <div className="flex m-4 flex-wrap justify-center">
        <DropdownListTrackingPlan
          trackingplans={trackingplans}
          onButtonClick={handleDropdownbuttonClick}
          status={statusDropdown}
        />
      </div>
    </div>
  );
};

export default TrackingPlan;
