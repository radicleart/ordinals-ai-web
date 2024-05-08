import { CONFIG } from '$lib/config';

async function extractInscriptionResponse(path:string) {
  const response = await fetch(path);
  if (response.status !== 200) throw new Error('Error from server: ' + response)
  try {
    return await response.text();
  } catch(err:any) {
    throw new Error('Error from server: ' + err)
  }
}

export async function fetchInscriptionWebContent(inscription:string) {
  try {
    const path = `${CONFIG.VITE_API_INSCRIPTIONS1}/content/${inscription}`
    return await extractInscriptionResponse(path);
  } catch (err:any) {
    const path = `${CONFIG.VITE_API_INSCRIPTIONS2}/content/${inscription}`
    return await extractInscriptionResponse(path);
  }
}

export async function fetchInscriptionMidiContent(inscription:string) {
  const path = `${CONFIG.VITE_API_BACKEND}/runes-api/v1/audionals/collect/${inscription}`
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    // Setting response type to arraybuffer 
    //responseType: "arraybuffer"
  })
  if (response.ok){
    return response.arrayBuffer();
  }
}

export async function convertToMidi(inscription:string) {
  const path = `${CONFIG.VITE_API_BACKEND}/runes-api/v1/audionals/convert/${inscription}`
  return await extractInscriptionResponse(path);
}

