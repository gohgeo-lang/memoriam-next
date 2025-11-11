"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

export default function EditUserInfo({
  isClickedEdit,
  handleCloseModal,
  selectedUser,
}) {
  // formData 초기값 항상 객체로
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    name: "",
    image: "",
    role: "User",
  });

  // selectedUser가 바뀌면 안전하게 업데이트
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id || "",
        email: selectedUser.email || "",
        password: "", // 비밀번호는 변경 시 입력
        name: selectedUser.name || "",
        image: selectedUser.image || "",
        role: selectedUser.role || "User",
      });
    } else {
      setFormData({
        id: "",
        email: "",
        password: "",
        name: "",
        image: "",
        role: "User",
      });
    }
  }, [selectedUser]);

  // 입력 값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장
  const handleSubmit = async () => {
    // 비밀번호 확인
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.email || !formData.name) {
      alert("이메일과 이름은 필수입니다.");
      return;
    }
    // 관련 api 없어서 그냥 닫기
    handleCloseModal();
    return;
    try {
      const response = await fetch(`/api/users/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("사용자 정보 수정 실패");

      alert("사용자 정보가 성공적으로 수정되었습니다!");
      handleCloseModal();
    } catch (error) {
      console.error("사용자 수정 오류:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity ${
        isClickedEdit
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleCloseModal} // 외부 클릭 시 닫기
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg p-6 overflow-y-auto max-h-[85vh] transition-transform transform"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-800"
          >
            <MdClose size={28} />
          </button>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          사용자 정보 수정
        </h2>

        {/* 폼 */}
        <div className="space-y-4">
          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름 입력"
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호 (변경 시에만 입력)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="새 비밀번호 입력"
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
            {formData.password && formData.confirmPassword && (
              <p
                className={`text-sm mt-1 ${
                  formData.password === formData.confirmPassword
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formData.password === formData.confirmPassword
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {/* 프로필 이미지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              프로필 이미지 URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="preview"
                className="mt-3 w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>

          {/* 권한 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              권한(Role)
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              disabled
            >
              <option value="Admin">관리자</option>
              <option value="User">일반 사용자</option>
            </select>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 mt-8">
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
