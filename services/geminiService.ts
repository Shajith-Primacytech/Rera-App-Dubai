import { GoogleGenAI, Type } from "@google/genai";
import { AiAdvice, RentDetails, CalculationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiAdvice = async (
  details: RentDetails,
  result: CalculationResult
): Promise<AiAdvice> => {
  
  const prompt = `
    You are a Dubai Real Estate expert (RDC context).
    
    Landlord Situation:
    - Unit: ${details.bedrooms} ${details.unitType} in ${details.area}
    - Current Rent: AED ${details.currentRent}
    - Benchmark Rent: AED ${details.hasValuation ? details.valuationAmount : details.marketRent} (Source: ${details.hasValuation ? 'Official Valuation' : 'RERA Index'})
    - Notice Sent: ${result.noticeDays} days before expiry (Valid: ${result.isNoticeValid})
    - Tenant Issue: ${details.tenantFlipFlop ? "Tenant initially declined then requested renewal" : "None"}
    
    Calculated Outcome:
    - Eligible for Increase: ${result.isEligible}
    - Allowed Increase: ${result.increasePercentage}%
    - Risk Level: ${result.riskLevel} (${result.riskReason})
    
    Task:
    Provide 3 concise, calm, and neutral "Recommended Next Steps" for the landlord.
    If the notice is invalid, advise to renew at current rent.
    If high risk, advise caution.
    Provide 1 short sentence "Market Context" about demand in ${details.area}.

    Constraint: Do NOT give legal guarantees. Use phrases like "Consider...", "Typically...", "It is recommended to...".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            marketContext: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAdvice;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return {
      nextSteps: [
        result.isEligible ? "Proceed with the renewal contract reflecting the increase." : "Renew at the current rental amount.",
        "Ensure all communications with the tenant are documented.",
        "If a dispute arises, file an 'Offer and Deposit' with the RDC."
      ],
      marketContext: "Dubai's rental market remains active; verify specific community trends."
    };
  }
};

export const estimateMarketRent = async (area: string, unitType: string, bedrooms: string): Promise<number | null> => {
  const prompt = `
    Estimate the current average annual market rent (RERA Index) for a ${bedrooms} ${unitType} in ${area}, Dubai.
    Return ONLY a single number representing the average annual rent in AED. 
    Do not give a range, just a conservative average integer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             estimatedRent: { type: Type.NUMBER }
           }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data.estimatedRent || null;
  } catch (error) {
    console.error("Estimation Error:", error);
    return null;
  }
};
