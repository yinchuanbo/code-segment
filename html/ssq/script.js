const ssqTextarea = document.querySelector("#ssq__textarea");
const ssqBtn = document.querySelector(".ssq__btn");
const randomBtn = document.querySelector(".random__btn");
const clearBtn = document.querySelector(".clear__btn");
const checkBox = document.querySelector(".check");

ssqBtn.onclick = () => {
  const value = (ssqTextarea?.value || "").trim();
  if (!value) {
    alert("请输入号码！！");
    return;
  }
  paichuBall(value);
};

clearBtn.onclick = () => {
  localStorage.clear()
}

const paichuBall = (value) => {
  let allRedBalls = [...Array(33).keys()].map((x) => x + 1);
  let allBlueBalls = [...Array(16).keys()].map((x) => x + 1);
  const arrs1 = value.split("\n");
  for (let i = 0; i < arrs1.length; i++) {
    const arr1 = arrs1[i];
    const fengefu = arr1.includes("+") ? "+" : "-";
    const arrs2 = arr1.split(fengefu);
    const redBalls = arrs2[0];
    const blueBalls = arrs2[1];
    const redBallsArr = redBalls.split(",");
    for (let j = 0; j < redBallsArr.length; j++) {
      const resball = redBallsArr[j];
      allRedBalls = allRedBalls.filter(
        (item) => parseInt(item) !== parseInt(resball)
      );
    }
    allBlueBalls = allBlueBalls.filter(
      (item) => parseInt(item) !== parseInt(blueBalls)
    );
  }
  create(allRedBalls, allBlueBalls);
};

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getRandomNumbers(arr, count) {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, count);
}

function getRandomNumber(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function create(allRedBalls, allBlueBalls) {
  const numbers = 5;
  let res = [];
  for (let i = 0; i < numbers; i++) {
    let redNumbers = getRandomNumbers(allRedBalls, 6);
    let blueNumber = getRandomNumber(allBlueBalls);
    redNumbers = redNumbers.sort((a, b) => a - b);
    redNumbers.push(blueNumber);
    res.push(redNumbers);
  }
  createCanvas(res);
}

const createCanvas = (arr) => {
  const conArr = convertArray(arr);
  const ssqLocal = localStorage.getItem("shuangseqiu");
  if (!ssqLocal) {
    localStorage.setItem("shuangseqiu", conArr);
  } else {
    localStorage.setItem("shuangseqiu", `${ssqLocal}\n${conArr}`);
  }
  var canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 40 * arr.length;
  var ctx = canvas.getContext("2d");
  var values = arr;
  var rows = values.length;
  var cols = values[0].length;
  var cellWidth = canvas.width / cols;
  var cellHeight = canvas.height / rows;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var value = values[i][j];
      var x = j * cellWidth;
      var y = i * cellHeight;
      if (j === cols - 1) {
        ctx.fillStyle = "rgb(71, 136, 244)";
      } else {
        ctx.fillStyle = "rgb(250, 78, 78)";
      }
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px hack";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2);
    }
  }
  var dataURL = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas_image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function convertArray(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i];
    var rowString = row.slice(0, row.length - 1).join(", ");
    result += rowString + " - " + row[row.length - 1] + "\n";
  }
  return result.trim();
}

// 检测代码
const renderHtml = () => {
  const getBallData = localStorage.getItem("shuangseqiu");
  const ulDom = document.createElement("ul");
  ulDom.id = "boxUl";
  checkBox.append(ulDom);
  if (getBallData) {
    const getBallLists = getBallData.split("\n");
    if (getBallLists?.length) {
      let liHtmls = "";
      for (let i = 0; i < getBallLists.length; i++) {
        const getBallList = getBallLists[i].trim();
        const splitSymbol = getBallList.includes("-") ? "-" : "+";
        const curBall = getBallList.split(splitSymbol);
        if (curBall?.length === 2) {
          const curBallRed = (curBall[0] + "").trim();
          const curBallBlue = curBall[1].trim();
          const redArrs = curBallRed.split(",");
          let redHtml = "";
          let blueHtml = `<span class="isBlue" data-id="${curBallBlue}">${curBallBlue}</span>`;
          if (redArrs?.length) {
            for (let j = 0; j < redArrs.length; j++) {
              const redArr = (redArrs[j] + "").trim();
              redHtml += `<span class="isRed" data-id="${redArr}">${redArr}</span>`;
            }
          }
          liHtmls += `<li>${redHtml}${blueHtml}</li>`;
        }
      }
      ulDom.innerHTML = liHtmls;
      setTimeout(() => {
        getLastestData();
      }, 100);
    }
  }
};

const getCurDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const formattedDate =
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (date < 10 ? "0" : "") +
    date;
  return formattedDate;
};

const getCurData = () => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return {
    h,
    m,
    s,
  };
};

const getWeekData = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const days = ["7", "1", "2", "3", "4", "5", "6"];
  const todaysDay = days[dayOfWeek];
  return todaysDay;
};

// 通过接口获取中奖号码
const getLastestData = () => {
  fetch(
    `https://www.mxnzp.com/api/lottery/common/latest?code=ssq&app_id=mfop6rrgg6fvmngd&app_secret=N1BsK2hadVZHU2hQRDQvMmRtdXBPQT09`
  )
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res?.code === 1) {
        let openCode = res?.data?.openCode || "";
        // const time = res?.data?.time || "";
        // console.log('time', time)
        // const expect = res?.data?.expect || "";
        // if (time) {
        //   const boxDom = document.querySelector('#box');
        //   const expectDom = document.createElement('div');
        //   expectDom.className = 'tags';
        //   expectDom.innerText = expect
        //   boxDom.appendChild(expectDom)
        // }
        openCode = openCode.split("+");
        let openCodeRed = openCode[0].trim();
        openCodeRed = openCodeRed.split(",");
        const openCodeBlue = parseInt(openCode[1].trim());
        for (let k = 0; k < openCodeRed.length; k++) {
          const redball = parseInt(openCodeRed[k].trim());
          const getAllRed = document.querySelectorAll(
            `.isRed[data-id="${redball}"]`
          );
          getAllRed.forEach((item) => {
            item.classList.add("isActive");
          });
        }
        const getAllBlue = document.querySelectorAll(
          `.isBlue[data-id="${openCodeBlue}"]`
        );
        getAllBlue.forEach((item) => {
          item.classList.add("isActive");
        });
      }
    });
};

window.onload = () => {
  const getBallData = localStorage.getItem("shuangseqiu");
  if (!getBallData) {
    checkBox.innerHTML = "";
  } else {
    if (getWeekData() == 2 || getWeekData() == 4 || getWeekData() == 7) {
      const { h, m } = getCurData();
      if ((h === 21 && m >= 35) || h > 21) {
        renderHtml();
      } else {
        console.log("今天开奖，但是不是最新结果");
      }
    } else {
      console.log("今天不是开奖日");
    }
  }
};

const items = document.querySelectorAll(".boxs__header_item");
const contents = document.querySelectorAll(".boxs__content>div");

items.forEach((item, index) => {
  item.onclick = () => {
    const active = document.querySelector(".boxs__header_item.active");
    if (active) active.classList.remove("active");
    item.classList.add("active");
    const show = document.querySelector(".boxs__content>div.show");
    if (show) show.classList.remove("show");
    contents[index].classList.add("show");
  };
});

function generateSSQNumbers(count) {
  const redBallCount = 6;
  const maxRedBall = 33;
  const maxBlueBall = 16;
  function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function generateSingleSSQ() {
      let redBalls = new Set();
      while (redBalls.size < redBallCount) {
          redBalls.add(getRandomNumber(1, maxRedBall));
      }
      redBalls = Array.from(redBalls).sort((a, b) => a - b);
      let blueBall = getRandomNumber(1, maxBlueBall);
      return {
          redBalls: redBalls,
          blueBall: blueBall
      };
  }
  function formatSSQNumbers(ssq) {
      return ssq.redBalls.join(',') + ' + ' + ssq.blueBall;
  }
  let results = [];
  for (let i = 0; i < count; i++) {
      let ssq = generateSingleSSQ();
      results.push(formatSSQNumbers(ssq));
  }
  return results;
}

randomBtn.onclick = () => {
  let numbers = generateSSQNumbers(6);
  numbers = numbers.join("\n")
  ssqTextarea.value = numbers
};
