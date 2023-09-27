import { ls } from 'vue-lsp';

export function setPageTitle(title) {
  
  title = title || 'หน้าเว็บไซต์';
  const hostName = ls.get('host') ? ls.get('host').name : "FTI Academy";
  document.title = `${title} / ${hostName}`;

  console.log("Change Title");
}