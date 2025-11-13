import fs from "fs";
import path from "path";
import xml2js from "xml2js";

const QUEST_XML_PATH = path.join(process.cwd(), "public", "data", "quest.xml");

export async function loadQuests() {
  try {
    const xml = fs.readFileSync(QUEST_XML_PATH, "utf-8");
    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(xml);

    const quests =
      parsed?.quests?.quest?.map((q) => ({
        type: q.type?.[0] || "unknown",
        label: q.label?.[0] || "이름없는 미션",
        reward: Number(q.reward?.[0] || 1),
        category: q.category?.[0] || "daily",
      })) || [];

    return quests;
  } catch (err) {
    return [];
  }
}
