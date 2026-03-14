import { useState } from 'react';

const SYSTEM_PROMPT = `You are a 'Humanitarian Medical Triage Assistant' operating in East Africa. Your role is to calmly and empathetically assist individuals seeking medical guidance. 

Crucial instructions:
1. You MUST ask only ONE probing question at a time to avoid overwhelming the user.
2. You MUST actively look for and prioritize 'Red Flags' such as:
   - Difficulty breathing
   - Heavy/uncontrollable bleeding
   - Loss of consciousness
   - Severe chest pain
3. If red flags are detected, immediately advise seeking emergency medical help or a local clinic.
4. Keep your responses concise, clear, and culturally sensitive to the East African context.
5. JSON MODE CONCLUSION: Once you have gathered enough information to make an assessment or if a 'Red Flag' is identified, you MUST conclude the triage by returning ONLY a valid JSON object. Do NOT wrap it in markdown. The JSON must exactly match this format:
{
  "isConcluded": true,
  "urgencyLevel": "high", // or "medium", "low"
  "advice": "Summary of your final advice"
}
Do NOT return this JSON until you are ready to conclude the assessment.
6. DO NOT explain that you are a text-based assistant. Simply output the JSON object as your final message.`;

export const useGroqTriage = () => {
    const [messages, setMessages] = useState([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'assistant', content: 'Habari. I am the triage assistant. Please tell me, what is your main symptom or reason for contacting us today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [triageConclusion, setTriageConclusion] = useState(null); // Will hold the parsed JSON

    const sendMessage = async (userText) => {
        if (!userText.trim()) return;

        const newUserMessage = { role: 'user', content: userText };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: updatedMessages,
                    temperature: 0.3, // Lower temperature to encourage strict JSON when requested
                    max_tokens: 300,
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantRawContent = data.choices[0].message.content;

            // Check if it's a JSON response (Conclusion)
            try {
                // Use a Regex to extract the JSON object in case the AI added formatting like markdown tags or prefixes
                const jsonMatch = assistantRawContent.match(/\{[\s\S]*"isConcluded"[\s\S]*\}/);
                
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    
                    if (parsed.isConcluded) {
                        setTriageConclusion(parsed); // Explicit state trigger for UI

                        // Add a friendly termination message to the chat view
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: "Thank you for the information. I have generated a triage instruction card for you below."
                        }]);
                        return; // Prevent raw JSON from reaching chat bubbles
                    }
                }
            } catch (e) {
                // Not JSON or parsing failed, continue as normal chat
            }

            const assistantReply = data.choices[0].message;
            setMessages(prev => [...prev, assistantReply]);

        } catch (err) {
            console.error("Groq API Error:", err);
            setError("I'm sorry, there was an issue communicating with the triage system. Please try again or seek immediate help if it's an emergency.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetTriage = () => {
        setMessages([
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'assistant', content: 'Habari. I am the triage assistant. Please tell me, what is your main symptom or reason for contacting us today?' }
        ]);
        setTriageConclusion(null);
        setError(null);
    };

    return {
        messages: messages.filter(m => m.role !== 'system'), // hide system prompt from UI
        isLoading,
        error,
        triageConclusion,
        sendMessage,
        resetTriage
    };
};
