function maker() {
    window.location.href = "#main2";
}

let selectedTemplate = null;

function selectTemplate(templateId) {
    if (selectedTemplate) {
        selectedTemplate.classList.remove("selected");
    }

    selectedTemplate = document.querySelector(`.template-card:nth-child(${templateId})`);
    selectedTemplate.classList.add("selected");

    localStorage.setItem("selectedTemplate", templateId);
}

function nextPage() {
    if (selectedTemplate) {
        window.location.href = "maker/";
    } else {
        alert("Please select a template to proceed.");
    }
}