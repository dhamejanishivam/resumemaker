// const backendUrl = "https://3a8a1ed3-4573-4f0a-8019-45d567abea8b-00-xpzkyrngg4dp.pike.replit.dev/api/resume";
//const backendUrl = "http://127.0.0.1:5000/api/resume";
const backendUrl = "https://8faf-45-124-145-194.ngrok-free.app/api/resume";


var selectedTemplate = localStorage.getItem("selectedTemplate");

const selectedTemplateIdTextArea =
  document.getElementById("selectedTemplateId");
selectedTemplateIdTextArea.value = selectedTemplate;

let currentStep = 1;

function showStep(step) {
  const steps = document.querySelectorAll(".form-step");
  steps.forEach((stepElem, index) => {
    stepElem.classList.toggle("active", index === step - 1);
  });
  document.getElementById("currentStep").textContent = step;

  document.getElementById("prevBtn").style.display =
    step === 1 ? "none" : "inline-block";
  document.getElementById("nextBtn").style.display =
    step === steps.length ? "none" : "inline-block";
  document.getElementById("submitBtn").style.display =
    step === steps.length ? "inline-block" : "none";
}

function nextStep() {
  if (currentStep < 5) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);
});

document.getElementById("resumeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
//   window.location.href=backendUrl;

  // Fetch values from input fields
  // const degreeName = document.getElementById("degree-name").value;
  // const startYear = document.getElementById("start-year").value;
  // const endYear = document.getElementById("end-year").value;
  // const instituteName = document.getElementById("institute-name").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  const data = {
    // Basic Information
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    // email: "a@a.com",
    phone: document.getElementById("phone").value,
    location: document.getElementById("location").value,
    objective: document.getElementById("objective").value,

    // Work Experience
    work_experience: [
      {
        title: document.getElementById("job-title").value,
        company: document.getElementById("company-name").value,
        duration: `${startDate} - ${endDate}`,
        description: document.getElementById("job-description").value,
      },
    ],

    // Education
    // let eduArray = document.querySelectorAll(".form-group education-item");
    // for
    education: getEducationData(),

    // Projects
    projects: document
      .getElementById("projects")
      .value.split(",")
      .map((p) => p.trim()),

    // Skills
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((skill) => skill.trim()),

    // Additional Details
    additional_details: document
      .getElementById("additionalDetails")
      .value.split(",")
      .map((detail) => detail.trim()),
  };


  const data23 = {
    name: "NooName",
    email: "dhamejanishivam@gmail.com",
    phone: "+91 9644971120",
    location: "Raipur",
    objective:
      "I want to be billioniare " +
      "Seeking opportunities to apply my expertise in building innovative solutions while continuously " +
      "learning and contributing to dynamic projects.",
    work_experience: [
      {
        title: "God • Internship",
        company: "Thought Applied Creation, Raipur",
        duration: "Jul 2024 - Aug 2024",
        description:
          "Built a ABC website linked to a database using React, HTML, CSS, JavaScript, PHP, " +
          "and MySQL.",
      },
    ],
    education: [
      {
        degree: "B1111111.Tech, Compu11ter Science & Engineering",
        year: "2022 - 20261111",
        institution:
          "Shri Shankaracharya Institute Of Professional Management And Technology",
      },
      {
        degree: "Senior Secondary (XII), CBSE",
        year: "2022",
        institution: "Krishna Public School",
      },
      {
        degree: "Secondary (X), CBSE",
        year: "2020",
        institution: "Krishna Public School",
      },
    ],
    projects: [
      "https://shivamdhamejani.in",
      "https://github.com/dhamejanishivam",
      "https://github.com/dhamejanishivam/Heart-Disease-Predictor",
      "https://github.com/dhamejanishivam/pendrive-virus",
    ],
    skills: [
      "JavaScript",
      "Python",
      "Photography",
      "HTML&CSS",
      "C Programming",
      "C++ Programming",
      "Linux",
      "MS-Excel",
      "Digital Marketing",
      "SQL",
      "Data Structures",
    ],
    additional_details: [
      "Green Olympiad",
      "2nd position in Spell Bee Competition",
      "1st position in Best Out of Waste competition",
    ],
  };

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      // Handle successful response and trigger the file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";  // You can set the filename as needed
      a.click();
  
      // Clean up the URL object after the download
      window.URL.revokeObjectURL(url);
      alert("Resume generated and downloading...");
    } else {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      alert("Failed to generate resume. Server responded with an error.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while generating the resume!");
  }
  
  
});

function parseWorkExperience(input) {
  return input.split("\n").map((exp) => {
    const [title, company, duration, description] = exp
      .split(",")
      .map((e) => e.trim());
    return { title, company, duration, description };
  });
}

function parseEducation(input) {
  return input.split("\n").map((edu) => {
    const [degree, year, institution] = edu.split(",").map((e) => e.trim());
    return { degree, year, institution };
  });
}









document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);

  // Handle the adding of additional education fields
  let a = document.querySelectorAll(".add-degree-btn");
  a.forEach(element => {
    element.addEventListener('click', function(event){
      const educationContainer = document.querySelector("#step2");

    // Clone the first set of fields and append to the container
    const newEducationItem = educationContainer.children[1].cloneNode(true);
    // const newEducationItem = educationContainer.firstChild.cloneNode(true);

    // Clear the values in the cloned input fields
    const inputs = newEducationItem.querySelectorAll("input");
    inputs.forEach(input => input.value = "");

    // Append the cloned fields
    educationContainer.appendChild(newEducationItem);
    })
  });
});




function getEducationData() {
  const educationContainers = document.querySelectorAll(".education-container");
  const educationData = [];

  educationContainers.forEach(container => {
    const degree = container.querySelector(".degree-name").value;
    const startYear = container.querySelector(".start-year").value;
    const endYear = container.querySelector(".end-year").value || "Present";
    const institution = container.querySelector(".institute-name").value;

    educationData.push({
      degree: degree,
      year: `${startYear} - ${endYear}`,
      institution: institution
    });
  });

  console.log(educationData);
  return educationData;
}
