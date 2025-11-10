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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("🏢 업체 관리");
  const tabs = ["🏢 업체 관리", "👥 사용자 관리", "📰 게시글 관리"];

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
    if (activeTab === tabs[0] && companies.length > 0) {
      setFilteredCompanies(companies);
    } else if (activeTab === tabs[1] && users.length > 0) {
      setFilteredUsers(users);
    } else if (activeTab === tabs[2] && posts.length > 0) {
      setFilteredPosts(posts);
    }
  }, [companies, users, posts, activeTab]);

  const handleSearch = (keyword) => {
    if (!keyword) {
      if (activeTab === tabs[0]) {
        setFilteredCompanies(companies);
      } else if (activeTab === tabs[1]) {
        setFilteredUsers(users);
      } else if (activeTab === tabs[2]) {
        setFilteredPosts(posts);
      }
      return;
    }

    if (activeTab === tabs[0]) {
      const filtered = companies.filter((c) =>
        c.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else if (activeTab === tabs[1]) {
      const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else if (activeTab === tabs[2]) {
      const filtered = posts.filter((p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsClickedEdit(true);
  };

  const handleCloseModal = () => {
    setIsClickedEdit(false);
    setSelectedCompany(null);
  };

  console.log("-------->", users);
  console.log("-------->", posts);

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

      <LiveSearchBar onSearch={handleSearch} activeTab={activeTab} />

      {activeTab === tabs[0] && (
        <div>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-2 py-2 sm:px-0">
              <div className="bg-gray-400 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2 gap-1">
                {filteredCompanies?.map((company) => (
                  <div
                    key={company.id}
                    className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col justify-between
              ${
                company.registered
                  ? "bg-white border border-gray-200"
                  : "bg-red-50 border-2 border-red-300 opacity-90"
              }`}
                  >
                    {/* 이름 */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {company.name || "업체명 없음"}
                    </h2>

                    {/* 등록 상태 */}
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 self-start ${
                        company.registered
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {company.registered ? "등록됨" : "미등록"}
                    </span>

                    {/* 지역 */}
                    <p className="text-gray-600 text-sm mb-4">
                      📍 {company.city || "지역 정보 없음"}
                    </p>

                    {/* 버튼 */}
                    <button
                      onClick={() => handleEditClick(company)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
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

      {activeTab === tabs[1] && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-1">
              {filteredUsers?.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col items-center"
                >
                  {/* 아바타 */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold mb-4">
                    {user.name ? user.name.charAt(0) : "?"}
                  </div>

                  {/* 사용자 정보 */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.name || "이름 정보 없음"}
                  </h2>
                  <p className="text-gray-500 mb-3">
                    {user.email || "이메일 정보 없음"}
                  </p>

                  {/* 버튼 */}
                  <div className="mt-auto flex gap-2">
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                      수정
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-sm text-red-500 font-medium hover:underline">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === tabs[2] && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-2 py-2 sm:px-0">
            <div className="bg-gray-400 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 shadow-xl p-2 gap-1">
              {filteredPosts?.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col"
                >
                  {/* 제목 + 작성자 */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {post.title || "제목 없음"}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    ✍️ {post.author?.name || "작성자 정보 없음"}
                  </p>

                  {/* 내용 */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {post.content || "내용 정보 없음"}
                  </p>

                  {/* 댓글 */}
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600 overflow-y-auto max-h-28">
                    <p className="font-semibold mb-1">💬 댓글</p>
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment) => (
                        <p
                          key={comment.id}
                          className="border-b border-gray-200 py-1"
                        >
                          {comment.content || "댓글 없음"}{" "}
                          <span className="text-xs text-gray-400">
                            - {comment.author?.name || "익명"}
                          </span>
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400">댓글이 없습니다.</p>
                    )}
                  </div>
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
