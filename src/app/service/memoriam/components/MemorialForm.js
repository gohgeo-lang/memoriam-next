"use client";

// 1. useEffect를 import합니다.
import { useState, useEffect } from "react";

// 2. props로 initialData를 받도록 추가합니다.
export default function MemorialForm({ onStorySubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    petName: "",
    ownerName: "",
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 3. 🔽 [핵심 추가] initialData를 감지하는 useEffect
  //    initialData가 (null에서) 변경되면 폼의 상태를 채웁니다.
  useEffect(() => {
    if (initialData) {
      // '수정' 모드: 폼 데이터를 initialData로 채웁니다.
      setFormData({
        petName: initialData.petName || "",
        ownerName: initialData.ownerName || "",
        title: initialData.title || "",
        content: initialData.content || "",
      });
      // 기존 이미지 URL을 미리보기로 설정합니다.
      setImagePreview(initialData.thumbnailUrl || null);
      setImageFile(null); // 새 파일 선택은 초기화
    } else {
      // '작성' 모드: 폼을 비웁니다.
      setFormData({
        petName: "",
        ownerName: "",
        title: "",
        content: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData]); // initialData가 바뀔 때마다 이 effect가 실행됩니다.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (imagePreview) {
      // 기존 미리보기(Object URL)가 있다면 메모리에서 해제
      // (단, 기존 DB URL(http://...)은 해제하지 않도록 체크)
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
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

    // 4. 🔽 [수정] '수정' 모드일 경우를 대비해 기본 URL을 설정합니다.
    //    initialData(기존 글)에 썸네일이 있었다면 그 값을 기본으로 사용합니다.
    let thumbnailUrl = initialData ? initialData.thumbnailUrl : null;

    // 5. 새 파일이 선택된 경우에만 S3에 업로드합니다.
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
        thumbnailUrl = data.url; // 👈 새 파일 URL로 덮어씁니다.

        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
      } catch (error) {
        console.error("S3 이미지 업로드 중 오류 발생:", error);
        alert(
          `이야기는 등록되지만, 이미지 업로드에 실패했습니다: ${error.message}.`
        );
        // 새 파일 업로드 실패 시, thumbnailUrl은 4번에서 설정한 기존 URL (또는 null)
      }
    }

    const storyDataForApi = {
      ...formData,
      thumbnailUrl: thumbnailUrl, // 👈 최종 URL (새 URL 또는 기존 URL)
    };

    // page.js는 initialData의 존재 여부를 이미 알고 있으므로
    // 폼 데이터만 넘겨주면 됩니다.
    onStorySubmit(storyDataForApi);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-6 bg-gray-50 p-8 rounded-xl shadow-lg"
    >
      {/* 6. 🔽 [수정] 제목을 initialData 유무에 따라 변경 */}
      <h3 className="text-2xl font-bold text-[#7b5449] mb-6 text-center">
        {initialData ? "추모 이야기 수정" : "새로운 추모 이야기 작성"}
      </h3>

      {/* 🔽 [수정] 보호자/반려견 이름을 1줄 (grid)로 처리 (이전 UI 요청 반영) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="ownerName"
            className="block text-base font-semibold text-[#7b5449] mb-2"
          >
            보호자 이름
          </label>
          <input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName} // 👈 state와 연결
            onChange={handleInputChange}
            placeholder="보호자님의 이름"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="petName"
            className="block text-base font-semibold text-[#7b5449] mb-2"
          >
            반려동물 이름
          </label>
          <input
            id="petName"
            name="petName"
            value={formData.petName} // 👈 state와 연결
            onChange={handleInputChange}
            placeholder="반려동물의 이름"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-base font-semibold text-[#7b5449] mb-2"
        >
          이야기 제목
        </label>
        <input
          id="title"
          name="title"
          value={formData.title} // 👈 state와 연결
          onChange={handleInputChange}
          placeholder="이야기 제목을 입력해주세요"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7b5449] focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-base font-semibold text-[#7b5449] mb-2"
        >
          추억 남기기 (내용)
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content} // 👈 state와 연결
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
          className="block text-base font-semibold text-[#7b5449] mb-2"
        >
          사진 등록
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
          <div className="space-y-1 text-center">
            {/* 🔽 [수정] imagePreview가 있으면 (기존 이미지든 새 이미지든) 렌더링 */}
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
        {/* 7. 🔽 [수정] 버튼 텍스트를 initialData 유무에 따라 변경 */}
        <button
          type="submit"
          disabled={!isFormValid || loading} // 로딩 중 버튼 비활성화
          className="px-6 py-2 bg-[#7b5449] text-white rounded-md disabled:bg-gray-400 hover:bg-[#694237] transition-colors active:scale-95"
        >
          {loading ? "처리 중..." : initialData ? "수정 완료" : "등록하기"}
        </button>
      </div>
    </form>
  );
}
