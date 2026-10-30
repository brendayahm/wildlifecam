// Vercel serverless endpoint. Never expose OPENAI_API_KEY in browser code.
module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return res.status(503).json({error:'Server has no OPENAI_API_KEY. Configure it in Vercel environment variables.'});
  const image=req.body?.image;
  if(typeof image!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(image)||image.length>9_000_000)return res.status(400).json({error:'Send a JPEG photo under 7 MB.'});
  const prompt=`You are a cautious field-observation assistant. Analyze the photograph only for wildlife identification and safe distant observation. Never assert certainty when uncertain. Do not diagnose injury, illness, abandonment or whether intervention is needed from a photo. If wildlife is not visible, say so. If age, exact species, location or key features are unknown, be explicit. Do not recommend moving, handling, feeding, approaching, capturing, transporting or treating wildlife; advise contacting a licensed wildlife rehabilitator/local authority for suspected injury or danger. Respond with ONLY a JSON object with exactly these string keys: identification (common-name candidate or broad group, with uncertain wording), certainty (one of Low, Moderate; never High), description (1-2 sentences), visible_clues (brief), safety_guidance (2-3 sentences). No markdown.`;
  try{
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5.5',max_output_tokens:450,input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:image,detail:'auto'}]}]})});
    const payload=await response.json();
    if(!response.ok){console.error('AI upstream:',response.status,payload?.error?.code);return res.status(502).json({error:'AI service unavailable. Verify API key, model access, and billing.'})}
    const raw=payload.output_text||payload.output?.flatMap(o=>o.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('')||'';
    let parsed;try{parsed=JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g,''))}catch{console.error('Non-JSON AI output');return res.status(502).json({error:'AI returned an unexpected response. Please retry.'})}
    const result={};for(const k of ['identification','certainty','description','visible_clues','safety_guidance'])result[k]=typeof parsed[k]==='string'?parsed[k].slice(0,1000):'';
    if(!['Low','Moderate'].includes(result.certainty))result.certainty='Low';
    return res.status(200).json(result);
  }catch(e){console.error('AI call failed:',e.message);return res.status(502).json({error:'Unable to reach the AI service.'})}
};
