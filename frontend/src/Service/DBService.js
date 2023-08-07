import axios from "axios";
import TrackingPlan from "../Components/TrackinPlan";

const baseURL = process.env.REACT_APP_API_URL;

const DBService = {
  saveEventToDB: async (eventData) => {
    const eventPOSTUrl = `${baseURL}/events/save/`;
    try {
      const res = await axios.post(eventPOSTUrl, eventData);
      if (res.status === 201) {
        let responseMessage = res.data.message; // Use the server's success message
        return { success: true, error: "", message: responseMessage };
      } else if (res.status === 200) {
        let responseMessage = res.data.message; // Use the server's update message
        return { success: true, error: "", message: responseMessage };
      } else {
        console.error(
          res.data.error || "An error occurred while processing the event."
        );
        return {
          success: false,
          error:
            res.data.error || "An error occurred while processing the event.",
          message: "",
        };
      }
    } catch (error) {
      console.error("A network error occurred:", error);
      return {
        success: false,
        error: "A network error occurred: " + error.message,
        message: "",
      };
    }
  },
  saveTrackingPlanToDB: async (TrackingPlanData) => {
    const trackinPlanPostUrl = `${baseURL}/trackingplan/save`;
    try {
      const res = await axios.post(trackinPlanPostUrl, {
        display_name: TrackingPlanData.name,
        description: TrackingPlanData.description,
        rules: TrackingPlanData.rules,
        source: TrackingPlanData.source,
      });
      if (res.status === 201) {
        let message = "Tracking Plan created successfully!";
        return { success: message, error: "" };
      } else if (res.status === 200) {
        let message = "Tracking Plan updated successfully!";
        console.log(res.data);
        return { success: message, error: "", data: res.data };
      } else {
        return {
          success: false,
          error: "An error occurred while creating the Tracking Plan.",
        };
      }
    } catch (error) {
      console.error("A network error occurred:", error);
      return {
        success: false,
        error: "A network error occurred:" + error.message,
      };
    }
  },
  fetchData: async (url) => {
    try {
      const response = await axios.get(`${baseURL}/${url}`);
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        console.error("An error occurred while fetching data.");
        return {
          success: false,
          error: "An error occurred while fetching data.",
        };
      }
    } catch (error) {
      console.error("A network error occurred:", error);
      return {
        success: false,
        error: "A network error occurred: " + error.message,
      };
    }
  },
  saveSourceToDB: async (sourceData) => {
    const sourcePostUrl = `${baseURL}/source/create/`;
    try {
      let res = await axios.post(sourcePostUrl, sourceData);
      if (res.status === 201) {
        let responseMessage = "Source saved successfully!";
        return { success: true, error: "", message: responseMessage };
      } else {
        return {
          success: false,
          error: "Not able to save source",
          message: "",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "A Network error occured" + error,
        message: "",
      };
    }
  },
  getSourceByName: async (name) => {
    const sourceGETUrl = `${baseURL}/sources/${name}/`;
    try {
      const res = await axios.get(sourceGETUrl);
      return { success: "True" };
    } catch (error) {}
  },
};

export default DBService;
