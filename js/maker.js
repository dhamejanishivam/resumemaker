const backendUrl = "http://localhost:5000/api/resume";

var selectedTemplate = localStorage.getItem("selectedTemplate");

const selectedTemplateIdTextArea = document.getElementById("selectedTemplateId");
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

    // Fetch values from input fields
    const degreeName = document.getElementById("degree-name").value;
    const startYear = document.getElementById("start-year").value;
    const endYear = document.getElementById("end-year").value;
    const instituteName = document.getElementById("institute-name").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    const data = {
        // Basic Information
        name: document.getElementById("name").value,
        // email: document.getElementById("email").value,
        email: "a@a.com",
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        objective: document.getElementById("objective").value,

        // Work Experience
        work_experience: [
            {
                title: document.getElementById("job-title").value,
                company: document.getElementById("company-name").value,
                duration: `${startDate} - ${endDate}`,
                description: document.getElementById("job-description").value
            }
        ],

        // Education
        education: [
            {
                degree: `${degreeName}, ${startYear} - ${endYear}`,
                year: `${startYear} - ${endYear}`,
                institution: instituteName
            }
            // Add more education entries if needed
        ],

        // Projects
        projects: document.getElementById("projects").value.split(",").map(p => p.trim()),

        // Skills
        skills: document.getElementById("skills").value.split(",").map(skill => skill.trim()),

        // Additional Details
        additional_details: document.getElementById("additionalDetails").value.split(",").map(detail => detail.trim())
    };

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Try to download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.pdf";
            a.click();
            alert("Resume generated successfully!");
        } else {
            // Log detailed error information
            const errorText = await response.text();
            console.error("Error response text:", errorText);
            alert("Failed to generate resume. Server responded with an error.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred!");
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
