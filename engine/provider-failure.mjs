// Failure diagnostics only: never save raw provider messages, identifiers or text.
const codes=new Set(['rate_limit_exceeded','context_length_exceeded','request_too_large','invalid_request_error','json_validate_failed','model_not_found']);
export async function safeProviderFailure(response){
 const result={code:'unrecognised',body_status:'unavailable',limit:null,requested:null,unit:null};
 if(!response.body?.getReader)return result;
 const reader=response.body.getReader();let size=0,parts=[];
 try{
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16384){await reader.cancel();return {...result,body_status:'too_large'};}parts.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.byteLength;}
  const body=JSON.parse(new TextDecoder().decode(bytes)),error=body?.error;
  result.body_status='parsed';
  if(codes.has(error?.code))result.code=error.code;
  else if(codes.has(error?.type))result.code=error.type;
  // Extract only the specific aggregate TPM pair, not arbitrary numbers from
  // provider prose. This is a provider-reported limit, never actual token usage.
  if(typeof error?.message==='string'){
   const pair=error.message.match(/tokens per minute \(TPM\): Limit (\d{1,7}), Requested (\d{1,7})(?=\D|$)/i);
   if(pair){result.unit='tokens_per_minute';result.limit=Number(pair[1]);result.requested=Number(pair[2]);}
  }
  return result;
 }catch{return {...result,body_status:'unreadable'};}
 finally{reader.releaseLock();}
}
