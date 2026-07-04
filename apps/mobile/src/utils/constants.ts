export const APP_CONSTANTS = {
  STATIC_CREDENTIALS: {
    username: "admin",
    password: "admin123",
  },
  SESSION_TOKEN: "mobile-session-token",
  API_BASE_URL: __DEV__
    ? "http://localhost:3000/api"
    : "https://your-api-domain.com/api",
  PERMISSIONS: {
    CAMERA: "camera",
    MICROPHONE: "microphone",
    LOCATION: "location",
    STORAGE: "storage",
  },
  LANGUAGES: [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  ],
  SUBMISSION_CATEGORIES: [
    { id: "education", label: "Education", icon: "📚" },
    { id: "healthcare", label: "Healthcare", icon: "🏥" },
    { id: "infrastructure", label: "Infrastructure", icon: "🏗️" },
    { id: "employment", label: "Employment", icon: "💼" },
    { id: "environment", label: "Environment", icon: "🌿" },
  ],
  SUBMISSION_SOURCES: [
    { id: "public_meeting", label: "Public Meeting" },
    { id: "letter", label: "Letter" },
    { id: "social_media", label: "Social Media" },
    { id: "grievance_portal", label: "Grievance Portal" },
    { id: "direct_representation", label: "Direct Representation" },
    { id: "voice", label: "Voice Message" },
    { id: "photo", label: "Photo Evidence" },
  ] as const,
} as const;
