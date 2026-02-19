export const generateAIExplanation = (fieldId, answer, customerName) => {
  const customer = customerName || 'the customer';
  const explanations = {
    partnerCollision: {
      yes: `No partner conflicts found. Checked AX system - no active Kundenschutz or SubLAR agreements exist for ${customer}.`,
      partial: `Potential overlap detected with ${customer} in adjacent service area. Recommend verification with Partner Management.`,
      no: `Partner conflict identified. Active SubLAR agreement exists for ${customer}. Escalation required.`,
      unknown: `Unable to verify partner status for ${customer}. Manual check recommended.`
    },
    customerNotCompetitor: {
      yes: `${customer} operates in non-competing sector. Company classification: End Customer.`,
      partial: `${customer} has IT consulting subsidiary with some overlapping services.`,
      no: `${customer} identified as competitor in DACH region.`,
      unknown: `Insufficient data to classify ${customer}.`
    },
    notPseudoTender: {
      yes: `RFP analysis shows balanced requirements. Timeline reasonable. Open competitive process likely.`,
      partial: `Some concerning indicators: Very specific requirements match one vendor profile.`,
      no: `High pseudo-tender risk. Vendor-specific terminology and unrealistic timeline detected.`,
      unknown: `Insufficient information to assess. Recommend customer conversation.`
    },
    portfolioAlignment: {
      yes: `Requirements map 95% to existing service catalog. Core services all standard offerings.`,
      partial: `70% alignment. Gap identified in specialized integration requirements.`,
      no: `Low portfolio fit. Customer requires services outside SWO scope.`,
      unknown: `RFP requirements unclear. Recommend clarification workshop.`
    },
    certificationsObtainable: {
      yes: `All required certifications available. ISO 27001 company certification valid.`,
      partial: `Most certifications covered. Gap in specialized certification - in process.`,
      no: `Critical certification gap. Required certification upgrade timeline: 6+ months.`,
      unknown: `Certification requirements not fully specified. Recommend clarification.`
    },
    referencesAvailable: {
      yes: `Matching references found: 3 projects in same industry, similar scope, completed within 24 months.`,
      partial: `Partial match. Found 2 relevant references but customer requires 3.`,
      no: `Reference gap. No matching projects in database for customer requirements.`,
      unknown: `Reference requirements need clarification.`
    },
    noWorkerLeasing: {
      yes: `No ANÜ indicators found. Project structure based on work packages - compliant.`,
      partial: `Borderline clauses detected. Recommend legal review for Werkvertrag compliance.`,
      no: `ANÜ risk identified. RFP requires "staff augmentation" - classic ANÜ indicators.`,
      unknown: `Contract model unclear. Legal review recommended.`
    },
    contractTermsAcceptable: {
      yes: `Contract terms reviewed. Standard liability caps, reasonable SLA penalties.`,
      partial: `Most terms acceptable. Penalty clause exceeds standard thresholds - negotiation needed.`,
      no: `Unacceptable terms. Unlimited liability and non-compete outside risk appetite.`,
      unknown: `Contract terms not yet available.`
    },
    involvedInTenderCreation: {
      yes: `Active involvement confirmed. Multiple workshops held. Strong incumbent position.`,
      partial: `Limited involvement. Participated in information session only.`,
      no: `No prior involvement. RFP received cold via procurement portal.`,
      unknown: `Checking with account team for historical engagement records.`
    },
    existingContract: {
      yes: `Active contract found. Current agreement valid with relationship since 2019.`,
      partial: `Historical contract only. Previous engagement ended 18 months ago.`,
      no: `No contract history. ${customer} is a new prospect.`,
      unknown: `CRM data incomplete. Account team to verify.`
    },
    existingServiceCustomer: {
      yes: `Active services customer. Currently delivering professional services. High satisfaction.`,
      partial: `Software customer only. No professional services engagement to date.`,
      no: `No existing services. ${customer} not in current customer base.`,
      unknown: `Service delivery status to be confirmed.`
    },
    strongRelationship: {
      yes: `Strong relationships at multiple levels. Regular executive contact. High NPS score.`,
      partial: `Relationship at operational level only. No executive sponsorship established.`,
      no: `Limited relationship. Only transactional contact through procurement.`,
      unknown: `Relationship strength to be assessed.`
    },
    decisionMakersKnown: {
      yes: `Buying center mapped. Decision maker and influencers identified. All contacts in CRM.`,
      partial: `Partial visibility. Know operational contacts. Decision maker level unclear.`,
      no: `Buying center unknown. RFP received through portal with no named contacts.`,
      unknown: `Stakeholder mapping incomplete.`
    },
    noCompetitorFramework: {
      yes: `No competitor frameworks identified. Open market.`,
      partial: `Partial competitor presence in adjacent service areas.`,
      no: `Competitor framework exists. Strategic agreement covering IT services.`,
      unknown: `Competitor landscape unclear.`
    },
    positiveWinHistory: {
      yes: `Strong track record. Won 4 of last 5 competitive situations.`,
      partial: `Mixed history. Won 2, lost 2 in past engagements.`,
      no: `Poor win history. Lost last 3 bids. Primary reasons: price and relationships.`,
      unknown: `No historical bid data available.`
    },
    technicalExpertise: {
      yes: `Full expertise coverage. Skills matrix shows all required competencies available.`,
      partial: `Core expertise available. Gap in specialized area - can upskill or subcontract.`,
      no: `Significant expertise gap. Required skills not a current competency area.`,
      unknown: `Skills requirements to be mapped against RFP.`
    },
    resourceCapacity: {
      yes: `Capacity available. Resource planner shows consultants available with buffer.`,
      partial: `Tight capacity. Can staff core team but bench is limited.`,
      no: `Capacity constraint. Required resources not available until Q3.`,
      unknown: `Capacity check pending.`
    },
    requirementsDeliverable: {
      yes: `All RFP requirements analyzed. 100% coverage with standard offerings.`,
      partial: `89% requirements coverage. Gaps identified with mitigation possible.`,
      no: `Critical gaps. Cannot meet core requirements.`,
      unknown: `Requirements analysis in progress.`
    },
    profilesAvailable: {
      yes: `All requested profiles available. CVs ready for submission.`,
      partial: `Most profiles covered. Need to source 1 specialist externally.`,
      no: `Profile gap. Language or qualification requirements not fully met.`,
      unknown: `Profile requirements to be matched.`
    },
    provenSolution: {
      yes: `Proven solution. Delivered 12 similar projects. Reusable assets available.`,
      partial: `Mostly proven. Core solution delivered, but customer-specific integration is new.`,
      no: `First of a kind (FOAK). Higher risk and learning curve expected.`,
      unknown: `Solution novelty to be assessed.`
    },
    risksAssessed: {
      yes: `Risk assessment complete. RAID log created with mitigation plans.`,
      partial: `Initial risk assessment done. Mitigation plans not yet developed.`,
      no: `Risk assessment pending.`,
      unknown: `Risk assessment to be completed.`
    },
    pricingAboveFloor: {
      yes: `Pricing validated. All day rates above minimum floor.`,
      partial: `Most rates acceptable. Junior rate at floor level - limited margin.`,
      no: `Below floor. Customer budget implies rates below minimum.`,
      unknown: `Pricing validation pending.`
    },
    marginAchievable: {
      yes: `Target margin achievable. Calculated MaS above target with buffer.`,
      partial: `Margin at target level. Minimal buffer for negotiation.`,
      no: `Below margin target. Would require scope reduction or price increase.`,
      unknown: `Margin calculation pending.`
    },
    customerBudgetExists: {
      yes: `Budget confirmed. Customer indicated allocation aligning with estimate.`,
      partial: `Budget indicated but not formally confirmed.`,
      no: `No budget. Customer in early exploration phase.`,
      unknown: `Budget status unknown.`
    },
    customerCreditworthy: {
      yes: `Credit check passed. Rating "very good". Stable financials.`,
      partial: `Moderate credit. Recommend milestone-based invoicing.`,
      no: `Credit concern. Recommend upfront payment or bank guarantee.`,
      unknown: `Credit check pending.`
    },
    dealRegPossible: {
      yes: `Deal registration confirmed with relevant vendors. Discounts secured.`,
      partial: `Partial registration. Some vendors declined.`,
      no: `Registration blocked. Competitor has existing registration.`,
      unknown: `Deal registration status to be checked.`
    },
    alignsWithVision: {
      yes: `Strong strategic fit. Project supports key pillars of SWO strategy.`,
      partial: `Partial alignment. Core services fit but legacy component not in focus.`,
      no: `Limited strategic value. Not aligned with value-add strategy.`,
      unknown: `Strategic alignment to be assessed.`
    },
    targetSegment: {
      yes: `Target segment confirmed. Core focus segment for DACH.`,
      partial: `Adjacent segment. Secondary focus, not primary target.`,
      no: `Non-focus segment. Not in current strategic focus.`,
      unknown: `Segment classification to be verified.`
    },
    replicableSolution: {
      yes: `High replication potential. Solution applicable to 15+ customers.`,
      partial: `Some replication possible. Significant customization needed per customer.`,
      no: `One-off solution. No replication potential.`,
      unknown: `Replication potential to be assessed.`
    },
    effortJustified: {
      yes: `Effort justified. Strong ROI on proposal investment.`,
      partial: `Borderline justification. Consider lighter proposal approach.`,
      no: `Effort not justified. Expected value below proposal cost.`,
      unknown: `ROI calculation pending.`
    },
    deadlineAchievable: {
      yes: `Timeline achievable. Team availability confirmed with buffer.`,
      partial: `Tight but possible. Requires prioritization.`,
      no: `Timeline not achievable. Quality would be compromised.`,
      unknown: `Timeline feasibility depends on scope clarification.`
    },
    teamCapacityExists: {
      yes: `Team capacity available. Bid team assigned.`,
      partial: `Limited capacity. Team stretched across active bids.`,
      no: `No capacity. Would need to deprioritize other bids.`,
      unknown: `Capacity check pending.`
    },
    informationComplete: {
      yes: `Information complete. All RFP documents received. Ready to proceed.`,
      partial: `Mostly complete. Pricing template and evaluation criteria pending.`,
      no: `Information gaps. Cannot proceed without missing details.`,
      unknown: `Completeness check in progress.`
    }
  };

  const fieldExplanations = explanations[fieldId];
  if (fieldExplanations && fieldExplanations[answer]) {
    return fieldExplanations[answer];
  }
  return `AI analysis pending for this criterion.`;
};
