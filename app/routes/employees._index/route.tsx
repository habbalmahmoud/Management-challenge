import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  // await db.close()
  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  return (
    <div>
      <div>
        {employees.map((employee: any) => (
          <div>
            <ul>
              <li style={{fontWeight : "bold", display : "inline", marginRight : 20}}>Employee #{employee.id}</li>
              <a href={`/employees/${employee.id}`} style={{textDecoration : "none", color : "gray"}}>--View full--</a>
              <br></br>
              <br></br>
              <ul>
                <li><span style={{fontWeight : "bold"}}>Full Name</span>: {employee.full_name}</li>
                <li><span style={{fontWeight : "bold"}}>Email</span>: {employee.email}</li>
                <li><span style={{fontWeight : "bold"}}>Phonenumber</span>: {employee.phone_number}</li>
                <li><span style={{fontWeight : "bold"}}>Job Title</span>: {employee.job_title}</li>
                <li><span style={{fontWeight : "bold"}}>Department</span>: {employee.department}</li>
              </ul>
            </ul>
          </div>
        ))}
      </div>
      <hr />
      <ul>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  )
}
