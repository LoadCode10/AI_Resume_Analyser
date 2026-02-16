// import { callUploader } from "./uploscript.js";
let cvAnalysisData = null;
let jobMatchingData = null;
// {
//     // "strengths": [
//     //     "Strong experience with JavaScript and modern frameworks",
//     //     "Excellent problem-solving and analytical skills",
//     //     "Good understanding of responsive web design principles",
//     //     "Experience working in agile development teams",
//     //     "Effective communication and collaboration abilities"
//     // ],
//     // "weaknesses": [
//     //     "Limited experience with cloud platforms like AWS or Azure",
//     //     "Need to improve knowledge of advanced algorithms",
//     //     "Lack of experience in mobile app development",
//     //     "Could strengthen project management methodologies knowledge"
//     // ],
//     // "missing_skills": [
//     //     "Docker containerization",
//     //     "GraphQL API development",
//     //     "Machine learning basics",
//     //     "WebAssembly",
//     //     "Serverless architecture"
//     // ],
//     // "improvement_suggestions": [
//     //     "Take an online course on cloud computing fundamentals",
//     //     "Contribute to open-source projects to gain practical experience",
//     //     "Attend tech meetups and conferences to network with professionals",
//     //     "Create a personal portfolio website to showcase your projects",
//     //     "Practice coding challenges on platforms like LeetCode or HackerRank"
//     // ],
//     // "projects_to_do": [
//     //     "Build a full-stack application with React and Node.js",
//     //     "Create a mobile app using React Native or Flutter",
//     //     "Develop a machine learning model for a practical use case",
//     //     "Implement a CI/CD pipeline for a sample project",
//     //     "Contribute to a popular open-source project on GitHub"
//     // ]
// };

const myLogo = document.querySelector('.logo');
const analysisSkeleton = document.getElementById("analysis-skeleton");
const analysisContainer = document.querySelector('.container');
const matchingContainer = document.querySelector('.results-container-match');
const uploaderModal = document.querySelector('.uploder-modal');
const btnCvOnly = document.querySelector('.btnCvOnly');
const btnCvJob = document.querySelector('.btnCvJob');
const getStartSection = document.querySelector('.hero');
const removeUploader = document.querySelector('.remove-uploader');
const subtitleUploader = document.querySelector('.subtitle');

myLogo.addEventListener('click',async ()=>{
    window.location.href = 'http://localhost:5050';
})

let currentMode = null;
// callUploader();
btnCvOnly.addEventListener('click',()=>{
  currentMode = "cv-only";
  uploaderModal.style.display = "flex";
  subtitleUploader.textContent = "Select Your CV file to upload to the system";
  getStartSection.style.display = "none";
});

removeUploader.addEventListener('click',()=>{
    uploaderModal.style.display = "none";
    subtitleUploader.textContent = "Select both Your CV and JOB description files to upload to the system";
    getStartSection.style.display = "flex";
});

btnCvJob.addEventListener('click',()=>{
  currentMode = "cv-job";
  uploaderModal.style.display = "flex";
  getStartSection.style.display = "none";
});


const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileList = document.getElementById('fileList');
const emptyState = document.getElementById('emptyState');
const cancelBtn = document.getElementById('cancelBtn');
const attachBtn = document.getElementById('attachBtn');

// Sample files data (preloaded as in the design)
const sampleFiles = [
  //   { name: "Report name_Q1.csv", size: 15, progress: 100 },
  //   { name: "Report name_Q2.csv", size: 15, progress: 80 },
  //   { name: "Report name_Q3.csv", size: 15, progress: 40 }
];

// Initialize with sample files
sampleFiles.forEach(file => {
    addFileToList(file.name, file.size, file.progress, true);
});
updateUIState();

// Event Listeners
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);

// Drag and drop events
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
    }
});

cancelBtn.addEventListener('click', resetUploader);

attachBtn.addEventListener('click', ()=>{
    if(currentMode === "cv-only"){
        handleAttachCVFile();
    }else if(currentMode === "cv-job"){
        handleAttachFiles();
    }
});

// Functions
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) {
        handleFiles(files);
    }
}

