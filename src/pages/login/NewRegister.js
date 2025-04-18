import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/login/newRegister.css";
import Background from "context/Background";
import { useDispatch } from "react-redux"; // Redux 사용

import Page from "components/styles/Page";
import BackButton from "components/Buttons/BackButton";

import defaultProfileIamge from "assets/image/default-profile-image.png";

//안코코
const NavigationButtons = ({ onPrev, onNext, nextDisabled, isFinalStep }) => {
  return (
    <div className="step-buttons">
      {onPrev && <button type="button" onClick={onPrev}>이전</button>}
      {onNext && (
        <button
          type={isFinalStep ? "submit" : "button"}
          onClick={!isFinalStep ? onNext : undefined}
          disabled={nextDisabled}
        >
          {isFinalStep ? "회원가입 완료" : "다음"}
        </button>
      )}
    </div>
  );
};

const NewRegister = () => {
  const dispatch = useDispatch(); // Redux 디스패치 가져오기
  const [step, setStep] = useState(1);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("gmail.com"); // 기본 선택값
  const options = ["gmail.com", "naver.com", "daum.net", "hanmail.net", "직접입력"];

  // 2. 드롭다운 열기/닫기 함수
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 3. 선택 처리 함수
  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    // 이메일 도메인 처리
    if (option === "직접입력") {
      setEmailDomain(""); // 직접입력 input 띄움
    } else {
      setEmailDomain(option);
    }
  };
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    tell: "",
    email: "",
    churchName: "",
    grade: "",
    nickname: "",
    profileImage: "",
  });
  const [validationMessages, setValidationMessages] = useState({});
  const navigate = useNavigate();

  const autoLogin = async (userId, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      if (!response.ok) {
        throw new Error("자동 로그인 실패");
      }

      const loginData = await response.json();
      console.log("✅ 자동 로그인 성공:", loginData);

      // ✅ Redux & localStorage 업데이트
      dispatch({ type: "SET_USER", payload: loginData }); // Redux에 저장
      dispatch({ type: "SET_USER_ID", payload: response.data.userId }); // 회원가입 정보 리스트 받아 보기 위함.
      console.log("📡 로그인 API 응답:", response.data);
      localStorage.setItem("token", loginData.token);

      localStorage.setItem("userData", JSON.stringify(loginData));

      return true; // ✅ 로그인 성공 시 true 반환

    } catch (error) {
      console.error("❌ 자동 로그인 실패:", error);
      alert("자동 로그인 중 오류가 발생했습니다.");
      return false; // ✅ 로그인 실패 시 false 반환
    }
  };

  //handleSubmit에서 autoLogin 호출 후, 성공 시에만 마이페이지로 이동
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 회원가입 버튼 클릭됨!"); // 1️⃣ 확인: 버튼이 눌렸는지

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }


    // const defaultProfileImageURL = defaultProfileIamge; // ✅ 문자열 URL
    const defaultProfileImageURL = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // 기본 프로필 이미지


    const requestData = {
      userId: formData.userId,
      password: formData.password,
      name: formData.name,
      tell: formData.tell,
      email: formData.email,
      churchName: formData.churchName,
      grade: formData.grade,
      nickname: formData.nickname,
      profileImage: formData.profileImage || defaultProfileImageURL,
    };

    console.log("📡 전송할 회원가입 데이터:", requestData); // 2️⃣ 확인: 데이터가 올바른지

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📡 서버 응답 상태 코드:", response.status); // 3️⃣ 확인: 응답 상태

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ 회원가입 성공:", responseData);
        alert("회원가입이 완료되었습니다!");
        navigate("/loginPage");
      } else {
        const errorData = await response.json();
        console.error("❌ 회원가입 실패 응답:", errorData);
        alert(`회원가입 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("❌ 회원가입 요청 실패:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  const goToRegister = () => {
    navigate("/register", {
      state: { from: "loginPage" } // ✅ 어디서 왔는지 표시
    });
  };


  //이메일 유효성 검사
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("gmail.com"); // 기본값

  // formData.email은 병합된 값으로 저장
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: emailId && emailDomain ? `${emailId}@${emailDomain}` : "",
    }));
  }, [emailId, emailDomain]);


  //유효성 문구
  const validateField = async (field, value) => {
    if (!value.trim()) {
      setValidationMessages((prev) => ({
        ...prev,
        [field]: `${field}을(를) 입력해 주세요.`,
      }));
      return;
    }

    if (field === "userId") {
      const idRegex = /^[a-z0-9]{6,}$/;
      if (!idRegex.test(value)) {
        setValidationMessages((prev) => ({
          ...prev,
          id: "소문자 6글자 이상 입력해 주세요.",
        }));
        return;
      }
    }

    if (field === "email") {
      const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(value)) {
        setValidationMessages((prev) => ({
          ...prev,
          email: "유효한 이메일 형식을 입력해 주세요.",
        }));
        return;
      }
    }

    if (field === "tell") {
      const phoneRegex = /^010\d{4}\d{4}$/;
      if (!phoneRegex.test(value)) {
        setValidationMessages((prev) => ({
          ...prev,
          tell: "올바른 핸드폰 번호 형식을 입력해 주세요.",
        }));
        return;
      }
    }

    let isAvailable = false;

    try {
      if (field === "userId") {
        isAvailable = await checkId(value);
      } else if (field === "email") {
        isAvailable = await checkEmail(value);
      } else if (field === "nickname") {
        isAvailable = await checkNickname(value);
      } else if (field === "tell") {
        isAvailable = await checkTell(value);
      }

      setValidationMessages((prev) => ({
        ...prev,
        [field]: isAvailable
          ? `사용할 수 있는 ${field}입니다.`
          : `중복된 ${field}입니다. 다른 값을 입력해 주세요.`,
      }));
    } catch (error) {
      setValidationMessages((prev) => ({
        ...prev,
        [field]: `${field} 확인 중 오류가 발생했습니다.`,
      }));
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });


    if (["userId", "email", "nickname", "tell"].includes(name)) {
      validateField(name, value); // 아이디, 이메일, 닉네임 중복 확인
    }

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "confirmPassword") {
      validatePasswordMatch(value, formData.password);
    }
  };



  const checkId = async (userId) => {
    try {
      const response = await fetch(`/api/v1/auth/checkId?userId=${userId}`);
      if (response.ok) {
        return await response.json(); // true: 사용 가능, false: 중복
      }
      return false;
    } catch (error) {
      console.error("아이디 중복 확인 요청 실패:", error);
      return false;
    }
  };


  const checkEmail = async (email) => {
    try {
      const response = await fetch(`/api/v1/auth/checkMail?email=${email}`);
      if (response.ok) {
        return await response.json(); // true: 사용 가능, false: 중복
      }
      return false;
    } catch (error) {
      console.error("이메일 중복 확인 요청 실패:", error);
      return false;
    }
  };

  const checkNickname = async (nickname) => {
    try {
      const response = await fetch(`/api/v1/auth/checkNickName?nickname=${nickname}`);
      if (response.ok) {
        return await response.json(); // true: 사용 가능, false: 중복
      }
      return false;
    } catch (error) {
      console.error("닉네임 중복 확인 요청 실패:", error);
      return false;
    }
  };



  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\W).{8,}$/;
    setValidationMessages((prev) => ({
      ...prev,
      password: passwordRegex.test(password)
        ? "사용할 수 있는 비밀번호입니다."
        : "비밀번호는 8자 이상, 소문자 및 특수문자를 포함해야 합니다.",
    }));

    if (formData.confirmPassword) {
      validatePasswordMatch(formData.confirmPassword, password);
    }
  };

  const validatePasswordMatch = (confirmPassword, password) => {
    setValidationMessages((prev) => ({
      ...prev,
      confirmPassword:
        confirmPassword === password
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다.",
    }));
  };


  const checkTell = async (tell) => {
    try {
      const response = await fetch(`/api/v1/auth/checkTell?tell=${tell}`);
      if (response.ok) {
        return await response.json(); // true: 사용 가능, false: 중복
      }
      return false;
    } catch (error) {
      console.error("핸드폰 번호 중복 확인 요청 실패:", error);
      return false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault(); // 기본 제출 동작 방지

      // ✅ 비밀번호 입력창일 경우 → confirmPassword input으로 포커스만 이동
      if (step === 2 && e.target.name === "password") {
        document.getElementById("confirmPassword").focus();
        return; // 다음 단계로 넘어가지 않도록 종료
      }

      // ✅ 그 외 모든 경우 → 다음 단계로 이동
      nextStep();
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);




  return (
    <Background type="white">
      <Page scrollable={false}>
        <div className="register-container">
          {/* <BackButton className="register-backButton" onClick={() => navigate("/initScreen")} /> */}
          <div>
            <BackButton variant="default" className="back-button" />
          </div>
          <div className="register-title">
            <h1>회원가입</h1>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="step">
                <label htmlFor="userId">아이디</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // 엔터키 감지
                  ref={inputRef} // ✅ 포커스 설정
                  placeholder="아이디를 입력하세요"
                  required
                />
                <p className={`validation-message ${validationMessages.userId?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.userId}
                </p>
                <NavigationButtons
                  onNext={nextStep}
                  nextDisabled={!validationMessages.userId?.includes("사용할 수 있는")}
                />
              </div>
            )}
            {step === 2 && (
              <div className="step">
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // 엔터키 감지
                  ref={inputRef} // ✅ 포커스 설정
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <p className={`validation-message ${validationMessages.password?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.password}
                </p>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  // ref={inputRef} // ✅ 포커스 설정
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // 엔터키 감지
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <p className={`validation-message ${validationMessages.confirmPassword?.includes("비밀번호가 일치합니다.") ? "success" : "error"}`}>
                  {validationMessages.confirmPassword}
                </p>
                <NavigationButtons
                  onPrev={prevStep}
                  onNext={nextStep}
                  nextDisabled={validationMessages.confirmPassword !== "비밀번호가 일치합니다."}
                />
              </div>
            )}
            {step === 3 && (
              <div className="step">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  ref={inputRef} // ✅ 포커스 설정
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // 엔터키 감지
                  placeholder="이름을 입력하세요"
                  required
                />
                <NavigationButtons onPrev={prevStep} onNext={nextStep} />
              </div>
            )}
            {step === 4 && (
              <div className="step">
                <label htmlFor="tell">핸드폰 번호</label>
                <input
                  type="text"
                  id="tell"
                  name="tell"
                  value={formData.tell}
                  onChange={handleChange}
                  ref={inputRef} // ✅ 포커스 설정
                  onKeyPress={handleKeyPress} // 엔터키 감지
                  placeholder="01012345678"
                  required
                />
                <p className={`validation-message ${validationMessages.tell?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.tell}
                </p>
                <NavigationButtons
                  onPrev={prevStep}
                  onNext={nextStep}
                  nextDisabled={!validationMessages.tell?.includes("사용할 수 있는")}
                />
              </div>
            )}
            {step === 5 && (
              <div className="step">
                <label htmlFor="emailId">이메일</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    id="emailId"
                    name="emailId"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="이메일 아이디"
                    required
                    ref={inputRef}
                  />
                  <span>@</span>
                  <div className="custom-select-wrapper">
                    <div className="custom-select-box" onClick={toggleDropdown}>
                      {selectedOption}
                      <span className="arrow"> </span>
                    </div>
                    {isOpen && (
                      <ul className="custom-dropdown">
                        {options.map((option) => (
                          <li key={option} onClick={() => handleSelect(option)}>
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {emailDomain === "직접입력" && (
                    <input
                      type="text"
                      placeholder="도메인 직접입력"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                      style={{ width: "120px", borderRadius: "30px", padding: "10px" }}
                    />
                  )}
                </div>
                <p className={`validation-message ${validationMessages.email?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.email}
                </p>
                <NavigationButtons onPrev={prevStep} onNext={nextStep} />
              </div>
            )}


            {step === 6 && (
              <div className="step">
                <label htmlFor="churchName">교회이름</label>
                <input
                  type="text"
                  id="churchName"
                  name="churchName"
                  value={formData.churchName}
                  onChange={handleChange} // ✅ 이게 맞아!
                  onKeyPress={handleKeyPress}
                  ref={inputRef}
                  placeholder="교회이름을 입력하세요"
                />
                {/* <p className={`validation-message ${validationMessages.nickname?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.nickname}
                </p> */}
                <NavigationButtons onPrev={prevStep} onNext={nextStep} />
              </div>
            )}


            {step === 7 && (
              <div className="step">
                <label htmlFor="grade">교회에서 직분</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange} // ✅ 이게 맞음
                  onKeyPress={handleKeyPress}
                  ref={inputRef}
                  placeholder="직분을 입력하세요"
                />

                {/* <p className={`validation-message ${validationMessages.nickname?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.nickname}
                </p> */}
                <NavigationButtons onPrev={prevStep} onNext={nextStep} />
              </div>
            )}


            {step === 8 && (
              <div className="step">
                <label htmlFor="nickname">닉네임</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  ref={inputRef} // ✅ 포커스 설정
                  placeholder="닉네임을 입력하세요"
                />
                <p className={`validation-message ${validationMessages.nickname?.includes("사용할 수 있는") ? "success" : "error"}`}>
                  {validationMessages.nickname}
                </p>
                <NavigationButtons
                  onPrev={prevStep}
                  onNext={handleSubmit} // 🔥 마지막 단계에서 handleSubmit 실행
                  isFinalStep={true} // 마지막 단계이므로 회원가입 버튼 활성화
                  nextDisabled={!validationMessages.nickname?.includes("사용할 수 있는")}
                />
              </div>
            )}
          </form>
        </div>
      </Page>
    </Background>
  );
};

export default NewRegister;