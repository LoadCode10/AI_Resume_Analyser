const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const fsPromises = require('fs').promises;
const { geminiService } = require('./gemini-model.js');
const {cleanText} = require('../utils/cleanText.js')
const {extractRelevantSections} = require('../utils/cleanText.js')
const {dedupeLines} = require('../utils/cleanText.js')
const {extractJSONBlocks} = require('../utils/cleanText.js')

// const cvFile = 'UXDesigner.pdf';
// const jobDescFile = 'Front-End-Dev-Desc.pdf';

async function analyseResume (cvFile) {
  try {
    const cvText = await extractTextFromFile(cvFile);
    // console.log(cvText);
    const prompt = `
      You are an expert AI career coach and professional recruiter.

      Analyze the following resume carefully and objectively.

      Your task is to evaluate the candidate’s profile based on:
      - technical skills
      - experience
      - education
      - clarity and structure
      - employability in today’s job market

      RESUME:
      ${cvText}

      Return ONLY valid JSON in the following exact format:

      {
        "strengths": [string],
        "weaknesses": [string],
        "missing_skills": [string],
        "improvement_suggestions": [string],
        "projects_to_do": [string]
      }

      Rules:
      - Each array must contain short, clear, and professional bullet-style sentences.
      - Do NOT include empty arrays.
      - Do NOT include explanations, markdown, comments, or extra text.
      - Be honest, specific, and useful.
      - Base all analysis strictly on the resume content.
      - Missing skills must be realistic for the candidate’s career path.
      - Suggested projects must directly help the candidate become more employable.
    `;

    const response = await geminiService(prompt);

    const analysis = response.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(analysis);
    } catch (error) {
      console.error("Failed to parse Gemini response as JSON:", analysis);
      throw new Error("Invalid response format from AI");
    }

  } catch (error) {
    console.log(error);
  }
};

async function cvJobMatching(cvFile,jobDescFile) {
  try {
    const cvText = await extractTextFromFile(cvFile);
    const jobDescText = await extractTextFromFile(jobDescFile);

    const prompt = `
      You are an expert AI recruitment engine used by professional hiring platforms.

      Your task is to compare a candidate’s resume with a job description and evaluate how well the candidate fits the role.

      You must analyze:
      - technical skills
      - experience
      - tools and technologies
      - education
      - role responsibilities
      - seniority level

      INPUTS:

      JOB DESCRIPTION:
      ${jobDescText}

      RESUME:
      ${cvText}

      ----------------------------

      STEP 1 — Compute matching

      Calculate a realistic MATCHING SCORE from 0 to 100 based on:
      - Skill overlap
      - Experience relevance
      - Role alignment
      - Tool & technology match
      - Seniority fit

      Then return JSON in this EXACT format:

      {
        "matching_score": number,
        "matching_points": [string],
        "unmatching_points": [string]
      }

      Rules:
      - matching_score must be a whole number between 0 and 100
      - matching_points = what fits well
      - unmatching_points = what is missing or weak
      - Use short professional bullet sentences
      - No empty arrays
      - No extra text, markdown, or explanations

      ----------------------------

      STEP 2 — Improvement plan

      If and ONLY IF matching_score is less than 60, return a SECOND JSON object after the first one in this format:

      {
        "suggestions_improvements": [string],
        "skills_to_learn": [string],
        "projects_to_build": [string]
      }

      Rules for second JSON:
      - Only output it when score < 60
      - Suggestions must directly increase matching_score
      - Skills must be specific to the job
      - Projects must be realistic and relevant
      - No empty arrays
      - No extra text
    `;

    const response = await geminiService(prompt);

    const matchingAnalysis = response.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonBlocks = extractJSONBlocks(matchingAnalysis);

    if (jsonBlocks.length === 0) {
      throw new Error("No valid JSON returned by Gemini");
    }

    const matching = jsonBlocks[0];
    const improvement = jsonBlocks[1] || null;

    try {
      return {
        matching,
        improvement
      }
    } catch (error) {
      console.error("Failed to parse Gemini response as JSON:", matchingAnalysis);
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.log(error);
  }
}

async function extractTextFromFile(filename){
  try {
    const buffer = fs.readFileSync(path.join(__dirname,'..','uploads',filename));
    const data = await pdf(buffer);
    const resumeText = data.text;
    const cleanResume = extractRelevantSections(
      dedupeLines(cleanText(resumeText))
    );
    return cleanResume;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  analyseResume,
  cvJobMatching
}

// cvJobMatching(cvFile,jobDescFile).then(result=>{
//   console.log(result);
// });


// analyseResume(cvFile);
// analyseResume(cvFile).then(async (result) => {
//   // console.log(result);
//   const folderPath = path.join(__dirname, 'analysesFolder');
//   if(!fs.existsSync(folderPath)){
//     await fsPromises.mkdir(folderPath);
//   };

//   await fsPromises.writeFile(path.join(__dirname,'analysesFolder','analysisall.json'),
//   JSON.stringify(result),
//   'utf-8'
// );
// });

