// let backendUrl = "https://3a8a1ed3-4573-4f0a-8019-45d567abea8b-00-xpzkyrngg4dp.pike.replit.dev/api/resume";
// let backendUrl = "http://127.0.0.1:5000/api/resume";
let backendUrl = "https://guided-strangely-lamb.ngrok-free.app/api/resume";





let degreeNameList = ["10th", "12th", "Higher Secondary", "Diploma", "B.Tech", "B.E.", "B.Sc", "B.Com", "B.A.", "BBA", "BCA", "LLB", "MBBS", "BDS", "B.Pharm", "B.Arch", "B.Ed", "BPT", "BFA", "BHM", "B.Des", "B.Voc", "BAMS", "BHMS", "BUMS", "BVSc", "B.Lib.Sc", "M.Tech", "M.E.", "M.Sc", "M.Com", "M.A.", "MBA", "MCA", "LLM", "MD", "MDS", "M.Pharm", "M.Arch", "M.Ed", "MPT", "MFA", "MSW", "PhD", "M.Phil", "PG Diploma"]

let collegeLIST =  [];

let jobTitlesList = [
  "Software Developer", "Web Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Mobile Developer", "App Developer", "Data Scientist", "Data Analyst", "Machine Learning Engineer",
  "AI Engineer", "Cybersecurity Specialist", "DevOps Engineer", "QA Engineer", "Cloud Engineer", "Blockchain Developer",
  "Game Developer", "Systems Administrator", "Database Administrator", "UX/UI Designer", "Digital Marketing Specialist",
  "SEO Specialist", "Social Media Manager", "Content Writer", "Content Marketing Specialist", "Brand Manager", "Market Research Analyst",
  "Business Analyst", "Product Manager", "Operations Manager", "Project Manager", "HR Specialist",
  "Recruitment Specialist", "Sales Manager", "Business Development Manager", "E-commerce Manager", "Accountant", "Financial Analyst",
  "Legal Advisor", "Content Creator", "Graphic Designer", "UI/UX Designer", "Web Designer", "Network Engineer",
  "IT Support Specialist", "Healthcare Professional", "Mechanical Engineer", "Civil Engineer", "Electrical Engineer",
  "Marketing Manager", "Retail Manager", "Hospitality Manager",

  // Additional Fields
  "Artificial Intelligence Researcher", "Big Data Engineer", "Robotics Engineer", "Embedded Systems Engineer", 
  "Bioinformatics Specialist", "Computer Vision Engineer", "Natural Language Processing Specialist", 
  "Ethical Hacker", "Penetration Tester", "IT Consultant", "Augmented Reality Developer", "Virtual Reality Developer",
  "Hardware Engineer", "VLSI Design Engineer", "Mechatronics Engineer", "Software Architect", "Technical Writer",
  "Game Designer", "3D Animator", "Motion Graphics Designer", "Video Editor", "Sound Engineer", "System Analyst",
  "IT Manager", "Cyber Forensics Expert", "Mobile App Tester", "Automation Engineer", "Performance Tester",
  "Quality Assurance Manager", "Environmental Engineer", "Industrial Engineer", "Materials Engineer",
  "Urban Planner", "Interior Designer", "Fashion Designer", "Biomedical Engineer", "Clinical Research Specialist",
  "Pharmaceutical Researcher", "Agricultural Engineer", "Food Technologist", "Renewable Energy Specialist",
  "Solar Energy Engineer", "Wind Energy Engineer", "Logistics Manager", "Supply Chain Manager", "Export Manager",
  "Banking Professional", "Investment Banker", "Stock Market Analyst", "Actuary", "Economist", "Teacher", 
  "Professor", "Research Scientist", "Librarian", "Policy Analyst", "Translator", "Interpreter",
  "Event Manager", "Travel Consultant", "Chef", "Bartender", "Sports Analyst", "Fitness Trainer", "Yoga Instructor"
];



//Code to get the selected template from user:
const selectedTemplate = localStorage.getItem("selectedTemplate");

const selectedTemplateIdTextArea =
  document.getElementById("selectedTemplateId");
selectedTemplateIdTextArea.value = selectedTemplate;


// Next and previous button logic
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

    //progress bar animation:
    fill(1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);

    //progress bar animation
    fill(-1);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);
});




