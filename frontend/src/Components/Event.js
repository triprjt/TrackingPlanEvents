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

  const [selectedEvent, setSelectedEvent] = useState({});

  const [statusMessage, setStatusMessage] = useState("");

  const [eventSubmitErrors, seteventSubmitErrors] = useState({});
  const [trackingPlanFormStatus, setTrackingPlanFormStatus] = useState("");

  const [eventsList, setAllEventsList] = useState([]); // State to hold the events list
  const [AllTrackingPlanList, setAllTrackingPlanList] = useState([]);

  const [selectedDropEvent, setSelectedDropEvent] = useState(null);
  const [selectedDropTrackingPlan, setSelectedDropTrackingPlan] =
    useState(null);

  const [addedEvents, setAddedEvents] = useState([]);
  const trackingPlanNameRef = useRef(null);
  const [source, setSource] = useState("");

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
    setTrackingPlan({
      ...trackingPlan,
      [key]: value,
    });
  };
  // Handle the dropdown selection change
  const handleEventDropdownChange = (selectedValue) => {
    const eventToAdd = eventsList.find((event) => event.name === selectedValue);
    setSelectedDropEvent(eventToAdd);
  };

  const handleTrackingDropdownChange = (selectedValue) => {
    console.log("//++++" + selectedValue);
    const trackingPlanToAdd = AllTrackingPlanList.find(
      (plan) => plan.name === selectedValue
    );

    setSelectedDropTrackingPlan(trackingPlanToAdd);
  };

  // Delete event handler
  const handleDeleteEvent = async (index) => {
    const eventNameToDelete = addedEvents[index].name;

    const trackingPlanName = trackingPlan.name;

    try {
      await axios.delete(
        `${baseURL}/trackingplan/${trackingPlanName}/remove/${eventNameToDelete}/`
      );

      // Remove the deleted event from the local state
      const updatedEvents = [...addedEvents];
      updatedEvents.splice(index, 1);
      setAddedEvents(updatedEvents);

      //Set a success message
      alert(`Event ${eventNameToDelete} deleted successfully.`);
    } catch (error) {
      setStatusMessage(
        `Error deleting event with ID ${eventNameToDelete}: ${error}`
      );
    }
  };

  const handleAddTrackingPlan = async () => {
    let { success, data, error } = await DBService.fetchData(
      `trackingplans/${selectedDropTrackingPlan.name}/`
    );
    if (success) {
      setTrackingPlan(selectedDropTrackingPlan);
      let temp = eventsList.filter((event) => data.events.includes(event.name));
      setAddedEvents(temp);
    } else {
      console.error(
        "An error occurred while fetching the tracking plan:",
        error
      );
    }
  };

  const handleAddEvent = () => {
    if (selectedEvent) {
      setAddedEvents([...addedEvents, selectedDropEvent]);
      setSelectedDropEvent(null); // Optional: Reset the selected event after adding;
    }
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
  const handleSubmit = async () => {
    let valid = true;
    let eventsToAdd = [...addedEvents];

    if (Object.keys(event).length !== 0) {
      try {
        const parsedRule = JSON.parse(event.rules);
        event.rules = parsedRule;
      } catch (error) {
        seteventSubmitErrors({
          ...eventSubmitErrors,
          ["json"]: "Invalid JSON in rules field",
        });
      }
      console.log(JSON.stringify(event));
      if (ValidateEvent(event.rules)) {
        const { success, error, message } = await DBService.saveEventToDB(
          event
        );
        if (success) {
          setStatusMessage(message);
          setTimeout(() => {
            setStatusMessage("");
          }, 1500);
          setAllEventsList([...eventsList, event]);
          eventsToAdd.push(event); // Add the event only if it's not empty and valid
          setAddedEvents(eventsToAdd);
          setEvent({}); // Clear the form if needed
          setEventFormShow(false);
        } else {
          seteventSubmitErrors({
            ...eventSubmitErrors,
            ["APIError"]: "Failed to process event: " + error,
          });
          valid = false;
        }
      } else {
        seteventSubmitErrors({
          ...eventSubmitErrors,
          ["json"]: "Event Validation Failed",
        });
        valid = false;
      }
    }
    if (valid) {
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
      style={{ height: "600px", overflowY: "auto" }}
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
      />
      <div className="flex justify-center p-2 gap-5">
        <DropdownListTrackingPlan
          trackingplans={AllTrackingPlanList}
          onChange={handleTrackingDropdownChange}
        />
        <button
          className=" bg-indigo-600 text-white text-xs p-1 rounded"
          onClick={handleAddTrackingPlan}
        >
          Add Tracking Plan
        </button>
      </div>

      <div className="border border-t-black w-full my-2"></div>

      <label className="block text-left text-base font-bold m-4">Events</label>

      <div className="flex justify-center p-2 gap-5">
        <DropdownList
          events={eventsList}
          onChange={handleEventDropdownChange}
        />
        <button
          className=" bg-indigo-600 text-white text-xs p-1 rounded"
          onClick={handleAddEvent}
        >
          Select Event
        </button>
      </div>
      {trackingPlan.name ? (
        <EventList
          events={addedEvents}
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
            onSubmit={handleSubmit}
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
            onClick={handleSubmit}
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
