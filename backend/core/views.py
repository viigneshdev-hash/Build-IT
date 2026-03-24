from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import google.generativeai as genai
from django.conf import settings
import json
import PyPDF2
import io

def analyze_with_gemini(resume_text, job_desc):
    """
    Common logic to analyze resume text with Gemini
    """
    # Configure Gemini
    api_key = getattr(settings, "GEMINI_API_KEY", None)
    if not api_key or api_key == "YOUR_GEMINI_API_KEY":
       return {
          "score": 85,
          "summary": "Sample analysis (Mock) - Configure Gemini API key for real AI analysis.",
          "suggestions": [
            "Use stronger action verbs.",
            "Include more keywords from the job description.",
            "Quantify your results with metrics."
          ],
          "missingKeywords": ["Python", "Docker", "Kubernetes"]
       }

    try:
      genai.configure(api_key=api_key)
      model = genai.GenerativeModel("gemini-1.5-flash")
      
      prompt = f"""
      You are an expert ATS (Applicant Tracking System) software. 
      Analyze the following Resume against the Job Description.
      
      Resume:
      {resume_text}
      
      Job Description:
      {job_desc}
      
      Return a JSON object with:
      - score: integer (0-100) match rate
      - summary: a short 2-3 sentence overview
      - suggestions: an array of strings (specific improvement ideas - focus on mistakes and missing items)
      - missingKeywords: an array of strings (keywords from JD missing in resume)
      
      Only return the JSON object, nothing else.
      """
      
      response = model.generate_content(prompt)
      
      # Extract JSON from response
      json_text = response.text.strip()
      if "```json" in json_text:
         json_text = json_text.split("```json")[-1].split("```")[0].strip()
      elif "```" in json_text:
         json_text = json_text.split("```")[-1].split("```")[0].strip()
          
      return json.loads(json_text)
    except Exception as e:
      raise e

class ATSCheckView(APIView):
  """
  Analyzes resume text against a job description using Gemini AI.
  """
  def post(self, request):
    resume_text = request.data.get('resumeText')
    job_desc = request.data.get('jobDesc')

    if not resume_text or not job_desc:
      return Response({"error": "Resume text and Job Description are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
      data = analyze_with_gemini(resume_text, job_desc)
      return Response(data)
    except Exception as e:
      return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ATSScorePDFView(APIView):
    """
    Accepts a PDF file, extracts text, and analyzes it with Gemini
    """
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('resume')
        job_desc = request.data.get('jobDesc', 'General software engineering role')

        if not file_obj:
            return Response({"error": "No resume PDF uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Extract text from PDF
            pdf_reader = PyPDF2.PdfReader(file_obj)
            resume_text = ""
            for page in pdf_reader.pages:
                resume_text += page.extract_text() or ""

            if not resume_text.strip():
                return Response({"error": "Could not extract text from PDF. Please ensure it is not an image-only PDF."}, status=status.HTTP_400_BAD_REQUEST)

            # Analyze
            data = analyze_with_gemini(resume_text, job_desc)
            return Response(data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
