import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const allowedCategories = [
  "Food",
  "Grocery",
  "Rent",
  "Shopping",
  "Transport",
  "Utilities",
  "Entertainment",
  "Medical",
  "Other"
];

export const parseExpenseWithAI = async (rawText:string) => {

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
            Extract expense data from the bill text.

            IMPORTANT RULES:
            - Return ONLY ONE JSON object.
            - Do NOT return arrays.
            - Do NOT return multiple amounts.
            - Extract ONLY the FINAL TOTAL PAYABLE AMOUNT.
            - Ignore line items, subtotal, taxes, GST.
            - If multiple totals appear, choose the largest final payable total and if that no given then do the sum.

            CATEGORY CLASSIFICATION RULES:
            - Amazon, Flipkart, Myntra, online retail → Shopping
            - Restaurants, cafes, Swiggy, Zomato → Food
            - Supermarket, grocery store → Grocery
            - Hospital, pharmacy, medical store → Medical
            - Electricity, water, gas bills → Utilities
            - Uber, Ola, fuel, petrol → Transport
            - Movie, Netflix, games → Entertainment
            - Rent payments → Rent
            - If unsure → Other
            Currency Rules:
            - If currency not given assume INR.
            - If currency is not INR, convert the amount to INR.
            - Use approximate conversion:
                GBP → multiply by 123
                EUR → multiply by 107
                USD → multiply by 90
            - Return final amount in INR only (number, no symbol).

            Date Rules: 
            - Based on the currency deduce if the country shares same date format as India if not then convert in Indian date format. 

            Return ONLY valid JSON nothing other than that,NO TEXT NO CALCULATION NOTHING OTHER THAN JSON.
            Format:
            {
              "amount": number,
              "category": "Food | Grocery | Rent | Shopping | Transport | Utilities | Entertainment | Medical | Other",
              "date": "day month year"
            }

            If date not found, use today's date.
          `
        },
        {
          role: "user",
          content: rawText
        }
      ]
    });

    let response = completion.choices[0].message.content!;
    
    if(!response){
      throw new Error("groq API no response");
    }

    response = response?.replace(/```json|```/g, "").trim();
  
    const parsed = JSON.parse(response);
  
    if (!allowedCategories.includes(parsed.category)) {
      parsed.category = "Other";
    }
  
    return parsed;
  } catch (error) {
    console.error("Error using groq API.",error);
  }
};
