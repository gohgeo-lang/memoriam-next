import fs from "fs";
import path from "path";
import xml2js from "xml2js";

const QUEST_XML_PATH = path.join(process.cwd(), "public", "data", "quest.xml");

const SYSTEM_QUESTS = [
  { type: "remember_post", label: "게시글에 추모 남기기", reward: 1 },
  { type: "upload_photo", label: "가족 사진 업로드하기", reward: 1 },
  { type: "register_family", label: "가족 등록하기", reward: 1 },
];

export async function loadQuests() {
  try {
    const xml = fs.readFileSync(QUEST_XML_PATH, "utf-8");

    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(xml);

    const questsFromXml =
      parsed?.quests?.quest?.map((q) => ({
        type: q.type?.[0] || "unknown",
        label: q.label?.[0] || "이름없는 미션",
        reward: Number(q.reward?.[0] || 1),
        category: q.category?.[0] || "daily",
      })) || [];

    const uniqueSystemQuests = SYSTEM_QUESTS.filter(
      (sys) => !questsFromXml.some((xmlQ) => xmlQ.type === sys.type)
    );

    return [...questsFromXml, ...uniqueSystemQuests];
  } catch (err) {
    console.error("loadQuests() 실패:", err);
    return SYSTEM_QUESTS;
  }
}
