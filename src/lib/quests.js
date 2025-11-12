export async function markQuestComplete(type) {
  try {
    await fetch("/api/quests/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    console.log(`[퀘스트 완료] ${type}`);
  } catch (err) {
    console.error("퀘스트 완료 실패:", err);
  }
}
