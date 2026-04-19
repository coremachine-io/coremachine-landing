interface NotifyOptions {
  title: string;
  content: string;
  chatId?: string;
}

export async function notifyOwner(options: NotifyOptions): Promise<boolean> {
  const { title, content, chatId } = options;
  
  // Console log always
  console.log("=".repeat(60));
  console.log(`📢 NOTIFICATION: ${title}`);
  console.log("-".repeat(60));
  console.log(content);
  console.log("=".repeat(60));

  // Send Telegram if token available
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !targetChatId) {
    console.log("⚠️ Telegram: Missing bot token or chat ID");
    return false;
  }

  try {
    const message = `*${title}*\n\n${content}`;
    const encodedMessage = encodeURIComponent(message);
    
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${targetChatId}&text=${encodedMessage}&parse_mode=Markdown`,
      { method: "GET" }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`⚠️ Telegram send failed: ${errorText}`);
      return false;
    }

    console.log("✅ Telegram notification sent");
    return true;
  } catch (error) {
    console.error("⚠️ Telegram notification error:", error);
    return false;
  }
}
