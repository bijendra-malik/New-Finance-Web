import { buildSuccessSections, fmtDate, resolveOther } from "../../../../../components/form/successSections";
import type { EducationLoanApplication } from "./ApplicationForm";

export const buildProductSections = (app: EducationLoanApplication) =>
  buildSuccessSections(app, {
    productSection: {
      title: "Education Details",
      rows: [
        { label: "Country of Study", value: resolveOther(app.educationCountry, app.educationCountryOther) },
        { label: "Field of Study", value: resolveOther(app.fieldOfStudy, app.fieldOfStudyOther) },
        { label: "Course", value: app.courseName },
        { label: "University", value: app.university },
        { label: "Institute", value: app.instituteName },
        { label: "Enrollment Status", value: resolveOther(app.enrollmentStatus, app.enrollmentStatusOther) },
        { label: "Course Duration", value: app.courseDuration ? `${app.courseDuration.toLocaleString("en-IN")} years` : undefined },
        { label: "Course Cost", value: app.educationCost ? `₹${app.educationCost.toLocaleString("en-IN")}` : undefined },
      ],
    },
    extraSections: [{
      title: "Co-applicant (Parent) Details",
      rows: [
        { label: "Relationship", value: resolveOther(app.parentRelationship, app.parentRelationshipOther) },
        { label: "Full Name", value: app.parentFullName },
        { label: "Mobile", value: app.parentMobile ? `+91 ${app.parentMobile}` : undefined },
        { label: "Email", value: app.parentEmail },
        { label: "Date of Birth", value: fmtDate(app.parentDob) },
        { label: "PAN Number", value: app.parentPanNumber },
        { label: "Residence", value: [app.parentCity, app.parentState].filter(Boolean).join(", ") || undefined },
        { label: "Residence Status", value: resolveOther(app.parentResidenceStatus, app.parentResidenceStatusOther) },
      ],
    }],

  });
