import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const job_title = formData.get("job_title");
  const date_of_birth = formData.get("date_of_birth");
  const department = formData.get("department");
  const gender = formData.get("gender");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");

  const db = await getDB();
  await db.run(
    'INSERT INTO employees (full_name, email, job_title, phone_number, date_of_birth, gender, department, salary, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [full_name, email, job_title, phone_number, date_of_birth, gender, department, salary, start_date, end_date]
  );

  // await db.close()
  return redirect("/employees");
}

export default function NewEmployeePage() {
  return (
    <div>
      <h1>Create New Employee</h1>
      <Form method="post">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="phone_number">Phonenumber</label>
          <input type="text" name="phone_number" id="phone_number" required />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="text" name="date_of_birth" id="date_of_birth" required />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <input type="text" name="gender" id="gender" required />
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" required />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input type="text" name="salary" id="salary" required />
        </div>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input type="text" name="start_date" id="start_date" required />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input type="text" name="end_date" id="end_date"/>
        </div>
        <button type="submit">Create Employee</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/timesheets">Timesheets</a></li>
      </ul>
    </div>
  );
}
