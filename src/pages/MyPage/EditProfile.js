import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Background from "context/Background.jsx";
import Page from "components/styles/Page.jsx";
import "styles/MyPage/editProfile.css";
import IconCancle from "assets/icon/IconCancle.png";

const fieldNames = {
  name: "이름",
  password: "비밀번호",
  nickname: "닉네임",
  tell: "휴대폰 번호",
  email: "이메일 주소",
  birth: "생년월일",
};

const EditProfile = () => {
  const { field } = useParams(); // URL에서 전달된 필드값 가져오기
  const navigate = useNavigate();

  // ✅ 사용자 데이터 및 입력값 상태
  const [userData, setUserData] = useState(null);
  const [value, setValue] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState(""); // 🔥 새 비밀번호 입력
  const [confirmPassword, setConfirmPassword] = useState(""); // 🔥 비밀번호 확인

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("토큰이 없습니다. 다시 로그인해주세요.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/v1/auth/check", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");

        const data = await response.json();
        console.log("✅ 사용자 데이터이건가?:", data); // 🔥 디버깅 로그 추가
        setUserData(data);
        setValue(data[field] || ""); // URL에서 가져온 field 값 설정
      } catch (error) {
        console.error("Error:", error.message);
        setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchUserData();
  }, [field]);

  const handleSave = async () => {
    if (!userData) {
      console.error("❌ 사용자 정보가 없습니다.");
      return;
    }
  
    if (newPassword.length < 8) {
      alert("❗ 비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("❌ 새 비밀번호가 일치하지 않습니다.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🔴 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }
  
      const userId = userData.userId;
      if (!userId) {
        console.error("❌ userId를 찾을 수 없습니다.");
        return;
      }
  
      const requestData = {
        password: newPassword, // ✅ 반드시 'password' 필드로 보낼 것!
      };
  
      console.log("🟡 비밀번호 변경 요청 데이터:", requestData);
      console.log("🟡 요청 URL:", `http://localhost:8080/api/v1/user/${userId}/updatePassword`);
  
      const response = await fetch(`http://localhost:8080/api/v1/user/${userId}/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`🚨 변경 실패! 서버 응답: ${errorText}`);
      }
  
      console.log("✅ 비밀번호 변경 성공!");
      alert("✅ 비밀번호가 성공적으로 변경되었습니다!");
      navigate("/mypage"); // 🔥 로그아웃 없이 마이페이지로 이동
    } catch (error) {
      console.error("변경 중 오류 발생:", error);
      setErrorMessage("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  return (
    <Background type="gray">
      <Page scrollable={false} id="editProfile">
        <section className="edit-profile-container">
          <h1 className="editProfile-title">새로운 {fieldNames[field]} 입력해주세요</h1>

          <div className="input-wrapper">
            <label className="input-label">{fieldNames[field]}</label>
            <div className={`input-container ${["name", "birth", "email"].includes(field) ? "disabled-field" : ""}`}>
              {field === "password" ? (
                <>
                  <input
                    type="password"
                    className="input-textfield"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                  />
                  <input
                    type="password"
                    className="input-textfield"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 한번 입력해주세요"
                  />
                </>
              ) : (
                <input
                  type="text"
                  className="input-textfield"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`${fieldNames[field]}을(를) 입력하세요`}
                  disabled={["name", "birth", "email"].includes(field)}
                />
              )}
            </div>
          </div>
        </section>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <section className="edit-profile-buttons-container">
          <button className="edit-profile-cancel-button" onClick={() => navigate("/ProfileInfo")}>
            취소
          </button>
          <button className="edit-profile-save-button" onClick={handleSave} disabled={!userData}>
            저장
          </button>
        </section>
      </Page>
    </Background>
  );
};

export default EditProfile;



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Background from "context/Background.jsx";
// import Page from "components/styles/Page.jsx";
// import "styles/MyPage/editProfile.css";
// import IconCancle from "assets/icon/IconCancle.png";

// const fieldNames = {
//   name: "이름",
//   password: "비밀번호",
//   nickname: "닉네임",
//   tell: "휴대폰 번호",
//   email: "이메일 주소",
//   birth: "생년월일",
//   company: "회사",
// };

// const EditProfile = () => {
//   const { field } = useParams(); // URL에서 전달된 필드값 가져오기
//   const navigate = useNavigate();
  
//   // ✅ 사용자 데이터를 저장할 상태
//   const [userData, setUserData] = useState(null);
//   const [value, setValue] = useState(""); 
//   const [errorMessage, setErrorMessage] = useState(""); 

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("토큰이 없습니다. 다시 로그인해주세요.");
//           return;
//         }

//         const response = await fetch("http://localhost:8080/api/v1/auth/check", {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");

//         const data = await response.json();
//         console.log("✅ 사용자 데이터:", data); // 🔥 디버깅 로그 추가
//         setUserData(data);
//         setValue(data[field] || ""); // URL에서 가져온 field 값 설정
//       } catch (error) {
//         console.error("Error:", error.message);
//         setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다.");
//       }
//     };

//     fetchUserData();
//   }, [field]);

//   const handleSave = async () => {
//     if (!userData) {
//       console.error("❌ 사용자 정보가 없습니다.");
//       return;
//     }

//     if (["name", "birth", "email"].includes(field)) {
//       alert("🚫 이 필드는 수정할 수 없습니다.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("🔴 토큰이 없습니다. 다시 로그인해주세요.");
//         return;
//       }

//       const userId = userData.userId; // 🔥 userId를 userData에서 가져오기
//       if (!userId) {
//         console.error("❌ userId를 찾을 수 없습니다.");
//         return;
//       }

//       const requestData = { [field]: value };

//       console.log("🟡 저장 요청 데이터:", requestData);
//       console.log("🟡 요청 URL:", `http://localhost:8080/api/v1/user/${userId}/update`);

//       const response = await fetch(`http://localhost:8080/api/v1/user/${userId}/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`🚨 변경 실패! 서버 응답: ${errorText}`);
//       }

//       console.log("✅ 변경 성공!");
//       alert(`${fieldNames[field]}이(가) 변경되었습니다!`);
//       navigate("/mypage");
//     } catch (error) {
//       console.error("변경 중 오류 발생:", error);
//       setErrorMessage("변경에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   return (
//     <Background type="mypage">
//       <Page id="editProfile">
//         <section className="edit-profile-container">
//           <h1 className="editProfile-title">{fieldNames[field]} 입력해주세요</h1>

//           <div className="input-wrapper">
//             <label className="input-label">{fieldNames[field]}</label>
//             <div className="input-container">
//               {userData ? (
//                 <input
//                   type={field === "password" ? "password" : "text"} 
//                   className="input-textfield"
//                   value={value}
//                   onChange={(e) => setValue(e.target.value)}
//                   placeholder={`${fieldNames[field]}을(를) 입력하세요`}
//                   disabled={["name", "birth", "email"].includes(field)} 
//                 />
//               ) : (
//                 <p>🔄 사용자 정보를 불러오는 중...</p>
//               )}
              
//               {value && userData && (
//                 <button className="clear-btn" onClick={() => setValue("")}> 
//                   <img src={IconCancle} alt="삭제" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </section>

//         {errorMessage && <p className="error-message">{errorMessage}</p>} 

//         <section className="edit-profile-buttons-container"> 
//           <button className="edit-profile-cancel-button" onClick={() => navigate("/ProfileInfo")}>
//             취소
//           </button>
//           <button className="edit-profile-save-button" onClick={handleSave} disabled={!userData}>
//             저장
//           </button>
//         </section>
//       </Page>
//     </Background>
//   );
// };

// export default EditProfile;


