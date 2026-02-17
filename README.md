# AI Resume Analyzer & Job Matcher

A powerful Node.js application that leverages Google's Gemini AI to analyze resumes and match candidates with job descriptions. This tool provides professional insights, improvement suggestions, and detailed matching analysis to help job seekers optimize their applications.

## 🚀 Features

### 📄 Resume Analysis
- **Strengths Identification**: Highlights key strengths in technical skills, experience, and education
- **Weaknesses Detection**: Identifies areas needing improvement
- **Skills Gap Analysis**: Suggests missing skills relevant to the candidate's career path
- **Actionable Suggestions**: Provides concrete improvement recommendations
- **Project Ideas**: Generates realistic project suggestions to enhance employability

### 🤝 CV-Job Matching
- **Matching Score**: Calculates a realistic compatibility score (0-100) between resume and job description
- **Matching Points**: Lists specific strengths that align with the job requirements
- **Unmatching Points**: Identifies gaps and weaknesses relative to the position
- **Improvement Plan**: For scores below 60%, provides:
  - Specific improvement suggestions
  - Skills to learn
  - Projects to build

### 📁 File Support
- PDF and DOCX format support
- Multiple file upload for CV-Job matching
- File validation and size limiting (50MB max)

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **AI Integration**: Google Gemini AI (@google/genai)
- **File Processing**: Multer, pdf-parse
- **Environment**: dotenv

## 📋 Prerequisites
- Node.js (v14 or higher)
- Google Gemini API key
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LoadCode/AI_Resume_Analyser.git
   cd ai-resume-analyzer
Install dependencies

bash
npm install
Set up environment variables
Create a .env file in the root directory:

env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5050
Create upload directory

bash
mkdir uploads
Start the server

bash
npm start
or for development with nodemon:

bash
npm run dev
## 📁 Project Structure
text
ai-resume-analyzer/
├── middlewares/
│   └── upload.js           # Multer configuration for file uploads
├── public/                  # Static files
├── routes/
│   ├── api/
│   │   ├── cv-analyse.js    # Resume analysis endpoint
│   │   └── upload.js        # File upload endpoint
│   └── cv-analyser.js       # Main route
├── services/
│   ├── analyses-logic.js    # Core analysis logic
│   └── gemini-model.js      # Gemini AI integration
├── uploads/                  # Uploaded files storage
├── utils/
│   └── cleanText.js         # Text cleaning utilities
├── views/                    # HTML views
├── .env                      # Environment variables
├── package.json
└── server.js                 # Main application file
🔌 API Endpoints
1. Upload and Analyze Resume
POST /api/upload

Content-Type: multipart/form-data

Body: file: [resume.pdf or resume.docx]

Response:

json
{
  "message": "File uploaded & analyzed successfully!",
  "file": {
    "original": "resume.pdf",
    "storedAs": "resume.pdf",
    "filepath": "uploads/resume.pdf",
    "filesize": 123456
  },
  "analysis": {
    "strengths": ["5+ years of React experience", "Strong problem-solving skills"],
    "weaknesses": ["Lack of TypeScript knowledge"],
    "missing_skills": ["GraphQL", "Docker"],
    "improvement_suggestions": ["Add measurable achievements to experience section"],
    "projects_to_do": ["Build a full-stack application with TypeScript"]
  }
}
2. Match CV with Job Description
POST /api/cv-analyse

Content-Type: multipart/form-data

Body:

cv: [resume.pdf]

job: [job-description.pdf]

Response (score ≥ 60%):

json
{
  "message": "Files uploaded & analyzed successfully!",
  "files": {
    "cv": "resume.pdf",
    "job": "job-description.pdf"
  },
  "matching": {
    "matching": {
      "matching_score": 85,
      "matching_points": ["React experience matches requirement"],
      "unmatching_points": ["No GraphQL experience"]
    },
    "improvement": null
  }
}
Response (score < 60%):

json
{
  "message": "Files uploaded & analyzed successfully!",
  "files": {
    "cv": "resume.pdf",
    "job": "job-description.pdf"
  },
  "matching": {
    "matching": {
      "matching_score": 45,
      "matching_points": ["Basic JavaScript knowledge"],
      "unmatching_points": ["No framework experience"]
    },
    "improvement": {
      "suggestions_improvements": ["Build projects with React"],
      "skills_to_learn": ["React", "Node.js"],
      "projects_to_build": ["E-commerce dashboard with React"]
    }
  }
}
🧠 How It Works
File Upload: Users upload PDF/DOCX files through the API

Text Extraction: The system extracts text content from uploaded files

Text Processing: Extracted text is cleaned and optimized for AI analysis

AI Analysis: Google Gemini AI processes the text with carefully crafted prompts

Response Parsing: AI responses are parsed into structured JSON format

Results Delivery: Analysis results are returned to the user

🎯 Use Cases
Job Seekers: Optimize resumes and understand skill gaps

Recruiters: Quick initial screening of candidates

Career Coaches: Provide data-driven advice to clients

Students: Identify skills needed for target roles

⚙️ Configuration
File Upload Limits
Edit middlewares/upload.js:

javascript
limits: {
  fileSize: 50 * 1024 * 1024 // 50MB max
}
Allowed File Types
javascript
const allowed = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
🧪 Testing
Use Postman or similar tools to test the APIs:

Resume Analysis Test:

bash
curl -X POST http://localhost:5050/api/upload \
  -F "file=@/path/to/your/resume.pdf"
CV-Job Matching Test:

bash
curl -X POST http://localhost:5050/api/cv-analyse \
  -F "cv=@/path/to/your/resume.pdf" \
  -F "job=@/path/to/job-description.pdf"
⚠️ Error Handling
400 Bad Request: Missing files or invalid file types

404 Not Found: Invalid routes

500 Internal Server Error: Server-side issues

Custom 404 page for HTML requests

🔒 Security Considerations
File type validation to prevent malicious uploads

File size limits to prevent DoS attacks

API key stored in environment variables

No persistent storage of uploaded files (auto-delete recommended for production)

🚀 Future Enhancements
Add DOCX text extraction

Implement file auto-deletion after analysis

Add user authentication

Create frontend dashboard

Support for batch processing

Export reports in PDF format

Add more AI models as alternatives
🙏 Acknowledgments
Google Gemini AI for powerful AI capabilities

pdf-parse for PDF text extraction

Multer for file upload handling


