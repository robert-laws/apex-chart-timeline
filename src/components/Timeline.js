import React from 'react'
import Chart from "react-apexcharts";

const Timeline = ({ events, onEntrySelect }) => {
  // Define the offset in hours
  const offsetHours = 3;
  // Helper function that subtracts the given offset (in hours) from the timestamp
  const adjustTime = (timestamp, hoursToSubtract) => new Date(timestamp - hoursToSubtract * 3600000);

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
      l: event.location,
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
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const { dataPointIndex } = config;
          if (dataPointIndex !== -1 && seriesData[dataPointIndex]) {
            setTimeout(() => {
              onEntrySelect(config.w.config.series[0].data[config.dataPointIndex]);
            }, 0);
          }
        },
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
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
                  <strong>${eventItem.z ? eventItem.z : eventItem.x}</strong><br/>
                  Start: ${adjustTime(eventItem.y[0], offsetHours).toLocaleDateString()}<br/>
                  End: ${adjustTime(eventItem.y[1], (offsetHours + 1)).toLocaleDateString()}<br/>
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
    />
  );
};

export default React.memo(Timeline);