chrome.runtime.onConnectExternal.addListener(function (port) {
  port.onMessage.addListener(function (request) {
    if (request.query == "sysInfo") {
      var systemInfo = {};
      chrome.system.cpu.getInfo((data) => {
        systemInfo.cpuInfo = data;
        chrome.system.memory.getInfo((data) => {
          systemInfo.memoryInfo = data;
          chrome.system.storage.getInfo((data) => {
            systemInfo.storageInfo = data;
            port.postMessage({ systemInfo: systemInfo });
          });
        });
      });
    }
  });
});
