import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { messages } from "../../helpers/calendar-messages";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarModal } from "./CalendarModal";
//import { AddNewFab } from "../ui/AddNewFab";
import { useAppDispatch } from "app/core/store/store";
//import { uiSlice } from "app/Middleware/reducers/uiSlice";
import { calendarSlice } from "app/Middleware/reducers/calendarSlice";
//import { authentificationSlice, getInformacionPersona } from "app/Middleware/reducers/authentificationSlice";
moment.locale("es");

const localizer = momentLocalizer(moment);

export const CalendarScreen = (): JSX.Element => {
  const dispatch = useAppDispatch();
  //const { events } = useAppSelector<ICalendar>((state) => state.calendar);
  const [lastView, setlastView] = useState(localStorage.getItem("lastView") || "month");

  const onDoubleClick = () => {
    // dispatch(uiSlice.actions.uiOpenModal());
  };
  const onSelectChange = (e: any) => {
    const evento = {
      ...e,
      start: moment(e.start).toDate(),
      end: moment(e.end).toDate()
    };
    dispatch(calendarSlice.actions.setActive(evento));
  };
  const onViewChange = (e: string) => {
    setlastView(e);
    localStorage.setItem("lastView", e);
  };
  const eventStyleGetter = () => {
    // console.log(event, start, end, isSelected);
    const style = {
      backgroundColor: "#367CF7",
      borderRadius: "0px",
      opacity: 0.8,
      display: "block",
      color: "white"
    };
    return {
      style
    };
  };
  return (
    <div className="container calendar-screen filter invert">
      <h1 className="text-5xl text-center mb-4">Calendar Screen</h1>
      <hr />
      <Calendar
        localizer={localizer}
        //    events={events}
        startAccessor="start"
        endAccessor="end"
        view={lastView}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onView={onViewChange}
        onSelectEvent={onSelectChange}
        onDoubleClickEvent={onDoubleClick}
        components={{ CalendarEvent }}
      />
      {/* <AddNewFab /> */}
      <CalendarModal />
    </div>
  );
};
