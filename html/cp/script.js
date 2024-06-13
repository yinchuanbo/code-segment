const cpTextarea = document.querySelector(".cp__textarea");
const cpBtn = document.querySelector(".cp__btn");

cpBtn.onclick = () => {
  const value = (cpTextarea?.value || "").trim();
  if (!value) {
    alert("请输入号码！！");
    return;
  }
  paichuBall(value);
};

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
    redNumbers = redNumbers.sort((a, b) => a - b)
    redNumbers.push(blueNumber)
    res.push(redNumbers);
  }
  createCanvas(res)
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
