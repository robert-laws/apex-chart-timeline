import React from 'react'
import Chart from "react-apexcharts";

const Timeline = ({ events, onEntrySelect }) => {
  // Map the Google Calendar events into the format required by Apex Charts:
  const seriesData = events.map((event) => {
    // Use dateTime if available; otherwise use date (for all-day events)
    const startDate = event.start.dateTime
      ? new Date(event.start.dateTime)
      : new Date(event.start.date);
    const endDate = event.end.dateTime
      ? new Date(event.end.dateTime)
      : new Date(event.end.date);

    return {
      x: event.summary,
      // y must be an array with the start and end times (in milliseconds)
      y: [startDate.getTime(), endDate.getTime()],
      z: event.description,
      fillColor: '#A08FFB'
    };
  });

  const series = [
    {
      data: seriesData,
    },
  ];

  // Updated options with ES6 syntax and additional customization as needed:
  const options = {
    chart: {
      type: "rangeBar",
      height: 350,
      // You can enable a toolbar or add more chart-level options here
    },
    plotOptions: {
      bar: {
        horizontal: true,
        // Other bar settings (e.g., bar height) can be added here
      },
    },
    xaxis: {
      type: "datetime",
    },
   dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        var label = opts.w.globals.labels[opts.dataPointIndex]
        return label;
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },
    tooltip: {
      // Optionally customize tooltips (e.g., to show event details)
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const eventItem = seriesData[dataPointIndex];
        return `<div style="padding:10px;">
                  <strong>${eventItem.x}</strong><br/>
                  Start: ${new Date(eventItem.y[0]).toLocaleString()}<br/>
                  End: ${new Date(eventItem.y[1]).toLocaleString()}<br />
                  Description: ${eventItem.z ? eventItem.z : "N/A"}
                </div>`;
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="rangeBar"
      height={350}
      // If you want to add an on-click event, you can use the following:
      // onDataPointSelection={(event, chartContext, config) => onEntrySelect(config)}
    />
  );
};

export default Timeline;