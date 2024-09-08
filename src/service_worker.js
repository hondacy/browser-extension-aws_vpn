// Background script to close any tab that has the "target_url" after 2 seconds

const acs_url = "http://127.0.0.1:35001/"

const handleExceptions = () => {
  const err = chrome.runtime.lastError;
  if (err) {
    throw new Error(err);
  }
};

const safeGetTab = async (tabId) => {
  const tab = await chrome.tabs.get(parseInt(tabId));
  try {
    handleExceptions();
    return tab;
  } catch (e){
    console.log('safeGetTab', e.message);
  }
  return {};
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


////**** Main Logic Here ****//// 
chrome.tabs.onCreated.addListener(async function(tabObject){	
  var i = 1;  
  function mainLoop() { 
    setTimeout(async function() { 
      const tab = await safeGetTab(tabObject.id);
      if (tab === undefined) {
        console.log('Tab closed');
      } 
      else {
        if (tab.url == acs_url){
          console.log("Closing Tab:" + tab.title);
          await sleep(900); 
          chrome.tabs.remove(tabObject.id, function(){console.log('Tab Closed!'); })
          return false;
            }
      }
      i++;  
      if (i < 10) {  
        mainLoop(); 
      } 
    }, 300)
  }
  mainLoop();  
});
console.log('AWS VPN Companion V1.0.0');