function handleFiles(files) {
    // Hide empty state if it's visible
    if (emptyState.style.display !== 'none') {
        emptyState.style.display = 'none';
    }
    
    // Process each file
    for (let file of files) {
        // Check file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            showNotification(`File "${file.name}" exceeds the maximum size of 50 MB.`,'warning');
            continue;
        }
        
        // Check file extension
        const validExtensions = ['.pdf', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            showNotification(`File "${file.name}" has an unsupported format. Please upload pdf or docx files.`,'warning');
            continue;
        }
        
        // Add file to list with simulated upload progress
      //   const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const fileSizeMB = formatFileSize(file.size);
        addFileToList(file.name, fileSizeMB, 0, false);
        
        // Simulate upload progress
        simulateUploadProgress(file.name);
    }
    
    updateUIState();
}

  function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      // Format to 1 decimal place for MB/GB, no decimals for Bytes/KB
      let formattedSize = parseFloat(bytes / Math.pow(k, i));
      
      if (i >= 2) { // For MB and GB
          formattedSize = formattedSize.toFixed(1);
      } else { // For Bytes and KB
          formattedSize = Math.round(formattedSize);
      }
      
      return formattedSize + ' ' + sizes[i];
  }

function addFileToList(fileName, fileSizeMB, progress, isComplete) {
    // Create file item element
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.dataset.fileName = fileName;
    
    // Determine icon based on file extension
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let iconClass = 'fas fa-file-alt';
    
    if (fileExtension === 'pdf') {
        iconClass = 'fa-solid fa-file-pdf';
    } else if (fileExtension === 'xls' || fileExtension === 'docx') {
        iconClass = 'fa-solid fa-file-word';
    }
    
    fileItem.innerHTML = `
        <div class="file-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="file-details">
            <div class="file-name">${fileName}</div>
            <div class="file-size">${fileSizeMB} </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
        </div>
        <div class="file-actions">
            <div class="progress-percent">${progress}%</div>
            <button class="remove-btn" title="Remove file">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Insert before empty state if it exists, otherwise append
    if (emptyState.style.display !== 'none') {
        fileList.insertBefore(fileItem, emptyState);
    } else {
        fileList.appendChild(fileItem);
    }
    
    // Add event listener to remove button
    const removeBtn = fileItem.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
        fileItem.remove();
        if (fileList.children.length === 1) { // Only empty state remains
            emptyState.style.display = 'block';
        }
        updateUIState();
    });
}

function simulateUploadProgress(fileName) {
    // Find the file item
    const fileItem = document.querySelector(`[data-file-name="${fileName}"]`);
    if (!fileItem) return;
    
    const progressBar = fileItem.querySelector('.progress-bar');
    const progressPercent = fileItem.querySelector('.progress-percent');
    
    let progress = 0;
    const interval = setInterval(() => {
        // Random increment between 5 and 15%
        progress += Math.floor(Math.random() * 11) + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            // Mark as complete
            fileItem.dataset.complete = "true";
        }
        
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;
        
        // Update UI when all uploads complete
        if (progress === 100) {
            updateUIState();
        }
    }, 300);
}

function updateUIState() {
    // Check if there are any files
    const fileItems = document.querySelectorAll('.file-item');
    const hasFiles = fileItems.length > 0;
    
    // Check if all uploads are complete
    const allComplete = Array.from(fileItems).every(item => {
        return item.dataset.complete === "true" || parseInt(item.querySelector('.progress-percent').textContent) === 100;
    });
    
    // Update attach button state
    attachBtn.disabled = !hasFiles || !allComplete;
    
    // Show/hide empty state
    emptyState.style.display = hasFiles ? 'none' : 'block';
}

function resetUploader() {
    // Clear all files except the empty state
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => item.remove());
    
    // Reset file input
    fileInput.value = '';
    
    // Show empty state
    emptyState.style.display = 'block';
    
    // Update UI
    updateUIState();
    
    // Optional: Show a message
    console.log('Upload cancelled - all files removed');
}

async function handleAttachFiles() {
    const input = document.getElementById("fileInput");
    const selectedFiles = input.files;
    if (selectedFiles.length !== 2) {
        showNotification("Please select BOTH a CV and a Job Description file.",'warning');
        resetUploader();
        return;
    }
    const cvFile = selectedFiles[0];
    const jobFile = selectedFiles[1];
    
    const formData = new FormData();
    formData.append("cv",cvFile);
    formData.append("job",jobFile);

    try {

        uploaderModal.style.display = "none";
        analysisSkeleton.style.display = "block";
        matchingContainer.style.display = "none";

        const response = await fetch('http://localhost:5050/api/upload',{
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        console.log(data);

        if(!response.ok){
            throw new Error(data.error || "Upload Failed");
        }

        jobMatchingData = data.matching;
        // initializePage();
        analysisSkeleton.style.display = "none";
        matchingContainer.style.display = "block";
        requestAnimationFrame(() => {
            populateMatchingAnalysis();
        });
        showNotification('Analysis complete!', 'success');
        // alert(
        // `Successfully attached 2 file(s):\n\n• ${cvFile.name}\n• ${jobFile.name}`
        // );

        // Reset the uploader after successful attachment
        resetUploader();

    } catch (error) {
        console.log(error);
        analysisSkeleton.style.display = "none";
        uploaderModal.style.display = "block";
    }
}

async function handleAttachCVFile() {
    const input = document.getElementById("fileInput");
    const selectedFiles = input.files;
    
    if(selectedFiles.length !== 1){
        showNotification("Please select EXACTLY one CV file.","warning");
        return;
    }

    const cvFile = selectedFiles[0];

    const formData = new FormData();
    formData.append("file",cvFile);

    try {

        uploaderModal.style.display = "none";
        analysisSkeleton.style.display = "block";
        analysisContainer.style.display = "none";

       const response = await fetch('http://localhost:5050/api/cv-analyse',{
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        console.log(data);

        if(!response.ok){
            throw new Error(data.error || "Upload Failed");
        }

        cvAnalysisData = data.analysis;
        initializePage();
        analysisSkeleton.style.display = "none";
        analysisContainer.style.display = "block";
        showNotification('Analysis complete!', 'success');
        // alert(`Successfully attached CV:\n\n• ${cvFile.name}`);
        // Reset the uploader after successful attachment
        resetUploader(); 
    } catch (error) {
        console.log(error);
        analysisSkeleton.style.display = "none";
        uploaderModal.style.display = "block";
    }

}

//Logic for my Analysis web part


// DOM elements
const strengthsList = document.getElementById('strengths-list');
const weaknessesList = document.getElementById('weaknesses-list');
const missingSkillsList = document.getElementById('missing-skills-list');
const improvementsList = document.getElementById('improvements-list');
const projectsList = document.getElementById('projects-list');

// Summary count elements
const strengthsCount = document.getElementById('strengths-count');
const weaknessesCount = document.getElementById('weaknesses-count');
const missingCount = document.getElementById('missing-count');
const suggestionsCount = document.getElementById('suggestions-count');
const projectsCount = document.getElementById('projects-count');

// Action buttons
const printBtn = document.getElementById('print-btn');
const exportBtn = document.getElementById('export-btn');
const newAnalysisBtn = document.getElementById('new-analysis-btn');

// Function to populate a list with data
function populateList(listElement, items) {
    // Clear any existing content
    listElement.innerHTML = '';
    
    if (!items || items.length === 0) {
        listElement.innerHTML = '<div class="empty-message">No items to display</div>';
        return;
    }
    
    // Add each item to the list
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-chevron-right"></i><span>${item}</span>`;
        listElement.appendChild(li);
    });
}

