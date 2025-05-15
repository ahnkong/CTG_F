import React, { useState, useRef, useEffect } from "react";
import "styles/login/newRegister.css";
import Background from "context/Background";
import { useDispatch } from "react-redux"; // Redux 사용
import { useNavigate } from "react-router-dom";
import Page from "components/styles/Page";
import BackButton from "components/Buttons/BackButton";

import defaultProfileImage from "assets/image/default-profile-image.png";

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
  const navigate = useNavigate();
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    tell: "",
    churchName: "",
    nickname: "",
  });

  const [validationMessages, setValidationMessages] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 회원가입 버튼 클릭됨!");
    console.log("📝 현재 formData 상태:", formData);

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const requiredFields = ['email', 'password', 'name', 'tell', 'churchName'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      alert(`다음 필드를 입력해주세요: ${emptyFields.join(', ')}`);
      return;
    }

    const requestData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      birth: new Date(),
      nickname: formData.nickname || formData.name,
      tell: formData.tell,
      churchName: formData.churchName,
      agreeToTerms: true,
      agreeToMarketing: false,
      local: 1,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "회원가입 실패");
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/loginPage");

    } catch (error) {
      console.error("❌ 회원가입 요청 실패:", error);
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const validateField = async (field, value) => {
    if (!value.trim()) {
      setValidationMessages(prev => ({
        ...prev,
        [field]: `${field}을(를) 입력해 주세요.`
      }));
      return;
    }

    if (field === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(value)) {
        setValidationMessages(prev => ({
          ...prev,
          email: "유효한 이메일 형식이 아닙니다."
        }));
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/v1/auth/checkEmail?email=${value}`);
        if (!response.ok) {
          throw new Error('이메일 중복 확인 실패');
        }
        const data = await response.json();
        console.log("이메일 중복 확인 결과:", data)
        setValidationMessages(prev => ({
          ...prev,
          email: data 
            ? "사용 가능한 이메일입니다." 
            : "이미 사용 중인 이메일입니다."
        }));
      } catch (error) {
        console.error("이메일 중복 확인 실패:", error);
        setValidationMessages(prev => ({
          ...prev,
          email: "이메일 확인 중 오류가 발생했습니다."
        }));
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
      if (field === "nickname") {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);
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
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="이메일 주소를 입력하세요"
                  required
                  ref={inputRef}
                />
                <p className={`validation-message ${
                  validationMessages.email?.includes("사용 가능한") ? "success" : "error"
                }`}>
                  {validationMessages.email}
                </p>
                <NavigationButtons 
                  onNext={nextStep} 
                  nextDisabled={!validationMessages.email?.includes("사용 가능한")}
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
                  required
                />
                <NavigationButtons 
                  onPrev={prevStep} 
                  onNext={handleSubmit} 
                  isFinalStep={true}
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