import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

/**
 * XML 파일에서 퀘스트 목록을 불러오는 함수
 * - 경로: public/data/quest.xml
 * - fast-xml-parser 사용
 */
export function loadQuests() {
  try {
    const xmlPath = path.join(process.cwd(), "public", "data", "quest.xml");

    if (!fs.existsSync(xmlPath)) {
      console.warn("⚠️ quest.xml 파일을 찾을 수 없습니다.");
      return [];
    }

    const xmlData = fs.readFileSync(xmlPath, "utf-8");
    const parser = new XMLParser();
    const json = parser.parse(xmlData);

    const quests = Array.isArray(json.quests.quest)
      ? json.quests.quest
      : [json.quests.quest];

    return quests.map((q) => ({
      type: q.type,
      label: q.label,
      reward: parseInt(q.reward, 10) || 1,
      category: q.category || "misc",
    }));
  } catch (error) {
    console.error("loadQuests() 오류:", error);
    return [];
  }
}
