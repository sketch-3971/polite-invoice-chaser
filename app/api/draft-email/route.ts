import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, tone } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderEmail = user.email || "";

    // 1. Smartly derive the sender's name
    let senderName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (!senderName && senderEmail) {
      // Fallback: capitalize the part of the email before the @ symbol
      const emailPrefix = senderEmail.split('@')[0];
      senderName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    senderName = senderName || "Your Name";

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

    // Calculate the US Standard 1.5% monthly late fee
    const lateFeeAmount = (Number(invoice.amount) * 0.015).toFixed(2);

    let toneInstruction = "professional and polite";
    let nicheContext = "Do not mention any late fees.";

    if (tone === "gentle") {
      toneInstruction = "friendly, gentle, and accommodating (assuming they just forgot).";
      nicheContext = "Do not mention any late fees.";
    } else if (tone === "standard") {
      toneInstruction = "clear, professional, and standard polite.";
      if (daysLate > 0) {
        nicheContext = `Remind them gently that standard US freelance contracts include a 1.5% monthly late fee ($${lateFeeAmount}), but explicitly state that you are waiving it as a courtesy if they pay this week.`;
      }
    } else if (tone === "firm") {
      toneInstruction = "strict, firm, and urgent (treating this as a final notice).";
      if (daysLate > 0) {
        nicheContext = `State clearly that a standard 1.5% monthly late fee ($${lateFeeAmount}) has now been triggered per US freelance contract terms. Ask for the new total of $${(Number(invoice.amount) + Number(lateFeeAmount)).toFixed(2)} immediately to avoid further penalties.`;
      }
    }

    // 2. Inject the dynamically generated senderName into the prompt
    const prompt = `You are a professional assistant managing billing for a US-based freelancer. 
    Draft a short, polite email to a client named ${invoice.client_name}. 
    They originally owed $${invoice.amount}. This invoice is ${daysLate > 0 ? daysLate + ' days overdue' : 'due soon'}.
    
    TONE: ${toneInstruction}
    LATE FEE RULES: ${nicheContext}
    
    Sign off the email professionally with the name "${senderName}". Do not use placeholder brackets like [Your Name]. Mention they can reply directly to ${senderEmail} with questions.

    Output your response in JSON format with exactly two keys: "subject" and "body".`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
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