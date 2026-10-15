export interface ContactoPublico { nombre:string; empresaDeclarada?:string; telefono:string; email:string; mensaje:string; consentimiento:boolean; sitioWeb?:string }
export interface SuscripcionPublica { email:string; consentimiento:boolean; sitioWeb?:string }
export interface RecepcionPublica { recibido:true }
