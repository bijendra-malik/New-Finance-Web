/** Copy and colours for the franchise agreement status shown across the dashboard. */

export interface AgreementTone {
  label: string;
  blurb: string;
  bg: string;
  border: string;
  text: string;
}

export const agreementTone = (status?: string): AgreementTone => {
  switch ((status ?? "").trim().toLowerCase()) {
    case "active":
      return {
        label: "Active",
        blurb: "Your franchise agreement is active. You can register customers and file loans.",
        bg: "rgba(38,174,144,0.16)",
        border: "rgba(38,174,144,0.45)",
        text: "#d6fff5",
      };
    case "pending":
      return {
        label: "Pending",
        blurb: "Your application is with the franchise team. Customer registration and loan filing open once the agreement is active.",
        bg: "rgba(224,168,0,0.2)",
        border: "rgba(224,168,0,0.5)",
        text: "#ffe9ad",
      };
    case "approved":
      return {
        label: "Approved",
        blurb: "Your franchise agreement is approved. Portal actions unlock once the franchise team marks the account active.",
        bg: "rgba(38,174,144,0.2)",
        border: "rgba(38,174,144,0.55)",
        text: "#d6fff5",
      };
    case "suspended":
      return {
        label: "Suspended",
        blurb: "This franchise is currently suspended. Contact the franchise team before registering customers or filing loans.",
        bg: "rgba(239,68,68,0.2)",
        border: "rgba(248,113,113,0.55)",
        text: "#fecaca",
      };
    default: {
      const reported = status?.trim();
      return {
        label: reported || "Not reported",
        blurb: reported
          ? "This is the agreement status on your live franchise profile. Contact the franchise desk if it looks out of date."
          : "The agreement status has not been reported by the backend yet.",
        bg: "rgba(255,255,255,0.12)",
        border: "rgba(255,255,255,0.3)",
        text: "#ffffff",
      };
    }
  }
};
