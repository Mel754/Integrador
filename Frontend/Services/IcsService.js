const { createEvent } = require('ics');

exports.buildICS = ({ title, description, location, start, end }) => new Promise((resolve, reject) => {
  const event = {
    title,
    description,
    location,
    start: [start.year(), start.month()+1, start.date(), start.hour(), start.minute()],
    end:   [end.year(),   end.month()+1,   end.date(),   end.hour(),   end.minute()]
  };
  createEvent(event, (error, value) => error ? reject(error) : resolve(value));
});
