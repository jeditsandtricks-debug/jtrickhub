import{useSettings}from"../context/SettingsContext";
export default function BlockedScreen(){
  const{settings}=useSettings();
  return(
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{background:"var(--bg)"}}>
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold mb-2" style={{fontFamily:"var(--fd)",color:"var(--tx)"}}>Access Blocked</h1>
        <p className="text-sm" style={{color:"var(--mu)"}}>You have been blocked from {settings.siteName}.</p>
      </div>
    </div>
  );
}
