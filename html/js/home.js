const html = (url = "") => {
  return `<div class="prever__mark"><iframe
    src="${url}"
    width="100%"
    height="100%"
    allow="accelerometer *; camera *; encrypted-media *; display-capture *; geolocation *; gyroscope *; microphone *; midi *; clipboard-read *; clipboard-write *; web-share *; serial *; xr-spatial-tracking *"
    allowfullscreen="true"
    allowpaymentrequest="true"
    allowtransparency="true"
    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-downloads allow-presentation"
    loading="lazy"
  ></iframe><div class="preview__click_close"></div></div>`;
};
const menu_box = document.querySelector(".menu-box");
// const menu_button = document.querySelector(".menu-button");
window.addEventListener("DOMContentLoaded", () => {
  const previewclicks = document.querySelectorAll(".preview__click");
  previewclicks.forEach((item) => {
    item.onclick = () => {
      const url = item.dataset.url;
      document.body.style.overflow = "hidden";
      document.body.insertAdjacentHTML("beforeend", html(url));
      const close = document.querySelector(".preview__click_close");
      close.onclick = () => {
        const mark = document.querySelector(".prever__mark");
        document.body.style.overflow = "initial";
        mark.remove();
      };
    };
  });
  // menu_button.addEventListener("click", function () {
  //   menu_box.classList.toggle("active");
  // });
});
