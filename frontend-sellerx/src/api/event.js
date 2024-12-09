import { HOST } from "@/api";

const eventMachine = {
  setup: () => {
    const productEvents = new EventSource(HOST + "/api/event/get-events", {
      withCredentials: true,
    });

    productEvents.onopen = function () {
      console.log("SSE connection opened.");
    };

    productEvents.onerror = function (error) {
      console.error("SSE connection error:", error);
    };

    productEvents.onmessage = function (event) {
      const datum = JSON.parse(event.data);

      const sendEvent = new CustomEvent("productEvents", {
        detail: {
          data: datum,
        },
      });

      document.dispatchEvent(sendEvent);
    };

    /////

    const gateEvents = new EventSource(HOST + "/api/event/get-events", {
      withCredentials: true,
    });

    gateEvents.onopen = function () {
      console.log("SSE connection opened.");
    };

    gateEvents.onerror = function (error) {
      console.error("SSE connection error:", error);
    };

    gateEvents.onmessage = function (event) {
      const datum = JSON.parse(event.data);

      const sendEvent = new CustomEvent("gateEvents", {
        detail: {
          data: datum,
        },
      });

      document.dispatchEvent(sendEvent);
    };
  },
};

export { eventMachine };
