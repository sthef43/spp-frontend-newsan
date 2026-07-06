import{r as d,j as e,aG as S,aH as y,aI as A,aJ as k,aN as T,cU as F,aK as L,b as M,aL as D,u as R,H as v,bV as C,b2 as B,ap as I,B as w,R as N,al as z,eX as O,eY as U,f as _,a as V,d as G,fD as H,p as q}from"./index-BkiOUA73.js";import{C as W}from"./ContainerForPages-Ccuziq8t.js";import{a as K}from"./usePlantApi-CpFULeWH.js";import{d as Y}from"./Edit-Dsm__2H5.js";import{u as $}from"./UseFetchApiMultiResults-BUM1oLnz.js";import"./FetchApi-CbA39Rz3.js";const J=48,X=8,Z=({listItems:l=[],valueLabel:a,valueSelect:t,value:o,onChange:p,activeMultiple:i=!1,label:n,variant:x="outlined",disabled:h=!1,error:u=!1,helperText:m=" "})=>{const f=d.useMemo(()=>{const c=new Map;return l.forEach(s=>{c.set(t(s),a(s))}),c},[l,t,a]),g=d.useMemo(()=>i?Array.isArray(o)?o:[]:o??"",[o,i]),j=c=>{const s=c.target.value,r=typeof s=="string"&&i?s.split(","):s;p(r)};return e.jsxs(S,{fullWidth:!0,variant:x,error:u,children:[e.jsx(y,{id:`select-label-${n}`,children:n}),e.jsx(A,{multiple:i,labelId:`select-label-${n}`,label:n,value:g,onChange:j,disabled:h,MenuProps:i?{disablePortal:!0,PaperProps:{style:{maxHeight:J*4.5+X,width:"auto",minWidth:250}}}:void 0,renderValue:i?c=>{const s=c;return e.jsx(T,{sx:{display:"flex",flexWrap:"wrap",gap:.5},children:s.map((r,b)=>e.jsx(F,{label:f.get(r)||r,size:"small"},b))})}:void 0,children:l.map((c,s)=>{const r=t(c),b=a(c);return e.jsx(k,{value:r,children:b},s)})}),e.jsx(L,{error:u,children:m})]})};function Q(){const{FetchPut:l}=$(),{openNotificationUI:a}=M();return{execute:d.useCallback(o=>new Promise((p,i)=>{l({consoleLog:!1,modelPut:o,sliceRequest:D.putRequest,activeConfirmation:!0,mensajePersonalizado:!0,messageUser:"Se actualizaran los datos de la linea seleccionada, ¿desea continuar?",titleUser:"Actualizar linea",functionAdd(n){a("Se actualizo correctamente","success"),p(n)},functionReject(n){a("Ocurrio un error al intentar actualizar el elemento","error"),i(n)}})}),[])}}const E=({setOpenModal:l,dataEdit:a})=>{const{control:t,handleSubmit:o,setValue:p,formState:{isDirty:i,isValid:n}}=R({defaultValues:a,mode:"onChange"}),[x,h]=d.useState(a.activa),{execute:u}=Q(),m=async s=>{try{const r=f(s);await u(r),l(!1)}catch(r){console.log(r)}},f=s=>({...s,idLinea:a.idLinea,FPY:a==null?void 0:a.fpy,porcentajeFpy:a==null?void 0:a.porcentajeFpy,estadoAndon:a==null?void 0:a.estadoAndon,imprimeNroserie:a==null?void 0:a.imprimeNroserie,verficaMes:a==null?void 0:a.verficaMes});d.useEffect(()=>{p("activa",x)},[x]);const g=d.useMemo(()=>[{label:"¿Relaciona Plis?",field:"relacionaPlis"},{label:"¿Relaciona EBS?",field:"relacionaEbs"},{label:"¿Relaciona Trazabilidad?",field:"relacionaTrazabilidad"},{label:"¿Relaciona Caja Eléctrica?",field:"relacionaCajaElec"},{label:"¿Relaciona el Manual?",field:"relacionaManual"},{label:"¿Utiliza reparar Plaquetas?",field:"utilizaReparPlaqueta"}],[]),j=d.useMemo(()=>[{label:"¿Utiliza reparar PLIS?",field:"utilizaReparPlis"},{label:"Testing LG",field:"testingLg"},{label:"Testing LG/CE",field:"testingLgCe"},{label:"Testing IDU/CE",field:"testingIDUCE"},{label:"¿Es trazabilidad LG?",field:"trazabilidadLG"},{label:"Desvincular Evaporador",field:"desvinculaEvaporador"}],[]),c=(s,r)=>e.jsx(v,{name:s,control:t,render:({field:b})=>e.jsxs("div",{className:"flex items-center justify-between py-1 border-b border-[var(--border)]",children:[e.jsx("div",{className:"text-[12px] font-medium",children:r}),e.jsx(C,{className:"admin-switch switch-capsule-blue",checked:b.value==="S",onChange:P=>b.onChange(P.target.checked?"S":"N")})]})},s);return e.jsxs("div",{className:"w-[90vw] txt",children:[e.jsx("form",{onSubmit:o(m),children:e.jsxs("div",{className:"bg2 rounded-[5px]",children:[e.jsxs("div",{className:"grid grid-cols-6 gap-[35px] text-center py-3 px-12 text-[12px] font-medium",children:[e.jsxs("div",{children:[e.jsx("div",{children:"Línea"}),e.jsx("div",{children:(a==null?void 0:a.descripcion)||"-"})]}),e.jsxs("div",{children:[e.jsx("div",{children:"Alias"}),e.jsx("div",{children:(a==null?void 0:a.alias)||"-"})]}),e.jsxs("div",{children:[e.jsx("div",{children:"Código"}),e.jsx("div",{children:(a==null?void 0:a.codigo)||"-"})]}),e.jsxs("div",{children:[e.jsx("div",{children:"Tipo"}),e.jsx("div",{children:(a==null?void 0:a.tipo)||"-"})]}),e.jsxs("div",{children:[e.jsx("div",{children:"Tipo de Unidad"}),e.jsx("div",{children:(a==null?void 0:a.tipoUnidad)||"-"})]}),e.jsxs("div",{children:[e.jsx("div",{children:"Código de Inicio"}),e.jsx("div",{children:(a==null?void 0:a.codigoInicio)||"-"})]})]}),e.jsx("div",{className:"border-b border-[var(--border)] mb-5"}),e.jsxs("div",{className:"grid grid-cols-3 gap-3 px-2",children:[e.jsx("div",{className:"px-12",children:g.map(s=>c(s.field,s.label))}),e.jsx("div",{className:"px-12 border-x border-[var(--border)]",children:j.map(s=>c(s.field,s.label))}),e.jsxs("div",{className:"px-12",children:[e.jsx(v,{name:"accesorios",control:t,render:({field:s})=>e.jsxs("div",{className:"flex items-center justify-between py-1 border-b border-[var(--border)]",children:[e.jsx("div",{className:"text-[12px] font-medium",children:"¿Lleva Accesorios?"}),e.jsx(C,{className:"admin-switch switch-capsule-blue",checked:s.value==="S",onChange:r=>s.onChange(r.target.checked?"S":"N")})]})}),e.jsxs("div",{className:"pt-4",children:[e.jsx("div",{className:"text-[12px] font-medium mb-2",children:"Tipo de Producción"}),e.jsx(v,{name:"tipoProduccion",control:t,render:({field:s})=>e.jsx("input",{...s,className:"w-full h-[44px] font-normal text-[12px] px-3",style:{backgroundColor:"var(--inputBg)"}})})]}),e.jsxs("div",{className:"pt-4",children:[e.jsx("div",{className:"text-[12px] font-medium mb-2",children:"Lote Siguiente"}),e.jsx(v,{name:"loteSiguiente",control:t,render:({field:s})=>e.jsx("input",{...s,className:"w-full h-[44px] font-normal text-[12px] px-3",style:{backgroundColor:"var(--inputBg)"}})})]}),e.jsx("div",{className:"pt-3",children:e.jsx(B,{label:e.jsx("span",{className:" text-[14px] font-semibold",children:"¿Activa?"}),control:e.jsx(v,{name:"activa",control:t,render:({field:s})=>e.jsx(I,{checked:x,onClick:()=>h(!x),...s})})})})]})]}),e.jsxs("div",{className:"flex justify-end gap-[45px] pt-6 py-6 px-[55px]",children:[e.jsx(w,{variant:"text",onClick:()=>l(!1),className:"text-[12px] font-semibold text-[var(--inputText)]",children:"Cancelar"}),e.jsx(w,{type:"submit",variant:"contained",disabled:!i&&!n,className:"!w-[140px] !h-[40px] !bg-[#137FEC] hover:!bg-[#2c94fdff] !text-white !px-10 !text-[12px] !font-semibold",children:"Guardar"})]})]})}),e.jsx("style",{children:`
      .admin-switch{margin-right: -6px; height: 42px }

      .txt{color: #3F3D56}
      .dark .txt{color: #FFF}

      :root{
        --inputBg: #EFF8FF;
        --inputText: #000000;
        --border: #c4c4c459;
        --track: #BDBDBD;
      }
      
      .dark{
        --inputBg: #000D27;
        --inputText: #ffffff;
        --border: #5353534a;
        --track: #000D27;
      }

      .bg{background-color: #EFF8FF;}
      .dark .bg{background-color: #001947;}

      //___SWITCH PERSONALIZADO___//
      * TAMAÑO */
      .switch-capsule-blue{
      width: 44px !important;
      height: 24px !important;
      padding: 0 !important;
      }

      /* BASE */
      .switch-capsule-blue .MuiSwitch-switchBase{
      padding: 3px !important;
      }

      /* CAPSULA */
      .switch-capsule-blue .MuiSwitch-track{
      background-color:var(--track) !important;
      opacity: 1 !important;
      border-radius: 999px !important;
      }

      /* THUMB */
      .switch-capsule-blue .MuiSwitch-thumb{
      width: 12px !important;
      height: 12px !important;
      background-color: #ffffff !important;
      }

      /* OFF */
      .switch-capsule-blue .MuiSwitch-switchBase{
      transform: translate(3px, 2px);
      padding: 13px !important;
      }

      /* ON */
      .switch-capsule-blue .MuiSwitch-switchBase.Mui-checked{
      transform: translate(16px, 2px) !important;
      }

      /* TRACK */
      .switch-capsule-blue .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track{
      background-color: #137FEC !important;
      }  
      `})]})},ee=({lineas:l})=>{const[a,t]=d.useState(!1),[o,p]=d.useState({}),[i,n]=N.useState(5),[x,h]=N.useState(0),u=(l??[]).length,m=i>0?(l??[]).slice(x*i,x*i+i):l??[],f=d.useCallback(s=>{p(s),t(!0)},[]),g=d.useCallback(s=>{t(s)},[]),j=(s,r)=>{h(r)},c=s=>{n(parseInt(s.target.value,10)),h(0)};return N.useEffect(()=>{const s=Math.max(0,Math.ceil(u/i)-1);x>s&&h(0)},[u,i]),e.jsxs("div",{className:"text-textNew",children:[e.jsxs("div",{className:"mx-2 mb-3 overflow-hidden rounded-[3px]",children:[e.jsx("div",{className:"border-b border-gray-400 border-divider w-full mb-5"}),e.jsxs("table",{className:"bg-New shadow-Box rounded-xs w-full table-fixed",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"text-[14px] text-center bg-NewTertiary",children:[e.jsx("th",{className:"py-[14px] px-[20px] text-left font-semibold",children:"Línea"}),e.jsx("th",{className:"font-semibold",children:"Alias"}),e.jsx("th",{className:"font-semibold",children:"Código"}),e.jsx("th",{className:"font-semibold",children:"Tipo"}),e.jsx("th",{className:"font-semibold",children:"Tipo de Unidad"}),e.jsx("th",{className:"font-semibold",children:"Código"}),e.jsx("th",{className:"font-semibold",children:"Acción"})]})}),e.jsxs("tbody",{children:[m==null?void 0:m.map((s,r)=>e.jsxs("tr",{className:"text-[12px] text-center font-regular",children:[e.jsx("td",{className:"py-[25px] px-[15px] text-left",children:s.descripcion}),e.jsx("td",{children:s.alias}),e.jsx("td",{children:s.codigo}),e.jsx("td",{children:s.tipo}),e.jsx("td",{children:s.tipoUnidad}),e.jsx("td",{children:s.codigoInicio}),e.jsx("td",{children:e.jsx(z,{size:"medium",onClick:()=>f(s),className:"text-[#1976d2]",children:e.jsx(Y,{fontSize:"medium"})})})]},s.idLinea)),!(l!=null&&l.length)&&e.jsx("tr",{className:"border-t border-divider ",children:e.jsx("td",{colSpan:7,className:"h-[220px]"})})]})]}),e.jsx(O,{rowsPerPageOptions:[5,8,12,25,50],component:"div",count:u,rowsPerPage:i,page:x,sx:{backgroundColor:s=>s.palette.mode==="dark"?"rgba(0, 25, 71, 1)":"#EFF8FF"},SelectProps:{inputProps:{"aria-label":"rows per page"},native:!0},onPageChange:j,onRowsPerPageChange:c,ActionsComponent:U})]}),e.jsx("div",{children:e.jsx(_,{titleModalStyle:"Audit",showModalCenterPage:!0,setOpenPopup:t,openPopup:a,title:"Edtiar campos de Líneas",subTitle:"Configure y gestione las relaciones técnicas de las líneas de producción",children:e.jsx(E,{dataEdit:o,setOpenModal:g})})}),e.jsx("style",{children:`
      /* OCULTA EL TÍTULO DEL MODALCOMPONENT */
      .MuiDialogTitle-root .bg-gradient-to-r:has(h1:empty) {display: none !important;}
      .MuiDialogTitle-root:has(h1:empty) {display: none !important;}
      table tbody tr:nth-child(odd){background-color: #ffffff;}
      table tbody tr:nth-child(even){background-color: #EFF8FF;}
      .dark table tbody tr:nth-child(odd){background-color: #000D27;}
      .dark table tbody tr:nth-child(even){background-color: rgba(0, 25, 71, 1);}
      `})]})},te=()=>{const l=V(n=>n.linea.dataAll),[a,t]=d.useState(),{TitleChanger:o}=G(),p=H(),{response:i}=K();return d.useEffect(()=>{o("Administrar líneas")},[]),e.jsxs(W,{activeEffectVisible:!0,optionsLayout:"page",children:[e.jsx("h2",{className:"text-3xl font-bold",children:"Administrar Líneas"}),e.jsx("div",{className:"w-1/4 mt-4 p-2",children:e.jsx(Z,{label:"Seleccionar Planta",listItems:i,value:a,onChange:n=>{t(n),p(q.actions.setSelectPlant(n))},valueLabel:n=>n.name,valueSelect:n=>n.id})}),e.jsx(ee,{lineas:l})]})};export{te as AdministrarLineasPage};
