let sortingSpeed = speed.value;

speed.addEventListener("input", function () {
  sortingSpeed = 500  - speed.value;
})

toggleButton.addEventListener("click", function () {
  let sheet = document.styleSheets[1];
  if (toggleButton.checked) {
    sheet.cssRules[0].style.setProperty("--back-color", "#212121");
    sheet.cssRules[0].style.setProperty("--color", "#c39a3b");
    sheet.cssRules[0].style.setProperty("--sorted", "#f5bc37");
  }
  else {
    sheet.cssRules[0].style.setProperty("--back-color", "#fafafa");
    sheet.cssRules[0].style.setProperty("--color", "#6125f9");
    sheet.cssRules[0].style.setProperty("--sorted", "#37168b");
  }
})

function generate(arrayLength) {
  document.querySelector(".wrapper > .content").innerHTML = '';
  let width = (window.innerWidth - 2 * arrayLength - 50) / arrayLength;
  for (let i = 0; i < arrayLength; i++) {
    let element = document.createElement("span");
    element.style.width = `${width}px`;
    element.style.height = `${Math.floor(Math.random() * test.offsetHeight)}px`;
    document.querySelector(".wrapper > .content").appendChild(element);
  }
}

number.addEventListener("input", function (e) {
  generate(e.target.value);
})

function clear() {
  document.querySelector(".wrapper > .content").innerHTML = '';
  test.style.height = `${window.innerHeight - test.getBoundingClientRect().top}px`;
  generate(number.value);
}

clear();

window.onresize = clear;

function sleep(seconds = sortingSpeed) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds);
  })
}

async function fastRun(elements) {
  for (let i = 0; i < elements.length; i++)
    elements[i].classList.remove("sorted");
  let range = Math.floor(elements.length / 5);
  for (let i = 0; i < range; i++) {
    sleep(20)
    elements[i].classList.add("sorted");
  }
  for (let i = range; i < elements.length; i++) {
    await sleep(20);
    elements[i - range].classList.remove("sorted");
    elements[i].classList.add("sorted");
  }
  for (let i = elements.length - range; i < elements.length; i++) {
    await sleep(20);
    elements[i].classList.remove("sorted");
  }
}

bubble.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  for (let i = 0; i < elements.length - 1; i++) {
    let flag = false;
    for (let j = 0; j < elements.length - i - 1; j++) {
      elements[j].classList.add("current");
      elements[j+1].classList.add("current");
      await sleep();
      if (elements[j].offsetHeight > elements[j + 1].offsetHeight) {
        flag = true;
        await sleep();
        elements[j].classList.add("misplaced");
        elements[j+1].classList.add("misplaced");
        await sleep();
        [elements[j].style.height, elements[j + 1].style.height] = [elements[j + 1].style.height, elements[j].style.height]
        await sleep();
        elements[j].classList.remove("misplaced");
        elements[j+1].classList.remove("misplaced");
      }
      elements[j].classList.remove("current");
      elements[j+1].classList.remove("current");
    }
    elements[elements.length - i - 1].classList.add("sorted");
    if(!flag)
      break;
  }
  fastRun(elements);
}

selection.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  for (let i = 0; i < elements.length - 1; i++) {
    let idx = i;
    elements[i].classList.add("current");
    for (let j = i + 1; j < elements.length; j++) {
      elements[j].classList.add("current");
      await sleep();
      if (elements[idx].offsetHeight > elements[j].offsetHeight) {
        elements[idx].classList.remove("misplaced");
        idx = j;
        elements[idx].classList.add("misplaced");
        elements[i].classList.add("misplaced");
        await sleep();
      }
      elements[j].classList.remove("current");
    }
    elements[i].classList.remove("current")
    if (idx !== i) {
      elements[i].classList.remove("misplaced");
      elements[idx].classList.remove("misplaced");
      elements[idx].classList.add("current");
      elements[i].classList.add("current");
      await sleep();
      [elements[i].style.height, elements[idx].style.height] = [elements[idx].style.height, elements[i].style.height];
      elements[idx].classList.remove("current");
      await sleep();
    }
    elements[i].classList.remove("current");
    elements[i].classList.add("sorted");
  }
  fastRun(elements);
}

insertion.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  for (let i = 0; i < elements.length; i++) {
    let j = i - 1;
    let val = elements[i].offsetHeight;
    elements[i].classList.add("current");
    await sleep();
    while (j >= 0 && elements[j].offsetHeight > val) {
      await sleep();
      elements[j + 1].style.height = elements[j].style.height;
      j--;
    }
    elements[j + 1].style.height = `${val}px`;
    elements[i].classList.add("sorted");
    await sleep();
  }
  fastRun(elements);
}

async function partition(start, end, elements) {
  let pos = start - 1;
  for (let i = start; i <= end; i++) {
    if (elements[i].offsetHeight <= elements[end].offsetHeight) {
      await sleep();
      pos++;
      [elements[i].style.height, elements[pos].style.height] = [elements[pos].style.height, elements[i].style.height]
    }
  }
  // pos++;
  // [elements[end].style.height, elements[pos].style.height] = [elements[pos].style.height, elements[end].style.height]
  return pos;
}

async function quickSort(start, end, elements) {
  if (start > end)
    return;
  let idx = await partition(start, end, elements);
  await quickSort(start, idx - 1, elements);
  await quickSort(idx + 1, end, elements);
}

quick.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  await quickSort(0, elements.length - 1, elements);
  fastRun(elements);
}

async function Merge(start, mid, end, elements) {
  let arr = [];
  let i = start, j = mid + 1, k = 0;
  while (i <= mid && j <= end) {
    if (elements[i].offsetHeight < elements[j].offsetHeight) {
      arr[k++] = elements[i++].offsetHeight;
    }
    else {
      arr[k++] = elements[j++].offsetHeight;
    }
  }
  while (i <= mid)
    arr[k++] = elements[i++].offsetHeight;
  while (j <= end)
    arr[k++] = elements[j++].offsetHeight;
  for (let t = 0; t < k; t++) {
    await sleep();
    elements[t + start].style.height = `${arr[t]}px`;
  }
}

async function mergeSort(start, end, elements) {
  if (start >= end)
    return;
  let mid = start + Math.floor((end - start) / 2);
  await mergeSort(start, mid, elements);
  await mergeSort(mid + 1, end, elements);
  await Merge(start, mid, end, elements);
}

merge.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  await mergeSort(0, elements.length - 1, elements);
  fastRun(elements);
}

async function heapify(index, n, elements) {
  let left = 2 * index + 1;
  let right = 2 * index + 2;
  let mx = index;
  if (left < n && elements[mx].offsetHeight < elements[left].offsetHeight) {
    mx = left;
  }
  if (right < n && elements[mx].offsetHeight < elements[right].offsetHeight) {
    mx = right;
  }
  if (mx != index) {
    await sleep();
    [elements[index].style.height, elements[mx].style.height] = [elements[mx].style.height, elements[index].style.height]
    await heapify(mx, n, elements);
  }
}

heap.onclick = async function () {
  let elements = document.querySelectorAll(".content > span");
  let n = elements.length;
  //building the max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(i, n, elements);
  }
  for (let i = n - 1; i >= 0; i--) {
    await sleep();
    [elements[0].style.height, elements[i].style.height] = [elements[i].style.height, elements[0].style.height];
    await heapify(0, i, elements)
  }
  fastRun(elements);
}