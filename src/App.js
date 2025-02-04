// src/App.js
import React, { useState, useEffect } from "react";
import Timeline from "./components/Timeline";

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Define the number of hours to subtract
  const offsetHours = 3;

  // Helper function to adjust time
  const adjustTime = (timestamp, hoursToSubtract) => new Date(timestamp - hoursToSubtract * 3600000);

  useEffect(() => {
    // Load the Google API client and initialize it
    window.gapi.load("client", initClient);
  }, []);

  const initClient = () => {
    window.gapi.client
      .init({
        apiKey: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      })
      .then(() => {
        listEvents();
      })
      .catch((error) => {
        console.error("Error initializing GAPI client:", error);
      });
  };

  const listEvents = () => {
    window.gapi.client.calendar.events
      .list({
        calendarId: process.env.REACT_APP_GOOGLE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 50,
        orderBy: "startTime",
      })
      .then((response) => {
        const items = response.result.items || [];
        setEvents(items);
      })
      .catch((error) => {
        console.error("Error fetching public events:", error);
      });
  };

  // Callback to be passed to Timeline (if you wish to select an entry)
  const handleEntrySelect = (event) => {
    setSelectedEntry(event);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-uppercase">Public Calendar Events</h1>
      View of all events organized by their category.
      <Timeline events={events} onEntrySelect={handleEntrySelect} />
      {selectedEntry && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 4,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Selected Event</h2>
          <p>
            <strong>Title:</strong> {selectedEntry.x}
          </p>
          {selectedEntry.l && (
            <p>
              <strong>Location:</strong> {selectedEntry.l}
            </p>
          )}
          <p>
            <strong>Start:</strong>{" "}
            {adjustTime(selectedEntry.y[0], offsetHours).toLocaleDateString()}{" "}
            {/* {adjustTime(selectedEntry.y[0], offsetHours).toLocaleTimeString()} */}
          </p>
          <p>
            <strong>End:</strong>{" "}
            {adjustTime(selectedEntry.y[1], (offsetHours + 1)).toLocaleDateString()}{" "}
            {/* {adjustTime(selectedEntry.y[1], (offsetHours + 1)).toLocaleTimeString()} */}
          </p>
          {selectedEntry.z && (
            <p>
              <strong>Description:</strong> {selectedEntry.z}
            </p>
          )}          
        </div>
      )}
    </div>
  );
}

export default App;
