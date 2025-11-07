"use client";
import { getCompanyList } from "@/app/service/estimate/lib/companiesCache";
import { useState, useEffect } from "react";
import Link from "next/link";
import EditCompanyInfo from "./components/EditCompanyInfo";

export default function DashboardPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [activeTab, setActiveTab] = useState("업체 관리");
  const tabs = ["업체 관리", "사용자 관리", "게시글 관리", "댓글 관리"];

  useEffect(() => {
    async function fetchData() {
      const companyList = await getCompanyList();
      setCompanies(companyList);

      const userList = await fetch("/api/users");
      console.log("userList", userList);
      const usersData = await userList.json();

      const postList = await fetch("/api/posts");
      const postsData = await postList.json();

      setUsers(usersData);
    }
    fetchData();
  }, []);

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsClickedEdit(true);
  };

  const handleCloseModal = () => {
    setIsClickedEdit(false);
    setSelectedCompany(null);
  };

  console.log("users=========>", users);
  console.log("posts=========>", posts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-3xl font-bold m-5 px-4 py-2 rounded-md transition 
            ${
              activeTab === tab
                ? "bg-gray-300 text-blue-600"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "업체 관리" && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 space-y-1 space-x-1">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
                >
                  <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                  <p className="text-gray-600">
                    {company.city || "지역 정보 없음"}
                  </p>
                  <button
                    onClick={() => handleEditClick(company)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    수정
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "사용자 관리" && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 space-y-1 space-x-1">
              {users.length > 0 &&
                users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-semibold">
                      {user.name || "이름 정보 없음"}
                    </h2>
                    <p className="text-gray-600">
                      {user.email || "이메일 정보 없음"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "게시글 관리" && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 space-y-1 space-x-1">
              {posts &&
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-semibold">
                      {post.title || "제목 정보 없음"}
                    </h2>
                    <p className="text-gray-600">
                      {post.content || "내용 정보 없음"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 모달창 */}
      <EditCompanyInfo
        isClickedEdit={isClickedEdit}
        handleCloseModal={handleCloseModal}
        selectedCompany={selectedCompany}
      />
    </div>
  );
}
