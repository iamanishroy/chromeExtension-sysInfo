const elem_cpu = document.querySelector(".data #cpu");
const elem_mem = document.querySelector(".data #memory");
const elem_stor = document.querySelector(".data #storage");

const updateInfo = async () => {
  await chrome.system.cpu.getInfo((data) => {
    var htmlToAppend = "";
    htmlToAppend += "<b>CPU</b>";

    htmlToAppend += createHTML("Architecture", data["archName"]);
    htmlToAppend += createHTML("modelName", data["modelName"]);
    htmlToAppend += createHTML("numOfProcessors", data["numOfProcessors"]);
    htmlToAppend += createHTML("features", arrToStr(data["features"]));

    for (var n = 0; n < data["numOfProcessors"]; n++) {
      var proc = data["processors"][n]["usage"];
      var usage = 100 - 100 * (proc["idle"] / proc["total"]);
      htmlToAppend += createHTML(
        "processor-" + (n + 1),
        usage.toFixed(5) + "%"
      );
    }

    elem_cpu.innerHTML = htmlToAppend;
  });
  await chrome.system.memory.getInfo((data) => {
    var htmlToAppend = "<b>Memory</b>";
    htmlToAppend += createHTML(
      "available",
      byteToMB(data["availableCapacity"])
    );
    htmlToAppend += createHTML(
      "used",
      byteToMB(data["capacity"] - data["availableCapacity"])
    );
    htmlToAppend += createHTML("capacity", byteToMB(data["capacity"]));
    elem_mem.innerHTML = htmlToAppend;
  });
  await chrome.system.storage.getInfo((data) => {
    var htmlToAppend = "<b>Storage</b>";
    data.forEach((drive) => {
      htmlToAppend += createHTML(drive["name"], byteToMB(drive["capacity"]));
    });
    elem_stor.innerHTML = htmlToAppend;
  });
};
updateInfo();
setInterval(() => {
  updateInfo();
}, 3000);

// checkInfo();
// chrome.tabs.onActivated.addListener(checkInfo());
// function buildTree(tree, container) {
//   tree.forEach(function (node) {
//     var el = document.createElement(node.tag);

//     if (Array.isArray(node.content)) {
//       buildTree(node.content, el);
//     } else if (typeof node.content == "object") {
//       buildTree([node.content], el);
//     } else {
//       el.innerHTML = node.content;
//     }

//     container.appendChild(el);
//   });
// }

// Helper Functions :-

function createHTML(p, v) {
  return `<div class="param">
  <div class="title">${p}</div>
  <div class="value">${v}</div>
  </div>`;
}
function arrToStr(arr) {
  var str = "";
  arr.forEach((e) => {
    str += e + ", ";
  });
  return str;
}

function byteToMB(byte) {
  return (byte / (1024 * 1024)).toFixed(2) + "MB";
}
