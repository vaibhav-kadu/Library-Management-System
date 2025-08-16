import { Link } from "react-router-dom";

export default function ViewStudents(){
    return(
        <div className="container">
            <h2>Add Student Records</h2>
            <div className="table-container">
                <Link to="/addStudents" class="btn btn-primary" >Add New Students</Link>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Vk</td>
                            <td>12025</td>
                            <td>
                                <a href="#" className="btn btn-success">View</a>
                                <a href="#" className="btn btn-primary">Edit</a>
                                <a href="#" className="btn btn-danger">Delete</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}