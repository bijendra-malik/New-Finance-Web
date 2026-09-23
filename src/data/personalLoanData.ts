export const personalLoanData = {
  highlights: [
    { label: "Loan Amount", value: "₹50K - ₹30L" },
    { label: "Interest Rate", value: "10.5% onwards" },
    { label: "Tenure", value: "12-60 Months" },
    { label: "Approval", value: "Within 24 Hours" },
  ],

  whyChoose: [
    { icon: "⚡", title: "Fast Approval", description: "Get approved within 24 hours" },
    { icon: "💰", title: "Low Interest", description: "Competitive rates from 10.5%" },
    { icon: "🔓", title: "No Collateral", description: "No physical security needed" },
    { icon: "💻", title: "100% Online", description: "Apply completely online" },
  ],

  whatIsPersonalLoan: {
    title: "What is a Personal Loan?",
    image: "/src/assets/money-bag.jpg",
    content: `A personal loan is an unsecured loan offered by financial institutions to individuals for various personal needs. Unlike secured loans that require collateral, personal loans are based on your creditworthiness and income stability. These loans are versatile and can be used for debt consolidation, medical emergencies, home renovations, education, travel, or any other personal expense. Personal loans typically come with fixed interest rates and flexible repayment tenures, making them an attractive option for borrowers looking for quick cash without pledging any assets.`,
  },

  benefits: [
    { icon: "🔓", title: "No Collateral", description: "No need to pledge any security" },
    { icon: "📋", title: "Minimal Documents", description: "Quick and easy documentation process" },
    { icon: "💳", title: "Flexible Usage", description: "Use money for any personal need" },
    { icon: "💵", title: "Large Loan Amount", description: "Borrow up to ₹30 Lakh" },
    { icon: "⚡", title: "Quick Approval", description: "Get approved within 24 hours" },
    { icon: "📅", title: "Flexible EMI", description: "Choose tenure from 12-60 months" },
  ],

  eligibility: [
    { criterion: "Age", value: "21-60 years" },
    { criterion: "Income", value: "₹20,000+ per month" },
    { criterion: "Employment", value: "Salaried or Self-employed" },
    { criterion: "Citizenship", value: "Indian Citizen" },
    { criterion: "Credit Score", value: "Good CIBIL score (600+)" },
  ],

  documents: [
    "Passport Photo",
    "PAN Card",
    "Aadhaar Card",
    "Salary Slip (Last 3 months)",
    "Bank Statement (Last 6 months)",
    "Address Proof",
    "Employment Certificate",
  ],

  charges: [
    { charge: "Processing Fee", amount: "1–3%" },
    { charge: "Prepayment Charges", amount: "2–5%" },
    { charge: "Late Payment Fee", amount: "2–3%" },
    { charge: "Bounce Charges", amount: "₹250–₹750" },
    { charge: "Documentation Charges", amount: "₹500–₹3000" },
  ],

  loanProcess: [
    { step: 1, title: "Apply", description: "Fill application form online" },
    { step: 2, title: "Verify", description: "Verification of documents" },
    { step: 3, title: "Approval", description: "Get instant approval" },
    { step: 4, title: "Disbursement", description: "Money in your account" },
  ],

  compareLoans: [
    {
      provider: "Indexia Finance",
      interest: "10.5% - 18%",
      processingFee: "1-3%",
      tenure: "12-60 months",
      loanAmount: "₹50K - ₹30L",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      provider: "Bank A",
      interest: "12% - 20%",
      processingFee: "2-4%",
      tenure: "12-48 months",
      loanAmount: "₹25K - ₹20L",
      rating: "⭐⭐⭐⭐",
    },
    {
      provider: "Bank B",
      interest: "11% - 19%",
      processingFee: "1.5-3.5%",
      tenure: "12-60 months",
      loanAmount: "₹50K - ₹25L",
      rating: "⭐⭐⭐⭐",
    },
  ],

  cibilScore: {
    title: "How Does CIBIL Affect Loan?",
    image: "/src/assets/money-bag1.png",
    content: `Your CIBIL score is a crucial factor in determining your loan eligibility and interest rate. A higher CIBIL score (750+) indicates good creditworthiness and helps you get:
    • Lower interest rates
    • Higher loan amounts
    • Faster approval
    • Better repayment terms
    
    A lower CIBIL score may result in higher interest rates or loan rejection. It's important to maintain a good CIBIL score by paying bills on time and keeping credit utilization low.`,
    scoreRanges: [
      { range: "750-900", meaning: "Excellent", approval: "Easy approval" },
      { range: "700-749", meaning: "Good", approval: "Likely approval" },
      { range: "650-699", meaning: "Fair", approval: "Possible approval" },
      { range: "Below 650", meaning: "Poor", approval: "Difficult approval" },
    ],
  },

  interestTypes: [
    {
      type: "Reducing Balance",
      description: "Interest calculated on remaining balance only",
      pros: ["Lower interest over time", "Preferred by most", "Lower total interest"],
      cons: ["EMI remains same"],
    },
    {
      type: "Flat Interest",
      description: "Interest calculated on full loan amount",
      pros: ["Simple to understand"],
      cons: ["Higher total interest", "EMI higher than reducing"],
    },
  ],

  tips: [
    { icon: "✓", title: "Maintain Good CIBIL", description: "Keep CIBIL score 700+ for better rates" },
    { icon: "✓", title: "Choose Correct Tenure", description: "Balance between EMI and total interest" },
    { icon: "✓", title: "Existing Relationship", description: "Existing customers get better rates" },
    { icon: "✓", title: "Stable Income", description: "Stable employment history helps approval" },
  ],

  faq: [
    {
      question: "What is the maximum personal loan amount?",
      answer: "The maximum personal loan amount is up to ₹30 Lakh depending on your income and credit profile.",
    },
    {
      question: "How long does it take to get approval?",
      answer: "You can get approval within 24 hours after document verification.",
    },
    {
      question: "Do I need to provide collateral?",
      answer: "No, personal loans are unsecured loans. No collateral is required.",
    },
    {
      question: "What is the minimum interest rate?",
      answer: "The minimum interest rate starts from 10.5% onwards based on your creditworthiness.",
    },
    {
      question: "Can I prepay my personal loan?",
      answer: "Yes, you can prepay anytime with minimal prepayment charges (2-5%).",
    },
    {
      question: "What documents do I need?",
      answer: "You need Aadhaar, PAN, salary slip, bank statement, and address proof.",
    },
    {
      question: "Is there a late payment fee?",
      answer: "Yes, late payment fee is 2-3% per month on the overdue amount.",
    },
    {
      question: "Can self-employed apply for personal loan?",
      answer: "Yes, self-employed individuals can apply with valid business documents.",
    },
    {
      question: "What is the minimum CIBIL score required?",
      answer: "Minimum CIBIL score of 600+ is required for approval.",
    },
    {
      question: "How is EMI calculated?",
      answer: "EMI is calculated using the formula: [Loan Amount × Interest Rate × (1 + Interest Rate)^Tenure] / [(1 + Interest Rate)^Tenure - 1]",
    },
    {
      question: "Can I increase my loan limit later?",
      answer: "Yes, after successful repayment of 6-12 months, you can request for limit increase.",
    },
    {
      question: "Is the interest rate fixed or variable?",
      answer: "We offer fixed interest rates throughout the loan tenure.",
    },
    {
      question: "What happens if I miss a payment?",
      answer: "Missing payments will result in late fees and negatively impact your CIBIL score.",
    },
    {
      question: "Can I transfer my loan to another lender?",
      answer: "Yes, loan balance transfer is possible with minimal charges.",
    },
    {
      question: "How do I apply for the loan?",
      answer: "You can apply online through our website. Fill the application form and submit required documents.",
    },
  ],
};
