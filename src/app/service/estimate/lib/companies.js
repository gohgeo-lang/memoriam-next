import proj4 from "proj4";

proj4.defs(
  "EPSG:5174",
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
);

function getDistance(userLat, userLon, x5174, y5174) {
  // 좌표 유효성 검사
  if (
    !isFinite(userLat) ||
    !isFinite(userLon) ||
    !isFinite(x5174) ||
    !isFinite(y5174)
  ) {
    console.warn("⚠️ getDistance: 잘못된 좌표", {
      userLat,
      userLon,
      x5174,
      y5174,
    });
    return NaN;
  }

  const [lon, lat] = proj4("EPSG:5174", "WGS84", [x5174, y5174]);

  if (!isFinite(lat) || !isFinite(lon)) {
    console.warn("⚠️ 변환 결과가 유효하지 않음", { lat, lon });
    return NaN;
  }

  const companiesList = [{}];

  const R = 6371;
  const dLat = ((lat - userLat) * Math.PI) / 180;
  const dLon = ((lon - userLon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function getCompanies(userLat, userLon) {
  const datas = localStorage.getItem("companiesData");
  if (datas) {
    return JSON.parse(datas);
  }

  const res = await fetch("/data/companies.xml");
  const text = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");
  const rows = Array.from(xml.getElementsByTagName("row"));

  const parsed = rows.map((row) => {
    const coordX = parseFloat(
      row.getElementsByTagName("x")[0]?.textContent ?? "NaN"
    );
    const coordY = parseFloat(
      row.getElementsByTagName("y")[0]?.textContent ?? "NaN"
    );
    return {
      id: row.getElementsByTagName("mgtNo")[0]?.textContent ?? "",
      name:
        row
          .getElementsByTagName("bplcNm")[0]
          ?.textContent.replace(/\(주\)|㈜/g, "")
          .trim() ?? "",
      approvedDate:
        row.getElementsByTagName("apvPermYmd")[0]?.textContent ?? "",
      state: row.getElementsByTagName("trdStateNm")[0]?.textContent ?? "",
      coordX: coordX,
      coordY: coordY,
      reviews: [],
      distanceKm: getDistance(userLat, userLon, coordX, coordY).toFixed(2),
      priceFrom: Math.floor(Math.random() * 1000000),
      tags: ["24시간", "픽업", "개별화장", "유골함제공", "추모실"],
      city:
        row
          .getElementsByTagName("siteWhlAddr")[0]
          ?.textContent?.split(" ")[0] ||
        row.getElementsByTagName("rdnWhlAddr")[0]?.textContent?.split(" ")[0] ||
        "",
      cremationTypes: [
        {
          type: "개별 화장",
          description: "반려동물만 단독으로 진행",
          basePrice: 220000,
        },
        {
          type: "합동 화장",
          description: "여러 마리와 함께 진행",
          basePrice: 150000,
        },
      ],
      priceTable: [
        { weight: "0~5kg", indiv: 220000, group: 150000 },
        { weight: "5~10kg", indiv: 250000, group: 170000 },
        { weight: "10~20kg", indiv: 290000, group: 190000 },
      ],
      hours: {
        weekdays: "09:00 ~ 20:00",
        weekend: "10:00 ~ 18:00",
        emergency: "24시간 전화 접수",
        lastEntryNote: "마감 1시간 전 접수 권장",
      },
      contacts: {
        phone: row.getElementsByTagName("siteTel")[0]?.textContent ?? "",
        addressSite:
          row.getElementsByTagName("siteWhlAddr")[0]?.textContent ?? "",
        addressRdn:
          row.getElementsByTagName("rdnWhlAddr")[0]?.textContent ?? "",
        site: "https://example.com/v1",
      },
      options: ["픽업 가능(유료)", "유골함 기본 제공", "추모실 예약제"],
      registered: true,
    };
  });

  localStorage.setItem("companiesData", JSON.stringify(parsed));

  return parsed;
}
