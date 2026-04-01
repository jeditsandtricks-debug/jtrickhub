import{useState}from"react";
import{useUser}from"../context/UserContext";
import{useSettings}from"../context/SettingsContext";
import{User,Sparkles}from"lucide-react";

export default function UserNameModal(){
  const{setName}=useUser();
  const{settings}=useSettings();
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();const n=input.trim();if(n.length<2)return;
    setLoading(true);await setName(n);setLoading(false);
  }

  return(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{background:"rgba(0,0,0,0.9)",backdropFilter:"blur(12px)"}}>
      <div className="w-full max-w-sm p-8 rounded-2xl fade-in" style={{background:"var(--sur)",border:"1px solid var(--bor)"}}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{background:"linear-gradient(135deg,var(--cp),var(--ca))"}}>
            {settings.logoIcon||"⚡"}
          </div>
          <h2 className="text-xl font-bold mb-1" style={{fontFamily:"var(--fd)",color:"var(--tx)"}}>{settings.siteName}</h2>
          <p className="text-sm" style={{color:"var(--mu)"}}>Enter your name to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--mu)"}}/>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Your name..." autoFocus maxLength={25} className="field pl-9"/>
          </div>
          <button type="submit" disabled={loading||input.trim().length<2} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
            <Sparkles size={15}/>{loading?"Joining...":"Let's Go!"}
          </button>
        </form>
      </div>
    </div>
  );
}
