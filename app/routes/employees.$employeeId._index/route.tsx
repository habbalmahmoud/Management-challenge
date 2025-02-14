import { useEffect, useState } from "react";
import {Form,  redirect,  useLoaderData, type ActionFunction } from "react-router"
import { getDB } from "~/db/getDB"


export const action: ActionFunction = async ({ request, params }) => {
  const db = await getDB(); // Get SQLite database instance
  const employeeId = Number(params.employeeId);

  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const job_title = formData.get("job_title");
  const phone_number = formData.get("phone_number");
  const date_of_birth = formData.get("date_of_birth");
  const gender = formData.get("gender");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  
  try {
    await db.run(
      "UPDATE employees SET full_name = ?, email = ?, job_title = ?, phone_number = ?, date_of_birth = ?, department = ?, salary = ?, start_date = ?, end_date = ?, gender = ?  WHERE id = ?",
      [full_name, email, job_title, phone_number, date_of_birth, department, salary, start_date, end_date, gender, employeeId]
    );

    await db.close()
    return new Response(null, { status: 204 }), redirect(`/employees/${employeeId}`) ; // No content, successful update
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }

}

export async function loader({ params }) {
  const db = await getDB();
  
  const {employeeId} = params
  const stmt = await db.prepare("SELECT * FROM employees WHERE id = ?");
  const employee = await stmt.get(employeeId);
  
  if (!employee)
    throw new Response("Employee not found", {status : 404})
  

  // await db.close()
  return {employee}
}


export default function EmployeePage() {
  const [update, setUpdate] = useState(false)
  const {employee} = useLoaderData()
   
  
  function change_page() {
    setUpdate(!update)
  }

  return (
    <div>
        {
          update == false ?
          <div> 
            <div style={{display : "flex", justifyContent : "space-around", flexDirection : "row"}}>
              <h1>Employee Detail</h1>
              <button style={{padding : 10, height : 50, width : 100, marginTop : 20, fontSize : 20}} onClick={change_page}>Edit</button>
          </div>
          <ul>
              <ul><span style={{fontSize : 35}}>Full Name:</span>
                <li style={{marginLeft : 50, marginTop : 15, marginBottom : 15, fontSize : 20}}>{employee.full_name}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Email:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.email}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Phonenumber:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.phone_number}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Date of Birth:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.date_of_birth}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Gender:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.gender}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Job title:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.job_title}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Department:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.department}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Salary:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.salary}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>Start Date:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.start_date}</li>
              </ul>
              <ul><span style={{fontSize : 35}}>End Date:</span>
                <li style={{marginLeft : 50, marginBottom : 15, marginTop : 15, fontSize : 20}}>{employee.end_date || "NONE"}</li>
              </ul>
            </ul> 
          </div> :
          <div>
            <Form method="post" onSubmit={change_page}>
              <div style={{display : "flex", justifyContent : "space-around", flexDirection : "row"}}>
                <h1>Employee Detail</h1>
                <button style={{padding : 10, height : 50, width : 100, marginTop : 20, fontSize : 20}} type="submit">Save</button>
            </div>
            <ul>
                <ul>
                  <div>
                    <label htmlFor="full_name">Full Name</label>
                    <input type="text" name="full_name" id="full_name" defaultValue={employee.full_name} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" defaultValue={employee.email} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="phone_number">Phonenumber</label>
                    <input type="text" name="phone_number" id="phone_number" defaultValue={employee.phone_number} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="date_of_birth">Date of Birth</label>
                    <input type="text" name="date_of_birth" id="date_of_birth" defaultValue={employee.date_of_birth} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="gender">Gender</label>
                    <input type="text" name="gender" id="gender" defaultValue={employee.gender} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="job_title">Job Title</label>
                    <input type="text" name="job_title" id="job_title" defaultValue={employee.job_title} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="department">Department</label>
                    <input type="text" name="department" id="department" defaultValue={employee.department} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="salary">Salary</label>
                    <input type="text" name="salary" id="salary" defaultValue={employee.salary} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="start_date">Start Date</label>
                    <input type="text" name="start_date" id="start_date" defaultValue={employee.start_date} required />
                  </div>
                </ul>
                <ul>
                  <div>
                    <label htmlFor="end_date">End Date</label>
                    <input type="text" name="end_date" id="end_date" defaultValue={employee.end_date}/>
                  </div>
                </ul>
              </ul>
            </Form>
          </div>
        }
      <hr></hr>
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  )
}
