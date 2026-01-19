// ===== PART A: Course Registration =====
const form = document.getElementById("registrationForm");
const tableBody = document.getElementById("courseTable");
const errorMsg = document.getElementById("formError");

// Load courses from localStorage or start with empty array
let courses = JSON.parse(localStorage.getItem("courses")) || [];

// Display courses on page load
displayCourses();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const matricNumber = document.getElementById("matricNumber").value.trim();
    const courseCode = document.getElementById("courseCode").value.trim();
    const courseTitle = document.getElementById("courseTitle").value.trim();

    const matricPattern = /^LCU\/[A-Z]{2}\/\d{4}\/\d{3}$/;

    // Validation
    if (!studentName || !matricNumber || !courseCode || !courseTitle) {
        errorMsg.textContent = "All fields are required";
        return;
    }

    if (!matricPattern.test(matricNumber)) {
        errorMsg.textContent = "Invalid matric number format";
        return;
    }

    errorMsg.textContent = "";

    // Add new course to array
    const courseData = { studentName, matricNumber, courseCode, courseTitle };
    courses.push(courseData);

    // Save updated array to localStorage
    localStorage.setItem("courses", JSON.stringify(courses));

    // Refresh table
    displayCourses();

    // Clear form inputs
    form.reset();
});

// Function to display courses in table
function displayCourses() {
    tableBody.innerHTML = "";

    if (courses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No courses registered yet</td></tr>`;
        return;
    }

    courses.forEach(course => {
        tableBody.innerHTML += `
            <tr>
                <td>${course.studentName}</td>
                <td>${course.matricNumber}</td>
                <td>${course.courseCode}</td>
                <td>${course.courseTitle}</td>
            </tr>
        `;
    });
}

// ===== PART B: Integrated Data Dashboard =====
const apiData = document.getElementById("apiData");
const loading = document.getElementById("loading");
const apiError = document.getElementById("apiError");
const refreshBtn = document.getElementById("refreshData");

async function fetchUserData() {
    loading.style.display = "block";
    apiError.textContent = "";
    apiData.innerHTML = "";

    try {
        const response = await fetch("https://randomuser.me/api/");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const user = data.results[0];

        apiData.innerHTML = `
            <img src="${user.picture.large}">
            <p>Name: ${user.name.first} ${user.name.last}</p>
            <p>Email: ${user.email}</p>
            <p>Country: ${user.location.country}</p>
        `;
    } catch (error) {
        apiError.textContent = error.message;
    } finally {
        loading.style.display = "none";
    }
}

// Refresh button
refreshBtn.addEventListener("click", fetchUserData);

// Load data on page open
fetchUserData();