// Function to update summary counts
function updateSummaryCounts() {
    strengthsCount.textContent = cvAnalysisData.strengths.length;
    weaknessesCount.textContent = cvAnalysisData.weaknesses.length;
    missingCount.textContent = cvAnalysisData.missing_skills.length;
    suggestionsCount.textContent = cvAnalysisData.improvement_suggestions.length;
    projectsCount.textContent = cvAnalysisData.projects_to_do.length;
}

// Function to initialize the page with data
function initializePage() {
    // Populate all lists with data
    populateList(strengthsList, cvAnalysisData.strengths);
    populateList(weaknessesList, cvAnalysisData.weaknesses);
    populateList(missingSkillsList, cvAnalysisData.missing_skills);
    populateList(improvementsList, cvAnalysisData.improvement_suggestions);
    populateList(projectsList, cvAnalysisData.projects_to_do);
    
    // Update summary counts
    updateSummaryCounts();
    
    // Set current date and year
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString();
    document.getElementById('current-year').textContent = now.getFullYear();
}

// Print functionality
printBtn.addEventListener('click', () => {
    window.print();
});

// Export as JSON functionality
exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(cvAnalysisData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cv-analysis-results.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Show a temporary notification
    const notification = document.createElement('div');
    notification.textContent = 'JSON file downloaded successfully!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        font-weight: 600;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
});

