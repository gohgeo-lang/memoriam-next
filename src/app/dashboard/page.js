"use client";
import { loadCompanies } from "@/app/service/estimate/lib/companiesCache";
import { useState, useEffect } from "react";
import EditCompanyInfo from "./components/EditCompanyInfo";
import LiveSearchBar from "./components/LiveSearchBar";

export default function DashboardPage() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [activeTab, setActiveTab] = useState("업체 관리");
  const tabs = ["업체 관리", "사용자 관리", "게시글 관리"];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const datas = await loadCompanies(latitude, longitude);
        datas.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setCompanies(datas);
      },
      async () => {
        const datas = await loadCompanies(); // 위치 정보 없을 때
        setCompanies(datas);
      }
    );
    async function fetchData() {
      const userList = await fetch("/api/users");
      const usersData = await userList.json();
      setUsers(usersData);

      const postList = await fetch("/api/posts");
      const postsData = await postList.json();
      setPosts(postsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      setFilteredCompanies(companies);
    }
  }, [companies]);

  const handleSearch = (keyword) => {
    if (!keyword) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter((c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsClickedEdit(true);
  };

  const handleCloseModal = () => {
    setIsClickedEdit(false);
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center flex-wrap space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm md:text-xl lg:text-2xl mx-2 px-2 font-bold rounded-md transition
      whitespace-nowrap h-10 md:h-12
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
        <div>
          <LiveSearchBar onSearch={handleSearch} />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-2 py-2 sm:px-0">
              <div className="bg-gray-400 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2 gap-1">
                {filteredCompanies?.map((company) => (
                  <div
                    key={company.id}
                    className={`p-4 rounded-lg shadow-md flex flex-col justify-between transition
              ${
                company.registered
                  ? "bg-white border border-gray-200"
                  : "bg-gray-100 border-2 border-red-400 opacity-80"
              }`}
                  >
                    <h2 className="text-sm md:text-xl lg:text-2xl font-semibold mb-2">
                      {company.name}
                    </h2>

                    <p
                      className={`text-xs font-semibold mb-2 ${
                        company.registered ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {company.registered ? "등록됨" : "미등록"}
                    </p>

                    <p className="text-gray-600 text-sm md:text-xl lg:text-2xl">
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
        </div>
      )}
      {activeTab === "사용자 관리" && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-1">
              {users?.map((user) => (
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
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-1">
              {posts?.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold">
                    {post.title || "제목 정보 없음"} -{" "}
                    {post.author.name || "작성자 정보 없음"}
                  </h2>
                  <p className="text-gray-600">
                    내용 : {post.content || "내용 정보 없음"}
                  </p>
                  <ul>
                    댓글 :{" "}
                    {post.comments?.map((comment) => (
                      <li key={comment.id}>
                        {comment.content || "댓글 정보 없음"} -{" "}
                        {comment.author?.name || "작성자 정보 없음"}
                      </li>
                    ))}
                  </ul>
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
