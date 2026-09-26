import { buildSuccessSections } from "../../../../../components/form/successSections";
import type { EducationLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: EducationLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Education Details",
      rows: [
        { label: "Country of Study", value: app.educationCountry },
        { label: "Field of Study", value: app.fieldOfStudy },
        { label: "Course", value: app.courseName },
        { label: "University", value: app.university },
        { label: "Institute", value: app.instituteName },
        { label: "Enrollment Status", value: app.enrollmentStatus },
        { label: "Course Duration", value: app.courseDuration ? `${app.courseDuration.toLocaleString("en-IN")} years` : undefined },
        { label: "Course Cost", value: app.educationCost ? `₹${app.educationCost.toLocaleString("en-IN")}` : undefined },
      ],
    },
    extraSections: [{
      title: "Co-applicant (Parent) Details",
      rows: [
        { label: "Relationship", value: app.parentRelationship },
        { label: "Full Name", value: app.parentFullName },
        { label: "Mobile", value: app.parentMobile ? `+91 ${app.parentMobile}` : undefined },
        { label: "Email", value: app.parentEmail },
        { label: "Date of Birth", value: app.parentDob },
        { label: "PAN Number", value: app.parentPanNumber },
        { label: "Residence", value: [app.parentCity, app.parentState].filter(Boolean).join(", ") || undefined },
        { label: "Residence Status", value: app.parentResidenceStatus },
      ],
    }],

  });
