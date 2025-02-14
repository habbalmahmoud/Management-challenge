import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { getDB } from "~/db/getDB";

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );
  const Employees = await db.all(
    "SELECT * FROM timesheets;"
  );

  // await db.close()
  return { timesheetsAndEmployees, Employees };
}

export function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const { Employees } = useLoaderData();
 
  const formattedEvents = Employees.map(event => ({
    ...event,
    start: event.start.replace("T", " "), // Convert to ISO 8601
    end: event.end.replace("T", " "),
  }));  

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: formattedEvents,
    plugins: [eventsService]
  })
 
  useEffect(() => {
    async function fetchEvents() {
      const allEvents = await eventsService.getAll();
      console.log("Fetched events:", allEvents);
    }
    fetchEvents();
  }, [eventsService]);

  return calendar
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [page, updatePage] = useState(true)
  let calender = CalendarApp() 

  function changePage()
  {
    updatePage(!page)
  }

  return (
    <div>
      <div>
        <button onClick={changePage}>Table View</button>
        <button onClick={changePage}>Calendar View</button>
      </div>
      {/* Replace `true` by a variable that is changed when the view buttons are clicked */}
      {page ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: any) => (
            <div key={timesheet.id}>
              <ul>
                <li style={{display : "inline", marginRight : 10}}>Timesheet #{timesheet.id}</li>
                <a href={`/timesheets/${timesheet.id}`} style={{textDecoration : "none", color : "gray"}}>--View full--</a>
                <ul>
                  <li>Employee: {timesheet.full_name} (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start}</li>
                  <li>End Time: {timesheet.end}</li>
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
         <div>
            <ScheduleXCalendar calendarApp={calender} />
          </div>
      )}
      <hr />
      <ul>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
