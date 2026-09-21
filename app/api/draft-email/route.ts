import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Extract the selected tone from the request body alongside the invoiceId
    const { invoiceId, tone } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Securely fetch the logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderEmail = user.email;

    // Fetch the invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const dueDate = new Date(invoice.due_date);
    const daysLate = Math.ceil((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    // 2. Map the user's selected tone to highly specific LLM instructions
    let toneInstruction = "professional and polite";
    if (tone === "gentle") {
      toneInstruction = "friendly, gentle, and accommodating (assuming they just forgot or missed the email)";
    } else if (tone === "standard") {
      toneInstruction = "clear, professional, and standard polite";
    } else if (tone === "firm") {
      toneInstruction = "strict, firm, and urgent (treating this as a final notice)";
    }

    // 3. Inject the toneInstruction into the prompt
    const prompt = `You are a professional assistant managing billing. 
    Draft a short, polite email to a client named ${invoice.client_name}. 
    They owe $${invoice.amount}. This invoice is ${daysLate > 0 ? daysLate + ' days overdue' : 'due soon'}.
    The tone MUST be ${toneInstruction}. 
    
    Sign off the email professionally. Mention they can reply directly to ${senderEmail} with questions. 
    Leave a placeholder "[Your Name]" at the bottom.

    Output your response in JSON format with exactly two keys: "subject" and "body".`;

    // Fetch directly from Groq's lightning-fast API
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // <-- This is the only line that changed
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);

    const data = await res.json();
    const draftedEmail = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ 
      subject: draftedEmail.subject, 
      body: draftedEmail.body 
    });
    
  } catch (error) {
    console.error("Error generating email:", error);
    return NextResponse.json({ error: "Failed to generate email." }, { status: 500 });
  }
}