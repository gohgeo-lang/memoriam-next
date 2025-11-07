import { useState } from "react";
import { saveCompayInfo } from "@/app/service/estimate/lib/companiesCache";

export default function EditCompanyInfo({
  isClickedEdit,
  handleCloseModal,
  selectedCompany,
}) {
  if (!isClickedEdit) return null;

  const [formData, setFormData] = useState({ ...selectedCompany });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...selectedCompany,
      ...formData,
    };

    console.log(updatedData);
    const isSuccess = await saveCompayInfo(updatedData);

    if (isSuccess) {
      handleCloseModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-center">업체 정보 수정</h2>

        {/* 기본 정보 */}
        <section className="mb-6 space-y-4">
          {/* 업체명 */}
          <div className="flex items-center justify-between">
            <label className="w-24 text-sm font-medium text-gray-700">
              업체명
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-md p-2 ml-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* 등록 여부 */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="registered"
              className="w-24 text-sm font-medium text-gray-700"
            >
              등록 여부
            </label>
            <div className="flex items-center gap-2">
              <input
                id="registered"
                name="registered"
                type="checkbox"
                checked={formData.registered}
                onChange={handleChange}
                className="h-5 w-5 accent-blue-600 cursor-pointer"
              />
              <span
                className={`text-sm font-semibold ${
                  formData.registered ? "text-green-600" : "text-red-500"
                }`}
              >
                {formData.registered ? "등록됨" : "미등록"}
              </span>
            </div>
          </div>

          {/* 태그 선택 영역 */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">업체 태그</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["24시간", "픽업", "개별화장", "유골함제공", "추모실"].map(
                (tag) => (
                  <label
                    key={tag}
                    className="flex items-center space-x-2 bg-gray-50 border rounded-md p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag}
                      checked={formData.tags.includes(tag)}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          tags: checked
                            ? [...prev.tags, value]
                            : prev.tags.filter((t) => t !== value),
                        }));
                      }}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="mb-6">
          <h3 className="font-semibold mb-2 text-lg text-gray-700">연락처</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="contacts.phone"
              value={formData.contacts?.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contacts: { ...prev.contacts, phone: e.target.value },
                }))
              }
              className="w-full border rounded-md p-2"
              placeholder="전화번호"
            />
            <input
              type="text"
              value={formData.contacts?.addressSite || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contacts: { ...prev.contacts, addressSite: e.target.value },
                }))
              }
              className="w-full border rounded-md p-2"
              placeholder="도로명 주소"
            />
            <input
              type="text"
              value={formData.contacts?.addressRdn || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contacts: { ...prev.contacts, addressRdn: e.target.value },
                }))
              }
              className="w-full border rounded-md p-2"
              placeholder="지번 주소"
            />
          </div>
        </section>

        {/* 영업시간 */}
        <section className="mb-6">
          <h3 className="font-semibold mb-2 text-lg text-gray-700">영업시간</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.hours?.weekdays || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, weekdays: e.target.value },
                }))
              }
              className="border rounded-md p-2"
              placeholder="평일"
            />
            <input
              type="text"
              value={formData.hours?.weekend || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, weekend: e.target.value },
                }))
              }
              className="border rounded-md p-2"
              placeholder="주말"
            />
            <input
              type="text"
              value={formData.hours?.emergency || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hours: { ...prev.hours, emergency: e.target.value },
                }))
              }
              className="border rounded-md p-2"
              placeholder="긴급"
            />
          </div>
        </section>

        {/* 가격 테이블 */}
        <section className="mb-6">
          <h3 className="font-semibold mb-2 text-lg text-gray-700">
            가격 정보
          </h3>
          <table className="w-full text-sm border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">체중</th>
                <th className="p-2 border">개별</th>
                <th className="p-2 border">합동</th>
              </tr>
            </thead>
            <tbody>
              {formData.priceTable.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{row.weight}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={row.indiv}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.priceTable];
                          updated[idx].indiv = Number(value);
                          return { ...prev, priceTable: updated };
                        });
                      }}
                      className="w-full border rounded-md p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={row.group}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.priceTable];
                          updated[idx].group = Number(value);
                          return { ...prev, priceTable: updated };
                        });
                      }}
                      className="w-full border rounded-md p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCloseModal}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
