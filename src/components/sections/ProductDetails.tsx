import { useState, useEffect, useRef } from "react";
import bgImage from "../../assets/copyright-free.png";
import ApplicationModal from "../modals/ApplicationModal";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}
interface Product {
  id: string;
  label: string;
  heading: string;
  subtitle: string;
  features: Feature[];
}

const products: Product[] = [
  {
    id: "personal-loan",
    label: "Personal Loan",
    heading: "Personal Loan",
    subtitle: "Fulfill your dreams instantly with collateral-free personal loans up to ₹40 Lakhs",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Instant Disbursal", desc: "Amount credited to your account within 24 hours of document verification" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "No Collateral", desc: "100% unsecured loan — no property or asset required as security" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Tenure", desc: "Repay comfortably over 12 to 60 months at competitive interest rates" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Minimal Paperwork", desc: "Digital KYC and e-signature. Apply with just Aadhaar, PAN and bank statement" },
    ],
  },
  {
    id: "business-loan",
    label: "Business Loan",
    heading: "Business Loan",
    subtitle: "Fuel your business growth with fast, flexible funding up to ₹2 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Up to ₹2 Crores", desc: "Unsecured business loans for expansion, inventory, working capital and equipment" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Overdraft Facility", desc: "Flexible overdraft limit to manage cash flow fluctuations with ease" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Dedicated Manager", desc: "Assigned relationship manager guides you from application to disbursal" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Collateral Free", desc: "No security deposit required — just healthy business financials and credit history" },
    ],
  },
  {
    id: "home-loan",
    label: "Home Loan",
    heading: "Home Loan",
    subtitle: "Make your dream home a reality with loans up to ₹5 Crores at lowest rates",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Up to ₹5 Crores", desc: "Finance your dream home — purchase, construction, or renovation — at competitive rates" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "30-Year Tenure", desc: "Extended repayment period up to 30 years keeping your EMIs affordable" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Tax Savings", desc: "Save up to ₹3.5 Lakhs annually on interest and principal under 80C and 24(b)" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Balance Transfer", desc: "Switch your existing home loan to us and save significantly on interest outgo" },
    ],
  },
  {
    id: "loanAP-loan",
    label: "Loan Against Property",
    heading: "Loan Against Property",
    subtitle: "Leverage your property to meet large financial needs at lower interest rates",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "High Loan Value", desc: "Get up to 70% of your property's market value as loan amount" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Lower Interest Rate", desc: "Secured nature means significantly lower rates compared to personal loans" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Multi-Purpose Use", desc: "Use for business expansion, education, medical emergencies, or any personal need" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Up to 15 Years", desc: "Comfortable repayment tenure with part-prepayment allowed without penalty" },
    ],
  },
  {
    id: "balance-loan",
    label: "Balance Transfer",
    heading: "Balance Transfer",
    subtitle: "Move your existing high-interest loans to us and save thousands every month",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Lower EMIs", desc: "Switch to lower interest rates and immediately reduce your monthly EMI outgo" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Top-Up Loan", desc: "Get additional funds over your transferred amount at no extra documentation" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Quick Processing", desc: "Seamless takeover processed in as little as 5 working days" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/></svg>, title: "Zero Prepayment", desc: "No hidden charges or prepayment penalties when you close early" },
    ],
  },
  {
    id: "car-loan",
    label: "Car Loan",
    heading: "Car Loan",
    subtitle: "Drive your dream car today with fast approvals and flexible EMI options",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Same-Day Approval", desc: "Get loan approved within hours — drive out of the showroom the same day" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Up to 100% Funding", desc: "Finance the entire on-road price of your new or used car with us" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Tenure", desc: "Choose repayment tenure from 12 to 84 months to suit your budget" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Any Brand", desc: "Loans available for all major car brands — new, used, and commercial vehicles" },
    ],
  },
  {
    id: "credit-card",
    label: "Credit Card",
    heading: "Premium Credit Cards",
    subtitle: "Unlock exclusive rewards and benefits with our range of credit cards",
    features: [
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Rewards Program",
        desc: "Earn points on every transaction and redeem for exclusive rewards and travel benefits",
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Zero Fraud Liability",
        desc: "Advanced security features protect you from unauthorized transactions 24/7",
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0110.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Global Acceptance",
        desc: "Use your card at 50+ million locations worldwide with zero foreign transaction fees",
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Instant Approval",
        desc: "Get approval in minutes with our digital-first application process",
      },
    ],
  },
  {
    id: "education-loan",
    label: "Education Loan",
    heading: "Education Loan",
    subtitle: "Invest in your future with flexible education financing up to ₹75 Lakhs",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Up to ₹75 Lakhs", desc: "Cover tuition, accommodation, travel and all academic expenses for top institutions globally" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Moratorium Period", desc: "No repayment during course duration + 6 months grace period after completion" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Tax Benefits", desc: "Claim deduction on interest paid under Section 80E of Income Tax Act" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>, title: "Quick Disbursal", desc: "Funds disbursed directly to institution within 7 working days of approval" },
    ],
  },
  {
    id: "project-loan",
    label: "Project Loan",
    heading: "Project Loan",
    subtitle: "Finance your business projects with tailored funding up to ₹5 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 012-2h4a2 2 0 012 2v6m-6-6V9a2 2 0 012-2h4a2 2 0 012 2v4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Project Financing", desc: "Structured financing for infrastructure, manufacturing, and development projects" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Quick Disbursal", desc: "Seamless fund disbursement based on project milestones" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Expert Support", desc: "Project management guidance from seasoned finance professionals" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Tenure", desc: "Repayment aligned with project cash flow" },
    ],
  },
  {
    id: "commercial-purchase",
    label: "Commercial Purchase",
    heading: "Commercial Purchase Loan",
    subtitle: "Buy commercial properties and spaces with secured financing up to ₹3 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "High LTV Ratio", desc: "Up to 80% financing on commercial property value" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Competitive Rates", desc: "Industry-leading interest rates from 11% p.a." },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Quick Approval", desc: "Fast-track approval within 48 hours for eligible properties" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Extended Tenure", desc: "Up to 20 years repayment period for commercial property" },
    ],
  },
  {
    id: "lease-rental",
    label: "Lease Rental Discounting",
    heading: "Lease Rental Discounting",
    subtitle: "Unlock working capital against lease rental agreements up to ₹2 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Instant Liquidity", desc: "Immediate cash against future lease rental income" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Simple Process", desc: "Minimal documentation — just lease agreement and financials" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Terms", desc: "Customize repayment to match your business needs" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "No Collateral", desc: "Lease itself acts as security — no additional guarantees needed" },
    ],
  },
  {
    id: "working-capital",
    label: "Working Capital",
    heading: "Working Capital Loan",
    subtitle: "Boost business operations with flexible working capital up to ₹1.5 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Quick Access", desc: "Immediate funds to manage inventory and receivables" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 012-2h4a2 2 0 012 2v6m-6-6V9" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Overdraft Facility", desc: "Flexible line of credit for seasonal business variations" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Repayment", desc: "Pay only interest during low-revenue months" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Minimal Documentation", desc: "Easy approval based on business financials" },
    ],
  },
  {
    id: "film-funding",
    label: "Film Funding",
    heading: "Film Funding",
    subtitle: "Finance your creative projects with dedicated film production loans up to ₹50 Crores",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 4v16a1 1 0 001 1h8a1 1 0 001-1V4m0 0L7 4m0 0l9 0" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Creative Financing", desc: "Tailored solutions for film production, distribution, and marketing" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Quick Disbursement", desc: "Funds disbursed at different project milestones" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Industry Experts", desc: "Dedicated team with film industry expertise" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Terms", desc: "Repayment aligned with film revenue collection" },
    ],
  },
  {
    id: "od-cc-limit",
    label: "OD CC Limit",
    heading: "OD & CC Limit",
    subtitle: "Flexible Overdraft and Cash Credit limits against your property — pay interest only on what you use",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Pay-As-You-Use", desc: "Interest charged only on the utilised amount, not on the sanctioned limit" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Renewable Limit", desc: "Renew your limit annually with minimal documentation and no fresh processing" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Against Property", desc: "Sanctioned against residential, commercial, or industrial property at attractive rates" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Instant Top-Up", desc: "Withdraw and deposit funds anytime within your sanctioned limit" },
    ],
  },
  {
    id: "loan-against-share",
    label: "Loan Against Share",
    heading: "Loan Against Share",
    subtitle: "Unlock liquidity from your shares and securities without selling your portfolio",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18M8 16l4-6 4 4 4-8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Stay Invested", desc: "Keep your portfolio intact while accessing funds against pledged securities" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Same-Day Liquidity", desc: "Funds disbursed quickly after pledge creation in your Demat account" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Lower Interest", desc: "Secured against shares and mutual funds — rates lower than personal loans" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "No Selling Pressure", desc: "Avoid capital gains tax and market-timing pressure — pledge instead of selling" },
    ],
  },
  {
    id: "gold-loan",
    label: "Gold Loan",
    heading: "Gold Loan",
    subtitle: "Get instant cash against your gold jewellery at attractive interest rates",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "45-Minute Approval", desc: "Walk in with your gold, walk out with funds — approval within the hour" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Safe Custody", desc: "Your gold is insured and stored in tamper-proof sealed packets" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Best Valuation", desc: "Transparent, certified valuation of your ornaments at the highest market rates" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Repayment", desc: "Pay only interest during the tenure and principal at maturity, or choose EMIs" },
    ],
  },
  {
    id: "fdi",
    label: "FDI",
    heading: "Foreign Direct Investment (FDI)",
    subtitle: "Structured FDI funding solutions for businesses expanding into India",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "End-to-End Structuring", desc: "Complete guidance on FEMA-compliant FDI structure and documentation" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Regulatory Compliance", desc: "RBI reporting, sectoral caps, and approval-route filings handled by experts" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Competitive Funding", desc: "Funding against company valuation or collateral property, on a case-by-case basis" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Growth Capital", desc: "Long-tenure capital for expansion, capex, and working-capital needs" },
    ],
  },
  {
    id: "npa",
    label: "NPA (Non-Performing Assets)",
    heading: "NPA Resolution Loan",
    subtitle: "Restructure and resolve NPAs with specialized financial solutions",
    features: [
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "NPA Resolution", desc: "Structured solutions to resolve non-performing assets" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Fast Restructuring", desc: "Quick approval and restructuring of existing NPAs" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Expert Handling", desc: "Experienced team for seamless NPA restructuring" },
      { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Flexible Payment", desc: "Customized repayment schedules for NPA borrowers" },
    ],
  },
];


