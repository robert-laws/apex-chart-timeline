// src/App.js
import React, { useState, useEffect } from "react";
import Timeline from "./components/Timeline";

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

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
        maxResults: 10,
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
      Pass the fetched events and the callback to Timeline
      <Timeline events={events} onEntrySelect={handleEntrySelect} />
      {selectedEntry && (
        <div>
          <h2>Selected Event</h2>
          <p>{JSON.stringify(selectedEntry)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
