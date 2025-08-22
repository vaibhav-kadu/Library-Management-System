import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex align-items-center">
          {/* Brand Name on Right */}
          <marquee behavior="" direction=""><a className="navbar-brand ms-auto fw-bold" href="#">
            Library Management System | Manage Students | Librarians | Books
          </a></marquee>


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              {/* Category Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="categoryDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </a>
                <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                  <li><a className="dropdown-item" href="/add-category">Add Category</a></li>
                  <li><a className="dropdown-item" href="/view-category">View Categories</a></li>
                </ul>
              </li>

              {/* Student Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="studentDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Student
                </a>
                <ul className="dropdown-menu" aria-labelledby="studentDropdown">
                  <li><a className="dropdown-item" href="/add-student">Add Student</a></li>
                  <li><a className="dropdown-item" href="/view-student">View Students</a></li>
                </ul>
              </li>

              {/* Librarian Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="librarianDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Librarian
                </a>
                <ul className="dropdown-menu" aria-labelledby="librarianDropdown">
                  <li><a className="dropdown-item" href="/add-librarian">Add Librarian</a></li>
                  <li><a className="dropdown-item" href="/view-librarian">View Librarians</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="text-center text-dark d-flex align-items-center justify-content-center"
        style={{
          height: "90vh",
          backgroundImage: "url('https://img.freepik.com/premium-photo/blurred-bookshelf-many-old-books-book-shop-library_327072-7345.jpg?w=740')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="bg-light bg-opacity-75 p-5 rounded"
          style={{ maxWidth: "700px" }}
        >
          <h1 className="display-4 fw-bold">Library Management System</h1>
          <p className="lead mt-3">
            Manage your books, students, and librarians efficiently in one place.
          </p>
          <a href="/admin-dashboard" className="btn btn-dark btn-lg mt-3">
            Get Started...
          </a>
        </div>
      </header>
    </>
  );
};

export default LandingPage;
