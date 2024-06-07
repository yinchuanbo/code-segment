const imgs = document.querySelectorAll("img");

const htmlFun = (src = "") => {
  return `
    <div class="img__preview">
      <img src="${src}" />
      <span id="imgClose"><svg t="1714003776752" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4260" width="48" height="48"><path d="M1024 930.133333L930.133333 1024 512 605.866667 93.866667 1024 0 930.133333 418.133333 512 0 93.866667 93.866667 0 512 418.133333 930.133333 0 1024 93.866667 605.866667 512z" fill="#bfbfbf" p-id="4261"></path></svg></span>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  imgs.forEach((ele) => {
    ele.onclick = () => {
      let imgPreview = document.querySelector(".img__preview");
      if (imgPreview) imgPreview.remove();
      document.body.insertAdjacentHTML("beforeend", htmlFun(ele.src));
      const imgClose = document.getElementById("imgClose");
      imgPreview = document.querySelector(".img__preview");
      imgPreview.onclick = imgClose.onclick = () => {
        imgPreview.remove();
      };
    };
  });

});