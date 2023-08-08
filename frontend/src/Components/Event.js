import React, { useEffect, useState, useRef } from "react";
import EventForm from "./EventForm";
import TrackingPlan from "./TrackinPlan";
import DBService from "../Service/DBService";
import Ajv from "ajv";
import DropdownList from "./DropdownList";
import axios from "axios";
import EventList from "./EventList";
import DropdownListTrackingPlan from "./DropdownListTrackingPlan";
import eventSchema from "../utils/eventSchema";
import debounce from "lodash.debounce";
const baseURL = process.env.REACT_APP_API_URL;

const Events = () => {
  const [event, setEvent] = useState({});
  const [trackingPlan, setTrackingPlan] = useState({});
  const [eventFormShow, setEventFormShow] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");

  const [eventSubmitErrors, seteventSubmitErrors] = useState({});
  const [trackingPlanFormStatus, setTrackingPlanFormStatus] = useState("");

  const [eventsList, setAllEventsList] = useState([]);
  const [AllTrackingPlanList, setAllTrackingPlanList] = useState([]);

  const [visibleEventList, setvisibleEventList] = useState([]);
  const trackingPlanNameRef = useRef(null);
  const [source, setSource] = useState("");
  const [dropdownStatus, setDropdownStatus] = useState({});

  const handleEventChange = (key, value) => {
    setEvent({
      ...event,
      [key]: value,
    });
    if (key === "name" && !value) {
      seteventSubmitErrors({
        ...eventSubmitErrors,
        [key]: "Name should not be empty.",
      });
    } else if (key === "rules" && !value) {
      seteventSubmitErrors({
        ...eventSubmitErrors,
        [key]: "Json should not be empty",
      });
    } else {
      seteventSubmitErrors({});
    }
  };

  const handleTrackinPlanChange = (key, value) => {
    if (key === "source") {
      setSource(value);
    }
    setTrackingPlan({
      ...trackingPlan,
      [key]: value,
    });
  };

  // Delete event handler
  const handleDeleteEvent = async (index) => {
    const eventNameToDelete = visibleEventList[index].name;

    const trackingPlanName = trackingPlan.name;
    if (trackingPlanName) {
      try {
        await axios.delete(
          `${baseURL}/trackingplan/${trackingPlanName}/remove/${eventNameToDelete}/`
        );

        // Remove the deleted event from the local state
        const updatedEvents = [...visibleEventList];
        updatedEvents.splice(index, 1);
        setvisibleEventList(updatedEvents);

        //Set a success message
        alert(`Event ${eventNameToDelete} deleted successfully.`);
      } catch (error) {
        setStatusMessage(`Failed while deleting event ${eventNameToDelete}`);
      }
    } else {
      const updatedEvents = [...visibleEventList];
      updatedEvents.splice(index, 1);
      setvisibleEventList(updatedEvents);
      alert(`Event ${eventNameToDelete} deleted successfully.`);
    }
  };

  const updateVisibleEventsList = (inputData) => {
    let eventNameArray = inputData.events;
    const fetchedEvents = eventNameArray
      .map((eventName) => eventsList.find((event) => event.name === eventName))
      .filter(Boolean); // Filters out any undefined items if an event name doesn't have a matching object

    // Update the visibleEventList with these full event objects
    setvisibleEventList(fetchedEvents);
  };
  const handleAddTrackingPlan = async (nameSelectTrackingPlan) => {
    let message = "";
    if (nameSelectTrackingPlan) {
      let { success, data, error } = await DBService.fetchData(
        `trackingplans/${nameSelectTrackingPlan}/`
      );

      if (success) {
        console.log(JSON.stringify(data));
        setTrackingPlan(data);
        updateVisibleEventsList(data);
        message = "Done!";
      } else {
        message = "An error occurred while fetching the tracking plan:";
      }
    } else {
      message = "Tracking Plan option cannot be an empty value";
    }
    setDropdownStatus({ ...dropdownStatus, TrackingPlan: message });
    setTimeout(() => {
      setDropdownStatus({ ...dropdownStatus, TrackingPlan: "" });
    }, 1500);
  };

  const handleAddEvent = (nameSelectedEvent) => {
    let message = "";

    const eventToAdd = eventsList.find(
      (event) => event.name === nameSelectedEvent
    );

    // Check if the event with nameSelectedEvent exists in visibleEventList
    const isEventPresent = visibleEventList.some(
      (event) => event.name === nameSelectedEvent
    );

    setvisibleEventList((prevList) => {
      if (isEventPresent) {
        // Replace the existing event with the new one
        message = "Already present in the list";
        return prevList.map((event) =>
          event.name === nameSelectedEvent ? eventToAdd : event
        );
      } else {
        // Add the new event to the list
        message = "Done!";
        return [...prevList, eventToAdd];
      }
    });

    // Update the dropdown status and clear it after 1.5 seconds.
    setDropdownStatus({ ...dropdownStatus, event: message });
    setTimeout(() => {
      setDropdownStatus((prevStatus) => ({ ...prevStatus, event: "" }));
    }, 1500);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Request initiated");
      const { success, data, error } = await DBService.fetchData("events/");
      if (success) {
        setAllEventsList(data);
        console.log("Request accepted");
      } else {
        console.error("An error occurred while fetching the event list", error);
      }
    };

    const fetchTrackingPlans = async () => {
      console.log("Request initiated");
      const { success, data, error } = await DBService.fetchData(
        "trackingplans/"
      );
      if (success) {
        setAllTrackingPlanList(data);
        console.log("Request accepted");
      } else {
        console.error(
          "An error occurred while fetching tracking plan list:",
          error
        );
      }
    };

    fetchEvents();
    fetchTrackingPlans();
    setSource(trackingPlan.source);
  }, []);

  // const handleEventList = (event)=>{
  //   if(checkAllList(event) && )
  // }

  const ValidateEvent = (obj) => {
    const ajv = new Ajv();

    const validate = ajv.compile(eventSchema);

    const valid = validate(obj);

    if (!valid) {
      seteventSubmitErrors({
        ...eventSubmitErrors,
        ["json"]: "JSON schema not validated.",
      });
      return false;
    } else {
      console.log("TRUE");
      return true;
    }
  };

  const handleValidation = () => {
    if (Object.keys(event).length !== 0) {
      try {
        const parsedRule = JSON.parse(event.rules);
        event.rules = parsedRule;
      } catch (error) {
        seteventSubmitErrors({
          ...eventSubmitErrors,
          ["json"]: "Invalid JSON in rules field",
        });
        return false;
      }
      return ValidateEvent(event.rules) ? true : false;
    }
  };
  const addToList = (eventToAdd) => {
    const isEventPresent = visibleEventList.some(
      (event) => event.name === eventToAdd.name
    );

    setvisibleEventList((prevList) => {
      if (isEventPresent) {
        // Replace the existing event with the new one
        return prevList.map((event) =>
          event.name === eventToAdd.name ? eventToAdd : event
        );
      } else {
        // Add the new event to the list
        return [...prevList, eventToAdd];
      }
    });
  };
  const handleCreateEvent = async () => {
    let validEvent = handleValidation(event);
    if (validEvent) {
      try {
        const { success, error, message } = await DBService.saveEventToDB(
          event
        );
        if (success) {
          setStatusMessage(message);
          setTimeout(() => {
            setStatusMessage("");
          }, 1500);

          addToList(event);

          setEvent({}); // Clear the form if needed

          setEventFormShow(false);
        }
      } catch (error) {
        seteventSubmitErrors({
          ...eventSubmitErrors,
          ["APIError"]: "Failed to process event: " + error,
        });
      }
    } else {
      seteventSubmitErrors({
        ...eventSubmitErrors,
        ["APIError"]: "Cannot save. Try again later",
      });
    }
  };

  const handleSubmitTrackingPlan = async () => {
    let valid = true;
    let eventsToAdd = [...visibleEventList];

    if (trackingPlan.name) {
      const trackingPlanToSave = {
        ...trackingPlan,
        rules: { events: eventsToAdd },
        source: source,
      };
      const { success, error } = await DBService.saveTrackingPlanToDB(
        trackingPlanToSave
      );
      if (success) {
        setTrackingPlanFormStatus(success);
        setTrackingPlan({
          name: "",
          description: "",
          events: [],
          source: "",
        });

        setvisibleEventList({});
        setTimeout(() => {
          setTrackingPlanFormStatus("");
        }, 1500);
      } else {
        setTrackingPlanFormStatus(error);
        setTimeout(() => {
          setTrackingPlanFormStatus("");
        }, 1500);
      }
    } else if (trackingPlan.description && !trackingPlan.name) {
      trackingPlanNameRef.current.focus();
      setTrackingPlanFormStatus(
        "Name should not be empty. It is a required field."
      );
    }
  };

  const handleEditEvent = (ListEventEdit) => {
    let tempEvent = {};
    for (let key in ListEventEdit) {
      if (key === "rules") {
        tempEvent[key] = JSON.stringify(ListEventEdit[key]);
      } else {
        tempEvent[key] = ListEventEdit[key];
      }
    }

    setEvent(tempEvent);
    setEventFormShow(true);
  };

  return (
    <div
      className="container mx-auto px-4"
      style={{ height: "800px", width: "700px", overflowY: "auto" }}
    >
      {/* start tracking plan component */}
      <label className="block text-left text-base font-bold mb-4">
        Add Tracking Plan
      </label>
      <TrackingPlan
        trackingPlan={trackingPlan}
        onChange={handleTrackinPlanChange}
        error={trackingPlanFormStatus}
        trackinPlanNameRef={trackingPlanNameRef}
        onNameChange={handleAddTrackingPlan}
        statusDropdown={dropdownStatus.TrackingPlan}
        trackingplans={AllTrackingPlanList}
      />

      <div className="border border-t-black w-full my-2"></div>

      <label className="block text-left text-base font-bold m-4">Events</label>

      <div className="flex justify-center p-2 gap-5">
        <DropdownList
          events={eventsList}
          onButtonClick={handleAddEvent}
          status={dropdownStatus.event}
        />
      </div>
      {trackingPlan.name || visibleEventList.length ? (
        <EventList
          events={visibleEventList}
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
        />
      ) : (
        <NoData />
      )}

      <div className="flex flex-wrap justify-center">
        {!eventFormShow ? (
          <>
            <button
              onClick={() => {
                setEventFormShow(true);
              }}
              className=" m-3 w-8 h-8 bg-blue-500 text-white rounded justify-center"
            >
              +
            </button>
            <label className="block text-left text-base font-bold m-3.5">
              Create Event
            </label>
          </>
        ) : (
          <button
            onClick={() => {
              setEventFormShow(false);
            }}
            className=" text-white p-2 m-2 rounded bg-red-500 text-xs"
          >
            Close
          </button>
        )}
      </div>

      {eventFormShow ? (
        <div className="flex flex-wrap justify-center relative">
          <EventForm
            event={event}
            onChange={handleEventChange}
            error={eventSubmitErrors}
            statusMessage={statusMessage}
            onSubmit={handleCreateEvent}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          {statusMessage && (
            <label className=" text-green-600 mx-auto font-semibold text-base">
              {statusMessage}
            </label>
          )}
          <button
            onClick={handleSubmitTrackingPlan}
            className="p-2 my-6 w-3/12 bg-green-500 mx-auto text-white text-xs rounded"
          >
            Save Tracking Plan
          </button>
        </div>
      )}
    </div>
  );
};

function NoData() {
  return (
    <div className="text-xs flex justify-center m-8 font-extralight text-gray-600">
      Please select or add a Tracking Plan to view events
    </div>
  );
}

export default Events;
