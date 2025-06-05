import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "styles/index.css";
// 로그인페이지 관련
import NewRegister from 'pages/login/NewRegister';
// import Login from 'pages/login/Login';
import LoginPage from 'pages/login/LoginPage';
import LoadingScreen from 'pages/login/LoadingScreen';
import LoadingToMain from 'pages/login/LoadingToMain';
import InitScreen from 'pages/login/InitScreen';
// 메뉴페이지
import Menu from 'pages/menu/menu'
// import Board from './components/board/Board';



import BoardForm from 'pages/board/boardForm';
import BoardList from 'pages/board/BoardList';
import BoardDetail from 'pages/board/BoardDetail';
import BoardNotice from 'pages/notice/BoardNotice';

import AuthCheck from 'utils/AuthCheck';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import store, { persistor } from "./reducers/store"; // store.js 경로에 맞게 수정 지은 추가
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import FloatingButton from 'components/floatingButton/FloatingButton';
//마이페이지 관련
import MyPage from 'pages/MyPage/MyPage';
import ProfileInfo from 'pages/MyPage/ProfileInfo';
import EditProfile from 'pages/MyPage/EditProfile';
import MyBoardList from 'pages/MyPage/MyBoardList';
import ChurchInfo from 'pages/MyPage/ChurchInfo'
import BottomNav from 'layouts/BottomNav';
import CheckPassword from 'components/mypage/CheckPassword';

import InitPage from 'pages/login/InitPage';

import VideoList from 'pages/video/VideoList';
import VideoForm from 'pages/video/VideoForm';

import CommunityForm from 'pages/community/CommunityForm';

import BibleStudy from 'pages/ctg/BibleStudy';
import Search from "pages/board/Search";
import ShorterCate from 'pages/ctg/ShorterCate';
import DetailPage from 'pages/ctg/detailPage';
import Hearder_ChuchType from 'layouts/Hearder_ChurchType';
import CatechismPage from "pages/ctg/CatechismPage";
import Header from "components/styles/Header";



import Newsletter from 'pages/newsletter/newsletter';
import NewsletterDetail from 'pages/newsletter/NewsletterDetail';
import Video from 'pages/video/Video';
import VideoDetail from 'pages/video/VideoDetail';
function App() {
  //+3/21안코코 리덕스가 로컬스토리지 기반으로 초기 상태 복원하도록,
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      dispatch({
        type: "SET_USER",
        payload: {
          userId: storedUser.userId,
          nickname: storedUser.nickname,
          isAuthenticated: true,
        },
      });
    }
  }, [dispatch]);


  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthCheck />
        <Router>
          <Routes>
            <Route path="/" element={<InitPage />} />
            <Route path="/InitScreen" element={<InitScreen />} />
            <Route path="/NewRegister" element={<NewRegister />} />
            <Route path="/create" element={<BoardForm />} />
            <Route path="/menu" element={<Menu />} /> {/* 상세 페이지 추가 */}
              
            <Route path="/Video" element={<Video />} /> {/* 상세 페이지 추가 */}
            <Route path="/Video/:videoId" element={<VideoDetail />} /> {/* 상세 페이지 추가 */}

            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/newsletter/:id" element={<NewsletterDetail />} />
            
            <Route path="/churchVideo" element={<VideoList />}/>
            <Route path="/videoForm" element={<VideoForm />}/>

            <Route path="/communityForm" element={<CommunityForm />} />

            <Route path="/MyPage" element={<MyPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/LoadingScreen" element={<LoadingScreen />} />
            <Route path="/LoadingToMain" element={<LoadingToMain />} />
            <Route path="/ProfileInfo" element={<ProfileInfo />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/ChurchInfo" element={<ChurchInfo />} />


            <Route path="/MyBoardList" element={<MyBoardList />} />
            {/* 기본 경로 */}
            <Route path="/main" element={<BoardList />} />
            <Route path="/board/:boardId" element={<BoardDetail />} />
            <Route path="/boardNotice" element={<BoardNotice />} />


            <Route path="/check-password" element={<CheckPassword />} />
            <Route path="/edit-profile/:field" element={<EditProfile />} />



            <Route path="/BibleStudy" element={<BibleStudy />} />
            <Route path="/search" element={<Search />} />
            <Route path="/:type" element={<CatechismPage />} />  {/* ✅ 통합된 페이지 */}
            <Route path="/:type" element={<CatechismPage />} />
            <Route path="/:type/:id" element={<DetailPage />} />  {/* ✅ 디테일 페이지 라우트 확인 */}


          </Routes>
          {/* 전역 FloatingButton */}
          {/* <FloatingButton /> */}
        </Router>
      </PersistGate>
    </Provider>
  );
}
export default App;






