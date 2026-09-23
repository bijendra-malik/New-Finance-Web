import { useState, useRef } from "react";

interface DocumentUploadProps {
  applicationId?: string;
}

const C = { teal:"#26ae90", navy:"#066a9c", dark:"#286090", gray:"#7b7b7b",
  tealBg:"rgba(38,174,144,0.08)", navyBg:"rgba(6,106,156,0.08)" };

const DOCS = [
  { id:"pan",        name:"PAN Card",                note:"Applicant / entity PAN",              icon:"💳", required:true },
  { id:"idProof",    name:"Passport / ID Proof",      note:"Aadhaar / Voter ID / Passport",       icon:"🪪", required:true },
  { id:"photo",      name:"Passport Photo",           note:"All applicants & co-applicants",      icon:"🖼️", required:true },
  { id:"income",     name:"ITR / Financials",         note:"Last 3 years, signed by CA",          icon:"💼", required:true },
  { id:"bank",       name:"Bank Statement",           note:"Last 12 months — main account",       icon:"🏦", required:true },
  { id:"lease",      name:"Lease Agreement",          note:"Copy along with latest rent receipt", icon:"📃", required:true },
  { id:"entity",     name:"Business Registration",    note:"Incorporation / Partnership Deed",    icon:"🏢", required:false },
  { id:"property",   name:"Property Documents",       note:"Title deed / ownership proof",        icon:"🏬", required:true },
];

interface DocState { file:File|null; preview:string|null; uploading:boolean; done:boolean; error:string; }