const VISIBLE_COUNT = 6;

const PRODUCT_META: Record<string, { rate: string; tagColor: string }> = {
  "personal-loan":    { rate: "From 10.5% p.a.",  tagColor: "#a78bfa" },
  "business-loan":    { rate: "From 12% p.a.",  tagColor: "#34d399" },
  "home-loan":        { rate: "From 8.4% p.a.",tagColor: "#22d3ee" },
  "loanAP-loan":      { rate: "From 9.5% p.a.", tagColor: "#f472b6" },
  "balance-loan":     { rate: "Save up to 40%",  tagColor: "#fb923c" },
  "car-loan":         { rate: "From 7.5% p.a.",  tagColor: "#fbbf24" },
  "credit-card":      { rate: "0% interest",   tagColor: "#f59e0b" },
  "education-loan":   { rate: "From 8.5% p.a.", tagColor: "#22d3ee" },
  "project-loan":     { rate: "From 13% p.a.",tagColor: "#ec4899" },
  "commercial-purchase": { rate: "From 11% p.a.",  tagColor: "#8b5cf6" },
  "lease-rental":     { rate: "From 10% p.a.",  tagColor: "#14b8a6" },
  "working-capital":  { rate: "From 9.5% p.a.", tagColor: "#06b6d4" },
  "film-funding":       { rate: "From 14% p.a.", tagColor: "#f97316" },
  "od-cc-limit":        { rate: "From 9% p.a.", tagColor: "#0ea5e9" },
  "loan-against-share": { rate: "From 10.5% p.a.", tagColor: "#a3e635" },
  "gold-loan":          { rate: "From 9.2% p.a.", tagColor: "#f59e0b" },
  "fdi":                { rate: "Case-by-case", tagColor: "#eab308" },
  "npa":                { rate: "From 15% p.a.", tagColor: "#ef4444" },
};

