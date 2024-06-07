function hideSpinner() {
  // 로딩 스피너 숨김
  document.getElementById("spinner").style.display = "none";
  overlay.style.opacity = "0"; // 투명도를 0으로 설정하여 사라지도록 함
  setTimeout(() => {
    overlay.style.display = "none"; // 로딩 중 오버레이 숨김
  }, 500); // 0.5초 후에 오버레이 숨김
}

function showSpinner() {
  // 로딩 스피너 표시
  document.getElementById("spinner").style.display = "block";
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.opacity = "1";
}
