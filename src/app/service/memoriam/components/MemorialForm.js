"use client";

import { useState } from "react";

// 글 작성 폼 컴포넌트
export default function MemorialForm({ onStorySubmit, onCancel }) {
  const [formData, setFormData] = useState({
    petName: "",
    ownerName: "",
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const isFormValid =
    formData.petName &&
    formData.ownerName &&
    formData.title &&
    formData.content;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);
    let thumbnailUrl = null;

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      uploadFormData.append("pathPrefix", "memorial");

      try {
        const uploadRes = await fetch("/api/s3-upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.error || "이미지 업로드 실패");
        }

        const data = await uploadRes.json();
        thumbnailUrl = data.url;

        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
      } catch (error) {
        console.error("S3 이미지 업로드 중 오류 발생:", error);
        alert(
          `이야기는 등록되지만, 이미지 업로드에 실패했습니다: ${error.message}.`
        );
        thumbnailUrl = null;
      }
    }

    const storyDataForApi = {
      ...formData,
      thumbnailUrl: thumbnailUrl,
    };

    
    onStorySubmit(storyDataForApi);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-6 bg-gray-50 p-8 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-bold text-[#7b5449] mb-6 text-center">
        새로운 추모 이야기 작성
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          name="ownerName"
          value={formData.ownerName}
          onChange={handleInputChange}
          placeholder="보호자 이름"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
        />
        <input
          name="petName"
          value={formData.petName}
          onChange={handleInputChange}
          placeholder="반려동물 이름"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
        />
      </div>

      <div>
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="이야기 제목"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
        />
      </div>

      <div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="아이와의 소중한 추억을 남겨주세요..."
          required
          rows="8"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent resize-none"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="imageUploadInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          사진 등록
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="미리보기"
                className="mx-auto h-48 w-full object-cover rounded-md"
              />
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="imageUploadInput"
                className="relative cursor-pointer bg-white rounded-md font-medium text-[#7b5449] hover:text-[#694237] focus-within:outline-none"
              >
                <span>파일 업로드</span>
                <input
                  id="imageUploadInput"
                  name="imageUpload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">또는 파일을 끌어오세요</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors active:scale-95"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading} // 로딩 중 버튼 비활성화
          className="px-6 py-2 bg-[#7b5449] text-white rounded-md disabled:bg-gray-400 hover:bg-[#694237] transition-colors active:scale-95"
        >
          {loading ? "업로드 및 등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
