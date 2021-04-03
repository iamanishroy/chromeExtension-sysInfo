chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.query == "send-info") {
      chrome.system.cpu.getInfo((data) => {
        port.postMessage({ query: "cpu-info", info: data });
      });
      chrome.system.memory.getInfo((data) => {
        port.postMessage({ query: "memory-info", info: data });
      });
      chrome.system.storage.getInfo((data) => {
        port.postMessage({ query: "storage-info", info: data });
      });
    }
  });
});
