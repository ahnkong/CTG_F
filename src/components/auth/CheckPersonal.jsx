import React, { useState} from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import termsData from '../../assets/termsData.json';

const CheckPersonal = ({ open, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    agreeAll: false,
    agreeService: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [detailsOpen, setDetailsOpen] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "agreeAll") {
      // 모든 동의 선택 시, 개별 동의 항목도 모두 변경
      setSelectedOptions((prev) => {
        const updatedOptions = Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === "agreeAll" ? checked : checked;
          return acc;
        }, {});
        return updatedOptions;
      });
    } else {
      setSelectedOptions((prev) => {
        const updatedOptions = { ...prev, [name]: checked };

        // 모든 항목이 체크되면 agreeAll도 true로 설정
        const allChecked = ["agreeService", "agreePrivacy", "agreeMarketing"].every(
          (key) => updatedOptions[key]
        );

        return { ...updatedOptions, agreeAll: allChecked };
      });
    }
  };

  const openDetails = (type) => {
    setDetailsOpen(type);
  };

  const closeDetails = () => {
    if (detailsOpen) {
      setSelectedOptions((prev) => ({
        ...prev,
        [`agree${detailsOpen.charAt(0).toUpperCase() + detailsOpen.slice(1)}`]: true,
      }));
  
      // 모든 필수 항목이 체크되었는지 확인하여 agreeAll을 업데이트
      setSelectedOptions((prev) => {
        const allRequiredChecked = ["agreeService", "agreePrivacy"].every(
          (key) => prev[key] || key === `agree${detailsOpen.charAt(0).toUpperCase() + detailsOpen.slice(1)}`
        );
  
        return { ...prev, agreeAll: allRequiredChecked };
      });
    }
    setDetailsOpen(null);
  };
  

  const getDetailContent = (type) => {
    const term = termsData.terms.find((term) => term.type === type);
    if (term) {
      return term.contents.map(
        (content) => (
          <Typography key={content.id} variant="body2" paragraph>
            {content.title}: {content.retentionPeriod}
          </Typography>
        )
      );
    }
    return "약관 내용을 찾을 수 없습니다.";
  };

  //------2번째
  // const getDetailContent = (type) => {
  //   const term = termsData.terms.find((term) => term.type === type);
  //   if (term) {
  //     return (
  //       <div>
  //         {term.retentionPeriod.map((item, index) => (
  //           <Typography key={index} variant="body2" paragraph>
  //             {item.content}
  //           </Typography>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return "약관 내용을 찾을 수 없습니다.";
  // };


  
  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth
          sx = {{ 
            // width : "250px",heigh : "400px"
            "& .MuiDialog-paper": { //체크 박스 눌렀을때, 켜지는 모달창
              width: "400px", // 너비 고정
              height: "400px", // 높이 고정
              maxWidth: "none", // maxWidth 무시
            },
          }}>
        <DialogTitle>개인정보 수집 및 이용 동의</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                name="agreeAll"
                checked={selectedOptions.agreeAll}
                onChange={handleCheckboxChange}
              />
            }
            label="모두 동의"
          />
          <br />
          {termsData.terms.map((term) => (
            <FormControlLabel
            
              key={term.type}
              control={
                <Checkbox
                  name={`agree${term.type.charAt(0).toUpperCase() + term.type.slice(1)}`}
                  checked={selectedOptions[`agree${term.type.charAt(0).toUpperCase() + term.type.slice(1)}`]}
                  onChange={handleCheckboxChange}
                />
              }
              label={
                <Button onClick={() => openDetails(term.type)} 
                  variant="text"
                  size="small"
                >
                  {term.type === "service"
                    ? "[필수]서비스 이용 동의"
                    : term.type === "privacy"
                    ? "[필수]개인정보 수집 및 이용 동의"
                    : "[선택]광고성 정보 수신"}
                </Button>
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} color="secondary">
            취소
          </Button>
          <Button
            onClick={() => {
              const allRequiredChecked = ["agreeService", "agreePrivacy"].every(
                (key) => selectedOptions[key]
              );

              if (!allRequiredChecked) {
                alert("필수 항목을 모두 선택해주세요.");
                return;
              }

              onClose({
                agreeToTerms: true,
                agreeMarketing: selectedOptions.agreeMarketing,
              });
            }}
            color="primary"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!detailsOpen}
        onClose={closeDetails}
        sx={{
          "& .MuiDialog-paper": { //체크 박스 눌렀을때, 켜지는 모달창
            width: "400px", // 너비 고정
            height: "400px", // 높이 고정
            maxWidth: "none", // maxWidth 무시
          },
        }}
      >
        <DialogTitle>
          {detailsOpen &&
            (detailsOpen === "service"
              ? "서비스 약관"
              : detailsOpen === "privacy"
              ? "개인정보 약관"
              : "마케팅 약관")}
        </DialogTitle>
        <DialogContent>{getDetailContent(detailsOpen)}</DialogContent>
        <DialogActions>
          <Button onClick={closeDetails} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CheckPersonal;
