# Build IT - AI-Based ATS Resume Builder

Welcome to **Build IT**, a premium, AI-powered resume builder designed to help you land your dream job by optimizing for Applicant Tracking Systems (ATS).

## 🚀 Features
- **Modern Landing Page**: High-performance UI with smooth animations.
- **AI-Powered ATS Checker**: Upload your resume and get a match score and improvement suggestions using Google Gemini AI.
- **5 Premium Templates**:
  - Elegant Serif (Creative/Portfolio)
  - Accent Sidebar (Modern/Clean)
  - Industrial Minimal (Corporate/Strict)
  - Terminal Bio (Tech/Developer)
  - Executive Black (Professional/Standard)
- **Instant PDF Download**: Export your resume in professional PDF format.
- **Saved Profiles**: Your data is securely saved in Supabase.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Python 3.x

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `frontend` folder with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### 3. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Gemini API Key:
   Open `buildit_backend/settings.py` and replace `YOUR_GEMINI_API_KEY` with your actual key from [Google AI Studio](https://aistudio.google.com/).
5. Run the Django server:
   ```bash
   python manage.py runserver
   ```

---

## 🏗️ Technology Stack
- **Frontend**: React, Vite, TailwindCSS v4, Framer Motion, Lucide React
- **Backend**: Python Django, Django Rest Framework
- **Database**: Supabase
- **AI**: Google Gemini Pro (1.5 Flash)
- **PDF Generation**: html2canvas + jsPDF

---

## 📜 Database Schema (Supabase)
Create a table named `user_profiles` with the following columns:
- `user_id`: uuid (foreign key to auth.users)
- `resume_data`: jsonb (to store the resume structure)
- `updated_at`: timestamp

---

Made with ❤️ by the Build IT team.
