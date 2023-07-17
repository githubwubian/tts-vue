const axios = require("axios");

const { ipcRenderer } = require("electron");

async function getTTSData(
  inps: any,
  voice: string,
  express: string,
  role: string,
  rate = 0,
  pitch = 0,
  api: number,
  key: string,
  region: string
) {
  let SSML = "";
  if (inps.activeIndex == "1" && (api == 1 || api == 3)) {
    SSML = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
            <mstts:express-as  ${
              express != "" ? 'style="' + express + '"' : ""
            } ${role != "" ? 'role="' + role + '"' : ""}>
                <prosody rate="${rate}%" pitch="${pitch}%">
                ${inps.inputValue}
                </prosody>
            </mstts:express-as>
        </voice>
    </speak>
    `;
  }
  else if (inps.activeIndex == "1" && api == 2) {
    SSML = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
            <prosody rate="${rate}%" pitch="${pitch}%">
            ${inps.inputValue}
            </prosody>
        </voice>
    </speak>
    `;
  }
  else {
    SSML = inps.inputValue;
  }
  ipcRenderer.send("log.info", SSML);
  console.log(SSML);
  if (api == 1) {
    const result = await ipcRenderer.invoke("speech", SSML);
    return result;
  } else if (api == 2) {
    const result = await ipcRenderer.invoke("edgeApi", SSML);
    return result;
  } else {
    const result = await ipcRenderer.invoke("azureApi", SSML, key, region);
    return result;
  }
}
export default getTTSData;
