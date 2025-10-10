// lib/mock.js
export const TEST_VENDORS = [
  {
    id: "v1",
    name: "포근한 작별",
    priceFrom: 180000,
    distanceKm: 6.2,
    rating: 4.7,
    reviews: 124,
    city: "서울",
    tags: ["24시간", "개별화장", "유골함제공"],
    // 상세용 필드
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
      phone: "02-1234-5678",
      address: "서울시 어딘가 123",
      site: "https://example.com/v1",
    },
    options: ["픽업 가능(유료)", "유골함 기본 제공", "추모실 예약제"],
  },
  {
    id: "v2",
    name: "무지개다리 센터",
    priceFrom: 150000,
    distanceKm: 12.8,
    rating: 4.5,
    reviews: 89,
    city: "경기",
    tags: ["픽업", "개별화장", "추모실"],
    cremationTypes: [
      {
        type: "개별 화장",
        description: "단독 화장, 유골 반환",
        basePrice: 200000,
      },
      { type: "합동 화장", description: "유골 반환 없음", basePrice: 140000 },
    ],
    priceTable: [
      { weight: "0~5kg", indiv: 200000, group: 140000 },
      { weight: "5~10kg", indiv: 230000, group: 160000 },
      { weight: "10~20kg", indiv: 270000, group: 180000 },
    ],
    hours: {
      weekdays: "10:00 ~ 19:00",
      weekend: "10:00 ~ 17:00",
      emergency: "야간 요청 시 사전 연락",
      lastEntryNote: "당일 예약제",
    },
    contacts: {
      phone: "031-222-3333",
      address: "경기도 어딘가 45",
      site: "https://example.com/v2",
    },
    options: ["픽업 무료(서울/수도권 한정)", "추모실 상시 운영"],
  },
  {
    id: "v3",
    name: "포레스트 메모리얼",
    priceFrom: 220000,
    distanceKm: 3.4,
    rating: 4.9,
    reviews: 203,
    city: "서울",
    tags: ["24시간", "픽업", "개별화장", "유골함제공", "추모실"],
    cremationTypes: [
      { type: "개별 화장", description: "가족 참관 가능", basePrice: 260000 },
      { type: "합동 화장", description: "유골 반환 없음", basePrice: 170000 },
    ],
    priceTable: [
      { weight: "0~5kg", indiv: 260000, group: 170000 },
      { weight: "5~10kg", indiv: 290000, group: 190000 },
      { weight: "10~20kg", indiv: 330000, group: 210000 },
    ],
    hours: {
      weekdays: "09:00 ~ 21:00",
      weekend: "09:00 ~ 20:00",
      emergency: "24시간 상시 대응",
      lastEntryNote: "야간은 전화 필수",
    },
    contacts: {
      phone: "02-9876-5432",
      address: "서울시 숲길 77",
      site: "https://example.com/v3",
    },
    options: ["참관 가능", "픽업/모시기(유료)", "프리미엄 유골함 선택"],
  },
];
