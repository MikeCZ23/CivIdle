import { L, t } from "../../../shared/utilities/i18n";
import logo from "../../images/icon.png";
import { getVersion } from "../logic/Version";
import { Singleton } from "../utilities/Singleton";
import { playClick } from "../visuals/Sound";
import { hideModal } from "./GlobalModal";

export function AboutModal(): React.ReactNode {
   return (
      <div className="window">
         <div className="title-bar">
            <div className="title-bar-text">{t(L.About)}</div>
         </div>
         <div className="window-body">
            <div className="row" style={{ margin: "15px 0 0 0" }}>
               <div style={{ alignSelf: "flex-start" }}>
                  <img src={logo} style={{ width: "72px", height: "72px", margin: "0 10px 0 0" }} />
               </div>
               <div className="f1">
                  <div className="text-strong">{t(L.CivIdle)}</div>
                  <div>{getVersion()}</div>
                  <div>{t(L.CivIdleInfo)}</div>
                  {L.CurrentLanguage === "English" ? null : (
                     <div>
                        {t(L.Translators)}: {t(L.TranslatorCredit)}
                     </div>
                  )}
                  <hr className="mv10" />
                  <div className="text-small text-desc">
                     {t(L.GraphicsDriver, { driver: getWebglRenderInfo() })}
                  </div>
                  <div className="text-small text-desc">
                     {t(L.UserAgent, { driver: navigator.userAgent })}
                  </div>
               </div>
            </div>
            <div className="text-right" style={{ margin: "20px 0 0 0" }}>
               <button
                  style={{ padding: "0 30px" }}
                  onClick={() => {
                     playClick();
                     hideModal();
                  }}
               >
                  {t(L.Ok)}
               </button>
            </div>
         </div>
      </div>
   );
}

function getWebglRenderInfo(): string {
   const { app } = Singleton().sceneManager.getContext();
   const gl = app.view.getContext("webgl2");
   if (!gl) {
      return "";
   }
   const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
   if (!debugInfo) {
      return "";
   }
   // const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
   const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
   return renderer;
}
