import { useState } from "react";
import { Form, redirect, useLoaderData, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request, params }) =>
{
  const db = await getDB(); // Get SQLite database instance
  const timesheetId = Number(params.timesheetId);


  const formData = await request.formData();
  const employee_id = formData.get("employee_id"); // <select /> input with name="employee_id"
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  // await db.close()

  try {
    await db.run(
      "UPDATE timesheets SET start = ?, end = ?, employee_id = ? WHERE id = ?",
      [start_time, end_time, employee_id, timesheetId]
    );

    // await db.close()
    return new Response(null, { status: 204 }), redirect(`/timesheets/${timesheetId}`) ; // No content, successful update
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  } finally {
    await db.close(); // Ensure the database connection closes
  }
}
export async function loader({ params }) {
  const db = await getDB();
  
  const {timesheetId} = params
  const stmt = await db.prepare("SELECT * FROM timesheets WHERE id = ?");
  const timesheet = await stmt.get(timesheetId);
  await stmt.finalize();
  const employees = await db.all('SELECT * FROM employees');
  
  if (!timesheet)
    throw new Response("Timesheet not found", {status : 404})
  
  return {timesheet, employees}
}

function getName(employees, timesheet) {
  let name = "NONE"
  employees.map((employee) => {
    if (employee.id == timesheet.employee_id) {
       name = employee.full_name
    }
  })
  return name
}

export default function TimesheetPage() {
  const [update, setUpdate] = useState(false)
  const {timesheet, employees} = useLoaderData()
  const emp = getName(employees, timesheet)


  function changeState() {
    setUpdate(!update)
  }


  return (
    <div>
      <div>
        {
          update == false ? 
          <div>
            <div style={{display : "flex", justifyContent : "space-around", flexDirection : "row"}}>
             <h1>Timesheet -- {emp}</h1>
             <button style={{padding : 10, height : 50, width : 100, marginTop : 20, fontSize : 20}} onClick={changeState}>Edit</button>
            </div>
             <ul>
              <li><span style={{fontWeight : "bold"}}>Start time: </span>{timesheet.start}</li>
              <li><span style={{fontWeight : "bold"}}>End time: </span>{timesheet.end}</li>
              </ul> 
          </div> : 
          <div>
            <Form method="post" onSubmit={changeState}>
              <div style={{display : "flex", justifyContent : "space-around", flexDirection : "row"}}>
                <div style={{display : "flex", flexDirection : "row"}}>
                  <h1 style={{paddingRight : 10}}>Timesheet -- </h1>
                  {/* Use employees to create a select input */
                    <select className="border p-2 rounded-md" style={{margin : 10}} name="employee_id">
                        <option value={timesheet.employee_id}>Select an Employee</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.full_name}
                          </option> 
                        ))}
                    </select>
                  }
                </div>
                <button style={{padding : 10, height : 50, width : 100, marginTop : 20, fontSize : 20}} type="submit">Save</button>
              </div>
              <div>
                <label htmlFor="start_time">Start Time</label>
                <input type="datetime-local" name="start_time" id="start_time" defaultValue={timesheet.start}/>
              </div>
              <div>
                <label htmlFor="end_time">End Time</label>
                <input type="datetime-local" name="end_time" id="end_time" defaultValue={timesheet.end}/>
              </div>
            </Form>
          </div>
        }
      </div>
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees/">Employees</a></li>
      </ul>
    </div>
  )
}
