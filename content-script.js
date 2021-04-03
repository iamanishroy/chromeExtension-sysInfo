var port;
port = chrome.runtime.connect();
chrome.runtime.connect().onDisconnect.addListener(function () {
  port = chrome.runtime.connect();
});
function updateData() {
  if (typeof chrome.app.isInstalled !== "undefined") {
    port.postMessage({ query: "send-info" });
  }
}

updateData();
setInterval(() => {
  updateData();
}, 3000);

port.onMessage.addListener(function (msg) {
  if (msg.query == "cpu-info") {
    // CPU INFO
    updateCPUSection(msg.info);
  } else if (msg.query == "memory-info") {
    // Memory INFO
    updateMemorySection(msg.info);
  } else if (msg.query == "storage-info") {
    // STORAGE INFO
    updateStorageSection(msg.info);
  }
});

function updateCPUSection(cpu) {
  document.getElementById("cpu-arch").innerText = cpu.archName;
  document.getElementById("cpu-model").innerText = cpu.modelName;
  document.getElementById("cpu-proc").innerText = cpu.numOfProcessors;
  document.getElementById("cpu-feat").innerText = cpu.features.map(
    (f) => f + " "
  );
  document.getElementById("cpu-proc-usage").innerText = JSON.stringify(
    cpu.processors
  );
  document.getElementById("cpu-proc-usage").click();
}

function updateMemorySection(memory) {
  document.getElementById("mem-available").innerText = formatBytes(
    memory.availableCapacity
  );
  document.getElementById("mem-used").innerText = formatBytes(
    memory.capacity - memory.availableCapacity
  );
  document.getElementById("mem-total").innerText = formatBytes(memory.capacity);
  var avaiPercent = (memory.availableCapacity / memory.capacity) * 100;
  document.getElementById(
    "mem-chart"
  ).style.background = `conic-gradient( #c4c4c47a 0 ${avaiPercent}%, var(--secondary) 0 ${
    100 - avaiPercent
  }%)`;
}

function updateStorageSection(storage) {
  document.getElementById("stor-disks").innerHTML = "";
  storage.forEach((disk) => {
    document.getElementById("stor-disks").innerHTML += `<div class="disk">
    <p>${disk.name}</p><p>${disk.id}</p><p>${formatBytes(disk.capacity)}</p>
    </div>`;
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " Bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
  else return (bytes / 1073741824).toFixed(3) + " GB";
}
