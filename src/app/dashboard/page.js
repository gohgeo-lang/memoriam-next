"use client";
import { useState, useEffect, useMemo } from "react";
import { loadCompanies } from "@/app/service/estimate/lib/companiesCache";
import EditCompanyInfo from "./components/EditCompanyInfo";
import LoadingSpinner from "@/components/LoadingSpinner";
import LiveSearchBar from "./components/LiveSearchBar";
import CompanyList from "./components/CompanyList";
import UserList from "./components/UserList";
import EditUserInfo from "./components/EditUserInfo";

import PostList from "./components/PostList";

export default function DashboardPage() {
  const TABS = useMemo(
    () => ({
      COMPANY: "🏢 업체 관리",
      USER: "👥 사용자 관리",
      POST: "📰 게시글 관리",
    }),
    []
  );

  const [activeTab, setActiveTab] = useState(TABS.COMPANY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isClickedEdit, setIsClickedEdit] = useState(false);
  const [keyword, setKeyword] = useState("");

  // ✅ 데이터 로드 (위치 기반)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const data = await loadCompanies(latitude, longitude);
            setCompanies(
              data.sort((a, b) => a.name.localeCompare(b.name, "ko"))
            );
            setIsLoading(false);
          },
          async () => {
            const data = await loadCompanies();
            setCompanies(data);
            setIsLoading(false);
          }
        );
      } catch (err) {
        setError("업체 정보를 불러오는 중 오류 발생");
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // ✅ 사용자 / 게시글 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/posts"),
        ]);

        if (!userRes.ok || !postRes.ok) throw new Error("API 오류");

        const [usersData, postsData] = await Promise.all([
          userRes.json(),
          postRes.json(),
        ]);

        setUsers(usersData);
        setPosts(postsData);
      } catch (err) {
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ 필터링 (탭 & 검색어 기반)
  const filteredData = useMemo(() => {
    const list =
      activeTab === TABS.COMPANY
        ? companies
        : activeTab === TABS.USER
        ? users
        : posts;

    if (!keyword) return list;
    const lower = keyword.toLowerCase();

    if (activeTab === TABS.COMPANY)
      return list.filter((c) => c.name?.toLowerCase().includes(lower));
    if (activeTab === TABS.USER)
      return list.filter((u) => u.name?.toLowerCase().includes(lower));
    if (activeTab === TABS.POST)
      return list.filter((p) => p.title?.toLowerCase().includes(lower));

    return list;
  }, [activeTab, companies, users, posts, keyword]);

  // ✅ 핸들러
  const handleSearch = (kw) => setKeyword(kw);
  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsClickedEdit(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsClickedEdit(true);
  };

  const handleDeleteUser = (user) => {
    console.log("삭제 요청:", user);
  };

  const handleCloseModal = () => {
    setIsClickedEdit(false);
    setSelectedCompany(null);
  };

  // ✅ 로딩 / 에러 처리
  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 탭 버튼 */}
      <div className="flex justify-center flex-wrap space-x-2 mb-2">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm md:text-xl lg:text-2xl mx-2 px-2 font-bold rounded-md transition h-10 md:h-12
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

      {/* 검색바 */}
      <LiveSearchBar onSearch={handleSearch} activeTab={activeTab} />

      {/* 탭별 내용 */}
      {activeTab === TABS.COMPANY && (
        <>
          <CompanyList data={filteredData} onEdit={handleEditCompany} />
          <EditCompanyInfo
            isClickedEdit={isClickedEdit}
            handleCloseModal={handleCloseModal}
            selectedCompany={selectedCompany}
          />
        </>
      )}
      {activeTab === TABS.USER && (
        <>
          {" "}
          <UserList
            data={filteredData}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
          <EditUserInfo
            isClickedEdit={isClickedEdit}
            handleCloseModal={handleCloseModal}
            selectedUser={selectedUser}
          />
        </>
      )}
      {activeTab === TABS.POST && <PostList data={filteredData} />}
    </div>
  );
}
