import { useState } from "react";
import { MdClose } from "react-icons/md";
import { saveCompayInfo } from "@/app/service/estimate/lib/companiesCache";

export default function EditUserInfo({
  isClickedEdit,
  handleCloseModal,
  selectedUser,
}) {
  if (!isClickedEdit) return null;

  const [formData, setFormData] = useState({ ...selectedUser });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...selectedUser,
      ...formData,
    };

    const isSuccess = await saveCompayInfo(updatedData);

    if (isSuccess) {
      handleCloseModal();
    }
  };

  const UserRole = Object.freeze({
    Admin: 1,
    User: 2,
  });

  console.log(UserRole.Admin, UserRole.User);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleCloseModal} // 외부 클릭 닫기
    >
      <div
        className="
      bg-white rounded-lg shadow-lg 
      w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl
      p-4 sm:p-6 
      overflow-y-auto 
      max-h-[85vh] sm:max-h-[90vh]
      transition-all duration-300
    "
        onClick={(e) => e.stopPropagation()} // 내부 클릭 닫기 방지
      >
        <div className="flex justify-end">
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-800"
          >
            <MdClose size={28} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          사용자 정보 수정
        </h2>

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
