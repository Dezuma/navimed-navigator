export const patientMedicalProfile = {
  patientId: "PT0141",
  displayName: "Michael Carter",
  conditions: ["Hypertension", "Family history of diabetes", "Recent elevated liver enzymes"],
  allergies: ["Penicillin"],
  medications: ["Lisinopril 10 mg daily"],
  vitals: [
    ["Blood pressure", "138/86 mmHg"],
    ["Heart rate", "78 bpm"],
    ["Oxygen saturation", "98%"],
    ["Temperature", "98.4 F"],
  ],
  watchItems: [
    ["ALT", "68 U/L", "High", "7-56"],
    ["AST", "42 U/L", "Slightly high", "10-40"],
    ["Fasting glucose", "104 mg/dL", "Slightly high", "70-99"],
  ],
  inRangeLabs: [
    ["Total cholesterol", "176 mg/dL", "< 200"],
    ["LDL", "94 mg/dL", "< 100"],
    ["HDL", "54 mg/dL", "> 40"],
    ["Bilirubin", "0.8 mg/dL", "0.1-1.2"],
  ],
  careGaps: [
    "Review elevated liver enzymes with provider",
    "Recheck blood pressure trend",
    "Discuss family history of diabetes at follow-up",
  ],
  safetyNote: "For care navigation only. For new, worsening, or urgent symptoms, contact a clinician or emergency services.",
};
