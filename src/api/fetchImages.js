// ===============================================
// fetchImages.js: 이미지 관련 API 호출 모듈
// ===============================================

import axios from "axios";

// ===============================================
// API 엔드포인트: GET /api/v1/images/{imageId}
// 특정 이미지 정보를 가져오는 함수
// ===============================================
export const fetchImageById = async (imageId) => {
  try {
    const response = await axios.get(`/api/v1/images/${imageId}`);
    return response.data; // 이미지 데이터 반환
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    throw error; // 에러 발생 시 호출 측으로 전달
  }
};

// ===============================================
// API 엔드포인트: POST /api/v1/images
// 새로운 이미지를 업로드하는 함수
// ===============================================
export const uploadImage = async (formData) => {
  try {
    const response = await axios.post("/api/v1/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // 업로드된 이미지 데이터 반환
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // 에러 발생 시 호출 측으로 전달
  }
};

// ===============================================
// API 엔드포인트: DELETE /api/v1/images/{imageId}
// 특정 이미지를 삭제하는 함수
// ===============================================
export const deleteImage = async (imageId) => {
  try {
    const response = await axios.delete(`/api/v1/images/${imageId}`);
    return response.data; // 삭제 결과 반환
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error; // 에러 발생 시 호출 측으로 전달
  }
};