// New analysis functionality
newAnalysisBtn.addEventListener('click', () => {
    // if (confirm('This will clear the current analysis results. Are you sure you want to start a new analysis?')) {
    //     // In a real application, this would redirect to the upload page
    //     // For this demo, we'll just reload with a message
    //     // alert('In a real application, this would redirect to the CV upload page.',);
    //     // window.location.href = '/upload'; // Example redirect
    // }
    analysisContainer.style.display = "none";
    matchingContainer.style.display = "none";
    analysisSkeleton.style.display = "none";
    uploaderModal.style.display = "none";

    getStartSection.style.display = "flex";

    resetUploader();
});

// Job matching analysis data structure

// const jobMatchingData = {
//     matching_score: 75,
//     matching_points: [
//         "Strong alignment with required JavaScript and React skills",
//         "Experience matches the 3+ years requirement for frontend development",
//         "Proficient with Git, Agile methodologies, and modern development workflows",
//         "Portfolio demonstrates responsive web design expertise",
//         "Education background in Computer Science aligns with requirements"
//     ],
//     unmatching_points: [
//         "Limited experience with TypeScript mentioned in job requirements",
//         "No demonstrated experience with Redux state management",
//         "Job requires GraphQL experience, but only REST APIs shown in CV",
//         "Lack of experience with AWS or cloud deployment mentioned in job",
//         "Mobile development experience not clearly demonstrated"
//     ],
//     suggestions_improvements: [
//         "Highlight any TypeScript experience in projects or add a TypeScript project",
//         "Consider taking a Redux course and implementing it in a portfolio project",
//         "Build a small GraphQL API to demonstrate backend flexibility",
//         "Add cloud deployment experience (even if personal projects) to CV",
//         "Include responsive design metrics and mobile-first approach details"
//     ],
//     skills_to_learn: [
//         "TypeScript for type-safe React development",
//         "Redux for complex state management",
//         "GraphQL API implementation",
//         "AWS Amplify or Firebase for cloud deployment",
//         "Jest or Cypress for advanced testing"
//     ],
//     projects_to_build: [
//         "E-commerce app with React, TypeScript, and Redux",
//         "Real-time chat application with GraphQL backend",
//         "Portfolio site deployed on AWS with CI/CD pipeline",
//         "Mobile-responsive dashboard with complex data visualization",
//         "Open-source contribution to a React component library"
//     ]
// };

// DOM elements for matching analysis
const matchScoreCircle = document.getElementById('match-score-circle');
const matchScoreValue = document.getElementById('match-score-value');
const matchingPointsList = document.getElementById('matching-points-list');
const unmatchingPointsList = document.getElementById('unmatching-points-list');
const improvementPlanCard = document.getElementById('improvement-plan-card');
const improvementSuggestionsList = document.getElementById('improvement-suggestions-list');
const skillsToLearnList = document.getElementById('skills-to-learn-list');
const projectsToBuildList = document.getElementById('projects-to-build-list');

// Breakdown elements
const skillsMatchBar = document.getElementById('skills-match-bar');
const skillsMatchValue = document.getElementById('skills-match-value');
const experienceMatchBar = document.getElementById('experience-match-bar');
const experienceMatchValue = document.getElementById('experience-match-value');
const toolsMatchBar = document.getElementById('tools-match-bar');
const toolsMatchValue = document.getElementById('tools-match-value');

