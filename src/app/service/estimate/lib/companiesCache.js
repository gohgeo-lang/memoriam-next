// companiesCache.js
import getCompanies from "./companies";

let companiesCache = null;

// XML 데이터를 한 번만 불러와서 캐싱
export async function loadCompanies(userLat, userLon) {
  if (!companiesCache) {
    companiesCache = await getCompanies(userLat, userLon);
  }

  return companiesCache;
}

// id를 기반으로 특정 회사 정보 가져오기
export async function getCompanyById(id) {
  if (!companiesCache) {
    await loadCompanies();
  }

  return companiesCache.find((c) => c.id === id) || null;
}

export async function saveCompayInfo(company) {
  const index = companiesCache.findIndex((c) => c.id === company.id);

  if (index === -1) {
    return null;
  }

  companiesCache[index] = company;
  localStorage.setItem("companiesData", JSON.stringify(companiesCache));

  return true;
}
