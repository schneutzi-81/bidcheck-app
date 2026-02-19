export const CATEGORY_WEIGHTS = {
  exclusion: 0,
  winProbability: 0.30,
  deliveryCapability: 0.25,
  commercialViability: 0.20,
  strategicAlignment: 0.15,
  proposalFeasibility: 0.10
};

export const FIELDS = {
  exclusion: [
    { id: 'partnerCollision', label: 'No Partner Collision', description: 'No conflict with existing partner agreements (Kundenschutz, SubLAR)?', owner: 'Sales', aiSource: 'CRM/Contract DB', aiPotential: 'high' },
    { id: 'customerNotCompetitor', label: 'Customer is Not a Competitor', description: 'Customer does not compete with SWO services?', owner: 'Sales', aiSource: 'Market Intelligence', aiPotential: 'high' },
    { id: 'notPseudoTender', label: 'Not a Pseudo Tender', description: 'No indication that winner is already pre-selected?', owner: 'Sales', aiSource: 'RFP Analysis', aiPotential: 'medium' },
    { id: 'portfolioAlignment', label: 'Portfolio Alignment', description: 'Request fits within SWO service portfolio?', owner: 'Presales', aiSource: 'Service Catalog', aiPotential: 'high' },
    { id: 'certificationsObtainable', label: 'Certifications Obtainable', description: 'All required certifications are available or obtainable?', owner: 'Delivery', aiSource: 'HR/Cert Database', aiPotential: 'high' },
    { id: 'referencesAvailable', label: 'References Available', description: 'Required references can be provided?', owner: 'Delivery', aiSource: 'Project Database', aiPotential: 'high' },
    { id: 'noWorkerLeasing', label: 'No ANÜ Requirement', description: 'No illegal worker leasing (Arbeitnehmerüberlassung) required?', owner: 'Legal', aiSource: 'RFP NLP Scan', aiPotential: 'high' },
    { id: 'contractTermsAcceptable', label: 'Contract Terms Acceptable', description: 'No unacceptable contract terms or unlimited liability?', owner: 'Legal', aiSource: 'Contract AI', aiPotential: 'high' },
  ],
  winProbability: [
    { id: 'involvedInTenderCreation', label: 'Involved in Tender Creation', description: 'SWO was involved in shaping the RFP requirements?', owner: 'Sales', aiSource: 'Meeting History', aiPotential: 'high', weight: 3 },
    { id: 'existingContract', label: 'Existing Contract', description: 'Current active contract relationship exists?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'existingServiceCustomer', label: 'Existing Service Customer', description: 'Already delivering professional services?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'strongRelationship', label: 'Strong Relationship', description: 'Good quality relationship with customer stakeholders?', owner: 'Sales', aiSource: 'CRM Score', aiPotential: 'medium', weight: 2 },
    { id: 'decisionMakersKnown', label: 'Decision Makers Known', description: 'Key decision makers and buying center identified?', owner: 'Sales', aiSource: 'CRM', aiPotential: 'high', weight: 2 },
    { id: 'noCompetitorFramework', label: 'No Competitor Advantage', description: 'Competitors have no existing framework agreement?', owner: 'Sales', aiSource: 'Intel', aiPotential: 'medium', weight: 2 },
    { id: 'positiveWinHistory', label: 'Positive Win History', description: 'Good track record in previous tenders with this customer?', owner: 'Sales', aiSource: 'CRM Analytics', aiPotential: 'high', weight: 2 },
  ],
  deliveryCapability: [
    { id: 'technicalExpertise', label: 'Technical Expertise Available', description: 'Required technical know-how exists in the organization?', owner: 'Delivery', aiSource: 'Skills Matrix', aiPotential: 'high', weight: 3 },
    { id: 'resourceCapacity', label: 'Resource Capacity Available', description: 'Sufficient capacity for project delivery?', owner: 'Delivery', aiSource: 'Resource Planner', aiPotential: 'high', weight: 3 },
    { id: 'requirementsDeliverable', label: 'All Requirements Deliverable', description: 'Can meet all stated service requirements?', owner: 'Delivery', aiSource: 'RFP Matching', aiPotential: 'high', weight: 3 },
    { id: 'profilesAvailable', label: 'CVs/Profiles Available', description: 'Required consultant profiles can be provided?', owner: 'Delivery', aiSource: 'HR System', aiPotential: 'high', weight: 2 },
    { id: 'provenSolution', label: 'Proven Solution', description: 'Not a first-of-a-kind (FOAK) service?', owner: 'Delivery', aiSource: 'Service Catalog', aiPotential: 'high', weight: 2 },
    { id: 'risksAssessed', label: 'Risks Assessed', description: 'Delivery risks identified and evaluated?', owner: 'Presales', aiSource: 'RAID Template', aiPotential: 'high', weight: 2 },
  ],
  commercialViability: [
    { id: 'pricingAboveFloor', label: 'Pricing Above Floor', description: 'Day rates exceed minimum price list or approved?', owner: 'Finance', aiSource: 'Price List', aiPotential: 'high', weight: 3 },
    { id: 'marginAchievable', label: 'Target Margin Achievable', description: 'Can achieve required margin targets?', owner: 'Finance', aiSource: 'Cost Model', aiPotential: 'high', weight: 3 },
    { id: 'customerBudgetExists', label: 'Customer Budget Exists', description: 'Customer has confirmed or indicated budget?', owner: 'Sales', aiSource: 'Customer Intel', aiPotential: 'medium', weight: 2 },
    { id: 'customerCreditworthy', label: 'Customer Creditworthy', description: 'Customer financial health is acceptable?', owner: 'Finance', aiSource: 'Credit API', aiPotential: 'high', weight: 2 },
    { id: 'dealRegPossible', label: 'Deal Registration Possible', description: 'Can register deal with relevant vendors?', owner: 'Sales', aiSource: 'Partner Portals', aiPotential: 'high', weight: 1 },
  ],
  strategicAlignment: [
    { id: 'alignsWithVision', label: 'Aligns with SWO Vision', description: 'Fits strategic direction and target operating model?', owner: 'Sales Leader', aiSource: 'Strategy Docs', aiPotential: 'medium', weight: 3 },
    { id: 'targetSegment', label: 'Target Customer Segment', description: 'Customer is in focus segment?', owner: 'Sales', aiSource: 'Strategy', aiPotential: 'high', weight: 2 },
    { id: 'replicableSolution', label: 'Replicable/Multiplier Potential', description: 'Solution can be replicated for other customers?', owner: 'Presales', aiSource: 'Pattern Analysis', aiPotential: 'medium', weight: 2 },
  ],
  proposalFeasibility: [
    { id: 'effortJustified', label: 'Proposal Effort Justified', description: 'Investment in proposal preparation is justified?', owner: 'Presales', aiSource: 'Historical Benchmarks', aiPotential: 'medium', weight: 2 },
    { id: 'deadlineAchievable', label: 'Deadline Achievable', description: 'Can meet submission deadline with quality?', owner: 'Presales', aiSource: 'Workload Analysis', aiPotential: 'high', weight: 3 },
    { id: 'teamCapacityExists', label: 'Team Capacity Exists', description: 'Bid team has bandwidth for proposal work?', owner: 'Presales', aiSource: 'Resource Calendar', aiPotential: 'high', weight: 2 },
    { id: 'informationComplete', label: 'Information Complete', description: 'All required information is available?', owner: 'Presales', aiSource: 'Checklist AI', aiPotential: 'high', weight: 2 },
  ]
};

export const ANSWER_OPTIONS = [
  { value: 'yes', label: 'Yes', score: 1, color: 'emerald' },
  { value: 'partial', label: 'Partial', score: 0.5, color: 'amber' },
  { value: 'no', label: 'No', score: 0, color: 'rose' },
  { value: 'unknown', label: 'Unknown', score: 0.25, color: 'slate' },
];

export const OWNERS = ['All', 'Sales', 'Presales', 'Delivery', 'Finance', 'Legal', 'Sales Leader'];

export const CATEGORY_CONFIG = {
  exclusion: { label: 'Exclusion Criteria', color: 'rose', description: 'Any "No" = Automatic NO-GO' },
  winProbability: { label: 'Win Probability', color: 'blue', description: '30% weight' },
  deliveryCapability: { label: 'Delivery Capability', color: 'purple', description: '25% weight' },
  commercialViability: { label: 'Commercial Viability', color: 'emerald', description: '20% weight' },
  strategicAlignment: { label: 'Strategic Alignment', color: 'amber', description: '15% weight' },
  proposalFeasibility: { label: 'Proposal Feasibility', color: 'cyan', description: '10% weight' }
};
