function chunk(arr, size) {
  let res = [];
  for (let i = 0; i < arr.length; i += size) {
    tempArr = arr.slice(i, i + size);
    res.push(tempArr);
  }
  return res;
}

function unique(arr) {
  // return [...new Set(arr)];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!res.includes(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

let arr1 = [2, 3, 4, 3, 1, 9, 7];
shuffle(arr1);

// cjs导出
module.export = {
  chunk,
  unique,
  shuffle,
};

// esm导出
export { chunk, unique, shuffle };
