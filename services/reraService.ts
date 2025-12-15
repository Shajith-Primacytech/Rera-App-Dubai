import { CalculationResult, RentDetails, RiskLevel } from '../types';

/**
 * Calculates rent increase eligibility based on Dubai Decree No. 43 of 2013.
 * Includes notice period validation and valuation overrides.
 */
export const calculateRentIncrease = (details: RentDetails): CalculationResult => {
  const { currentRent, marketRent, hasValuation, valuationAmount, expiryDate, noticeDate, tenantFlipFlop } = details;

  // 1. Establish Benchmark (Index vs Valuation)
  let benchmarkRent = marketRent;
  let valuationUsed = false;
  
  if (hasValuation && valuationAmount && valuationAmount > 0) {
    benchmarkRent = valuationAmount;
    valuationUsed = true;
  }

  if (!currentRent || !benchmarkRent) {
    return createEmptyResult(currentRent || 0);
  }

  // 2. Calculate RERA Bands
  const difference = benchmarkRent - currentRent;
  const percentageBelowMarket = (difference / benchmarkRent) * 100;

  let increasePercentage = 0;
  let bandReason = "";

  if (percentageBelowMarket <= 10) {
    increasePercentage = 0;
    bandReason = "Rent is within 10% of market value";
  } else if (percentageBelowMarket <= 20) {
    increasePercentage = 5;
    bandReason = "Rent is 11-20% below market value";
  } else if (percentageBelowMarket <= 30) {
    increasePercentage = 10;
    bandReason = "Rent is 21-30% below market value";
  } else if (percentageBelowMarket <= 40) {
    increasePercentage = 15;
    bandReason = "Rent is 31-40% below market value";
  } else {
    increasePercentage = 20;
    bandReason = "Rent is >40% below market value";
  }

  // Negative check
  if (percentageBelowMarket < 0) {
    increasePercentage = 0;
    bandReason = "Current rent is above market value";
  }

  let potentialNewRent = currentRent + (currentRent * (increasePercentage / 100));

  // 3. Validate Notice Period
  let isNoticeValid = true;
  let noticeDays = 90;
  let noticeMessage = "Notice not evaluated (dates missing)";

  if (expiryDate && noticeDate) {
    const start = new Date(noticeDate);
    const end = new Date(expiryDate);
    const diffTime = end.getTime() - start.getTime();
    noticeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (noticeDays < 90) {
      isNoticeValid = false;
      noticeMessage = `Notice was sent ${noticeDays} days before expiry. RERA requires 90 days.`;
    } else {
      isNoticeValid = true;
      noticeMessage = `Notice was sent ${noticeDays} days before expiry (Valid > 90 days).`;
    }
  }

  // 4. Determine Final Eligibility & Risk
  let isEligible = increasePercentage > 0;
  let riskLevel: RiskLevel = 'Low';
  let riskReason = "Standard RERA compliance.";
  let edgeCaseWarning = undefined;

  // Override: If notice invalid, block increase
  if (!isNoticeValid && isEligible) {
    isEligible = false;
    increasePercentage = 0; // Reset for display
    potentialNewRent = currentRent; // Reset
    riskLevel = 'High';
    riskReason = "Invalid notice period usually invalidates any increase.";
    edgeCaseWarning = "Although the market value supports an increase, the 90-day notice requirement was not met.";
  } else if (!isNoticeValid && !isEligible) {
    // Not eligible anyway
    riskReason = "No increase possible due to market rates (and notice was also late).";
  } else if (valuationUsed) {
    riskLevel = 'Medium'; // Valuations can sometimes be challenged
    riskReason = "Valuation certificates are generally stronger than the Index, but disputes can occur.";
  } else if (isEligible && noticeDays < 95) {
     riskLevel = 'Medium'; // Cutting it close
     riskReason = "Notice period is valid but close to the 90-day minimum limit.";
  }

  // Tenant Flip Flop Logic
  if (tenantFlipFlop) {
     edgeCaseWarning = edgeCaseWarning 
        ? `${edgeCaseWarning} Also, tenant changing mind does not reset legal deadlines.`
        : "A tenant changing their decision does not reset rent eligibility. Renewal terms still follow RERA-based limits.";
  }

  // 5. Generate Explanations
  
  // "Why this result happened"
  let whyResult = "";
  if (!isNoticeValid && noticeDate) {
      whyResult = `While your rent is below market value, the rent increase is blocked because the 90-day notice requirement was not met. Notice was served only ${noticeDays} days prior to expiry.`;
  } else if (increasePercentage === 0) {
      if (percentageBelowMarket < 0) {
          whyResult = `Your current rent is higher than the ${valuationUsed ? 'valuation' : 'RERA Index'}. No increase is justified.`;
      } else {
          whyResult = `Your current rent is within 10% of the ${valuationUsed ? 'valuation' : 'RERA Index'}. Under RERA rules, no increase is permitted when the gap is small.`;
      }
  } else {
      whyResult = `Your rent is ${(percentageBelowMarket).toFixed(1)}% below the ${valuationUsed ? 'valuation' : 'RERA Index'}. RERA bands permit a ${increasePercentage}% increase for this gap.`;
  }

  // Plain English Summary
  let plainEnglishSummary = "";
  if (isEligible) {
      plainEnglishSummary = `You can legally raise the rent by ${increasePercentage}%. Ensure you have proof of the notice delivery.`;
  } else {
      if (!isNoticeValid && noticeDate) {
           plainEnglishSummary = "You cannot increase the rent this cycle due to the missed 90-day notice deadline. Renew at the current amount.";
      } else {
           plainEnglishSummary = "You cannot increase the rent this cycle as the current rent is close to or above market value. Renew at the current amount.";
      }
  }

  // RDC Expectation
  let rdcExpectation = "";
  if (valuationUsed) {
      rdcExpectation = "In similar cases, RDC typically favors a valid Valuation Certificate over the general Rental Index.";
  } else if (!isNoticeValid && noticeDate) {
      rdcExpectation = "RDC typically strictly enforces the 90-day notice rule. Late notices are usually rejected if challenged.";
  } else {
      rdcExpectation = "RDC typically relies on the Smart Rental Index calculator for standard disputes.";
  }

  return {
    isEligible,
    increasePercentage: isEligible ? calculateRawIncreasePercent(percentageBelowMarket) : 0, // Show potential %? No, show effective.
    maxIncreaseAmount: potentialNewRent - currentRent,
    newMaxRent: potentialNewRent,
    reason: bandReason,
    whyResult,
    isNoticeValid,
    noticeDays,
    noticeMessage,
    valuationUsed,
    riskLevel,
    riskReason,
    rdcExpectation,
    plainEnglishSummary,
    edgeCaseWarning
  };
};

// Helper to get raw percent without notice blocking for internal logic if needed
const calculateRawIncreasePercent = (percentageBelowMarket: number): number => {
    if (percentageBelowMarket <= 10) return 0;
    if (percentageBelowMarket <= 20) return 5;
    if (percentageBelowMarket <= 30) return 10;
    if (percentageBelowMarket <= 40) return 15;
    return 20;
}

const createEmptyResult = (currentRent: number): CalculationResult => ({
    isEligible: false,
    increasePercentage: 0,
    maxIncreaseAmount: 0,
    newMaxRent: currentRent,
    reason: "Enter details",
    whyResult: "",
    isNoticeValid: true,
    noticeDays: 0,
    noticeMessage: "",
    valuationUsed: false,
    riskLevel: 'Low',
    riskReason: "",
    rdcExpectation: "",
    plainEnglishSummary: "",
});