// Buttons
const analyzeMatchBtn = document.getElementById('analyze-match-btn');
const resetMatchBtn = document.getElementById('reset-match-btn');

// Function to update score visualization
function updateScoreVisualization(score) {
    // Update main score
    matchScoreValue.textContent = `${score}%`;
    matchScoreCircle.style.background = `conic-gradient(var(--primary-color) ${score}%, #e0e0e0 0%)`;
    matchScoreCircle.classList.add('score-update');
    
    // Update breakdown scores (these would come from API in real scenario)
    const skillsScore = Math.min(score + 10, 95);
    const experienceScore = score;
    const toolsScore = Math.max(score - 15, 30);
    
    setTimeout(() => {
        skillsMatchBar.style.width = `${skillsScore}%`;
        skillsMatchValue.textContent = `${skillsScore}%`;
        
        experienceMatchBar.style.width = `${experienceScore}%`;
        experienceMatchValue.textContent = `${experienceScore}%`;
        
        toolsMatchBar.style.width = `${toolsScore}%`;
        toolsMatchValue.textContent = `${toolsScore}%`;
    }, 500);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        matchScoreCircle.classList.remove('score-update');
    }, 1000);
}

// Function to populate matching analysis
function populateMatchingAnalysis() {
    // Update score
    updateScoreVisualization(jobMatchingData.matching.matching_score);
    
    // Populate matching points
    populateList(matchingPointsList, jobMatchingData.matching.matching_points);
    
    // Populate unmatching points
    populateList(unmatchingPointsList, jobMatchingData.matching.unmatching_points);
    
    // Show/hide improvement plan based on score
    if (jobMatchingData.matching.matching_score < 60) {
        improvementPlanCard.style.display = 'block';
        const improvement = jobMatchingData.improvement;
        populateList(improvementSuggestionsList, improvement.suggestions_improvements);
        populateList(skillsToLearnList, improvement.skills_to_learn);
        populateList(projectsToBuildList, improvement.projects_to_build);
    } else {
        improvementPlanCard.style.display = 'none';
    }
}

// Function to simulate AI analysis (in real app, this would call an API)
function simulateAIAnalysis() {
    // Show loading state
    analyzeMatchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeMatchBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Update with new analysis data (could be randomized for demo)
        const newScore = Math.floor(Math.random() * 30) + 60; // Random score between 60-90
        jobMatchingData.matching_score = newScore;
        
        // Randomize some matching points for demo
        if (Math.random() > 0.5) {
            jobMatchingData.matching_points.push("Good understanding of modern CSS frameworks");
        }
        
        if (Math.random() > 0.5) {
            jobMatchingData.unmatching_points.push("Limited experience with testing frameworks");
        }
        
        // Populate the analysis
        populateMatchingAnalysis();
        
        // Restore button state
        analyzeMatchBtn.innerHTML = '<i class="fas fa-search"></i> Analyze CV vs Job Description';
        analyzeMatchBtn.disabled = false;
        
        // Show success notification
        showNotification('Analysis complete! Match score updated.', 'success');
    }, 2000);
}

// Function to reset matching analysis
function resetMatchingAnalysis() {
    analysisContainer.style.display = "none";
    matchingContainer.style.display = "none";
    analysisSkeleton.style.display = "none";
    uploaderModal.style.display = "none";

    getStartSection.style.display = "flex";

    resetUploader();
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    let bgColor = 'var(--primary-color)';
    if (type === 'success') bgColor = 'var(--success-color)';
    if (type === 'warning') bgColor = 'var(--warning-color)';
    if (type === 'error') bgColor = 'var(--danger-color)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        
        // Add slideOut animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event listeners
analyzeMatchBtn.addEventListener('click', resetMatchingAnalysis);
// resetMatchBtn.addEventListener('click', resetMatchingAnalysis);

// Initialize matching analysis when page loads
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize main CV analysis
//     initializePage();
    
//     // Initialize matching analysis
//     populateMatchingAnalysis();
// });














// Small interactive polish
document.querySelectorAll(".btn.primary").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    btn.style.opacity = "0.9";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.opacity = "1";
  });
});

