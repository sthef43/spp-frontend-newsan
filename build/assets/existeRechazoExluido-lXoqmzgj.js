const l=(o,a,i)=>{const s=a.filter(e=>e.idControlLote!==i);console.log(s,"rechazos sin el que edito");let t=!1;return s.map(e=>{o>=e.serieDesde&&o<=e.serieHasta&&(t=!0)}),t};export{l as e};