// Pressing submit button
document.getElementById("resumeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  const data = {
    // Basic Information
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    location: document.getElementById("location").value,
    objective: document.getElementById("objective").value,

    // Work Experience
    work_experience: getWorkExperienceDetails(),

    // Education
    education: getEducationData(),

    // Projects
    projects:getProjectsDetails(),
    // projects: document
    //   .getElementById("projects")
    //   .value.split(",")
    //   .map((p) => p.trim()),

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

    // Selected template design:
    selectedTemplateId:selectedTemplate,
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
      // alert("Resume generated and downloading...");
      alertMessageShow("Resume generated and downloading...");
    } else {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      // alert("Failed to generate resume. Server responded with an error.");
      let error = "Failed to generate resume. Server responded with an error.";
      alertMessageShow(error);

      sendDeatilsToTelegram(data,error)
      
    }
  } catch (error) {
    console.error("Error:", error);
    // alert("An error occurred while generating the resume!");
    alertMessageShow("An error occurred while generating the resume!");
    sendDeatilsToTelegram(data,error)
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



// This function send 
function sendDeatilsToTelegram(data,error){
  // Function to send a Telegram message
  datanew = JSON.stringify(data)
  message = `${data['name']} tried to build their resume, but there was a error : ${error} \n\nContact them : ${data['phone']} \n${data['email']} \n\n\n Their data is ${datanew}`
  sendTelegramMessage(message)
  async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot8113534372:AAF2DahT2CQYToSvG7Z_VMZ_-0BmweybX5I/sendMessage`;
    try {
      // Send the message to the Telegram bot
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `chat_id=1293804795&text=${encodeURIComponent(message)}`,
      });
    } catch (error) {
      console.error("Error sending message to Telegram:", error);
    }
  }
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
    // Clear the values in the cloned input fields
    const inputs = newEducationItem.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
    // Append the cloned fields
    educationContainer.appendChild(newEducationItem);
    newEducationItem.style.marginTop = '35px';


    const newDegreeInput = newEducationItem.querySelector(".degree-name"); // Assuming the class is correct
    new Awesomplete(newDegreeInput, {
      list: degreeNameList,
      minChars:1
    })

     // Reinitialize Awesomplete on the new input field
     const newCollegeInput = newEducationItem.querySelector(".coolegeNameInput"); // Assuming the class is correct
     new Awesomplete(newCollegeInput, {
       list: collegeLIST,
       minChars:1
     });
   });
 });
});



document.addEventListener("DOMContentLoaded", () => {

  showStep(currentStep);

  let a = document.getElementById("addworkBtn");

  a.addEventListener('click',function() {
      const workContainer = document.querySelector("#step3")


      // workContainer.children[1].appendChild(newLine)
      let newWorkContainer = workContainer.children[1].cloneNode(true);
      const inputs = newWorkContainer.querySelectorAll("input")
      const textarea = newWorkContainer.querySelectorAll("textarea")
      inputs.forEach(input => input.value = '');
      textarea.forEach(input => input.value = '');

      workContainer.appendChild(newWorkContainer)

      newWorkContainer.style.marginTop = '35px';

      let newWorkInput = newWorkContainer.querySelector(".job-title");
      new Awesomplete(newWorkInput,{
        list: jobTitlesList,
        minChars:1
      })
  })

})



document.addEventListener("DOMContentLoaded",() => {
  showStep(currentStep);

  let a = document.getElementById("addprojectBtn");

  a.addEventListener('click', function(){
    let projectContainer = document.querySelector(".projectSection");

    let newProjectContainer = projectContainer.children[0].cloneNode(true);
    const inputs = newProjectContainer.querySelectorAll("input")
    const textarea = newProjectContainer.querySelectorAll("textarea")
    inputs.forEach(input => input.value = '');
    textarea.forEach(input => input.value = '');
    projectContainer.appendChild(newProjectContainer)
    newProjectContainer.style.marginTop = '35px'

  })
  
})









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

  // console.log(educationData);
  return educationData;
}



function getWorkExperienceDetails(){
  let workContainers = document.querySelectorAll(".work-container")
  let workData = [];

  workContainers.forEach(container => {
    let jobTitle = container.querySelector('.job-title').value
    let compnayName = container.querySelector('.company-name').value
    let startDate = container.querySelector('.start-date').value
    let endDate = container.querySelector('.end-date').value
    let jobDescription = container.querySelector(".job-description").value

    workData.push({
      title: jobTitle,
      company: compnayName,
      duration: `${startDate}-${endDate}`,
      description: jobDescription
    });
  })

  return workData;

}


function getProjectsDetails(){
  let projectContainer = document.querySelectorAll(".projectSection > div");
  let projectsData = []


  projectContainer.forEach(container => {
      let projectname = container.querySelector(".projectname").value
      let projectlink = container.querySelector(".projecturl").value
      let projectdesc = container.querySelector(".projectdesc").value

      projectsData.push({
        projectName:projectname,
        projectLink:projectlink,
        projectDesc:projectdesc
      })
    })
    console.log(projectsData)
    return projectsData;

}




// prevents from submitting the form when enter is pressed
document.getElementById("resumeForm").addEventListener("keydown", function(event) {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
      this.value += '\n';
  }
});




// Initialize Awesomplete with a predefined list of suggestions
new Awesomplete(document.getElementById("degree-name"), {
  list: degreeNameList ,
  minChars: 1  // Show suggestions after typing 1 character
});




// Suggestion list for autocomplete





new Awesomplete(document.getElementById("job-title"), {
  list: jobTitlesList,
  minChars: 1  // Show suggestions after typing 1 character
});

new Awesomplete(document.getElementById("location"), {
  list: ["Mumbai","Raipur", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Ahmedabad", "Pune", "Surat", "Jaipur",
    "Kanpur", "Lucknow", "Nagpur", "Indore", "Thane", "Chandigarh", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
    "Gurugram", "Nashik", "Agra", "Madurai", "Faridabad", "Meerut", "Rajkot", "Kochi", "Coimbatore", "Mysuru",
    "Noida", "Jamshedpur", "Vijayawada", "Howrah", "Ranchi", "Kolkata", "Gwalior", "Udaipur", "Dhanbad", "Tirunelveli",
    "Shimla", "Navi Mumbai", "Bhubaneswar", "Dehradun", "Aligarh", "Rohtak", "Solapur", "Kota", "Haridwar", "Bikaner",
    "Jodhpur", "Aurangabad", "Nagapattinam", "Kolkata", "Siliguri", "Jammu", "Chandrapur", "Amritsar", "Chittorgarh"
],
  minChars: 1  // Show suggestions after typing 1 character
});






function alertMessageShow(text){
  
  let alertText = document.getElementById("alert-text")
  alertText.innerHTML = text;
  
  let alertBox = document.getElementById("alert-box");
  alertBox.style.display = "flex";
  
}


let alertButton = document.querySelector(".alert-button")
alertButton.addEventListener("click", function() {
  let alertBox = document.getElementById("alert-box");
  alertBox.style.display = "none";
});




// progress bar animation
let filled = document.getElementById("filled");
let bar = document.getElementById("bar");
let fillCount = 0;



function fill(toAdd) {
    fillCount++;

    // For filling the progress bar
    if(toAdd == 1) {
        bar.style.display = 'block';
        bar.style.borderTop = "3px solid rgb(103, 103, 255)";
        filled.style.display = 'block';
        let percentElement = document.querySelector(".percent");
        percentElement.style.display = 'block'

        let currentWidth = parseInt(window.getComputedStyle(filled).width);
        let totalWidth = parseInt(window.getComputedStyle(bar).width);
        let newWidth = (currentWidth / totalWidth) * 100 + 25;

        // Prevent width from exceeding 100%
        if(newWidth>=85){
          filled.classList.remove("animationClass");
        }

        if(newWidth>=97){
          filled.innerHTML = "100%"
        }

        if (newWidth >= 100) {
            newWidth = 100;
            filled.classList.remove("animationClass");
        }

        filled.style.width = `${newWidth}%`;
        updatePercentage(newWidth);
    }
    // For decreasing the progress bar
    else if(toAdd == -1) {
        let currentWidth = parseInt(window.getComputedStyle(filled).width);
        let totalWidth = parseInt(window.getComputedStyle(bar).width);
        let newWidth = (currentWidth / totalWidth) * 100 - 25;

        if(newWidth<90){
          filled.innerHTML = '';
        }

        // Prevent width from going below 0%
        if (newWidth <= 0) {
            newWidth = 0;
            filled.style.display = 'none';
            bar.style.borderTop = "none";
            let percentElement = document.querySelector(".percent");
            percentElement.style.display = 'none'
            filled.classList.remove("animationClass");
        }

        filled.style.width = `${newWidth}%`;
        updatePercentage(newWidth);
    }
}

function updatePercentage(width) {
    let percentage = Math.round(width) + "%";
    let percentElement = document.querySelector(".percent");
    percentElement.innerText = percentage;
}





























collegeLIST = ["Shri Shankaracharya Institute Of Professional Management And Technology","SSIPMT","Abhilashi University","Acharya N.G. Ranga Agricultural University","Acharya Nagarjuna University","Acharya Narendra Deva University of Agriculture & Technology","Adamas University","Adesh University","Adikavi Nannaya University","Ahmedabad University","Ajeenkya D.Y. Patil University","Akal University","AKS University","Alagappa University","Alakh Prakash Goyal Shimla University","Al-Falah University","Aliah University","Aligarh Muslim University","All India Institute of Medical Sciences Bhopal","All India Institute of Medical Sciences Bhubaneswar","All India Institute of Medical Sciences Delhi","All India Institute of Medical Sciences Jodhpur","All India Institute of Medical Sciences Patna","All India Institute of Medical Sciences Raipur","All India Institute of Medical Sciences Rishikesh","Alliance University","Amity University","Amrita Vishwa Vidyapeetham","Anand Agricultural University","Anant National University","Andhra University","Anna University","Annamalai University","Apeejay Stya University","Apex Professional University","Apex University","APJ Abdul Kalam Technological University","Arka Jain University","Arni University","Arunachal University of Studies","Arunodaya University","Aryabhatta Knowledge University","Ashoka University","Assam Agricultural University","Assam Don Bosco University","Assam Down Town University","Assam Rajiv Gandhi University of Cooperative Management","Assam Science and Technology University","Assam University","Assam Women's University","Atal Bihari Vajpayee Hindi Vishwavidyalaya","Atal Bihari Vajpayee Vishwavidyalaya","Atmiya University","AURO University","Avantika University","Avinashilingam Institute for Home Science and Higher Education for Women","Awadhesh Pratap Singh University","Ayush and Health Sciences University of Chhattisgarh","Azim Premji University","B.S. Abdur Rahman Crescent Institute of Science and Technology","Baba Farid University of Health Sciences","Baba Ghulam Shah Badhshah University","Baba Mastnath University","Babasaheb Bhimrao Ambedkar Bihar University","Babasaheb Bhimrao Ambedkar University","Babu Banarasi Das University","Baddi University of Emerging Sciences and Technologies","BAHRA University","Banaras Hindu University","Banasthali Vidyapith","Banda University of Agriculture and Technology","Bangalore University","Bankura University","Bareilly International University","Barkatullah University","Bengaluru North University","Bennett University","Berhampur University","Bhabha University","Bhagat Phool Singh Mahila Vishwavidyalaya","Bhagwant University","Bhakta Kavi Narsinh Mehta University","Bharath Institute of Higher Education and Research","Bharathiar University","Bharathidasan University","Bharati Vidyapeeth Deemed University","Bhartiya Skill Development University","Bhatkhande Sanskriti Vishwavidyalaya","Bhupal Nobles University","Bhupendra Narayan Mandal University","Bidhan Chandra Krishi Viswavidyalaya","Bihar Agricultural University","Biju Patnaik University of Technology","Binod Bihari Mahto Koyalanchal University","Birla Institute of Technology","Birla Institute of Technology and Science","Birsa Agricultural University","BLDE University","BML Munjal University","Bodoland University","Brainware University","Bundelkhand University","C.U. Shah University","Career Point University","Central Agricultural University","Central Institute of Fisheries Education","Central Institute of Higher Tibetan Studies","Central University of Andhra Pradesh","Central University of Gujarat","Central University of Haryana","Central University of Himachal Pradesh","Central University of Jammu","Central University of Jharkhand","Central University of Karnataka","Central University of Kashmir","Central University of Kerala","Central University of Odisha","Central University of Punjab","Central University of Rajasthan","Central University of South Bihar","Central University of Tamil Nadu","Centurion University of Technology and Management","CEPT University","Chanakya National Law University","Chandigarh University","Chandra Shekhar Azad University of Agriculture and Technology","Charotar University of Science and Technology","Chaudhary Bansi Lal University","Chaudhary Charan Singh Haryana Agricultural University","Chaudhary Charan Singh University","Chaudhary Devi Lal University","Chaudhary Ranbir Singh University","Chennai Mathematical Institute","Chhatrapati Shahu Ji Maharaj University","Chhattisgarh Kamdhenu Vishwavidyalaya","Chhattisgarh Swami Vivekananda Technical University","Children's University","Chitkara University, Himachal Pradesh","Chitkara University, Punjab","Christ University","Cluster University of Jammu","CMJ University","CMR University","Cochin University of Science and Technology","Cooch Behar Panchanan Barma University","Cotton University","CSK Himachal Pradesh Krishi Vishvavidyalaya","Dakshina Bharat Hindi Prachar Sabha","Damodaram Sanjivayya National Law University","Datta Meghe Institute of Higher Education & Research","DAV University","Davangere University","Dayalbagh Educational Institute","Dayananda Sagar University","Deccan College Post-Graduate and Research Institute","Deen Dayal Upadhyay Gorakhpur University","Deenbandhu Chhotu Ram University of Science and Technology","Delhi Pharmaceutical Sciences and Research University","Delhi Technological University","Desh Bhagat University","Dev Sanskriti Vishwavidyalaya","Devi Ahilya Vishwavidyalaya","Dharmsinh Desai University","Dhirubhai Ambani Institute of Information and Communication Technology","Diamond Harbour Women's University","Dibrugarh University","DIT University","Doon University","Dr K.N. Modi University","Dr YSR Architecture and Fine Arts University","Dr. A.P.J Abdul Kalam University","Dr. A.P.J. Abdul Kalam Technical University","Dr. B R Ambedkar National Institute of Technology Jalandhar","Dr. B. R. Ambedkar University Delhi","Dr. B.R. Ambedkar University","Dr. B.R. Ambedkar University of Social Sciences","Dr. Babasaheb Ambedkar Marathwada University","Dr. Babasaheb Ambedkar Technological University","Dr. Balasaheb Sawant Konkan Krishi Vidyapeeth","Dr. Bhimrao Ambedkar University","Dr. C.V. Raman University","Dr. D.Y. Patil Vidyapeeth","Dr. Harisingh Gour Vishwavidyalaya Sagar","Dr. M.G.R. Educational and Research Institute","Dr. N.T.R. University of Health Sciences","Dr. Panjabrao Deshmukh Krishi Vidyapeeth","Dr. Rajendra Prasad Central Agricultural University","Dr. Ram Manohar Lohia Avadh University","Dr. Ram Manohar Lohiya National Law University","Dr. Sarvepalli Radhakrishnan Rajasthan Ayurved University","Dr. Shakuntala Misra National Rehabilitation University","Dr. Vishwanath Karad MIT World Peace University","Dr. Y.S. Parmar University of Horticulture and Forestry","Dr. Y.S.R. Horticultural University","Dravidian University","EIILM University","Era University","Eternal University","Fakir Mohan University","Flame University","Forest Research Institute","G.H. Raisoni University","G.L.S. University","Galgotias University","Gandhi Institute of Technology and Management","Gangadhar Meher University","Ganpat University","Garden City University","Gauhati University","Gautam Buddha University","GD Goenka University","Geetanjali University","GIET University","GLA University","Glocal University","GNA University","Goa University","Gokhale Institute of Politics and Economics","Gondwana University","Govind Ballabh Pant University of Agriculture and Technology","Govind Guru Tribal University","Graphic Era Hill University","Graphic Era University","GSFC University","Gujarat Ayurved University","Gujarat National Law University","Gujarat Technological University","Gujarat University","Gujarat University of Transplantation Sciences","Gujarat Vidyapith","Gulbarga University","Guru Angad Dev Veterinary and Animal Sciences University","Guru Ghasidas Vishwavidyalaya","Guru Gobind Singh Indraprastha University","Guru Jambheshwar University of Science and Technology","Guru Kashi University","Guru Nanak Dev University","Guru Ravidas Ayurved University","Gurukul Kangri Vishwavidyalaya","Harcourt Butler Technical University","Haridev Joshi University of Journalism and Mass Communication","Haridwar University","Hemchandracharya North Gujarat University","Hemwati Nandan Bahuguna Garhwal University","Hemwati Nandan Bahuguna Uttarakhand Medical Education University","Hidayatullah National Law University","Himachal Pradesh Technical University","Himachal Pradesh University","Himalayan University","Himgiri ZEE University","Hindustan Institute of Technology and Science","Homi Bhabha National Institute","ICFAI University, Dehradun","ICFAI University, Himachal Pradesh","ICFAI University, Jaipur","ICFAI University, Jharkhand","ICFAI University, Meghalaya","ICFAI University, Mizoram","ICFAI University, Nagaland","ICFAI University, Raipur","ICFAI University, Sikkim","ICFAI University, Tripura","IEC University","IFHE Hyderabad","IFTM University","IIHMR University","IIMT University","IMS Unison University","Indian Agricultural Research Institute","Indian Institute of Engineering Science and Technology, Shibpur","Indian Institute of Foreign Trade","Indian Institute of Information Technology Allahabad","Indian Institute of Information Technology and Management Gwalior","Indian Institute of Information Technology, Design and Manufacturing","Indian Institute of Information Technology, Guwahati","Indian Institute of Information Technology, Kalyani","Indian Institute of Information Technology, Kottayam","Indian Institute of Information Technology, Lucknow","Indian Institute of Information Technology, Manipur","Indian Institute of Information Technology, Pune","Indian Institute of Information Technology, Sri City","Indian Institute of Information Technology, Una","Indian Institute of Information Technology, Vadodara","Indian Institute of Public Health","Indian Institute of Science","Indian Institute of Science Education and Research, Bhopal","Indian Institute of Science Education and Research, Kolkata","Indian Institute of Science Education and Research, Mohali","Indian Institute of Science Education and Research, Pune","Indian Institute of Science Education and Research, Thiruvananthapuram","Indian Institute of Space Science and Technology","Indian Institute of Teacher Education","Indian Institute of Technology Bhubaneswar","Indian Institute of Technology Bombay","Indian Institute of Technology Delhi","Indian Institute of Technology Gandhinagar","Indian Institute of Technology Guwahati","Indian Institute of Technology Hyderabad","Indian Institute of Technology Indore","Indian Institute of Technology Jodhpur","Indian Institute of Technology Kanpur","Indian Institute of Technology Kharagpur","Indian Institute of Technology Madras","Indian Institute of Technology Mandi","Indian Institute of Technology Patna","Indian Institute of Technology Roorkee","Indian Institute of Technology Ropar","Indian Institute of Technology, BHU","Indian Maritime University","Indian School of Mines","Indian Statistical Institute","Indian Veterinary Research Institute","Indira Gandhi Delhi Technical University for Women","Indira Gandhi Institute of Development Research","Indira Gandhi Institute of Medical Sciences","Indira Gandhi Krishi Vishwavidyalaya","Indira Gandhi National Tribal University","Indira Gandhi Technological and Medical Sciences University","Indira Gandhi University, Meerpur","Indira Kala Sangeet Vishwavidyalaya","Indraprastha Institute of Information Technology","Indrashil University","Indus International University","Indus University","Institute of Advanced Research","Institute of Advanced Studies in Education","Institute of Chemical Technology","Institute of Infrastructure, Technology, Research and Management","Integral University","International Institute for Population Sciences","International Institute of Information Technology Bangalore","International Institute of Information Technology, Bhubaneswar","International Institute of Information Technology, Hyderabad","International Institute of Information Technology, Naya Raipur","Invertis University","ISBM University","Islamic University of Science and Technology","ITM University Gwalior","ITM University Raipur","ITM Vocational University","J.C. Bose University of Science and Technology","Jadavpur University","Jagadguru Ramanandacharya Rajasthan Sanskrit University","Jagadguru Rambhadracharya Handicapped University","Jagan Nath University","Jagannath University","Jagran Lakecity University","Jai Narain Vyas University","Jai Prakash Vishwavidyalaya","Jain University","Jain Vishva Bharati Institute","Jaipur National University","Jamia Hamdard","Jamia Millia Islamia","Jananayak Chandrashekhar University","Janardan Rai Nagar Rajasthan Vidhyapeeth University","Jawaharlal Institute of Postgraduate Medical Education & Research","Jawaharlal Nehru Architecture and Fine Arts University","Jawaharlal Nehru Centre for Advanced Scientific Research","Jawaharlal Nehru Krishi Vishwavidyalaya","Jawaharlal Nehru Technological University","Jawaharlal Nehru Technological University, Anantapur","Jawaharlal Nehru Technological University, Kakinada","Jawaharlal Nehru University","Jayoti Vidyapeeth Women's University","Jaypee Institute of Information Technology","Jaypee University Anoopshahr","Jaypee University of Engineering and Technology","Jaypee University of Information Technology","JECRC University","Jharkhand Rai University","Jharkhand Raksha Shakti University","JIS University","Jiwaji University","JK Lakshmipat University","Jodhpur National University","JS University","JSS Academy of Higher Education and Research","JSS Science and Technology University","Junagadh Agricultural University","K L University","K.K. University","K.R. Mangalam University","Kadi Sarva Vishwavidyalaya","Kakatiya University","Kalasalingam Academy of Research and Education","Kalinga University","Kamdhenu University","Kameshwar Singh Darbhanga Sanskrit University","Kannada University","Kannur University","Karnatak University","Karnataka Janapada Vishwavidyalaya","Karnataka Samskrit University","Karnataka State Akkamahadevi Women's University","Karnataka State Law University","Karnataka State Rural Development and Panchayat Raj University","Karnataka Veterinary, Animal and Fisheries Sciences University","Karnavati University","Karpagam Academy of Higher Education","Karunya Institute of Technology and Sciences","Kavayitri Bahinabai Chaudhari North Maharashtra University","Kavi Kulguru Kalidas Sanskrit Vishwavidyalaya","Kazi Nazrul University","Kaziranga University","Kerala Agricultural University","Kerala Kalamandalam","Kerala University of Fisheries and Ocean Studies","Kerala University of Health Sciences","Kerala Veterinary and Animal Sciences University","Khwaja Moinuddin Chishti Language University","KIIT University","King George's Medical University","KLE Technological University","KLE University","Kolhan University","Krantiguru Shyamji Krishna Verma Kachchh University","Krishna University","Krishna Vishwa Vidyapeeth","KSGH Music and Performing Arts University","Kumar Bhaskar Varma Sanskrit and Ancient Studies University","Kumaun University","Kurukshetra University","Kushabhau Thakre Patrakarita Avam Jansanchar University","Kuvempu University","Lakshmibai National Institute of Physical Education","Lakulish Yoga University","Lala Lajpat Rai University of Veterinary and Animal Sciences","Lalit Narayan Mithila University","Lingaya's University","LNCT University","Lokbharati University for Rural Innovation","Lovely Professional University","M.J.P. Rohilkhand University","Madan Mohan Malaviya University of Technology","Madhav University","Madhyanchal Professional University","Madurai Kamaraj University","Magadh University","Mahapurusha Srimanta Sankaradeva Viswavidyalaya","Maharaja Agrasen Himalayan Garhwal University","Maharaja Agrasen University","Maharaja Bir Bikram University","Maharaja Chhatrasal Bundelkhand University","Maharaja Ganga Singh University","Maharaja Krishnakumarsinhji Bhavnagar University","Maharaja Ranjit Singh Punjab Technical University","Maharaja Surajmal Brij University","Maharana Pratap University of Agriculture and Technology","Maharashtra Animal and Fishery Sciences University","Maharashtra National Law University Mumbai","Maharashtra National Law University, Aurangabad","Maharashtra National Law University, Nagpur","Maharashtra University of Health Sciences","Maharishi Arvind University, Jaipur","Maharishi Dayanand University","Maharishi Mahesh Yogi Vedic Vishwavidyalaya","Maharishi Markandeshwar University, Mullana","Maharishi Markandeshwar University, Sadopur","Maharishi Markandeshwar University, Solan","Maharishi University","Maharishi University of Management and Technology","Maharshi Dayanand Saraswati University","Maharshi Panini Sanskrit Vishwavidyalaya","Mahatma Gandhi Antarrashtriya Hindi Vishwavidyalaya","Mahatma Gandhi Central University, Motihari","Mahatma Gandhi Chitrakoot Gramoday Vishwavidyalaya","Mahatma Gandhi Kashi Vidyapeeth","Mahatma Gandhi University","Mahatma Gandhi University of Medical Sciences and Technology","Mahatma Gandhi University, Meghalaya","Mahatma Gandhi University, Nalgonda","Mahatma Jyoti Rao Phoole University","Mahatma Phule Krishi Vidyapeeth","Makhanlal Chaturvedi Rashtriya Patrakarita Vishwavidyalaya","Malaviya National Institute of Technology, Jaipur","Malwanchal University","Manav Bharti University","Manav Rachna International Institute of Research and Studies","Manav Rachna University","Mandsaur University","Mangalayatan University","Mangalore University","Manipal Academy of Higher Education","Manipur International University","Manipur Technical University","Manipur University","Manipur University of Culture","Manonmaniam Sundaranar University","Martin Luther Christian University","Marwadi University","MATS University","Maulana Abul Kalam Azad University of Technology, West Bengal","Maulana Azad National Institute of Technology","Maulana Azad National Urdu University","Maulana Azad University, Jodhpur","Maulana Mazharul Haque Arabic and Persian University","Medi-Caps University","Meenakshi Academy of Higher Education and Research","Mewar University","MGM Institute of Health Sciences","MIT Art Design and Technology University","MIT University","Mizoram University","Mody University of Science and Technology","Mohammad Ali Jauhar University","Mohanlal Sukhadia University","Monad University","Mother Teresa Women's University","Motherhood University","Motilal Nehru National Institute of Technology Allahabad","Murshidabad University","MVN University","Nagaland University","Nalanda University","NALSAR University of Law","Nanaji Deshmukh Veterinary Science University","Narsee Monjee Institute of Management and Higher Studies","National Dairy Research Institute","National Forensic Sciences University","National Institute of Design","National Institute of Educational Planning and Administration","National Institute of Fashion Technology","National Institute of Food Technology Entrepreneurship and Management","National Institute of Mental Health and Neuro Sciences","National Institute of Pharmaceutical Education and Research, Ahmedabad","National Institute of Pharmaceutical Education and Research, Guwahati","National Institute of Pharmaceutical Education and Research, Hajipur","National Institute of Pharmaceutical Education and Research, Hyderabad","National Institute of Pharmaceutical Education and Research, Kolkata","National Institute of Pharmaceutical Education and Research, Raebareli","National Institute of Pharmaceutical Education and Research, S.A.S. Nagar","National Institute of Technology Delhi","National Institute of Technology Mizoram","National Institute of Technology Sikkim","National Institute of Technology, Agartala","National Institute of Technology, Arunachal Pradesh","National Institute of Technology, Calicut","National Institute of Technology, Durgapur","National Institute of Technology, Goa","National Institute of Technology, Hamirpur","National Institute of Technology, Jamshedpur","National Institute of Technology, Karnataka","National Institute of Technology, Kurukshetra","National Institute of Technology, Manipur","National Institute of Technology, Meghalaya","National Institute of Technology, Nagaland","National Institute of Technology, Patna","National Institute of Technology, Puducherry","National Institute of Technology, Raipur","National Institute of Technology, Rourkela","National Institute of Technology, Silchar","National Institute of Technology, Srinagar","National Institute of Technology, Tiruchirappalli","National Institute of Technology, Uttarakhand","National Institute of Technology, Warangal","National Law Institute University","National Law School of India University","National Law University and Judicial Academy","National Law University Odisha","National Law University, Delhi","National Law University, Jodhpur","National Sanskrit University","National Sports University","National University of Study and Research in Law","Nava Nalanda Mahavihara","Navrachana University","Navsari Agricultural University","Nehru Gram Bharati Vishwavidyalaya","NIILM University","NIIT University","Nilamber-Pitamber University","NIMS University","Nirma University","NITTE University","Nizam's Institute of Medical Sciences","Noida International University","North East Frontier Technical University","North Eastern Hill University","North Eastern Regional Institute of Science and Technology","North Orissa University","O.P. Jindal Global University","O.P. Jindal University","Odisha University of Agriculture and Technology","OPJS University","Oriental University","Osmania University","P P Savani University","P.K. University","Pacific Medical University","Pacific University, India","Padmashree Dr. D.Y. Patil Vidyapith","Palamuru University","Pandit Deendayal Petroleum University","Pandit Deendayal Upadhyaya Shekhawati University","Pandit Ravishankar Shukla University","Panjab University","Parul University","Patna University","PDM University","PDPM Indian Institute of Information Technology, Design and Manufacturing","PEC University of Technology","People's University","Periyar Maniammai Institute of Science and Technology","Periyar University","PES University","Plastindia International University","Pondicherry University","Ponnaiyan Ramajayam Institute of Science and Technology","Poornima University","Post Graduate Institute of Medical Education and Research","Potti Sreeramulu Telugu University","Pragyan International University","Pratap University","Pravara Institute of Medical Sciences","Presidency University","Presidency University","Prof. Rajendra Singh (Rajju Bhaiya) University","Professor Jayashankar Telangana State Agricultural University","Pt. Bhagwat Dayal Sharma University of Health Sciences","Punjab Agricultural University","Punjab Technical University","Punjabi University Patiala","Punyashlok Ahilyadevi Holkar Solapur University","Quantum University","Rabindra Bharati University","Rabindranath Tagore University","Raffles University","Rai Technology University","Rai University","Raiganj University","Raj Rishi Bharthari Matsya University","Raja Mansingh Tomar Music and Arts University","Rajasthan Technical University Kota","Rajasthan University of Health Sciences","Rajasthan University of Veterinary and Animal Sciences","Rajiv Gandhi Institute of Petroleum Technology","Rajiv Gandhi National Aviation University","Rajiv Gandhi National Institute of Youth Development","Rajiv Gandhi National University of Law","Rajiv Gandhi Proudyogiki Vishwavidyalaya","Rajiv Gandhi University","Rajiv Gandhi University of Health Sciences","Rajiv Gandhi University of Knowledge Technologies","Rajmata Vijayaraje Scindia Krishi Vishwavidyalaya","Rama Devi Women's University","Rama University","Ramaiah University of Applied Sciences","Ramakrishna Mission Vivekananda Educational and Research Institute","Ranchi University","Rani Channamma University, Belagavi","Rani Durgavati Vishwavidyalaya","Rani Lakshmi Bai Central Agricultural University","Ras Bihari Bose Subharti University","Rashtrasant Tukadoji Maharaj Nagpur University","Rashtriya Raksha University","Rashtriya Sanskrit Sansthan University","Ravenshaw University","Rayalaseema University","Rayat-Bahra University","REVA University","RIMT University","Rishihood University","RK University","RKDF University","Sabarmati University","Sage University","Sai Nath University","Sai Tirupati University","Sam Higginbottom Institute of Agriculture, Technology and Sciences","Sambalpur University","Sampurnanand Sanskrit Vishvavidyalaya","Sanchi University of Buddhist-Indic Studies","Sandip University","Sandip University, Sijoul","Sangai International University","Sangam University","Sanjay Gandhi Post Graduate Institute of Medical Sciences","Sanjay Ghodawat University","Sankalchand Patel University","Sanskriti University","Sant Baba Bhag Singh University","Sant Gadge Baba Amravati University","Sant Longowal Institute of Engineering and Technology","Santosh University","Sarala Birla University","Sardar Patel University","Sardar Patel University of Police, Security and Criminal Justice","Sardar Vallabhbhai National Institute of Technology, Surat","Sardar Vallabhbhai Patel University of Agriculture and Technology","Sardarkrushinagar Dantiwada Agricultural University","Sarguja University","Sarvepalli Radhakrishnan University","SASTRA University","Satavahana University","Sathyabama Institute of Science and Technology","Saurashtra University","Saveetha Institute of Medical and Technical Sciences","Savitribai Phule Pune University","School of Planning and Architecture, Bhopal","School of Planning and Architecture, Delhi","School of Planning and Architecture, Vijayawada","Seacom Skills University","Shaheed Mahendra Karma Vishwavidyalaya","Sharda University","Sharnbasva University","Sher-e-Kashmir University of Agricultural Sciences and Technology of Jammu","Sher-e-Kashmir University of Agricultural Sciences and Technology of Kashmir","Sher-i-Kashmir Institute of Medical Sciences","Shiv Nadar University","Shivaji University","Shobhit Institute of Engineering and Technology","Shoolini University of Biotechnology and Management Sciences","Shree Guru Gobind Singh Tricentenary University","Shree Somnath Sanskrit University","Shreemati Nathibai Damodar Thackersey Women's University","Shri Govind Guru University","Shri Guru Ram Rai Education Mission","Shri Guru Ram Rai University","Shri Jagannath Sanskrit Vishvavidyalaya","Shri Jagdishprasad Jhabrmal Tibrewala University","Shri Lal Bahadur Shastri Rashtriya Sanskrit Vidyapeetha","Shri Mata Vaishno Devi University","Shri Ramswaroop Memorial University","Shri Vaishnav Vidyapeeth Vishwavidyalaya","Shri Venkateshwara University","Shri Vishwakarma Skill University","Shridhar University","Siddharth University","Sidho Kanho Birsha University","Sido Kanhu Murmu University","Sikkim Manipal University","Sikkim University","Siksha 'O' Anusandhan","Singhania University","Sir Padampat Singhania University","SKIPS University","South Asian University","Spicer Adventist University","Sree Chitra Thirunal Institute of Medical Sciences and Technology","Sree Sankaracharya University of Sanskrit","Sri Balaji Vidyapeeth","Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya","Sri Dev Suman Uttarakhand University","Sri Devaraj Urs Academy of Higher Education and Research","Sri Guru Granth Sahib World University","Sri Guru Ram Das University of Health Sciences","Sri Konda Laxman Telangana State Horticultural University","Sri Krishnadevaraya University","Sri Padmavati Mahila Visvavidyalayam","Sri Ramachandra Institute of Higher Education and Research","Sri Sai University","Sri Sathya Sai Institute of Higher Learning","Sri Satya Sai University of Technology and Medical Sciences","Sri Siddhartha Academy of Higher Education","Sri Sri University","Sri Venkateswara Institute of Medical Sciences","Sri Venkateswara University","Sri Venkateswara Vedic University","Sri Venkateswara Veterinary University","Srimanta Sankaradeva University of Health Sciences","Srinivas University","SRM Institute of Science and Technology","SRM University Haryana","SRM University, Sikkim","St. Joseph University","St. Peter's Institute of Higher Education and Research","St. Xavier's University","Starex University","State University of Performing and Visual Arts","Suamandeep Vidyapeeth","Sunrise University","Suresh Gyan Vihar University","Sushant University","Swami Keshwanand Rajasthan Agricultural University","Swami Rama Himalayan University","Swami Ramanand Teerth Marathwada University","Swami Vivekanand Subharti University","Swami Vivekanand University","Swami Vivekananda Yoga Anusandhana Samsthana","Swarnim Gujarat Sports University","Swarnim Startup and Innovation University","Symbiosis International University","Symbiosis University of Applied Sciences","Tamil Nadu Agricultural University","Tamil Nadu Dr Ambedkar Law University","Tamil Nadu Dr. J. Jayalalithaa Fisheries University","Tamil Nadu Dr. M.G.R.Medical University","Tamil Nadu Dr.J Jayalalithaa Music and Fine Arts University","Tamil Nadu National Law University","Tamil Nadu Physical Education and Sports University","Tamil Nadu Teacher Education University","Tamil Nadu Veterinary and Animal Sciences University","Tamil University","Tantia University","Tata Institute of Fundamental Research","Tata Institute of Social Sciences","TeamLease Skills University","Techno India University","Teerthanker Mahaveer University","Telangana University","TERI School of Advanced Studies","Tezpur University","Thapar Institute of Engineering and Technology","The English and Foreign Languages University","The Gandhigram Rural Institute","The IIS University","The Indian Law Institute","The LNM Institute of Information Technology","The Maharaja Sayajirao University of Baroda","The National University of Advanced Legal Studies","The Neotia University","The Northcap University","The Sanskrit College and University","The West Bengal National University of Juridical Sciences","Thiruvalluvar University","Thunchath Ezhuthachan Malayalam University","Tilak Maharashtra Vidyapeeth","Tilka Manjhi Bhagalpur University","Tripura University","Tumkur University","U.P. Pt. Deen Dayal Upadhyaya Veterinary Science University and Cattle Research Institute","Uka Tarsadia University","University of Agricultural and Horticultural Sciences, Shivamogga","University of Agricultural Sciences, Bangalore","University of Agricultural Sciences, Dharwad","University of Agricultural Sciences, Raichur","University of Allahabad","University of Burdwan","University of Calcutta","University of Calicut","University of Delhi","University of Engineering and Management, Kolkata","University of Gour Banga","University of Horticultural Sciences, Bagalkot","University of Hyderabad","University of Jammu","University of Kalyani","University of Kashmir","University of Kerala","University of Kota","University of Lucknow","University of Madras","University of Mumbai","University of Mysore","University of North Bengal","University of Patanjali","University of Petroleum and Energy Studies","University of Rajasthan","University of Science and Technology, Meghalaya","University of Technology","University of Trans-Disciplinary Health Sciences and Technology","Usha Martin University","Utkal University","Utkal University of Culture","Uttar Banga Krishi Viswavidyalaya","Uttar Pradesh University of Medical Sciences","Uttarakhand Aawasiya Vishwavidyalaya, Almora","Uttarakhand Ayurved University","Uttarakhand Sanskrit University","Uttarakhand Technical University","Uttaranchal University","Vasantrao Naik Marathwada Krishi Vidyapeeth","Veer Bahadur Singh Purvanchal University","Veer Chandra Singh Garhwali Uttarakhand University of Horticulture & Forestry","Veer Kunwar Singh University","Veer Narmad South Gujarat University","Veer Surendra Sai University of Technology","Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology","Vellore Institute of Technology","Vels University","Vidyasagar University","Vignan University","Vijayanagara Sri Krishnadevaraya University","Vikram University","Vikrama Simhapuri University","Vinayaka Mission's Research Foundation","Vinayaka Missions Sikkim University","Vinoba Bhave University","Vishwakarma University","Visva-Bharati University","Visvesvaraya National Institute of Technology","Visvesvaraya Technological University","VIT Bhopal University","Vivekananda Global University","West Bengal State University","West Bengal University of Animal and Fishery Sciences","West Bengal University of Health Sciences","West Bengal University of Teachers' Training, Education Planning and Administration","William Carey University, Shillong","XIM University","YBN University","Yenepoya University","A. D. Patel Institute of Technology","A.K.G. Engineering College","A.R.J. College of Engineering and Technology","ABES Engineering College","ACE Engineering College","AES American Embassy School","AIMIT","AIT","AMC Engineering College","APS College of Engineering","AQJ College","ASM Institute of Business Management and Research","Aalim Muhammed Salegh College","Aarupadai Veedu Institute of Technology","Acharya Institute of Technology","Acharya N.G. Ranga Agricultural University","Acharya Nagarjuna Vishwavidhyalayamu","Acropolis Institute of Technology and Research","Acropolis Technical Campus","Adhiyamaan College of Engineering","Adi Shankara Institute of Engineering and Technology","Adikavi Nannaya University","Aditanar College of Arts and Science","Aditya Institute of Technology and Management","Advanced Institute of Technology and Management","Agra College","Ajmer Institute of Technology","Akkineni Nageswara Rao College","Al-Ameen Educational and Medical Foundation","Alagappa University College of Education","Alard Institute of Management Sciences (AIMS)","Aligarh Muslim University","All India Institute of Medical Sciences","All Saints College of Technology","All Saints  College","Allahabad Agricultural Institute","Allahabad University","Allana Inistitute Of Management Sciences","Allana Institute of Management Studies","Alpha College of Engineering","Amal Jyothi College of Engineering","Ambala College of Engineering","Ambedkar Institute of Technology","American School of Bombay","Amity School of Engineering and Technology - New Delhi","Amity University Lucknow Campus","Amity University Haryana","Amrapali Institute of Management and Computer Applications","Amrapali Institute of Technology and Sciences","Amravati University","Amrita Vishwa Vidyapeetham - Coimbatore","Amrita Vishwa Vidyapeetham - Amritapuri","Amrita Vishwa Vidyapeetham - Bangalore","Amrita School of Arts and Sciences - Mysore","Amrita School of Arts and Sciences - Kochi","Amrutvahini College of Engineering","Anand Institute of Higher Technology","Anand Institute of Information Science","Anbanathapuram Vahaira Charities College - A.V.C.","Andhra University","Angel College of Engineering and Technology","Anil Neerukonda Institute of Technology and Sciences - ANITS","Anja Polytechnic College","Anjalai Ammal Mahalingam Engineering College","Anjuman College of Engineering and Technology","Anna University","Annai Mathammal Sheela Engineering College","Annai Teresa Magalir Palkalaikazhgam","Annamacharya Institute of Technology and Sciences","Annamalai University","Anurag group of Institutions","Apeejay College of Engineering","Apeejay Institute of Technology","Apex Institute of Management and Science","Appa Institute of Engineering and Technology","Arasu Engineering College","Army Institute of Technology","Arul Anandar College","Arya College of Engineering and Information Technology","Arya Institute of Engineering and Technology","Aryabhatta Institute of Engineering and Management","Asansol Engineering College","Asia Pacific Institute of Information Technology","Assam Agricultural University","Assam Engineering College","Assam University","Atal Birahi Vajpayee Indian Institute of Information Technology and Management","Atharva College of Engineering","Atmiya Institute of Technology and Science","Atria Institute of Technology","Auden Technology and Management Academy","Aurora P. G. College","Aurora Engineering College","Avanthi Institute of Engineering and Technology","Avinashilingam Institute for Home Science and Higher Education for Women","Awadhesh Pratap Singh Vishwavidyalaya","Ayya Nadar Janaki Ammal College","B P Poddar Institute of Management and Technology","B. P. Poddar Institute of Management and Technology","B. V. B. College of Engineering and Technology","B.N. Mandal University","B.S. Anangpuria Institute of Technology and Management","B.V.B. College of Engineering and Technology","B.V.C. Engineering College","BBS College of Engineering and. Technology","BK Birla Institue of Engineering and Technology","BLDEACET","BMS College of Engineering (BMSCE)","BMS Institute of Technology (BMSIT)","BNM Institute of Technology","BSA College of Engineering and Technology","BSA Crescent Engineering College","Baba Banda Singh Bahadur Engineering College","Baba Farid University of Health Sciences","Baba Saheb Ambedkar Institute of Technology and Management","Babaria Institute of Technology","Babasaheb Bhimrao Ambedkar Bihar University","Babasaheb Bhimrao Ambedkar University","Babu Banarasi Das National Institute of Technology and Management","Babu Banarsi Das Institute of Technology","Babu Mohanlal Arya Smarak Engineering College","Bahadhur Shastri National Academy of Administration","Baharati Vidyapeeth College of Engineering","Bahai Institute for Higher Education","Baldev Ram Mirdha Institute of Technology","Balaji Institute of Technology &amp; Science","Banaras Hindu University","Banarsidas Chandiwala Institute Of Information Technology","Banasthali Vidyapith for Women","Bangalore Institute of Technology","Bangalore University","Bankura Unnayani Institute of Engineering","Bannari Amman Institute of Technology","Bansal College of Engineering","Bansal Institute of Science and Technology","Bansal School of Engineering and Technology","Bapuji Institute of Engineering and Technology","Bapuji Institute of Hi-Tech Education","Bapurao Deshmukh College of Engineering","Barkatullah Vishwavidyalaya","Basaveshwar Engineering College - Bagalkot","Beant College of Engineering and Technology","Bellary Engineering College","Bengal College of Engineering and Technology","Bengal Engineering College","Bengal Engineering and Science University","Bengal Institute of Technology","Berhampur University","Bhajarang Engineering College","Bharat Institute of Technology","Bharath Institute of Science and Technology","Bharath Niketan Engineering College","Bharathiar University","Bharathidasan University","Bharati Vidyapeeth","Bharati Vidyapeeth Institute of Management and IT","Bharati Vidyapeeth University Institute of Management and Research","Bharatiya Vidya Bhavans S. P. Jain Institute of Management and Research (SPJIMR)","Bhartiya Pashu-Chikitsa Anusandhan Sansthan","Bhatkhande Music Institute","Bhavnagar University","Bhilai Institute of Technology","Bhiwani Institute of Technology and Sciences","Bhoj Reddy Engineering College for Women","Bhoomaraddi College of Engineering and Technology (BVBCET)","Bhopal Engineering College","Bidhan Chandra Krishi Viswavidyalaya","Bihar Yoga Bharati","Biju Patnaik University of Technology","Birbhum Institute of Engineering and Technology","Birla Institute of Applied Science","Birla Institute of Technology - Ranchi","Birla Institute of Technology and Science - BITS Pilani","Birla Institute of Technology","Birsa Agricultural University","Birsa Institute of Technology","Bishop Heber College","Biyani Institute of Science and Management - BISMA","Brindavan College of Engineering","Bundelkhand Institute of Engineering and Technology","Bundelkhand University","C K Pithawala College of Engineering and Technology","C U Shah College of Engineering and Technology","C.B. Patel Computer College","CET Karnataka Information and Counselling","CIT-Changa","CMR College of Engineering Technology (CMRCET)","CMR College of Engineering and Technology","CMR Institute of Technology","CSI College Of Engineering (CSICE)","CV Raman College of Engineering","CVR College of Engineering","Calcutta Institute of Engineering and Management","Calcutta Institute of Technology","Canara Engineering College","Chandubhai S Patel Institute of Technology","Central Agricultural University","Central Institute of English and Foreign Languages","Central Institute of Fisheries Education","Central Institute of Higher Tibetan Studies","Centre for Development of Advanced Computing","Centre for Environmental Planning and Technology","Chaitanya Bharati Institute of Technology","Chaityana Institute of Science and Technology","Chamelidevi Institute of Technology and Management","Chandigarh Engineering College","Chandra Shekhar Azad University of Agriculture and Technology","Chaudhary Charan Singh Haryana Agricultural University","Chaudhary Charan Singh University","Chaudhary Sarwan Kumar Himachal Pradesh Krishi Vishwavidyalaya","Chennai Mathematical Institute","Cherraans Arts and Science College","Chettinad College of Engineering and Technology","Chhattisgarh Swami Vivekanand Technical University","Chhatrapati Shahu Ji Maharaj University","Chhatrapati Shivaji Institute of Technoloty","Chikhli College","Chinmaya Institute of Technology","Chitkara Educational Trust","Chouksey Engineering College","Christ College","Christ University","Christu Jayanthi Jubilee College","Co-operative Institute of Technology - Vadakara","Cochin University of Science and Technology - Kerala","Coimbatore Institute of Engineering and Technology","Coimbatore Institute of Technology","College of Engineering and Management","College of Engineering and Technology","College of Engineering Kallooppara","College Of  Engineering Karunagapally","College of Engineering Poonjar","College of Engineering Roorkee","College of Engineering Thalassery","College of Engineering Trivandrum","College of Engineering","College of Technology And Engineering","Cummins College of Engineering for Women","D. G. Ruparel College","D.G. Vaishnav College - Chennai","D.N.R College","DAV College of Engineering and Technology","DAV Institute of Engineering and Technology","DB Pampa College","DES Navinchandra Mehta Institute of Technology and Development","DMCE Online","DRK Institute of Science and Technology","DVR college of Engineering and Technology","Dadi Institute of Engineering and Technology","Dakshina Bharat Hindi Prachar Sabha","Darda Engineering College Yavatmal","Dayalbagh Educational Institute","Dayananda Sagar Institutions","Deccan College of Engineering and Technology","Deenbandhu Chhotu Ram University of Science and Technology","Deendayal Upadhyay Gorakhpur University","Deepshikha College of Technical Education","Dehradun Institute of Technology","Delhi College of Engineering","Delhi University","Delhi Vishwavidyalaya","Deogiri College Aurangabad","Dev Sanskriti Vishwavidyalaya","Devanga Arts College","Devi Ahilya Vishwavidyalaya","Devineni Venkata Ramana and Dr. HS Mic College of Technology","Dhanalakshmi College of Engineering","Dharmsinh Desai University","Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)","Dhruva College of Management","Dibrugarh University","Dnyaneswar Vidyapeeth IST ","Doctor B.R. Ambedkar Open University","Doctor Babasaheb Ambedkar Technological University","Doctor Balasaheb Sawant Konkan Krishi Vidyapeeth","Doctor Bhim Rao Ambedkar University","Doctor Harisingh Gour Vishwavidyalaya","Doctor Panjabrao Deshmukh Krishi Vidyapeeth","Doctor Ram Manohar Lohia Awadh University","Doctor Yashwant Singh Parmar University of Horticulture and Forestry","Don Bosco Institute of Technology","Dr G R Damodaran College of Science","Dr MGR College","Dr Mahalingam College of Engineering and Technology","Dr Paul Raj Engineering College","Dr. B.C. Roy Engineering College","Dr. Babasaheb Ambedkar Marathwada University","Dr. D. Y. Patil College of Engineering","Dr. D. Y. Patil Institute Of Management and Research","Dr. Kedar Nath Modi Institute of Engineering and Technology","Dr. M.G.R Engineering College","Dr. Navalar Nedunchezhian College Of Engineering","Dr. Pauls Engineering College","Dr. Ram Manohar Lohia Institute","Dr. Sivanthi Aditanar College of Engineering","Dr. T. Thimmaiah Institute of Technology","Dr.M.G.R University","Dravidian University","Dronacharya College of Engineering","Durgapur Institute of Advanced Technology and Management","ERandDCI Institute of Technology","East Point College of Engineering and Technology","Easwari Engineering College","Einstein College of Engineering","Engineering College Ajmer","Engineering College in Patiala","Engineering College of Kota","Engineering College","Erode Sengunthar Engineering College","Ethiraj College","FET","FORE School of Management","Faculdades Integradas Logatti","Fakir Mohan University","Farah Institute of Computer Science","Federal Institute of Science and Technology","Fergusson College - Pune","Feroz Gandhi Institute of Engineering and Technology","Forest Research Institute","Forte Institute of Technology","Fr. Conceicao Rodrigues College of Engineering","Future Institute of Engineering and Management","Gujarat Forensic Science University","G H Raisoni Institute of Information Technology","G. B. Pant Engineering College - Uttar Pradesh","G. D. Goenka World Institute - Lancaster University","G. Narayanamma Institute of Technology and Science","G. Pulla Reddy Engineering College","G. Pullaiah College of Engineering and Technology","G.H. Patel College of Engineering and Technology","G.V.M. Institute of Technology and Management - GVMITM","GATES Institute of Technology","GLA Institute of Technology and Management","GLS Institute of Computer Technology","GMR Institute of Technology (GMRIT)","Gnanamani College Of Engineering","GS Medical College","GVP College of Engineering","Galgotia Institute of Management and Technology","Galgotias College of Engineering and Technology","Ganadipathy Tulsis Engineering College","Gandhi Institute for Technology","Gandhi Institute of Engineering and Technology (GIET)","Gandhi Institute of Engineering and Technology","Gandhi Institute of Technology and Management","Gandhigram Rural Institute","Ganpat University","Garden City College","Gauhati University","Gauthami Degree College For Women","Gayatri Vidya Parishad College of Engineering","Geeta Institute Of Management And Technology","Geetanjali Institute of Technical Studies","Gitam Institute of Technology and Science","Gitam University","Gitarattan International Business School","Global Academy of Technology","Global Institute of Management and Technology (GIMT)","Global Institute of Technology","Goa Institute of Management","Goa University","Godavari Institute of Engineering and Technology","Gogte Institute of Technology","Gojan School of Business and Technology","Gokaraju Rangaraju Institute of Engineering and Technology","Gokhale Institute of Politics and Economics","Gopal Ramalingam Memorial Engineering College","Government College Of Engineering - Pune","Government College of Arts","Government College of Engineering","Government College of Engineering Auranagabd","Government College of Engineering and Ceramic Technology","Government College of Engineering and Leather Technology","Government College of Engineering","Government Engineering College","Government College of Technology","Government Engineering College Ajmer","Government Polytechnic Institute","Government Polytechnic","Govind Ballabh Pant Krishi Evam Praudyogik Vishwavidyalaya","Govt. Mahila Engineering College","Graphic Era Institute of Technology","Great Lakes Institute of Management","Greater Noida Institute of Technology","Gudlavalleru Engineering College","Gujarat Agricultural University","Gujarat Ayurved University","Gujarat University","Gujarat Vidyapith","Gulbarga University","Gulzar Group Of Institutes","Gurgaon Institute of Technology and Management","Guru Ghasidas University","Guru Gobind Singh College of Engineering and Technology","Guru Gobind Singh Indraprastha University","Guru Jambeshwar University","Guru Nanak Dev University","Guru Nanak Enginerring College","Guru Ramdas Khalsa Institite of Technology","Guru Tegh Bahadur Institute of Technology-GTBIT","Gurukula Kangri Vishwavidyalaya","Gurunanak Institute of Technology","Gyan Ganga Institute of Technology and Sciences","Gyan Vihar School of Engineering and Technology","H.K.R.H. College","HKBK College of Engineering","HMS Institute of Technology","Haldia Insitute of Technology","Harcourt Butler Technological Institute - Kanpur","Hemchandracharya North Gujarat University","Hemwati Nandan Bahuguna Garhwal University","Heritage Institute of Technology","Hi-Point College of Engineering and Technology","Himachal Pradesh University","Hindustan College of Engineering","Hindustan College of Science and Technology","Hitkarini College of Engineering and Technology","Holy Mary Institute of Technology and Science","Hyderabad Central University","IBS Ahmedabad","IBS Hyderabad","ICFAI Business School","ICFAI National College","ICFAI School of Information Technology","ICFAI University","IEC College of Engineering and Technology","IMPS College of Engineering and Technology - IMPSCET","IMS College Of Engineering","INMANTEC Integrated Academy of Management and Technology","Ilahia College of Engineering and Technology","India Business School ","Indian Agricultural Research Institute","Indian Association for the Cultivation of Science","Indian Business Academy","Indian Institute of Foreign Trade","Indian Institute of Information Management","Indian Institute of Information Technology","Indian Institute of Information Technology - IIIT Allahabad","Indian Institute of Information Technology - IIIT Bangalore","Indian Institute of Information Technology - IIIT Hyderabad","Indian Institute of Information Technology - IIIT Kolkata","Indian Institute of Information Technology - IIIT Pune","Indian Institute of Information Technology Jabalpur","Indian Institute of Information Technology and Management - Kerala","Indian Institute of Information Technology and Management","Indian Institute of Management","Indian Institute of Rural Management","Indian Institute of Science","Indian Institute of Science and Information Technology","Indian Institute of Science - IISc Bangalore","Indian Institute of Science Education and Research Pune","Indian Institute of Space Science and Technology","Indian Institute of Social Welfare and Business Management","Indian Institute of Technology - IIT Bhubaneswar","Indian Institute of Technology - IIT Bombay","Indian Institute of Technology - IIT Delhi","Indian Institute of Technology - IIT Guwahati","Indian Institute of Technology - IIT Kanpur","Indian Institute of Technology - IIT Kharagpur","Indian Institute of Technology - IIT Madras","Indian Institute of Technology - IIT Powaii","Indian Institute of Technology - IIT Roorkee","Indian Institute of Technology - IIT Patna","Indian Institute of Technology - IIT Ropar","Indian Institute of Technology - IIT Hyderabad","Indian Institute of Technology - IIT Gandhinagar","Indian Institute of Technology - IIT Rajasthan","Indian Institute of Technology - IIT Mandi","Indian Institute of Technology - IIT Indore","Indian Institute of Technology - IIT BHU","Indian School of Business","Indian School of Mines - Dhanbad","Indian Statistical Institute","Indira College of Engineering and Management","Indira Gandhi Institute of Development and Research","Indira Gandhi Institute of Technology","Indira Gandhi Krishi Vishwavidyalaya","Indira Gandhi National Open University","Indira Gandhi Rashtriya Mukta Vishwavidyalaya","Indira Institute of Management","Indraprastha Institute of Information Technology","Indira Kala Sangeet Vishwavidyalaya","Indo Global Engineering","Indore Institute of Science and Technology","Indore Professional Studies Academy","Indur Institute of Engineering and Technology","Infant Jesus College of Engineering","Institute of Informatics and Communication","Institute for Development and Research in Banking Technology","Institute for Electronic Governance","Institute of Advanced Computer and Research","Institute of Advanced Studies in Education","Institute of Aeronautical Engineering","Institute of Armament Technology","Institute of Engineering and Science IPS Academy","Institute of Engineering and Technology","Institute of Foreign Trade and Management","Institute of Industrial and Computer Management and Research A.T.S.S.  I.I.C.M.R.","Institute of Information Technology and Management","Institute of Management Research and Development","Institute of Management Research","Institute of Management Studies Career Development and Research","Institute of Management Studies Noida","Institute of Management Studies- Ghaziabad","Institute of Management Technology","Institute of Management and Research","Institute of Mathematical Sciences - IMSc Chennai","Institute of Productivity and Management","Institute of Productivity and Management","Institute of Road and Transport Technology","Institute of Rural Management Anand","Institute of Technology and Management","Institute of Technology and Science (ITS)","Institute of Technology and Marine Engineering","Integral University","International Institute for Population Sciences","International Institute for Special Education","International Institute of Information Technology","International Institute of Management Science","International Management Institute","International School Of Informatics and Management","International School of Business and Research","International School of Business and Media","International School of Informatics and Management","International School of Information Management","International School of Management Excellence","Invertis Institute of Engineering and Technology","Ishwarchand Vidya Sagar Institute of Technology and Management","Islamiah Institute of Technology","Islamic University of Science and Technology","J.B. Institute of Engineering and Technology","J.T. Mahajan College of Engineering","Jay Sriram College of Technology","JIS College of Engineering","JM Institute of Technology","JNTU College of Engineering","JSPMs Abacus Institute Of Computer Application","JSS Academy of Technical Education","JSS College for Women","Jabalpur Engineering College","Jadavpur University - Jadavpur University","Jagan Institute of Management Studies","Jagan Nath University","Jagannath Institute for Technology and Management","Jagarlamudi Kuppuswamy Chowdary College","Jai Narain Vyas University","Jai Prakash Vishwavidyalaya","Jain University","Jaipur Engineering College and Research Centre","Jaipur Engineering College","Jaipuria Institute of Management","Jamia Hamdard - Delhi","Jamia Millia Islamia","Jansons School of Business","Jansons Institute of Technology","Jawaharlal Institute of Technology","Jawaharlal Nehru Centre for Advanced Scientific Research","Jawaharlal Nehru Engineering College - JNEC","Jawaharlal Nehru Krishi Vishwavidyalaya","Jawaharlal Nehru Technological University","Jawaharlal Nehru Technological University","Jawaharlal Nehru University - JNU Delhi","Jawaharlal Nehru Vishvavidyalaya","Jaya College of Arts and Science","Jaya Engineering College","Jayam College of Engineering and Technology","Jayawant Institute of Computer Applications","Jayawant Shikshan Prasarak Mandal","Jayawantrao Sawant College of Engineering","Jaypee Institute of Information Technology","Jaypee University of Information Technology","Jaypee University of Engineering &amp; Technology","Jehangirabad Institute of Technology","Jeppiaar Engineering College","Jerusalem College of Engineering","Jind Institute of Engineering and Technology","Jiwaji University","Jnana Vikas Institute of Technology","Jodhpur Engineering College and Research Centre","Jodhpur Institute of Engineering and Technology","Jorhat Engineering College","Jyothi Engineering College","Jyothi Nivas College","Jyothishmathi Institute of Technology and Science","K L University","K. J. Somaiya College of Engineering","K. K. Wagh Institute of Engineering Education and Research","K. R. School of Information Technology","K. S. R. College of Technology - Tamilnadu","K.C. College of Engineering","KCG College of Technology","KGiSL Institute of Information Management","KGiSL Institute of Technology","KIIT College of Engineering","KIIT University","KLE Society College of Engineering and Technology","KLN College of Engineering","KLN College of Information Technology - KLNCIT","KS Institute of Technology - KSIT","KSR College of Technology","KSRM College of Engineering","KVM College of Engineering and Information Technology","Kakatiya Institute of Technology and Science","Kakatiya University","Kakinada Institute of Engineering and Technology","Kalasalingam University","Kalikata Viswavidyalaya","Kalinga Institute of Industrial Technology - Bhubaneshwar","Kalyani Government Engineering College","Kamala Institute of Technology and Science","Kamaraj College of Engineering and Technology","Kameshwar Singh Darbhanga Sanskrit University","Kamla Nehru Institute of Technology - KNIT","Kanchi Pallavan Enginnering College","Kandula Sreenivasa Reddy Memorial College Of Engineering","Kannada University","Kannur University","Kanpur Institute of Technology","Karnatak University","Karnataka State Open University","Karpaga Vinayaga College of Engineering and Technology","Karpagam Arts and Science College","Karpagam College of Engineering","Karpagam Institute of Technology","Karpagam University","Karunya University","Kathir College of Engineering - KCE","Kautilya Institute of Technology and Engineering","Kavikulguru Institute of Technology and Science","Kavikulguru Kalidas Sanskrit Vishwavidyalaya","Kedar Nath Ginni Devi Modi Engineering College","Kelkar Education Trust Vinayak Ganesh Vaze College","Kerala University","Kerala Agricultural University","Keshav Mahavidyalaya","Keshav Memorial Institute of Technology","Khadir Mohideen College","Khalsa College for Women","Kings College of Engineering","Kings Engineering College","K.I.T College Of Engineering","Koneru Lakshmaiah College of Engineering","Kongu Arts and Science College","Kongu Engineering College","Kongunadu Arts and Science College","Kota Open University","Koti Womens College","Krishna Engineering College","Krishna Institute of Engineering and Technology","Krishnasamy College of Engineering and Technology","Kristu Jyothi College of Management and Technology","Kumaraguru College of Technology - KCT","Kumaun University","Kurukshetra University - Haryana","Kuvempu University","LBS Institute of Technology for Women","LBS PG College","LD College of Engineering","LDRP Institute of Technology and Research","LJ Institute of Computer Applications - LJMCA","Lady Shriram CC","Lakshmi Narain College of Technology - LNCT","Lakshmibai National Institute of Physical Education","Lal Bahadur Shastri Institute of Management","Lala Lajpat Rai Institute of Engineering and Technology","Lalit Narayan Mithila University","Larsen and Toubro Institute of Technology","Late Bhausaheb Hiray S.S.Trusts College of Architecture","Laxmi Devi Institute of Engineering and Technology","Laxmi Niwas Mittal Institute of Information Technology","Les Filles MVN Institute of Engineering and Technology","Lokamanya Tilak PG College","Lokmanya Tilak College of Engineering","Lovely Professional University","Loyola College - Chennai","Loyola Institute of Business Administration","Ludhiana College of Engineering and Technology - LCET","M. S. Ramaiah Institute of Technology - Bangalore","M.S. Engineering College","MCKV Institute of Engineering","MDS University","MEASI Institute of Information Technology","MES College of Engineering","MES College","MET Institute of Computer Science","MET Institute of Engineering","MET Institute of Management","MGM College of Engineering and Technology","MH Saboo Siddik College of Engineering","MIT College of Engineering","MIT School of Telecom and Management Studies","MITS School of Biotechnology - MSB","MK Institute of Computer Studies","MLR Institute of Technology","MLV Textile and Engineering College","MRD Arts and E E Laher Kosadia Commerce College","MVSR Engineering College","Maamallan Institute of Technology","Madanapalle Institute of Technology and Science","Madha Engineering College","Madhav Institute of Technology and Science","Madhira Institute of Technology and Sciences","Madhya Pradesh Bhoj (Open) University","Madina Engineering College","Madras Institute of Technology","Madurai Kamaraj University","Magadh University","Magnus School of Business","Maha College of Engineering","Mahakal Institute of Technology and Science","Maharaj Vijayaram Gajapath Raj College of Engineering","Maharaja Agrasen Institute of Technology","Maharaja Engineering College","Maharaja Institute of Technology","Maharaja Ranjit Singh College of Professional Sciences - MRS","Maharaja Surajmal Institute of Technology","Maharana Pratap Engineering College","Maharana Pratap University of Agriculture and Technology","Maharashtra Academy of Engineering","Maharashtra Animal and Fishery Sciences University","Maharashtra Institute of Technology (MIT)","Maharashtra University of Health Sciences","Maharishi Arvind Institute of Engineering and Technology","Maharishi Arvind Institute of Science and Management - MAISM","Maharishi Mahesh Yogi Vedic Vishwavidyalaya","Maharshi Dayanand Saraswati University","Maharshi Dayanand University","Mahatma Gandhi Antarrashtriya Hindi Vishwavidyalaya","Mahatma Gandhi Chitrakoot Gramodaya Vishwavidyalaya","Mahatma Gandhi Institute of Technology - MGIT","Mahatma Gandhi Kashi Vidyapeeth","Mahatma Gandhi Memorial Medical College","Mahatma Gandhi University","Mahatma Jyotiba Phule (MJP) Rohilkhand University","Mahatma Phule Krishi Vidyapeeth","Mahaveer Institute of Science and Technology","Mahendra Engineering College","Maheshwara Engineering College","Mailam Engineering College","Makhanlal Chaturvedi Rashtriya Patrakarita Vishwavidhyalaya","Malankara Catholic College","Malaviya National Institute of Technology","Malla Reddy College of Engineering and Technology","Malla Reddy Engineering College","Mallabhum Institute of Technology","Malnad College of Engineering","Malout Institute of Management and Information Technology","Management Development Institute","Management Education and Research Institute","Manav Rachna College of Engineering","Mandsaur Institute of Technology","Mangalmay Institute of Management and Technology","Mangalore University","Mangalore Institiute of Technology and Engineering","Manipal Academy of Higher Education","Manipur University","Manjara Charitable Trust Rajiv Gandhi Institute of Technology","Manonmaniam Sundaranar University","Mar Athanasius College of Engineering","Mar Thoma Institute of Information Technology - MIIT","Marathwada Institute of Technology Bulandshahr","Marathwada Krishi Vidyapeeth","Marathwada Mitra Mandal College of Engineering","Marian Engineering College","Marine Engineering College - MERI","Marudhar Engineering College","Matrusri Institute of Post Graduate Studies","Maulana Azad College","Maulana Azad College","Maulana Azad National Institute of Technology","Maulana Azad National Urdu University","Medicaps Institute of Technology and Management","Meenakshi College for Women","Meenakshi Sundararajan Engineering College","Meerut Institute of Engineering and Technology","Meghnad Saha Institute of Technology","Mepco Schlenk Engineering College","Military College of Telecommunication Engineering","Misrimal Navajee Munoth Jain Engineering College","Mizoram University","Model Institute of Engineering and Technology","Model Engineering College","Modi Institute of Technology","Mody Institute of Technology and Science","Mohamed Sathak A.J. College of Engineering","Mohan Lal Sukhadia University","Mohandas College of Engineering and Technology","Mohanlal Sukhadia University - MLSU","Mona College of Engineering and Technology","Moolji Jaitha College","Mother Teresa Institute of Management","Motilal Nehru National Institute of Technology","Mount Carmel College","Mudra Institute of Communications","Muffakham Jah College of Engineering and Technology","Mugniram Bangur Memorial Engineering College","Mukesh Patel School of Technology Management and Engineering","Mumbai Educational Trust (MET)","Munnar Engineering College","Murshidabad College of Engineering and Technology","Mysore Medical College &amp; Research Institute","NBKR Institute of Science and Technology","NERIST","NLCPAS Navsari","NMAM Institute of Technology","NMKRV College","NRI Institute of Information","NRI Institute of Technology","NTR University of Health Sciences Andhra Pradesh","Nadar Mahajana Sangam S.Vellaichamy Nadar College","Nagaland University","Nagarjuna College of Engineering and Technology","Nagarjuna University","Nagpur University","Nalanda Institute of Engineering and Technology","Nalanda Khula Vishwavidyalaya","Nalla Malla Reddy Engineering College","Nallamuthu Gounder Mahalingam College","Nandha Engineering College - Erode","Narasu Sarathy Institute of Technology","Narayana Engineering College","Narendra Deva University of Agriculture and Technology","Nargund College of Pharmacy","Narmada College of Computer Application","Narsee Monjee Institute of Management and Higher Studies","Narula Institute of Technology","National Academy of Legal Studies and Research University","National Dairy Research Institute","National Engineering College","National Institute of Construction Management and Research","National Institute of Cooperative Management","National Institute of Design","National Institute of Engineering","National Institute of Engineering (NIE) Mysore","National Institute of Fashion Technology","National Institute of Industrial Engineering","National Institute of Information Technology","National Institute of Mental Health and Neuro Sciences","National Institute of Pharmaceutical Education and Research","National Institute of Science and Technology","National Institute of Technology Calicut (NITC)","National Institute of Technology Durgapur","National Institute of Technology Hamirpur","National Institute of Technology Karnataka","National Institute of Technology Kurukshetra","National Institute of Technology Meghalaya","National Institute of Technology Silchar","National Institute of Technology Warangal","National Institute of Technology Trichy","National Institute of Technology ","National Insurance Academy (NIA)","National Law Institute University","National Law School of India University","National Law University","Nehru College of Management","Nelson Marlborough Institute of Technology","Netaji Subhas Institute of Technology - Delhi","Netaji Subhas Open University","Netaji Subhash Engineering College - NSEC","Neville Wadia Institute of Management Studies and Research","New Horizon College of Engineering","Nirma Institute of Technology","Nirma University of Science and Technology","Nishitha College of Engineering and Technology","Nishitha PG College","Nitte Meenakshi Institute of Technology","Nizams Institute of Medical Sciences","Noble Institute of Science and Technology","Noida Institute Of Enginnering And Technology","Noorul Islam College of Engineering","Nootan Sarva Vidyalaya Sanchalit MCA College","North Gujarat University","North Maharashtra University","North Orissa University","Northwood High School","North-Eastern Hill University","Northern India Engineering College","Nova College of Engineering and Technology","N.S.S College of Engineering","O. U. College for Women","Oriental Institute of Science and Technology","Orissa University of Agriculture and Technology","Osmania University","Oxford College of Engineering","Oxford Engineering College","P. A. College of Engineering","Palakkad Institute of Science and Technology","P. E. S. College of Engineering","P. S. R. Engineering College","P. V. P. Siddhartha Engineering College","P.B.R. Visvodaya Institute of Technology and Science","P.C. Jabin Science College","P.E. Society Modern College of Engineering","P.E.S. College Of Engineering","P.G. College","PDM College of Engineering","PRRM Engineering College","PSG College of Arts and Science","PSG College of Technology","PSNA College of Engineering and Technology","Paavai Engineering College","Pachaiyappas College","Dr. D. Y. Patil Institute of Master of Computer Applications","Dr D. Y. Patil Vidyapeeth","BVRIT","Padre Conceicao College of Engineering","Pailan College of Management and Technology","Pandit Ravishankar Shukla University","Pandian Saraswathi yadava Engineering College","Panimalar Engineering College","Panipat Institute of Textile and Engineering","Panjab University","Park College of Engineering and Technology","Parul Institute of Engineering and Technology","Patel College Of Science and Technology","Patna University","Peoples Education Society Institute of Technology - PESIT","Peoples Educational Soceity School of Engineering","Periyar Maniammai College of Technology for Women","Periyar University","Pimpri Chichwad Polytechnic","Pimpri Chinchwad College of Engineering","Poddard International College","Pondicherry Engineering College","Pondicherry University","Ponjesly College of Engineering","Poona College","Poornima College of Engineering","Poornima Institute of Engineering and Technology","Postgraduate Institute of Medical Education and Research","Potti Sreeramulu Telugu University","Pragati Engineering College","Prakasam Engineering College","Pranveer Singh Institute of Technology","Prestige Institute of Management Dewas","Priyadarshini College of Engineering","Pune Institute of Computer Technology","Pune Vidhyarthi Grihas College of Engineering and Technology","Punjab Agricultural University","Punjab College of Engineering and Technology","Punjab Engineering College","Punjab Technical University","Punjab University - Chandigarh","Punjabi University Neighbourhood Campus","Punjabi University Patiala","Pydah Engineering College","QIS College of Engineering and Technology","R. C. Patel Institute of Technology","R. D. Gardi Medical College","R. M. K. Engineering College","R. N. S. Institute of Technology","R. V. College of Engineering - Bangalore","R. V. S. College of Arts and Science","R. V. S. College of Engineering and Technology","R.P.Sharma Institute of Technology","RCC Institute of Information Technology","RL Jalappa Institute of Technology","RMD Engineering College","RV College of Engineering","RVR and JC College Of Engineering","Rabindra Bharati University","Radha Govind Engineering College","Raghu Engineering College","Raipur Institute Of Tecnology","Raja College of Engineering","Raja Mahendra College of Engineering","Rajagiri School of Engineering and Technology","Rajalakshmi Engineering College","Rajarambapu Institute of Technology","Rajarshi Shahu College Of Engineering - RSCOE","Rajasthan Agricultural University","Rajasthan College of Engineering For Women","Rajasthan Institute Of Engineering and Technology","Rajasthan Sanskrit Vishwavidyalaya","Rajasthan Vidyapeeth","Rajeev Gandhi Memorial College Of Engineering and Technology","Rajeev Gandhi Institute of Technology","Rajeev Gandhi Technical University","Rajendra Agricultural University","Rajiv Academy For Technology And Management","Rajiv Gandhi Institute of Technology","Rajiv Gandhi Proudyogiki Vishwavidyalaya","Rajiv Gandhi University of Health Sciences","Rajiv Gandhi University of Knowledge Technologies","Rajlalakshmi Engineering College","Ramnarain Ruia College for Arts and Science","Ramrao Adik Institute of Technology - Navi Mumbai","Ranchi University","Ranganathan Engineering College","Rani Durgavati Vishwavidyalaya","Rashtriya Sanskrit Vidyapeetha","Rashtriya Vidyalaya College of Engineering - RVCE","Rayat Institute of Engineering and Information Technology","Rayat and Bahra Institute of Engineering and Bio-Technology","Regency Institute of Technology","Regional Engineering College","Reva Institute of Technology and Management","Rishiraj Institute of Technology","Rizvi College Of Arts","Roland Institute of Technology","Royal School of Management and Technology","Rukmani Devi Institute of Advanced Studies - RDIAS","Rungta College of Engineering and Technology","Rural Engineering College","Rustamji Institute of Technology - RJIT","S V Institute of Computer Studies","S. K. Patel Institute of Management and Computer Studies","S.R.M.S. College of Engineering and Technology - Bareilly","S. Sukhjinder Singh Engineering and Technology College","S.D. Sabha Institute Of Technology","S.I.E.S. College of Management Studies (SIESCOMS)","S.K.R. Engineering College","S.P. Chowgule College","S.R. Engineering College","S.V.H. College of Engineering","S.V.K.P And Dr K.S. Raju Arts And Science College","S.V.P.M College Of Engineering Malegaon (Bk)","SACS MAVMM Engineering College","SASTRA University","SCSVMV","SCT Institute of Technology","SD College","SDM College of Engineering and Technology","SDP College for Women","SGGS College of Engineering and Technology","SHM Engineering College","Shobhit University Meerut","SIBER College","SJM Institute of Technology","SLBS Engineering College","SLC Institute of Engineering and Technology","SN Kansagra School","SNS College of Engineering","SP Jain Institute of Management and Research","SR Engineering College","SRK Institute of Technology","SRM Engineering College","SRM University","SS Institute of Technology - Hyderabad","SS Jain Subodh College","SSJ Engineering College - Sri Sai Jyothi Engineering College","SSM College of Engineering","SSN College of Engineering","ST. Peters Engineering College","St. Thomas College Of Engineering &amp; Technology","STJ Institute of Technology","SUS College of Engineering and Technology","SVKP and Dr. Kalidindi Suryanarayana Raju Arts and Science College","Sagi Ramakrishnam Raju Engineering College - SRKR","Sahrdaya College of Engineering and Technology","Sai-Sudhir Post Graduate College","Sakthi Mariamman Engineering College - SMEC","Sambalpur University","Sambhram Institute of Technology","Sampurnanand Sanskrit Vishwavidyalaya","Samrat Ashok Technological Institute Vidisha - SATI","Sanjay Gandhi Memorial Government Polytechnic","Sanjay Gandhi Postgraduate lnstitute of Medical Sciences","Sankalchand Patel College of Engineering","Sankara College","Sanketika Vidya Parishad Engineering College","Sant Gadge Baba Amravati University","Sant Longowal Institiute of Engineering and Technology","Sapthagiri College of Engineering","Saranathan College of Engineering","Sardar Patel College of Engineering - Mumbai","Sardar Patel Institute of Technology - Mumbai","Sardar Patel University","Sardar Vallabhbai Polytechnic College","Sardar Vallabhbhai National Institute of Technology","Saroj Mohan Institute of Technology","Sarva Vidhyalaya Institute of Computer Studies","Sarvajanik College of Engineering","Sasi Institute of Technology and Engineering","Sathyabama Engineering College - Chennai","Sathyabama Institute of Science and Technology","Sathyabama University","Satpriya Institute of Engineering and Technology","Saurashtra University","Saveetha Engineering College","School of Planning and Architecture","Scient Institute of Technology","Seacom Engineering College","Seth Rajiv Govind Sable Institute Of Technology","Sethu Institute of Technology","Shadan College of Engineering and Technology","Shadan Womens College of Engineering and Technology","Shankara Institute of Technology","Shanmuganathan Engineering College","Shanmugha Arts","Shanmugha College of Engineering - Tamilnadu","Shantilal Shah Engineering College","Sharda University","Shekhawati Engineering College","Shivaji University","Shree Rayeshwar Institute of Engineering and IT","Shree Sant Muktabai Institute of Technology - SMIT","Shreemati Nathibai Damodar Thackersey Womens University","Shri Andal Alagar College of Engineering","Shri Balaji College of Engineering and Technology","Shri Govindram Seksaria Institute of Technology and Science","Shri Guru Gobind Singhji College of Engineering and Technology","Shri Guru Ram Rai Institute of Technology and Science","Shri Hanuman Vyayam Prasarak Mandals College of Engg and Tech","Shri Jagannath Sanskrit Vishwavidyalaya","Shri Lal Bahadur Shastri Rashtriya Sanskrit Vidyapeeth","Shri Mata Vaishno Devi University","Shri Ram Murti Smarak College of Engineering","Shri Ramdeobaba Kamla Nehru College","Shri Ramswaroop Memorial College of Engineering and Management","Shri Sant Gajanan Maharaja College of Engineering - SSGM","Shri Vaishnav Institute of Technology and Science","Shri Venkteshwar Institute Of Technology","Shri Vishnu Engineering College for Women","Shrimad Rajchandra Institute of Management and Computer Application","Shrinathji Institute of Technology and Engineering","Siddaganga Institute  of Technology","Siddharth Institute of Engineering and Technology - SIETK","Siddhu Kanhu Murmu University","Sikkim Manipal University of Health","Sinhgad Academy of Engineering","Sinhgad College of Engineering - SCOE","Sinhgad Institute of Management and Computer Application","Sinhgad Institute of Technology","Sinhgad Technical Educational Society - Pune","Sinhudurg Shikshan Prasarak Mandals College of Engineering","Sipnas College of Engineering and Technology","Sir C R Reddy College of Engineering","Sir M. Visvesvaraya Institute of Technology","Sir Padampat Singhania University","Sir Visvesvaraya Memorial Engineering College","Smt Kashibai Navale College Of Engineering","Smt Kasturbai Walchand College","Smt Parvatibai Chowgule College","Kamala and Venkappa M. Agadi College of Engineering and Technology","SNDT Women's University","Sobhasaria Engineering College","Sona College of Technology","Sophia Girls College Ajmer","Sourashtra College","South Gujarat University - Surat","South Travancore Hindu College","Sphoorthy Engineering College","Sree Chaitanya College of Engineering","Sree Chitra Tirunal Institute for Medical Sciences and Technology","Sree Dattha Institute of Engineering","Sree Narayana Guru Institute of Science and Technology","Sree Sankaracharya University of Sanskrit","Sree Sastha Engineering College","Sreenidhi Institute of Science and Technology","Sreenivasa Institute of Technology and Management Studies","Sri Balaji College of Engineering and Technology","Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya","Sri Datta College of Engineering and Science - SDITS","Sri Devi Womens Engineering College","Sri Indu College of Engineering and Technology","Sri Jagadguru Balagangadaranath swamiji Institute of Technology","Sri Jagadguru Chandrasekaranathaswamiji Institute of Technology","Sri Jayachamarajendra College of Engineering","Sri Kaliswari College","Sri Krishna College of Engineering and Technology (SKCET)","Sri Krishnadevaraya University","Sri Manakula Vinayagar Engineering College","Sri Muthukumaran Institute of Technology","Sri Padmavati Mahila Viswavidyalayam","Sri Prakash College of Engineering Tuni","Sri Ramachandra Medical College and Research Institute","Sri Ramakrishna Engineering College","Sri Ramakrishna Mission Vidyalaya College of Arts and Science","Sri Ramanujar Engineering College","Sri Sarathi Institute of Engineering and Technology","Sri Sathya Sai Institute of Higher Learning","Sri Shakthi Institute of Engineering and Technology","Sri Siddhartha Institute of Technology","Sri Sivasubramaniya Nadar College of Engineering","Sri Vasavi Engineering College","Sri Venkatesa Perumal College of Engineering and Technology","Sri Venkateswara College of Engineering","Sri Venkateswara University","Sri Vidyaniketan Engineering College","Srikalahasteeswara Institute of Technology","Srimad Andavan Arts and Science College","Srinivas Institute of Technology-Mangalore","Srinivasa Institute of Engineering and Technology","Srinivasan Engineering College","Sriram Engineering College","St Anns College of Engineering","St Josephs College of Engineering","St Patricks PG College","St Stephen","St. Francis Institute of Technology","St. Johns College of Engineering and Techonology","St. Josephs College (Autonomous) - Tiruchirappalli","St. Margaret Engineering College - Neemrana","St. Martins Engineering College","St. Marys Engineering College","St. Theressa Institute of Engineering and Technology","St. Vincent Pallotti College","St. Xaviers College","St.Xaviers Catholic College of Engineering","SAINTGITS COLLEGE OF ENGINEERING","Stani Memorial College of Engineering and Technology","Sudharsan Engineering College","Sushila Devi Bansal College of Technology","Swami Keshvanand Institute of Technology","Swami Parmanand College of Engineering and Technology","Swami Ramanand Teerth Marathwada University","Swami Ramananda Tirtha Institute of Science and Technology","Swami Sachchidanand Polytechnic College Visnagar","Swami Sahajanand College of Commerce And Management","Swami Vivekananda PG College","Swarnandhra College of Engineering","Symbiosis","T.K.M. College of Engineering","TERI School of Advanced Studies","TRR College of Engineering","Techno India Salt Lake","TRUBA Institute of Engineering and Information Technology","Tagore Engineering College","Tamil Nadu Agricultural University","Tamil Nadu Doctor Ambedkar Law University","Tamil Nadu Doctor M.G.R. Medical University","Tamil Nadu Veterinary and Animal Sciences University","Tamil University","Tamilnadu College of Engineering","Tata Institute of Fundamental Research - TIFR Mumbai","Tata Institute of Social Sciences","Tatysaheb Kore Institute of Engineering and Technology - Warana","Technocrats Institute of Technology","Technological Institute Of Textile and Sciences","Techno India College of Technology","Teerthanker Mahaveer Institute of Management and Technology","Tezpur University","Thadomal Shahani Engineering College","Thakral College of Technology","Thakur College Of Engeneering And Technology","Thangal Kunju Musaliar College of Engineering - TKM","Thangavelu College","Thapar Institute of Engineering and Technology","The American College","The Heritage Academy","The Maharaja Sayajirao University of Baroda","Theegala Krishna Reddy College of Engineering and Technology","Thiagarajar College of Engineering","Thiagarajar School of Management","Tilak Maharashtra Vidyapeeth","Tilka Manjhi Bhagalpur University","Toc-H Institute of Science and Technology","Tripura University","U. V. Patel College of Engineering","Ujjain Engineering College","Union Christian College","United College of Engineering &amp; Research","United College of Engineering and Research","United Institute of Technology - UIT","University College of Engineering","University Institute of Computer Science and Applications","University Institute of Engineering and Technology - UIET","University Institute of Technology Barkatullah University","UIT RGPV","University Visvesvaraya College of Engineering","University of Agricultural Sciences","University of Burdwan","University of Calcutta","University of Calicut","University of Delhi - University of Delhi","University of Hyderabad","University of Jammu","University of Kalyani","University of Kashmir","University of Kerela","University of Lucknow","University of Madras","University of Mumbai","University of Mysore","University of North Bengal","University of Petroleum and Energy Studies - UPES","University of Pune","University of Rajasthan","University of Roorkee - UP","University of Vishweshwariya College of Engineering","Utkal Sanskruti Viswavidyalaya","Utkal University","Uttam Devi Mohan Lal College of Engineering","Uttar Banga Krishni Viswavidyalaya","Uttar Maharashtra Vidyapeeth","Uttar Pradesh Rajarshi Tandon Open University","Uttar Pradesh Technical University","Uttaranchal Institute of Management","V. H. N. Senthikumaranadar College","V. L. B. Janakiammal College","V. S. Patel College","V.B.S Purvanchal University","V.S.M. College","VEL TECH MULTI TECH Engineering College","VHNSN College","VIF College of Engineering and Technology","VR Siddhartha Engineering College","VRS College of Engineering and Technology - VRSCET","VVV College for Women","Vaagdevi Institute of Technology and Science","Valliammai Engineering College","VNRVJIET","Vardhaman College Of Engineering","Vasavi College of Engineering","Veer Kunwar Singh University","Veer Narmad South Gujarat University","Veer Surendra Sai University Of Technology","Veermata Jijabai Technological Institute","Vel Tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering College","Velammal College of Management and Computer Studies","Velammal Engineering College - VEC","Vellalar College of Engineering and Technology","Vellore Engineering College","Vellore Institute of Technology","Vemana Institute of Technology","Vickram College of Engineering","Vidya Academy of Science and Technology","Vidya Bhawan Rural Institute","Vidya Jyothi Institute of technology - VJIT","Vidya Pratishthan College Of Engineering","Vidyalankar Institute Of Technology","Vidyalankar Polytechnic","Vidyasagar Viswavidyalaya","Vignan Institute of Technology and Science","Vignans Engineering College","Vignana Jyothi College Of Engineering And Technology","Vijetha Degree College","Vikasa Engineering Institute of Technology","Vikram University","Villa Marie P. G. College For Women","Vimal Jyothi Engineering College","Vinayaka Missions Research Foundation - University","Vinoba Bhave University","Vishwakarma Institute of Technology","Visva-Bharati","Visvesvaraya National Institute of Technology","Visvesvaraya Technological University","Visveswaraiah Technological University","Viswajyothi College of Engineering and Technology","Vivekanand Education Society Institute of Technology","Vivekanand Institute of Technology","Vivekananda College of Computer Science","Vivekanandha Institute of Engineering and Technology for Women","Vivekanandha College of Technology for Women","Vivekananda Institute of Technology and Science","Vivekananda Institute of Technology","Vivekananda School of Post Graduate Studies","Walchand College of Engineering","West Bengal National University of Juridical Sciences","West Bengal University of Animal and Fishery Sciences","West Bengal University of Technology","Womens College","XLRI Jamshedpur Business School","Xavier Institute of Management","Xavier Institute of Social Service","Yagyavalkya Institute of Technology - YIT","Yashwantrao Chavan Maharashtra Open University","Yeahwantro Chavan College Of Engineering (YCCE)","Zakir Hussain College of Engg &amp; Technology","Velalar College of Engineering and Technology","Sri Eshwar College Of Engineering","PSG Institute Of Technology and Applied Research","Mahendra Institute of Technology","knowledge institute of technology","seagi","sree vidyanikethan engineering college","Gayatri Vidya Parishad College of engineering for women ","KIT - Kalaignar Karunanidhi Institute of Technology","Info Institute of Engineering","KPR Institute of Engineering and Technology","Sri Sairam Institute of technology","Dr.NGP Institute of technology","PSGR Krishnammal College for Women","Central Institute of Plastic Engineering and Technology","Akshaya College of Engineering and Technology","Sree Sakthi Engineering College","Muthoot Institute of Technology and Science","Indian Institute of Information Technology","Ramco Institute of Technology","Dhirajlal Gandhi College of Technology","Velammal College Of Engineering and Technology","TRP Engineering College","Nandha College of Technology","MIET Engineering College","Christ college of engineering and technology","K. Ramakrishnan College of Technology","Sri Ramakrishna Institute of Technology","Sree Chitra Thirunal College of Engineering","Galaxy Institute of Technology","JCT College of Engineering and Technology","Sri Krishna College of Technology (SKCT)","Daiata Madhusudhana Sastry sri venkateswara hindu Colllege of Engineering","CMF College","CMS College","Kongunadu Institute of Engineering and Technology","bharathi matriculation higher secondary school","Mahatma Gandhi Medical College & Research Institute","SSS Film Academy","Rathinam College of Arts","SSN Institute of Engineering & Technology","sri guru institute of technlogy","Suguna PIP School","Nehru College of Aeronautics & Applied science","SVS College of Engineering","KAP Viswanatham Government Medical College","SSM Institute of Engineering and technology","NGM Arts & Science College","SNS College of Technology","RVS College of engineering and technology","Nehru Institute OF Engineering & Technology"];




new Awesomplete(document.getElementById("nameofInstitution"), {
  list:collegeLIST,
  minChars: 1  // Show suggestions after typing 1 character
});