interface NotifyOptions { title: string; content: string; }

export async function notifyOwner(options: NotifyOptions): Promise<boolean> {
  const { title, content } = options;
  console.log("=".repeat(60));
  console.log(`📢 NOTIFICATION: ${title}`);
  console.log("-".repeat(60));
  console.log(content);
  console.log("=".repeat(60));
  return true;
}
