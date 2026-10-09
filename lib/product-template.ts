export type ProductFaq = { question: string; answer: string };

export const standardProductFactoryImages = [
  { title: "Production process", description: "Reference overview of BOHOL production and quality-control stages.", image: "/uploads/products/factory/production-process-overview.png", fit: "contain" as const },
  { title: "Factory production", description: "Assembly, wiring, testing and finished-machine preparation in the factory.", image: "/uploads/products/factory/factory-production-process.png", fit: "cover" as const },
  { title: "Payment integration reference", description: "Payment-method examples for project discussion; final availability depends on market and provider approval.", image: "/uploads/products/factory/payment-methods-reference.png", fit: "contain" as const },
] as const;

export const standardProductFaq: readonly ProductFaq[] = [
  { question: "What products can this vending machine sell?", answer: "Product fit depends on the machine's dimensions, weight, packaging, storage requirements and delivery method. Share product samples or measurements so BOHOL can review the configuration." },
  { question: "Can BOHOL customize the cabinet and branding?", answer: "BOHOL can discuss cabinet finish, graphics, dispensing channels, touchscreen layout, languages and OEM/ODM requirements. The approved drawing and specification define the final scope." },
  { question: "Which payment methods can be integrated?", answer: "Card, mobile, QR, cash and other payment options can be reviewed for the target market. Merchant onboarding, network access and processing approval must be confirmed with the selected provider." },
  { question: "What information is needed for a quotation?", answer: "Please provide the target country, product list and dimensions, installation setting, payment preference, branding requirements, quantity, connectivity and any compliance needs." },
  { question: "What is the minimum order quantity?", answer: "MOQ is project-based and is confirmed after BOHOL reviews the product fit, customization scope, testing plan and production requirements." },
  { question: "How long does production take?", answer: "Lead time is confirmed after product fit, drawings, payment configuration, quantity and approval milestones are agreed. Ask BOHOL for a schedule based on your project brief." },
  { question: "Can the machine be configured for our country?", answer: "Voltage, plug, language, connectivity and payment requirements can be reviewed for the target market. Any local approvals or permits remain the buyer's responsibility." },
  { question: "How are machines tested before shipment?", answer: "The agreed acceptance plan can cover product fit, dispensing, payment, electrical functions, cooling where relevant, software behavior, run testing, packing and final inspection." },
  { question: "Does BOHOL support OEM and ODM projects?", answer: "Yes, OEM and ODM discussions can cover cabinet styling, channels, user interface, branding, payment placement and production requirements, subject to an approved specification." },
  { question: "How do we start a BOHOL project?", answer: "Send your product information, target market, site or use case, payment preference, branding needs and quantity through the BOHOL enquiry form for a project review." },
];

export function getProductFaq(productFaq?: readonly ProductFaq[]): ProductFaq[] {
  const seen = new Set<string>();
  return [...(productFaq ?? []), ...standardProductFaq].filter((item) => {
    const key = item.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
