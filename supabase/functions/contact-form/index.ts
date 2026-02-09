
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Declare Deno to avoid TypeScript errors in environments without Deno types
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, subject, message } = await req.json()

    // Validate inputs
    if (!name || !email || !message) {
        throw new Error("Missing required fields");
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
        throw new Error("Telegram configuration missing on server");
    }

    // Construct the message for Telegram
    const text = `
📩 *New Contact Message*
------------------------
👤 *Name:* ${name}
📧 *Email:* ${email}
📝 *Subject:* ${subject || 'No Subject'}
------------------------
💬 *Message:*
${message}
    `;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Telegram API Error: ${errorData}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