const DocumentUpload = ({ applicationId:_id }: DocumentUploadProps) => {
  const [docs, setDocs] = useState<Record<string,DocState>>(
    Object.fromEntries(DOCS.map(d=>[d.id,{file:null,preview:null,uploading:false,done:false,error:""}]))
  );
  const refs = useRef<Record<string,HTMLInputElement|null>>({});

  const doneCount = Object.values(docs).filter(d=>d.done).length;

  const handleFile = async (id: string, file: File|null) => {
    if (!file) return;
    if (!["application/pdf","image/jpeg","image/jpg","image/png"].includes(file.type)) {
      setDocs(p=>({...p,[id]:{...p[id],error:"Only PDF, JPG, PNG allowed"}})); return;
    }
    if (file.size > 5*1024*1024) {
      setDocs(p=>({...p,[id]:{...p[id],error:"Max 5MB allowed"}})); return;
    }
    const preview = file.type.startsWith("image/")
      ? await new Promise<string>(res=>{const r=new FileReader();r.onload=e=>res(e.target?.result as string);r.readAsDataURL(file);})
      : null;
    setDocs(p=>({...p,[id]:{file,preview,uploading:true,done:false,error:""}}));
    await new Promise(res=>setTimeout(res,900)); // TODO: replace with real API
    setDocs(p=>({...p,[id]:{...p[id],uploading:false,done:true}}));
  };

  const remove = (id: string) => {
    setDocs(p=>({...p,[id]:{file:null,preview:null,uploading:false,done:false,error:""}}));
    if (refs.current[id]) refs.current[id]!.value="";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Progress header */}
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${C.teal}22`}}>
        <div className="px-6 py-4" style={{background:`linear-gradient(90deg,${C.tealBg},${C.navyBg})`,borderBottom:`1px solid ${C.teal}18`}}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold" style={{color:C.dark}}>Upload Documents</h2>
              <p className="text-xs mt-0.5" style={{color:C.gray}}>All marked documents are required for verification</p>
            </div>
            <span className="text-2xl font-extrabold" style={{color:C.teal}}>
              {doneCount}<span className="text-base font-semibold" style={{color:C.gray}}>/{DOCS.length}</span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{background:"rgba(0,0,0,0.06)"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${(doneCount/DOCS.length)*100}%`,background:`linear-gradient(90deg,${C.teal},${C.navy})`}}/>
          </div>
          <p className="text-[10px] mt-1.5 font-semibold" style={{color:C.gray}}>
            {doneCount===DOCS.length?"✓ All documents uploaded!":`${DOCS.length-doneCount} remaining`}
          </p>
        </div>
      </div>

      {/* ── 3-column grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCS.map(doc => {
          const s = docs[doc.id];
          return (
            <div key={doc.id} className="rounded-2xl overflow-hidden flex flex-col transition-all"
              style={{border:`1.5px solid ${s.done?C.teal:s.error?"#ef4444":"#e2e8f0"}`,
                background:"#fff", boxShadow:s.done?`0 4px 16px ${C.teal}20`:"none"}}>

              {/* Card top */}
              <div className="px-4 py-3 flex items-start justify-between gap-2"
                style={{background:s.done?C.tealBg:C.navyBg, borderBottom:`1px solid ${s.done?C.teal+"22":"#e2e8f0"}`}}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{doc.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight truncate" style={{color:C.dark}}>
                      {doc.name}{doc.required&&<span className="text-red-500 ml-0.5">*</span>}
                    </p>
                    <p className="text-[10px] truncate" style={{color:C.gray}}>{doc.note}</p>
                  </div>
                </div>
                {s.done&&(
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{background:C.teal}}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4 flex-1 flex flex-col justify-center">
                {s.done ? (
                  <div className="flex items-center gap-2.5">
                    {s.preview
                      ? <img src={s.preview} className="w-10 h-10 rounded-lg object-cover border shrink-0" style={{borderColor:C.teal+"44"}}/>
                      : <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{background:C.tealBg}}>📄</div>
                    }
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate" style={{color:C.dark}}>{s.file?.name}</p>
                      <p className="text-[10px]" style={{color:C.gray}}>{s.file?(s.file.size/1024).toFixed(0)+"KB":""}</p>
                    </div>
                    <button onClick={()=>remove(doc.id)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg shrink-0 transition-all"
                      style={{color:"#ef4444",background:"#fef2f2",border:"1px solid #fecaca"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"}
                      onMouseLeave={e=>e.currentTarget.style.background="#fef2f2"}>
                      ✕
                    </button>
                  </div>
                ) : s.uploading ? (
                  <div className="flex items-center gap-3 py-2">
                    <svg className="w-5 h-5 animate-spin shrink-0" style={{color:C.teal}} fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{color:C.dark}}>Uploading...</p>
                      <div className="w-full h-1 rounded-full mt-1 overflow-hidden" style={{background:"#e2e8f0"}}>
                        <div className="h-full rounded-full animate-pulse" style={{width:"65%",background:C.teal}}/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <input ref={el=>{refs.current[doc.id]=el;}} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={e=>handleFile(doc.id,e.target.files?.[0]??null)}/>
                    <button onClick={()=>refs.current[doc.id]?.click()}
                      className="w-full py-3 rounded-xl text-xs font-semibold border-2 border-dashed transition-all flex items-center justify-center gap-2"
                      style={{borderColor:`${C.teal}55`,color:C.navy,background:C.tealBg}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background=`${C.teal}14`;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=`${C.teal}55`;e.currentTarget.style.background=C.tealBg;}}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Click to upload
                    </button>
                    {s.error&&<p className="text-[10px] text-red-500 mt-1.5 text-center">{s.error}</p>}
                    <p className="text-[9px] text-center mt-1" style={{color:C.gray}}>PDF, JPG, PNG · max 5MB</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="rounded-xl p-4" style={{background:C.navyBg,border:`1px solid ${C.navy}22`}}>
        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{color:C.navy}}>💡 Tips</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {["Use clear, high-quality scans","All text must be readable","File size: 100KB – 5MB","Formats: PDF, JPG, PNG"].map(t=>(
            <li key={t} className="flex items-start gap-1.5 text-xs" style={{color:C.gray}}>
              <span style={{color:C.teal}}>✓</span>{t}
            </li>
          ))}
        </ul>
      </div>

      {/* All done */}
      {doneCount===DOCS.length&&(
        <div className="rounded-2xl p-6 text-center" style={{background:`linear-gradient(135deg,${C.teal}18,${C.navy}12)`,border:`1.5px solid ${C.teal}44`}}>
          <p className="font-bold mb-3 text-sm" style={{color:C.dark}}>✓ All documents uploaded successfully!</p>
          <button className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg"
            style={{background:`linear-gradient(135deg,${C.teal},${C.navy})`}}>
            Submit Documents
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