const ProductDetails = () => {
  const [activeId, setActiveId]   = useState(products[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visible, setVisible]     = useState(true);
  const [displayId, setDisplayId] = useState(products[0].id);
  const [scrollTop, setScrollTop] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef    = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const ITEM_H = 52;
  const canScrollUp   = scrollTop > 0;
  const canScrollDown = scrollTop < (products.length - VISIBLE_COUNT) * ITEM_H;

  // Viewport entry trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(scrollTop + dir * ITEM_H * 2, (products.length - VISIBLE_COUNT) * ITEM_H));
    setScrollTop(next);
    if (listRef.current) listRef.current.scrollTop = next;
  };

  const handleListScroll = () => {
    if (listRef.current) setScrollTop(listRef.current.scrollTop);
  };

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDisplayId(id);
      setActiveId(id);
      setVisible(true);
    }, 260);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const active = products.find((p) => p.id === displayId) ?? products[0];
  const meta   = PRODUCT_META[active.id] ?? { rate: "", tag: "", tagColor: "#22d3ee" };

  return (
    <>
      <style>{`        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(36px); }
          /* transform: none (not translateX(0)) — releases the pinned stacking
             context once the entrance finishes, so hover z-ordering works */
          to { opacity: 1; transform: none; }
        }
        .pd-enter { animation: slideInFromRight 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .pd-btn-list::-webkit-scrollbar { display: none; }
        .pd-btn-list { scrollbar-width: none; overflow-x: hidden; }
        @keyframes pdFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pd-fade-up { animation: pdFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        /* CTA buttons — paint-only hover (brightness/shadow/arrow nudge).
           The arrow nudges INSIDE the button's own padding, never outside. */
        .pd-cta svg { transition: transform 0.2s ease; }
        .pd-cta:hover svg { transform: translateX(3px); }

        /* Product list buttons — ALL hover effects are painted INSIDE the
           button's own border-box. No translate/scale on the button itself,
           so it can never escape its box, clip, or slide under a sibling. */
        .pd-product-btn {
          position: relative;
          overflow: hidden;
        }
        .pd-product-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(38,174,144,0.20) 40%,
            rgba(6,106,156,0.25) 70%,
            rgba(38,174,144,0.12) 100%
          );
          transform: translateX(-100%) translateY(100%);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
          border-radius: 10px;
        }
        .pd-product-btn:hover::before {
          transform: translateX(0%) translateY(0%);
        }
        /* chevron indicator — absolutely positioned INSIDE the box,
           slides in from the inner edge on hover */
        .pd-product-btn::after {
          content: "";
          position: absolute;
          right: 12px;
          top: 50%;
          width: 6px;
          height: 6px;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: translateY(-50%) rotate(45deg) translateX(-5px);
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
          z-index: 1;
        }
        .pd-product-btn:hover::after {
          opacity: 0.9;
          transform: translateY(-50%) rotate(45deg) translateX(0);
        }
        .pd-product-btn > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full min-h-112.5 flex items-stretch overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        {/* Dark overlay — brand gradient */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(135deg, rgb(3 37 60 / 88%) 0%, rgb(6 106 156 / 78%) 55%, rgb(38 174 144 / 0%) 100%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-10 md:px-8 py-8 lg:px-10 flex flex-col lg:flex-row md:py-16 gap-10">

          {/* ── LEFT content ── */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div
              key={displayId}
              className={visible ? "pd-enter" : ""}
              style={{ opacity: visible ? 1 : 0, transition: visible ? "none" : "opacity 0.22s ease" }}
            >

              {/* Heading + tag badge */}
              <div className="flex items-start gap-3 flex-wrap mb-1">
                <h2
                  className="text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-tight"
                  style={{ color: "#f2f231" }}
                >
                  {active.heading}
                </h2>
                {/* Tag badge */}
                {/* <span
                  className="mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                  style={{ background: meta.tagColor + "22", color: meta.tagColor, border: `1px solid ${meta.tagColor}55` }}
                >
                  {meta.tag}
                </span> */}
              </div>

              {/* Accent + rate pill */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="flex gap-1.5">
                  <div className="h-0.75 w-8 rounded-full" style={{ background: "#26ae90" }} />
                  <div className="h-0.75 w-8 rounded-full" style={{ background: "#f2f231" }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border" style={{ color: "#ffffffff" }}>
                  {meta.rate}
                </span>
              </div>

              <p className="text-sm sm:text-[0.95rem] leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(255,255,255,0.80)" }}>
                {active.subtitle}
              </p>

              {/* Features — with hover effect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7 mb-10">
                {active.features.map((feat, i) => (
                  <FeatureItem key={feat.title} feat={feat} delay={i * 60} visible={visible} />
                ))}
              </div>

              {/* Buttons */}
              <div className="relative z-20 flex items-center gap-4 flex-wrap">
                <a
                  href={(() => {
                    const docRouteMap: Record<string, string> = {
                      "personal-loan":    "/requireddocument/personal-loan",
                      "business-loan":    "/requireddocument/business-loan",
                      "home-loan":        "/requireddocument/home-loan",
                      "loanAP-loan":      "/requireddocument/loan-against-property",
                      "balance-loan":     "/requireddocument/balance-transfer",
                      "car-loan":         "/requireddocument/car-loan",
                      "credit-card":      "/requireddocument/credit-card",
                      "education-loan":   "/requireddocument/education-loan",
                      "project-loan":     "/requireddocument/project-loan",
                      "commercial-purchase": "/requireddocument/commercial-purchase",
                      "lease-rental":     "/requireddocument/lease-rental",
                      "working-capital":  "/requireddocument/working-capital",
                      "film-funding":     "/requireddocument/film-funding",
                      "od-cc-limit":      "/requireddocument/od-cc-limit",
                      "loan-against-share": "/requireddocument/loan-against-share",
                      "gold-loan":        "/requireddocument/gold-loan",
                      "npa":              "/requireddocument/npa",
                      "fdi":              "/requireddocument/fdi",
                    };
                    return docRouteMap[active.id] || `/requireddocument?loan=${encodeURIComponent(active.heading)}`;
                  })()}
                  className="pd-cta relative z-20 inline-flex items-center gap-2 px-7 py-2.5 rounded-lg font-bold text-white text-sm cursor-pointer select-none transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #066a9c, #26ae90)",
                    boxShadow: "0 4px 16px rgba(38,174,144,0.40)",
                    border: "1px solid rgba(38,174,144,0.45)",
                  }}
                >
                  Required Document
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href={`/showdetails/${active.id}`}
                  className="pd-cta relative z-20 inline-flex items-center gap-2 px-7 py-2.5 rounded-lg font-bold text-sm cursor-pointer select-none transition-all duration-200 hover:brightness-125 active:scale-95"
                  style={{
                    color: "#f2f231",
                    border: "1px solid rgba(255, 255, 255, 1)",
                    background: "rgba(242,242,49,0.07)",
                  }}
                >
                  Know More About Your Loan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT: scrollable button list ── */}
          <div className="lg:w-56 flex flex-col gap-0 shrink-0">

            {/* Up chevron */}
            <button
              onClick={() => scrollBy(-1)}
              className="flex items-center justify-center mb-1 rounded-lg transition-all duration-200"
              style={{ opacity: canScrollUp ? 1 : 0, pointerEvents: canScrollUp ? "auto" : "none", cursor: "pointer" }}
              aria-label="Scroll up"
            >
              <svg className="w-4 h-4" style={{ color: "#26ae90" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Button list */}
            <div
              ref={listRef}
              onScroll={handleListScroll}
              className="pd-btn-list flex flex-col gap-3 overflow-y-auto"
              style={{ maxHeight: `${VISIBLE_COUNT * ITEM_H}px` }}
            >
              {products.map((p, i) => {
                const isActive  = p.id === activeId;
                const isHovered = hoveredId === p.id && !isActive;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="pd-product-btn w-full text-left pl-3 pr-8 py-2.5 text-sm cursor-pointer select-none whitespace-nowrap shrink-0 flex items-center gap-2.5"
                    style={{
                      borderRadius: "10px",
                      // active: teal bg + dark text | hovered: teal tint + lime text | default: subtle
                      background: isActive
                        ? "linear-gradient(135deg, #066a9c, #26ae90)"
                        : isHovered
                        ? "rgba(38,174,144,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: isActive
                        ? "#f2f231"           // lime text on active
                        : isHovered
                        ? "#f2f231"           // teal text on hover
                        : "rgba(255, 255, 255, 1)", // muted white default
                      border: isActive
                        ? "1.5px solid rgba(38,174,144,0.80)"
                        : isHovered
                        ? "1.5px solid rgba(38,174,144,0.50)"
                        : "1.5px solid rgb(242 242 49)",
                      boxShadow: isActive
                        ? "0 4px 16px rgba(6,106,156,0.45)"
                        : isHovered
                        ? "inset 0 0 0 1px rgba(38,174,144,0.35), inset 0 0 14px rgba(38,174,144,0.18)"
                        : "none",
                      /* no transform on hover — the redesign keeps every hover
                         effect inside the button's own box (see CSS above) */
                      fontWeight: isActive ? 700 : 500,
                      opacity: sectionVisible ? 1 : 0,
                      transitionProperty: "opacity, transform, background, border, box-shadow, color",
                      transitionDuration: "0.4s, 0.25s, 0.25s, 0.25s, 0.25s, 0.25s",
                      transitionDelay: sectionVisible ? `${i * 50}ms` : "0ms",
                    }}
                  >
                    {/* Product icon */}
                    {/* <span className="text-base leading-none flex-shrink-0">{PRODUCT_ICON[p.id]}</span> */}
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Down chevron */}
            <button
              onClick={() => scrollBy(1)}
              className="flex items-center justify-center rounded-lg mt-1 transition-all duration-200"
              style={{ opacity: canScrollDown ? 1 : 0, pointerEvents: canScrollDown ? "auto" : "none", cursor: "pointer" }}
              aria-label="Scroll down"
            >
              <svg className="w-4 h-4" style={{ color: "#26ae90" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={active.heading}
      />
    </>
  );
};

// ── FeatureItem with hover glow ───────────────────────────────────────────────
const FeatureItem = ({
  feat,
  delay,
  visible,
}: {
  feat: Feature;
  delay: number;
  visible: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col gap-2 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-1 shrink-0 transition-all duration-300"
        style={{
          background: hovered ? "rgba(38,174,144,0.25)" : "rgba(38,174,144,0.12)",
          border: hovered ? "1px solid rgba(38,174,144,0.70)" : "1px solid rgba(38,174,144,0.30)",
          boxShadow: hovered ? "0 0 14px rgba(38,174,144,0.35)" : "none",
        }}
      >
        <span style={{ color: "#26ae90" }}>{feat.icon}</span>
      </div>
      <p
        className="font-bold text-sm leading-snug transition-colors duration-200"
        style={{ color: hovered ? "#f2f231" : "#fff" }}
      >
        {feat.title}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>{feat.desc}</p>
    </div>
  );
};

export default ProductDetails;
