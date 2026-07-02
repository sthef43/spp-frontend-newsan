import React from "react";

export const CalendarEvent = (event: any) => {
  console.log(event);
  const { title, user } = event;
  return (
    <div className="filter invert">
      <span>{title}</span>
      <strong>{user.name}</strong>
    </div>
  );
};
