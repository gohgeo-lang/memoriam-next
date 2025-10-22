"use client";

import { useState } from "react";
import PreviewCanvas from "@/components/PreviewCanvas";
import {
  BiImage,
  BiBrush,
  BiUser,
  BiPalette,
  BiSliderAlt,
  BiStar,
  BiUpload,
} from "react-icons/bi";

export default function Photo() {
  const [activeStep, setActiveStep] = useState(1);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTemplateClick = (tpl) => {
    setLoading(true);
    setPreviewImage(null);
    setTimeout(() => {
      setPreviewImage(tpl.result);
      setLoading(false);
    }, 5000);
  };

  const templates = [
    {
      id: 1,
      name: "정장",
      icon: "/image/suit-icon.png",
      result: "/image/result-suit.png",
    },
    {
      id: 2,
      name: "한복",
      icon: "/image/hanbok-icon.png",
      result: "/image/result-hanbok.png",
    },
    {
      id: 3,
      name: "캐주얼",
      icon: "/image/casual-icon.png",
      result: "/image/result-casual.png",
    },
  ];

  const [background, setBackground] = useState("#ffffff");
  const backgrounds = [
    { id: 1, name: "화이트", color: "#ffffff" },
    { id: 2, name: "그레이", color: "#e0e0e0" },
    { id: 3, name: "브라운", color: "#7b5449" },
    { id: 4, name: "그린", color: "#80bc85ff" },
    { id: 5, name: "스카이", color: "#65b3f3ff" },
    { id: 6, name: "옐로우", color: "#ffdb4bff" },
    { id: 7, name: "핑크", color: "#ff6cb8ff" },
    { id: 8, name: "베이지", color: "#decf9cff" },
    { id: 9, name: "블랙", color: "#000000ff" },
    { id: 10, name: "레드", color: "#b63030ff" },
  ];

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [selectedControl, setSelectedControl] = useState(null);

  const controls = [
    { key: "contrast", label: "대비", value: contrast, setter: setContrast },
    {
      key: "brightness",
      label: "밝기",
      value: brightness,
      setter: setBrightness,
    },
    {
      key: "saturation",
      label: "채도",
      value: saturation,
      setter: setSaturation,
    },
    {
      key: "temperature",
      label: "색조",
      value: temperature,
      setter: setTemperature,
    },
    {
      key: "sharpness",
      label: "선명도",
      value: sharpness,
      setter: setSharpness,
    },
  ];

  const [currentPreset, setCurrentPreset] = useState("default");
  const applyPreset = (preset) => {
    setCurrentPreset(preset.type);
    switch (preset.type) {
      case "grayscale":
        setBackground("#888888");
        break;
      case "sepia":
        setBackground("#704214");
        break;
      case "noise":
        setBackground("#999999");
        break;
      default:
        break;
    }
  };
  const handleSave = async () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return alert("저장할 이미지가 없습니다.");

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "result.png");

      const res = await fetch("/api/photo/save", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("저장 완료!");
        console.log("서버에 저장된 URL:", data.url);
      } else {
        alert("저장 실패");
      }
    });
  };

  const presets = [
    { id: 1, name: "기본", type: "default" },
    { id: 2, name: "흑백", type: "grayscale" },
    { id: 3, name: "세피아", type: "sepia" },
    { id: 4, name: "필름노이즈", type: "noise" },
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const stepIcons = [
    { step: 1, icon: <BiImage className="text-2xl" /> },
    { step: 2, icon: <BiBrush className="text-2xl" /> },
    { step: 3, icon: <BiUser className="text-2xl" /> },
    { step: 4, icon: <BiPalette className="text-2xl" /> },
    { step: 5, icon: <BiSliderAlt className="text-2xl" /> },
    { step: 6, icon: <BiStar className="text-2xl" /> },
    { step: 7, icon: <BiUpload className="text-2xl" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[65vh] flex justify-center items-center bg-gray-50 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-600">
            <p>합성 중입니다...</p>
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mt-3"></div>
          </div>
        ) : previewImage || image ? (
          <PreviewCanvas
            image={previewImage || image}
            background={background}
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            temperature={temperature}
            sharpness={sharpness}
            currentPreset={currentPreset}
          />
        ) : (
          <ul className="w-[250px] rounded-lg bg-gray-200 p-4 list-none text-center shadow">
            <p className="font-bold text-base mb-2">첨부이미지 가이드</p>
            <li>피사체는 클수록 좋아요.</li>
            <li>정면일 때 인식률이 높아요.</li>
            <li>피사체 이외의 것은 적을수록 좋아요.</li>
          </ul>
        )}

        {activeStep === 5 && selectedControl && (
          <div className="absolute bottom-5 w-3/4 bg-white p-3 rounded-lg shadow flex items-center gap-3">
            <span className="w-16 text-sm font-bold">
              {controls.find((c) => c.key === selectedControl).label}
            </span>
            <input
              type="range"
              min="-100"
              max="100"
              value={controls.find((c) => c.key === selectedControl).value}
              onChange={(e) =>
                controls
                  .find((c) => c.key === selectedControl)
                  .setter(Number(e.target.value))
              }
              className="flex-1"
            />
            <span className="w-10 text-right text-sm">
              {controls.find((c) => c.key === selectedControl).value}
            </span>
          </div>
        )}
      </div>

      <div className="left-0 w-full z-50 bg-white rounded-t-xl shadow-lg flex flex-col">
        <div className="bg-[#7b5449] text-white">
          <ul className="cursor-pointer m-0 p-0 flex flex-row justify-around w-full">
            {stepIcons.map((item) => (
              <li
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className="p-3"
              >
                {item.icon}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-100 py-1 px-3 overflow-y-auto h-[20vh]">
          {activeStep === 1 && (
            <div className="flex flex-col gap-3 py-12 justify-center">
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer border-2 border-dashed border-[#7b5449] text-stone-500 font-base text-center py-3 rounded-xl shadow-md hover:bg-[#694237] hover:text-white transition text-lg"
              >
                이미지 등록하기
              </label>
            </div>
          )}

          {activeStep === 2 && <p className="text-sm text-center">빠른 제작</p>}

          {activeStep === 3 && (
            <div>
              <p className="text-sm text-center">디자인템플릿</p>
              <div className="flex gap-3 flex-wrap mt-2">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="w-[80px] border rounded-lg text-center cursor-pointer hover:scale-105 transition"
                    onClick={() => handleTemplateClick(tpl)}
                  >
                    <img
                      src={tpl.icon}
                      alt={tpl.name}
                      className="rounded-t-lg"
                    />
                    <p>{tpl.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <p className="text-sm text-center">배경설정</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className="w-[60px] h-[60px] rounded-lg cursor-pointer hover:scale-105 transition flex items-center justify-center"
                    style={{ backgroundColor: bg.color }}
                    onClick={() => setBackground(bg.color)}
                  >
                    <span className="text-[12px] text-gray-800">{bg.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <p className="text-sm text-center mb-4">사진보정</p>
              <div className="grid grid-cols-5 gap-3">
                {controls.map((ctrl) => (
                  <div
                    key={ctrl.key}
                    onClick={() => setSelectedControl(ctrl.key)}
                    className={`p-3 rounded-lg shadow cursor-pointer text-center ${
                      selectedControl === ctrl.key
                        ? "bg-[#7b5449] text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {ctrl.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div>
              <p className="text-sm text-center">필터효과</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="w-[80px] cursor-pointer text-center"
                    onClick={() => applyPreset(preset)}
                  >
                    <div className="w-[80px] h-[60px] rounded-md bg-gray-300 mb-2"></div>
                    <p>{preset.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 7 && (
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-center mb-3">사진 저장하기</p>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#7b5449] text-white rounded-lg shadow-md hover:bg-[#5c3a2f] transition"
              >
                저장하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
