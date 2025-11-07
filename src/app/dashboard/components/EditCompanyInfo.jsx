import { useState } from "react";
import { saveCompayInfo } from "@/app/service/estimate/lib/companiesCache";

export default function EditCompanyInfo({
  isClickedEdit,
  handleCloseModal,
  selectedCompany,
}) {
  if (!isClickedEdit) return null;

  const [name, setName] = useState(selectedCompany?.name || "");
  const [city, setCity] = useState(selectedCompany?.city || "");
  const [registered, setRegistered] = useState(
    selectedCompany?.registered || false
  );

  const handleSave = async () => {
    const updatedData = {
      ...selectedCompany,
      name,
      city,
    };

    console.log(updatedData);
    const isSuccess = await saveCompayInfo(updatedData);

    if (isSuccess) {
      handleCloseModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-around items-center text-center">
          <h2 className="text-xl font-semibold mb-4">등록상태</h2>
          <button className="items-center">
            {selectedCompany.registered ? "등록해제" : "등록"}
          </button>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCloseModal}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
