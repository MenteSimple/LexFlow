import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, FileText, Shield, Building2, Scale, PenTool,
  Search, Bell, ChevronDown, AlertTriangle, Zap, Star, ArrowRight, Menu,
  CheckCircle, XCircle, AlertCircle, Send, X, BookOpen,
  Clock, Copy, Filter, ChevronRight, User, Tag, GitMerge, FileSearch,
  ShieldCheck, Download, ListChecks, MapPin, Briefcase,
  Upload, Mail, Wifi, WifiOff, ArrowLeftRight, FileDown, Eye, Trash2, FilePlus2,
  Users, Lightbulb, ChevronLeft, BarChart3
} from "lucide-react";

// ─── DASHBOARD DATA ───────────────────────────────────────────────────────────

const RISK_DATA = [
  { name: "Alto",  value: 8,  color: "#ef4444" },
  { name: "Medio", value: 15, color: "#FFB510" },
  { name: "Bajo",  value: 23, color: "#10B991" },
];

const TASK_DATA = [
  { module: "Contratos",   tasks: 12, fill: "#6446E5" },
  { module: "NDA",         tasks: 7,  fill: "#09C8D4" },
  { module: "Compliance",  tasks: 5,  fill: "#10B991" },
  { module: "Proveedores", tasks: 8,  fill: "#FFB510" },
  { module: "Firmas",      tasks: 4,  fill: "#0E1EAB" },
];

const ACTIVITY = [
  { id: 1, Icon: FileText,  text: "Contrato Proveedor XYZ revisado",         time: "Hace 2h",  risk: "alto"  },
  { id: 2, Icon: Shield,    text: "NDA Tech Solutions – aprobado",            time: "Hace 4h",  risk: "bajo"  },
  { id: 3, Icon: Building2, text: "KYB Empresa ABC completado",               time: "Ayer",     risk: "medio" },
  { id: 4, Icon: PenTool,   text: "Firma pendiente: Contrato de Servicios",   time: "Ayer",     risk: "medio" },
  { id: 5, Icon: Scale,     text: "Sentencia T-030/24 consultada",            time: "Hace 2d",  risk: "bajo"  },
];

const NAV = [
  { id: "dashboard",      label: "Dashboard",       Icon: LayoutDashboard },
  { id: "contratos",      label: "Contratos & NDA", Icon: FileText         },
  { id: "jurisprudencia", label: "Jurisprudencia",  Icon: Scale            },
  { id: "compliance",     label: "Compliance",      Icon: Shield           },
  { id: "proveedores",    label: "Proveedores",     Icon: Building2        },
  { id: "firmas",         label: "Firmas",          Icon: PenTool          },
];

const JURISDICTIONS = [
  { code: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "MX", flag: "🇲🇽", name: "México"   },
  { code: "PE", flag: "🇵🇪", name: "Perú"     },
  { code: "CL", flag: "🇨🇱", name: "Chile"    },
];

const CONNECTORS = [
  { name: "DocuSign",   online: true,  sync: "5 min",  desc: "Flujos de firma activos" },
  { name: "Legis",      online: true,  sync: "12 min", desc: "Base jurídica sincronizada" },
  { name: "SharePoint", online: false, sync: null,     desc: "Sin conexión — verificar VPN" },
  { name: "Slack",      online: true,  sync: "1 min",  desc: "Notificaciones activas" },
];

const MODULES = {};

// ─── CONTRATOS MODULE DATA ────────────────────────────────────────────────────

const LOAD_MSGS = [
  "Escaneando cláusulas...",
  "Evaluando niveles de riesgo...",
  "Generando sugerencias Redline...",
  "Compilando resultados...",
];

const DOC_TYPES = [
  "NDA",
  "Contrato Mercantil",
  "Contrato de Arrendamiento",
  "Contrato Laboral",
  "Contrato de Servicios",
];

const SAMPLE_TEXT = {
  "NDA":
`ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN

Partes: EMPRESA ALFA S.A.S. (NIT 900.123.456-7) y BETA TECH LTDA. (NIT 901.987.654-3)

Art. 1 – OBJETO: Las partes acuerdan guardar reserva sobre toda información intercambiada en el marco de la negociación.

Art. 2 – INFORMACIÓN CONFIDENCIAL: Se considera confidencial toda información técnica, financiera o comercial revelada durante la vigencia del acuerdo.

Art. 3 – VIGENCIA: Las obligaciones de confidencialidad estarán vigentes durante el período de la negociación.

Art. 4 – OBLIGACIONES: Las partes se obligan a no divulgar, reproducir ni transferir la información confidencial a terceros sin autorización escrita.

Art. 5 – CLÁUSULA PENAL: En caso de incumplimiento, el infractor pagará la suma de CINCO MILLONES DE PESOS ($5.000.000) como pena compensatoria.

Art. 7 – EXCEPCIONES: La obligación de reserva no aplicará cuando la información sea de dominio público.

Art. 9 – LEY APLICABLE: Este acuerdo se rige por las leyes de la República de Colombia.

Art. 10 – SOLUCIÓN DE CONTROVERSIAS: Las partes acuerdan someter sus diferencias al Centro de Arbitraje y Conciliación de la CCB.`,

  "Contrato Mercantil":
`CONTRATO DE COMPRAVENTA MERCANTIL

Partes: DISTRIBUIDORA S.A.S. (NIT 901.234.567-8) como VENDEDOR, y RETAIL COLOMBIA S.A.S. (NIT 900.876.543-1) como COMPRADOR.

Art. 1 – OBJETO: El VENDEDOR se compromete a transferir la propiedad de 10.000 unidades del producto "XYZ Premium".

Art. 2 – PRECIO Y PAGO: El precio es de $200.000.000 pesos colombianos, pagaderos en cuotas mensuales iguales durante 12 meses, sin intereses de mora.

Art. 3 – ENTREGA: El VENDEDOR entregará la mercancía en un plazo no determinado desde la firma del contrato.

Art. 4 – GARANTÍAS: El producto tiene garantía de 6 meses. El VENDEDOR no responde por vicios ocultos posteriores a la entrega.

Art. 5 – CLÁUSULA PENAL: En caso de incumplimiento del COMPRADOR, se aplicará una penalidad del 5% del valor total del contrato.

Art. 6 – INDEMNIDAD: Ninguna de las partes será responsable por daños indirectos o lucro cesante.

Art. 7 – LEY APLICABLE: Derecho colombiano. Jurisdicción: Tribunal de Arbitramento de la CCB.`,

  "Contrato de Arrendamiento":
`CONTRATO DE ARRENDAMIENTO COMERCIAL

Partes: INMOBILIARIA XYZ S.A.S. (NIT 900.555.444-2) como ARRENDADOR, y EMPRESA INQUILINA LTDA. (NIT 901.333.222-5) como ARRENDATARIO.

Art. 1 – INMUEBLE: Oficina ubicada en Calle 100 #15-20, Of. 501, Bogotá D.C.

Art. 2 – DESTINACIÓN: El inmueble se destinará exclusivamente al uso comercial y de oficinas.

Art. 3 – CANON: El canon mensual es de $8.500.000 pagaderos dentro de los primeros 5 días de cada mes.

Art. 4 – INCREMENTO: El canon se incrementará anualmente conforme al IPC certificado por el DANE más 2 puntos.

Art. 5 – PLAZO: El contrato tendrá una duración de 24 meses, con posibilidad de renovación.

Art. 6 – DEPÓSITO: El ARRENDATARIO entregará como depósito el equivalente a 2 meses de canon ($17.000.000).

Art. 7 – MEJORAS: Cualquier mejora o adición al inmueble quedará a favor del ARRENDADOR sin compensación.

Art. 8 – RESTITUCIÓN: En caso de restitución anticipada sin justa causa, el ARRENDATARIO pagará los cánones pendientes hasta la terminación del plazo.`,

  "Contrato Laboral":
`CONTRATO DE TRABAJO A TÉRMINO INDEFINIDO

Partes: EMPRESA EMPLEADORA S.A.S. (NIT 900.111.222-3) como EMPLEADOR, y JUAN PÉREZ C.C. 1.020.345.678 como TRABAJADOR.

Art. 1 – CARGO: El TRABAJADOR se desempeñará como Analista de Sistemas.

Art. 2 – SALARIO: El TRABAJADOR devengará un salario mensual de $4.500.000, más prestaciones de ley.

Art. 3 – JORNADA: La jornada será de lunes a viernes de 8:00 a.m. a 6:00 p.m. (10 horas diarias).

Art. 4 – LUGAR DE TRABAJO: Las funciones se desarrollarán en las instalaciones del EMPLEADOR o en modalidad híbrida.

Art. 5 – PERÍODO DE PRUEBA: Las partes acuerdan un período de prueba de 4 meses.

Art. 6 – CONFIDENCIALIDAD: El TRABAJADOR se compromete a guardar reserva de toda información empresarial.

Art. 7 – EXCLUSIVIDAD: El TRABAJADOR no podrá prestar servicios a competidores directos durante la vigencia del contrato.

Art. 8 – VACACIONES: El TRABAJADOR tendrá derecho a 15 días hábiles de vacaciones por año trabajado.`,

  "Contrato de Servicios":
`CONTRATO DE PRESTACIÓN DE SERVICIOS

Partes: CONTRATANTE CORP S.A.S. (NIT 900.777.888-4) y CONSULTOR INDEPENDIENTE (C.C. 80.123.456) como CONTRATISTA.

Art. 1 – OBJETO: El CONTRATISTA prestará servicios de consultoría en transformación digital por el período pactado.

Art. 2 – HONORARIOS: El CONTRATISTA recibirá $12.000.000 mensuales, pagaderos el último día del mes.

Art. 3 – DURACIÓN: El contrato tendrá vigencia de 6 meses a partir de la firma.

Art. 4 – AUTONOMÍA: El CONTRATISTA actúa con plena autonomía técnica y administrativa.

Art. 5 – ENTREGABLES: El CONTRATISTA presentará informes mensuales de avance.

Art. 6 – PROPIEDAD INTELECTUAL: Todos los entregables y desarrollos pertenecerán al CONTRATANTE.

Art. 7 – CONFIDENCIALIDAD: El CONTRATISTA guardará reserva sobre la información del CONTRATANTE durante la vigencia y por 2 años posteriores.

Art. 8 – RESPONSABILIDAD: El CONTRATANTE no responderá por daños causados por el CONTRATISTA a terceros.`,
};

const ANALYSIS = {
  "NDA": {
    score: 48,
    matrix: [
      { clause: "Art. 3 – Vigencia de la Reserva",       risk: "alto",  obs: "No define término fijo. Sin plazo determinado, la reserva puede ser inaplicable ante juez. Estándar en Colombia: 2–5 años (C.Co. Art. 263)." },
      { clause: "Art. 5 – Cláusula Penal",               risk: "alto",  obs: "Monto de $5M desproporcionadamente bajo. Riesgo de reducción judicial (Art. 1601 C.C.). Recomendado: 50–100 SMMLV." },
      { clause: "Art. 9 – Ley Aplicable y Datos Pers.",  risk: "medio", obs: "No referencia Ley 1581/2012 ni Decreto 1074/2015. Obligatorio si se comparten datos personales (SIC)." },
      { clause: "Art. 7 – Excepciones de Confidenc.",    risk: "medio", obs: "Lista incompleta. Faltan: orden judicial, conocimiento previo documentado, desarrollo independiente." },
      { clause: "Art. 2 – Información Confidencial",     risk: "bajo",  obs: "Adecuada pero no incluye información derivada ni subcontratistas. Se recomienda ampliar alcance." },
      { clause: "Art. 10 – Arbitramento CCB",            risk: "bajo",  obs: "Cláusula correctamente redactada. Sin observaciones materiales." },
    ],
    redlines: [
      {
        clause: "Art. 3 – Vigencia", risk: "alto",
        original:  "Las obligaciones de confidencialidad estarán vigentes durante el período de la negociación.",
        suggested: "Las obligaciones de confidencialidad estarán vigentes durante la negociación y por TRES (3) años adicionales contados desde su terminación, prorrogables de común acuerdo por escrito.",
      },
      {
        clause: "Art. 5 – Cláusula Penal", risk: "alto",
        original:  "En caso de incumplimiento, el infractor pagará la suma de CINCO MILLONES DE PESOS ($5.000.000) como pena compensatoria.",
        suggested: "En caso de incumplimiento, el infractor pagará CIEN (100) salarios mínimos legales mensuales vigentes (SMMLV) como pena compensatoria, sin perjuicio de la indemnización adicional que resulte probada, conforme al Art. 1600 del C.C.",
      },
      {
        clause: "Art. 7 – Excepciones (ampliación)", risk: "medio",
        original:  "La obligación de reserva no aplicará cuando la información sea de dominio público.",
        suggested: "La obligación de reserva no aplicará cuando la información: (i) sea de dominio público por causa no imputable a las partes; (ii) fuera conocida por la parte receptora con anterioridad, con prueba documental; (iii) sea desarrollada de forma independiente; o (iv) deba revelarse por orden judicial o administrativa, notificando previamente a la otra parte.",
      },
    ],
    ndaCheck: [
      { id: 1, label: "Vigencia de la reserva definida con plazo fijo",    status: "fail", obs: "No especifica término. Jurisprudencia colombiana exige plazo determinado o determinable." },
      { id: 2, label: "Cláusula penal proporcional al daño",               status: "fail", obs: "Monto ($5M) insuficiente para el valor comercial en juego. Riesgo de reducción judicial." },
      { id: 3, label: "Excepciones de confidencialidad completas",         status: "warn", obs: "Incompleta. Faltan supuestos de orden judicial y conocimiento previo documentado." },
      { id: 4, label: "Referencia Ley 1581/2012 (Datos Personales)",       status: "fail", obs: "Ausente. Obligatoria si se comparten datos de personas naturales (regulación SIC)." },
      { id: 5, label: "Ley aplicable y jurisdicción especificadas",        status: "pass", obs: "Correctamente establecida: Derecho colombiano + CCB." },
      { id: 6, label: "Identificación plena de las partes con NIT",        status: "pass", obs: "Ambas partes identificadas con NIT. Correcto." },
      { id: 7, label: "Mecanismo de solución de controversias",            status: "pass", obs: "Arbitramento CCB correctamente pactado (Ley 1563/2012)." },
    ],
    simple: "Este es un acuerdo de 'boca cerrada' entre dos empresas. El principal problema es que NO dice cuánto tiempo dura ese secreto — sin un plazo claro, es muy difícil hacerlo valer ante un juez. Además, si alguien lo viola, la multa pactada ($5 millones) es tan pequeña que no representa un desincentivo real. Por último, no menciona las reglas de protección de datos personales que la ley colombiana exige (Ley 1581 de 2012).",
  },

  "Contrato Mercantil": {
    score: 62,
    matrix: [
      { clause: "Art. 2 – Precio y Pago",           risk: "alto",  obs: "No incluye cláusula de ajuste por inflación (IPC). En contratos de 12 meses, el valor real puede erosionarse significativamente." },
      { clause: "Art. 3 – Plazo de Entrega",        risk: "alto",  obs: "Plazo 'no determinado' genera incertidumbre jurídica y dificulta el cobro de perjuicios por mora (Art. 1608 C.C.)." },
      { clause: "Art. 5 – Cláusula Penal",          risk: "medio", obs: "El 5% del valor total ($10M) puede ser insuficiente para cubrir perjuicios reales. Revisar proporcionalidad." },
      { clause: "Art. 4 – Garantías y Vicios",      risk: "medio", obs: "Exclusión de vicios ocultos puede contravenir Art. 934 del Código de Comercio colombiano." },
      { clause: "Art. 6 – Limitación de Daños",     risk: "bajo",  obs: "La limitación de daños indirectos es válida pero la redacción es amplia. Precisar alcance." },
    ],
    redlines: [
      {
        clause: "Art. 2 – Ajuste de Precio", risk: "alto",
        original:  "El precio es de $200.000.000 pesos colombianos, pagaderos en cuotas mensuales iguales durante 12 meses, sin intereses de mora.",
        suggested: "El precio total es de $200.000.000. Las cuotas mensuales se ajustarán anualmente conforme al IPC certificado por el DANE. Los saldos vencidos causarán intereses de mora a la tasa máxima legal certificada por la Superfinanciera.",
      },
      {
        clause: "Art. 3 – Plazo de Entrega", risk: "alto",
        original:  "El VENDEDOR entregará la mercancía en un plazo no determinado desde la firma del contrato.",
        suggested: "El VENDEDOR entregará la totalidad de la mercancía dentro de los TREINTA (30) días calendario siguientes a la firma del presente contrato, en la bodega del COMPRADOR ubicada en [DIRECCIÓN]. El incumplimiento de este plazo causará los perjuicios pactados en el Art. 5.",
      },
      {
        clause: "Art. 4 – Vicios Ocultos", risk: "medio",
        original:  "El VENDEDOR no responde por vicios ocultos posteriores a la entrega.",
        suggested: "El VENDEDOR responderá por vicios ocultos que hagan la cosa impropia para su uso natural, conforme al Art. 934 del Código de Comercio, durante los SEIS (6) meses siguientes a la entrega real y efectiva.",
      },
    ],
    ndaCheck: null,
    simple: "Contrato para comprar 10.000 productos por $200 millones en cuotas mensuales. Los dos problemas más serios: 1) no dice cuándo se entregan los productos (¡sin fecha de entrega!), y 2) los $200 millones no se ajustan con la inflación, lo que significa que el vendedor pierde poder adquisitivo durante el año de pago.",
  },

  "Contrato de Arrendamiento": {
    score: 74,
    matrix: [
      { clause: "Art. 7 – Mejoras y Adiciones",       risk: "alto",  obs: "Cláusula inequitativa. No distingue mejoras necesarias, útiles y voluptuarias (Art. 1994 C.C.). El arrendatario puede perder inversiones significativas." },
      { clause: "Art. 8 – Restitución Anticipada",    risk: "medio", obs: "Penalidad válida pero debe precisar si aplica únicamente al incumplimiento del arrendatario o también a terminación bilateral." },
      { clause: "Art. 3 – Canon y Pagos",             risk: "bajo",  obs: "Plazo de pago correcto (primeros 5 días). Acorde con la práctica comercial colombiana." },
      { clause: "Art. 4 – Incremento IPC+2",          risk: "bajo",  obs: "Ajuste de canon por IPC+2 es válido para uso comercial (L. 820/2003 solo limita incrementos en vivienda)." },
    ],
    redlines: [
      {
        clause: "Art. 7 – Mejoras", risk: "alto",
        original:  "Cualquier mejora o adición al inmueble quedará a favor del ARRENDADOR sin compensación.",
        suggested: "Las mejoras necesarias (Art. 1993 C.C.) serán reembolsadas por el ARRENDADOR. Las mejoras útiles quedarán a favor del ARRENDADOR previo avalúo acordado por las partes. Las mejoras voluptuarias podrán ser retiradas por el ARRENDATARIO sin deterioro del inmueble.",
      },
      {
        clause: "Art. 8 – Restitución Anticipada", risk: "medio",
        original:  "En caso de restitución anticipada sin justa causa, el ARRENDATARIO pagará los cánones pendientes hasta la terminación del plazo.",
        suggested: "En caso de restitución anticipada imputable exclusivamente al ARRENDATARIO, este pagará como indemnización el equivalente a TRES (3) cánones de arrendamiento, sin perjuicio de los cánones causados hasta la fecha de restitución efectiva.",
      },
    ],
    ndaCheck: null,
    simple: "Es un contrato para arrendar una oficina por 24 meses a $8.5 millones al mes. El mayor riesgo: si la empresa hace reformas en la oficina (pinturas, instalaciones, divisiones), pierde todo ese dinero invertido cuando se vaya, porque el arrendador se queda con todo sin pagar nada. En lo demás es un contrato bastante equilibrado.",
  },

  "Contrato Laboral": {
    score: 55,
    matrix: [
      { clause: "Art. 3 – Jornada de Trabajo",    risk: "alto",  obs: "10 horas diarias excede la jornada máxima de 8 horas (CST Art. 161). Las 2 horas extra deben pagarse con recargo del 25% diurno o 75% nocturno (Art. 168 CST)." },
      { clause: "Art. 5 – Período de Prueba",     risk: "alto",  obs: "4 meses excede el máximo legal de 2 meses para contratos indefinidos (CST Art. 78). Esta cláusula es nula de pleno derecho." },
      { clause: "Art. 7 – Exclusividad",          risk: "medio", obs: "Válida durante el contrato, pero la redacción amplia puede interpretarse como restricción al libre ejercicio profesional. Precisar alcance y sector." },
      { clause: "Art. 6 – Confidencialidad",      risk: "bajo",  obs: "Válida. Se recomienda precisar el período post-terminación (usualmente 1–2 años)." },
      { clause: "Art. 8 – Vacaciones",            risk: "bajo",  obs: "15 días hábiles correcto (CST Art. 186). Conforme a derecho." },
    ],
    redlines: [
      {
        clause: "Art. 3 – Jornada", risk: "alto",
        original:  "La jornada será de lunes a viernes de 8:00 a.m. a 6:00 p.m. (10 horas diarias).",
        suggested: "La jornada ordinaria será de lunes a viernes de 8:00 a.m. a 5:00 p.m. (8 horas diarias con 1 hora de almuerzo). El trabajo adicional a la jornada ordinaria se reconocerá como horas extras con los recargos establecidos en el Art. 168 del CST.",
      },
      {
        clause: "Art. 5 – Período de Prueba", risk: "alto",
        original:  "Las partes acuerdan un período de prueba de 4 meses.",
        suggested: "Las partes acuerdan un período de prueba de DOS (2) meses, conforme al artículo 78 del Código Sustantivo del Trabajo, aplicable a contratos a término indefinido.",
      },
      {
        clause: "Art. 7 – Exclusividad", risk: "medio",
        original:  "El TRABAJADOR no podrá prestar servicios a competidores directos durante la vigencia del contrato.",
        suggested: "Durante la vigencia del contrato, el TRABAJADOR se abstendrá de prestar servicios a empresas que desarrollen actividades directamente competidoras en el mismo mercado geográfico y segmento de producto. Esta restricción no limita el ejercicio de actividades profesionales en sectores distintos al del EMPLEADOR.",
      },
    ],
    ndaCheck: null,
    simple: "Este contrato tiene dos problemas legales graves: 1) La jornada de 10 horas al día viola el límite de 8 horas que fija el Código del Trabajo — las 2 horas extra deben pagarse con recargo, y 2) el período de prueba de 4 meses está prohibido; la ley solo permite máximo 2 meses. Estas cláusulas son nulas y el trabajador podría reclamar diferencias ante el Ministerio de Trabajo.",
  },

  "Contrato de Servicios": {
    score: 79,
    matrix: [
      { clause: "Art. 6 – Propiedad Intelectual",            risk: "medio", obs: "La cesión de PI es válida pero debe especificar: tipo de derechos cedidos, territorio, vigencia y si incluye versiones futuras (Ley 23/1982)." },
      { clause: "Art. 7 – Confidencialidad Post-Contractual", risk: "bajo",  obs: "2 años post-terminación es adecuado. Se recomienda incluir cláusula penal específica para el incumplimiento de esta obligación." },
      { clause: "Art. 4 – Autonomía del Contratista",         risk: "bajo",  obs: "Correctamente redactado para evitar subordinación laboral. Importante para evitar reclasificación como contrato laboral (CST Art. 23)." },
    ],
    redlines: [
      {
        clause: "Art. 6 – PI (precisión)", risk: "medio",
        original:  "Todos los entregables y desarrollos pertenecerán al CONTRATANTE.",
        suggested: "El CONTRATISTA cede al CONTRATANTE, de forma exclusiva, irrevocable y a nivel mundial, todos los derechos patrimoniales de autor sobre los entregables, incluyendo reproducción, transformación, distribución y comunicación pública (Ley 23/1982). Los derechos morales permanecen en el CONTRATISTA conforme al Art. 30 de dicha ley.",
      },
      {
        clause: "Art. 7 – Sanción por incumplimiento", risk: "bajo",
        original:  "El CONTRATISTA guardará reserva sobre la información del CONTRATANTE durante la vigencia y por 2 años posteriores.",
        suggested: "El CONTRATISTA guardará reserva durante la vigencia y por DOS (2) años adicionales. El incumplimiento de esta obligación dará lugar al pago de una pena convencional de CINCUENTA (50) SMMLV, sin perjuicio de los perjuicios adicionales que se acrediten.",
      },
    ],
    ndaCheck: null,
    simple: "Contrato de consultoría de 6 meses a $12 millones mensuales. En general está bien redactado y equilibrado. El único punto a mejorar es la cláusula de propiedad intelectual: dice que todo pertenece al contratante, pero no especifica qué tipo de derechos ni en qué territorio. La ley colombiana exige ser específico cuando se ceden derechos de autor sobre obras creadas por encargo.",
  },
};

// ─── EXPORT REPORT GENERATOR ─────────────────────────────────────────────────

const generateExportReport = (docType, results, contractText) => {
  const date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  const riskLabel = results.score >= 71 ? "Riesgo Bajo" : results.score >= 41 ? "Riesgo Medio" : "Riesgo Alto";
  const riskColor = results.score >= 71 ? "#22c55e" : results.score >= 41 ? "#f59e0b" : "#ef4444";

  const matrixRows = results.matrix.map(r => {
    const c = r.risk === "alto" ? "#ef4444" : r.risk === "medio" ? "#f59e0b" : "#22c55e";
    return `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:500">${r.clause}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center"><span style="background:${c}18;color:${c};padding:3px 10px;border-radius:20px;font-size:12px;text-transform:capitalize">${r.risk}</span></td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">${r.obs}</td></tr>`;
  }).join("");

  const redlineItems = results.redlines.map(r => `
    <div style="margin-bottom:16px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
      <div style="background:#f8fafc;padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:14px">${r.clause}</div>
      <div style="display:flex">
        <div style="flex:1;padding:12px 14px;background:#fef2f2;border-right:1px solid #e2e8f0">
          <p style="font-size:11px;font-weight:700;color:#dc2626;margin-bottom:6px">TEXTO ACTUAL</p>
          <p style="font-size:13px;color:#991b1b;text-decoration:line-through;line-height:1.6">${r.original}</p>
        </div>
        <div style="flex:1;padding:12px 14px;background:#f0fdf4">
          <p style="font-size:11px;font-weight:700;color:#16a34a;margin-bottom:6px">TEXTO SUGERIDO</p>
          <p style="font-size:13px;color:#166534;line-height:1.6">${r.suggested}</p>
        </div>
      </div>
    </div>
  `).join("");

  const ndaSection = results.ndaCheck ? `
    <h2 style="font-size:18px;font-weight:700;margin:28px 0 14px;color:#1e293b">Checklist NDA</h2>
    ${results.ndaCheck.map(item => {
      const ico = item.status === "pass" ? "✅" : item.status === "fail" ? "❌" : "⚠️";
      return `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9">
        <span style="font-size:16px">${ico}</span>
        <div><p style="font-weight:600;font-size:14px;color:#1e293b">${item.label}</p><p style="font-size:12px;color:#64748b;margin-top:2px">${item.obs}</p></div>
      </div>`;
    }).join("")}
  ` : "";

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LexFlow · Análisis ${docType}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#334155;line-height:1.6;padding:40px;max-width:900px;margin:0 auto;background:#fff}
table{width:100%;border-collapse:collapse;font-size:14px}th{text-align:left;padding:10px 14px;background:#f1f5f9;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600}
@media print{body{padding:20px}}</style>
</head><body>
<div style="display:flex;align-items:center;justify-content:between;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #e2e8f0">
  <div style="flex:1">
    <h1 style="font-size:22px;font-weight:800;color:#0f172a">Análisis de Contrato · ${docType}</h1>
    <p style="font-size:13px;color:#64748b;margin-top:4px">Generado por LexFlow Colombia · ${date}</p>
  </div>
  <div style="text-align:center;padding:14px 20px;border-radius:12px;background:${riskColor}11;border:1px solid ${riskColor}33">
    <p style="font-size:28px;font-weight:800;color:${riskColor}">${results.score}</p>
    <p style="font-size:11px;font-weight:600;color:${riskColor}">${riskLabel}</p>
  </div>
</div>
${results.simple ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:24px;font-size:14px;color:#92400e;line-height:1.7">
  <p style="font-weight:700;margin-bottom:6px">💡 Resumen en lenguaje simple</p>${results.simple}
</div>` : ""}
<h2 style="font-size:18px;font-weight:700;margin:0 0 14px;color:#1e293b">Matriz de Riesgos</h2>
<table style="margin-bottom:28px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
  <thead><tr><th style="width:35%">Cláusula</th><th style="width:12%;text-align:center">Riesgo</th><th>Observación</th></tr></thead>
  <tbody>${matrixRows}</tbody>
</table>
<h2 style="font-size:18px;font-weight:700;margin:0 0 14px;color:#1e293b">Sugerencias Redline</h2>
${redlineItems}
${ndaSection}
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:11px">
  LexFlow Colombia · Motor de Análisis Legal IA · Este documento es orientativo y no constituye asesoría legal.
</div>
</body></html>`;
};

// ─── SIMPLE DIFF UTILITY ─────────────────────────────────────────────────────

const computeTextDiff = (textA, textB) => {
  const linesA = textA.split("\n").map(l => l.trim()).filter(Boolean);
  const linesB = textB.split("\n").map(l => l.trim()).filter(Boolean);
  const setB = new Set(linesB);
  const setA = new Set(linesA);
  return {
    removed: linesA.filter(l => !setB.has(l)),
    added: linesB.filter(l => !setA.has(l)),
    unchanged: linesA.filter(l => setB.has(l)),
  };
};

// ─── JURISPRUDENCIA DATA ──────────────────────────────────────────────────────

const SENTENCIAS = [
  {
    id: "T-025/04",
    tipo: "T",
    corte: "Constitucional",
    fecha: "2004-01-22",
    tema: "Estado de cosas inconstitucional – Población desplazada",
    magistrado: "Manuel José Cepeda Espinosa",
    ratio: `La Corte declaró el "estado de cosas inconstitucional" ante la sistemática vulneración de los derechos fundamentales de la población en situación de desplazamiento forzado. Ordenó a más de 40 entidades del Estado adoptar medidas coordinadas para superar el bloqueo institucional. Subregla: Cuando una violación masiva y estructural de derechos afecta a un número amplio de personas que no poseen recursos judiciales efectivos, el juez constitucional puede impartir órdenes complejas que comprometan el diseño y ejecución de políticas públicas, con seguimiento periódico de su cumplimiento.`,
    cita_apa: `Corte Constitucional de Colombia. (2004, enero 22). Sentencia T-025 de 2004. M.P. Manuel José Cepeda Espinosa.`,
    cita_legal: `Corte Constitucional, Sentencia T-025 de 2004, M.P. Manuel José Cepeda Espinosa, 22 de enero de 2004.`,
  },
  {
    id: "C-355/06",
    tipo: "C",
    corte: "Constitucional",
    fecha: "2006-05-10",
    tema: "Despenalización parcial del aborto – Tres causales constitucionales",
    magistrado: "Jaime Araújo Rentería",
    ratio: `Declaró la inexequibilidad parcial del artículo 122 del Código Penal. Subregla: No se incurre en el delito de aborto cuando la conducta se realiza con consentimiento de la mujer en tres causales: (i) cuando la continuación del embarazo constituya peligro para la vida o la salud de la madre, certificado por médico; (ii) cuando exista grave malformación del feto que haga inviable su vida extrauterina, certificada por médico; y (iii) cuando el embarazo sea resultado de conducta debidamente denunciada constitutiva de acceso carnal violento, inseminación artificial no consentida, o transferencia de óvulo fecundado no consentida.`,
    cita_apa: `Corte Constitucional de Colombia. (2006, mayo 10). Sentencia C-355 de 2006. M.P. Jaime Araújo Rentería y Clara Inés Vargas Hernández.`,
    cita_legal: `Corte Constitucional, Sentencia C-355 de 2006, M.P. Jaime Araújo Rentería, 10 de mayo de 2006.`,
  },
  {
    id: "SU-420/19",
    tipo: "SU",
    corte: "Constitucional",
    fecha: "2019-09-11",
    tema: "Estabilidad laboral reforzada – Debilidad manifiesta por razones de salud",
    magistrado: "José Fernando Reyes Cuartas",
    ratio: `Unificó la jurisprudencia sobre estabilidad laboral reforzada por razones de salud. Subregla: La protección aplica a todo trabajador cuya condición física, sensorial o psicológica sea causa determinante de la terminación del contrato, sin que sea necesaria una calificación previa de pérdida de capacidad laboral moderada, severa o profunda. Basta con que el empleador conozca o deba conocer la condición del trabajador al momento del despido. El empleador que prescinda de la autorización del Ministerio del Trabajo debe reconocer indemnización especial de 180 días de salario, adicional a las prestaciones legales.`,
    cita_apa: `Corte Constitucional de Colombia. (2019, septiembre 11). Sentencia SU-420 de 2019. M.P. José Fernando Reyes Cuartas.`,
    cita_legal: `Corte Constitucional, Sentencia SU-420 de 2019, M.P. José Fernando Reyes Cuartas, 11 de septiembre de 2019.`,
  },
];

const LINEA_JURISPRUDENCIAL = [
  {
    id: "T-571/92",
    label: "Sentencia Fundadora",
    year: "1992",
    color: "#8b5cf6",
    titulo: "Primera protección laboral por estado de salud",
    desc: "La Corte reconoce por primera vez que el estado de salud de un trabajador genera una obligación constitucional de protección especial. Establece que el derecho al trabajo incluye la estabilidad para personas en condición de debilidad manifiesta, inaugurando la línea jurisprudencial.",
  },
  {
    id: "T-198/06",
    label: "Sentencia Hito",
    year: "2006",
    color: "#3b82f6",
    titulo: "Consolidación del fuero de salud",
    desc: "Consolida la doctrina: el empleador no puede dar por terminado el contrato sin autorización del Ministerio del Trabajo cuando conoce la condición de salud del trabajador. Define el concepto operativo de 'debilidad manifiesta' como elemento activador de la protección reforzada.",
  },
  {
    id: "SU-420/19",
    label: "Sentencia Unificadora",
    year: "2019",
    color: "#22c55e",
    titulo: "Unificación definitiva – Criterio vinculante",
    desc: "Cierra los debates doctrinarios. La protección no requiere calificación de PCL. Fija la indemnización especial de 180 días de salario y unifica el precedente para todas las salas de revisión de tutelas, con efecto vinculante erga omnes.",
  },
];

const CORTES_FILTER   = ["Todos", "Constitucional", "Suprema de Justicia", "Consejo de Estado"];
const ANOS_FILTER     = ["Todos", "2024", "2023", "2022", "2021", "2020", "2019", "2010–2019", "2000–2009"];
const MAGS_FILTER     = ["Todos", "Manuel José Cepeda", "Jaime Araújo Rentería", "José Fernando Reyes", "Jorge Iván Palacio", "Alejandro Linares", "Diana Fajardo", "Gloria Stella Ortiz"];

// ─── FIRMAS MODULE DATA ───────────────────────────────────────────────────────

const FIRMAS_DOCS = [
  {
    id: "f1",
    doc: "Contrato Prestación de Servicios — TechSoft S.A.S.",
    destinatarios: ["jlopez@techsoft.com.co", "mgarcia@techsoft.com.co"],
    estado: "pendiente",
    enviado: "03 Mar 2025",
    vence: "10 Mar 2025",
  },
  {
    id: "f2",
    doc: "NDA — Grupo Constructor Alianza Ltda.",
    destinatarios: ["contratos@alianza.co"],
    estado: "firmado",
    enviado: "28 Feb 2025",
    vence: "07 Mar 2025",
  },
  {
    id: "f3",
    doc: "Otrosí No. 2 — Contrato Arrendamiento Local 4B",
    destinatarios: ["p.hernandez@gmail.com", "renta@lexflow.co"],
    estado: "vencido",
    enviado: "15 Feb 2025",
    vence: "22 Feb 2025",
  },
  {
    id: "f4",
    doc: "Contrato Laboral — Ingrid Sofía Vargas Ruiz",
    destinatarios: ["ivargas@empresa.co"],
    estado: "pendiente",
    enviado: "04 Mar 2025",
    vence: "11 Mar 2025",
  },
  {
    id: "f5",
    doc: "Acuerdo de Inversión — Fondo Capital Andino",
    destinatarios: ["legal@fcandino.com", "jramirez@fcandino.com"],
    estado: "firmado",
    enviado: "01 Mar 2025",
    vence: "08 Mar 2025",
  },
];

// ─── FIRMAS MODULE ────────────────────────────────────────────────────────────

const FirmasModule = () => {
  const [docs,     setDocs]     = useState(FIRMAS_DOCS);
  const [pingSent, setPingSent] = useState({});
  const [form,     setForm]     = useState({ firmante1: "", firmante2: "", orden: "paralelo" });
  const [fileName, setFileName] = useState("");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const sendReminder = (id) => {
    setPingSent((p) => ({ ...p, [id]: "sending" }));
    setTimeout(() => setPingSent((p) => ({ ...p, [id]: "done" })), 800);
    setTimeout(() => setPingSent((p) => ({ ...p, [id]: null })), 2800);
  };

  const sendDoc = () => {
    if (!form.firmante1) return;
    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const fmt = (d) => d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
      const newDoc = {
        id: `fn${Date.now()}`,
        doc: fileName || "Nuevo Documento.pdf",
        destinatarios: [form.firmante1, form.firmante2].filter(Boolean),
        estado: "pendiente",
        enviado: fmt(now),
        vence: fmt(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
      };
      setDocs((prev) => [newDoc, ...prev]);
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ firmante1: "", firmante2: "", orden: "paralelo" });
        setFileName("");
      }, 2200);
    }, 1400);
  };

  const estadoCfg = {
    pendiente: { label: "Pendiente", color: "#94a3b8", bg: "rgba(148,163,184,0.12)", Icon: Clock },
    firmado:   { label: "Firmado",   color: "#22c55e", bg: "rgba(34,197,94,0.12)",   Icon: CheckCircle },
    vencido:   { label: "Vencido",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",   Icon: XCircle },
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>

      {/* ── HEADER ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
            <PenTool size={20} style={{ color: "#22c55e" }} />
            Gestión de Firmas Electrónicas
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">DocuSign · Ley 527/1999 · Firma Digital Certificada · Estampa Cronológica TSA</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <ShieldCheck size={14} style={{ color: "#22c55e" }} />
          <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>Ley 527 de 1999 — Cumplimiento Legal</span>
        </div>
      </div>

      {/* ── TWO-PANEL BODY ── */}
      <div className="flex-1 overflow-hidden flex" style={{ minHeight: 0 }}>

        {/* LEFT — Document table */}
        <div className="flex-1 overflow-y-auto p-6" style={{ minWidth: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold text-sm">Documentos en Circulación</h3>
            <div className="flex gap-3 text-xs text-slate-500">
              <span style={{ color: "#94a3b8" }}>● {docs.filter((d) => d.estado === "pendiente").length} Pendientes</span>
              <span style={{ color: "#22c55e" }}>● {docs.filter((d) => d.estado === "firmado").length} Firmados</span>
              <span style={{ color: "#ef4444" }}>● {docs.filter((d) => d.estado === "vencido").length} Vencidos</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700" style={{ background: "rgba(15,23,42,0.65)" }}>
                  <th className="text-left px-4 py-3 text-slate-500 text-xs font-medium">Documento</th>
                  <th className="text-left px-4 py-3 text-slate-500 text-xs font-medium">Destinatarios</th>
                  <th className="text-center px-3 py-3 text-slate-500 text-xs font-medium w-28">Estado</th>
                  <th className="text-center px-3 py-3 text-slate-500 text-xs font-medium w-24">Vence</th>
                  <th className="text-center px-3 py-3 text-slate-500 text-xs font-medium w-32">Acción</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, i) => {
                  const cfg = estadoCfg[doc.estado];
                  const EI  = cfg.Icon;
                  const ps  = pingSent[doc.id];
                  return (
                    <tr key={doc.id} className="border-b border-slate-800 last:border-0"
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-200 text-xs font-medium leading-snug">{doc.doc}</p>
                        <p className="text-slate-500 text-xs mt-0.5">Enviado {doc.enviado}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        {doc.destinatarios.map((d, j) => (
                          <p key={j} className="text-slate-400 text-xs leading-relaxed font-mono">{d}</p>
                        ))}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          <EI size={11} />{cfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="text-xs font-mono"
                          style={{ color: doc.estado === "vencido" ? "#f87171" : "#64748b" }}>
                          {doc.vence}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        {doc.estado === "pendiente" ? (
                          <button
                            onClick={() => sendReminder(doc.id)}
                            disabled={ps === "sending"}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={
                              ps === "done"
                                ? { background: "rgba(34,197,94,0.15)",   color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                                : ps === "sending"
                                ? { background: "rgba(59,130,246,0.08)",  color: "#475569", border: "1px solid rgba(51,65,85,0.5)" }
                                : { background: "rgba(59,130,246,0.12)",  color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }
                            }
                          >
                            {ps === "done"    ? <><CheckCircle size={11} />Enviado</>
                            : ps === "sending" ? <><div className="w-3 h-3 border border-slate-500 border-t-transparent rounded-full animate-spin" />…</>
                            : <><Mail size={11} />Recordatorio</>}
                          </button>
                        ) : (
                          <span className="text-slate-700 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legal validator */}
          <div className="rounded-xl border border-slate-700 p-4" style={{ background: "rgba(30,41,59,0.5)" }}>
            <h4 className="text-slate-300 text-xs font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck size={13} style={{ color: "#22c55e" }} />
              Validación Legal — Ley 527 de 1999 (Comercio Electrónico en Colombia)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Firma Digital Certificada", desc: "Entidad certificadora acreditada por la SIC — Art. 28 Ley 527/99" },
                { label: "Estampa Cronológica TSA",   desc: "RFC 3161 · Timestamp Authority · Integridad temporal garantizada" },
                { label: "Cadena de Custodia",        desc: "Trazabilidad completa: quién firmó, cuándo y desde qué IP" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-lg"
                  style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <CheckCircle size={14} style={{ color: "#22c55e", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-slate-200 text-xs font-semibold leading-tight">{item.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Send configurator */}
        <div className="w-80 flex-shrink-0 border-l border-slate-800 flex flex-col overflow-y-auto p-5"
          style={{ background: "rgba(15,23,42,0.5)" }}>
          <h3 className="text-slate-300 font-semibold text-sm mb-5 flex items-center gap-2">
            <Upload size={14} style={{ color: "#22c55e" }} />Nuevo Envío
          </h3>

          {/* File upload (simulated) */}
          <div
            onClick={() => setFileName((f) => f ? "" : "Contrato_LexFlow_2025.pdf")}
            className="border-2 border-dashed rounded-xl p-5 text-center mb-5 cursor-pointer transition-colors"
            style={{
              borderColor:  fileName ? "rgba(34,197,94,0.45)" : "#334155",
              background:   fileName ? "rgba(34,197,94,0.05)" : "transparent",
            }}
          >
            {fileName ? (
              <>
                <CheckCircle size={22} className="mx-auto mb-1.5" style={{ color: "#22c55e" }} />
                <p className="text-slate-300 text-xs font-medium leading-tight">{fileName}</p>
                <p className="text-slate-500 text-xs mt-1">Click para cambiar</p>
              </>
            ) : (
              <>
                <Upload size={22} className="mx-auto mb-1.5 text-slate-600" />
                <p className="text-slate-400 text-xs font-medium">Subir Documento</p>
                <p className="text-slate-600 text-xs mt-1">PDF · DOCX · máx. 50 MB</p>
              </>
            )}
          </div>

          {/* Signature order */}
          <div className="mb-4">
            <label className="block text-slate-400 text-xs mb-2">Orden de Firmas</label>
            <div className="grid grid-cols-2 gap-2">
              {["secuencial", "paralelo"].map((o) => (
                <button key={o} onClick={() => setForm((p) => ({ ...p, orden: o }))}
                  className="py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={form.orden === o
                    ? { background: "rgba(34,197,94,0.18)", color: "#22c55e",  border: "1px solid rgba(34,197,94,0.35)" }
                    : { background: "rgba(30,41,59,0.6)",   color: "#475569", border: "1px solid rgba(51,65,85,0.8)" }}
                >
                  {o === "secuencial" ? "Secuencial" : "Paralelo"}
                </button>
              ))}
            </div>
          </div>

          {/* Firmantes */}
          {[{ key: "firmante1", label: "Firmante 1", required: true }, { key: "firmante2", label: "Firmante 2", required: false }].map(({ key, label, required }) => (
            <div key={key} className="mb-3">
              <label className="flex items-center gap-1.5 text-slate-400 text-xs mb-1.5">
                <Mail size={11} />{label}
                {!required && <span className="text-slate-600">(opcional)</span>}
              </label>
              <input
                className="w-full bg-slate-800 text-slate-200 rounded-lg px-3 py-2.5 text-xs border border-slate-700 focus:outline-none focus:border-green-500 placeholder-slate-600"
                placeholder="correo@empresa.co"
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}

          {/* Send button */}
          <button
            onClick={sendDoc}
            disabled={!form.firmante1 || sending || sent}
            className="w-full py-3 rounded-lg text-sm font-semibold mt-3 flex items-center justify-center gap-2 transition-all"
            style={
              sent    ? { background: "#16a34a",  color: "white" }
              : sending ? { background: "#1e293b", color: "#475569" }
              : !form.firmante1 ? { background: "#1e293b", color: "#475569" }
              : { background: "#22c55e", color: "white" }
            }
          >
            {sending  ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Procesando…</>
            : sent    ? <><CheckCircle size={15} />Enviado con DocuSign</>
            : <><Send size={15} />Enviar para Firma</>}
          </button>

          {/* Footer note */}
          <div className="mt-auto pt-5">
            <div className="rounded-lg p-3" style={{ background: "rgba(30,41,59,0.6)", border: "1px solid rgba(51,65,85,0.8)" }}>
              <p className="text-slate-500 text-xs leading-relaxed">
                Los documentos firmados se almacenan en <span className="text-slate-400">SharePoint</span> y se sincronizan automáticamente con <span className="text-slate-400">DocuSign</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── COMPLIANCE MODULE DATA ───────────────────────────────────────────────────

const KYB_SAMPLES = {
  "900.123.456-7": {
    nombre: "INVERSIONES ANDINA S.A.S.",
    nit: "900.123.456-7",
    riesgo: "medio",
    representante: "Carlos Eduardo Ríos Montoya",
    actividad: "Actividades de inversión de capital",
    ciudad: "Bogotá D.C.",
    listas: [
      { nombre: "Lista Clinton (OFAC)",                     estado: "limpio",  obs: "Sin coincidencias" },
      { nombre: "Listas ONU – Terrorismo / Proliferación",  estado: "limpio",  obs: "Sin coincidencias" },
      { nombre: "Boletín Responsables Fiscales (Contraloría)", estado: "limpio", obs: "Sin boletines vigentes" },
      { nombre: "Antecedentes Procuraduría",                estado: "limpio",  obs: "Sin registros disciplinarios" },
      { nombre: "Antecedentes Policiales / SIJIN",          estado: "limpio",  obs: "Sin antecedentes" },
      { nombre: "PEP – Personas Expuestas Políticamente",   estado: "alerta",  obs: "Carlos E. Ríos M. — Ex-Concejal Bogotá 2016–2019. Requiere Enhanced Due Diligence." },
    ],
  },
  "800.456.789-1": {
    nombre: "COMERCIALIZADORA PACÍFICO S.A.",
    nit: "800.456.789-1",
    riesgo: "bajo",
    representante: "María Fernanda López Cárdenas",
    actividad: "Comercio al por mayor de productos diversos",
    ciudad: "Cali, Valle del Cauca",
    listas: [
      { nombre: "Lista Clinton (OFAC)",                     estado: "limpio",  obs: "Sin coincidencias" },
      { nombre: "Listas ONU – Terrorismo / Proliferación",  estado: "limpio",  obs: "Sin coincidencias" },
      { nombre: "Boletín Responsables Fiscales (Contraloría)", estado: "limpio", obs: "Sin boletines vigentes" },
      { nombre: "Antecedentes Procuraduría",                estado: "limpio",  obs: "Sin registros disciplinarios" },
      { nombre: "Antecedentes Policiales / SIJIN",          estado: "limpio",  obs: "Sin antecedentes" },
      { nombre: "PEP – Personas Expuestas Políticamente",   estado: "limpio",  obs: "Sin coincidencias en base PEP" },
    ],
  },
  "830.123.456-2": {
    nombre: "IMPORTACIONES CARIBE TRADE S.A.S.",
    nit: "830.123.456-2",
    riesgo: "alto",
    representante: "Jorge Alirio Mendoza Suárez",
    actividad: "Importación y distribución de mercancías",
    ciudad: "Barranquilla, Atlántico",
    listas: [
      { nombre: "Lista Clinton (OFAC)",                     estado: "critico", obs: "MATCH CONFIRMADO — SDN ID #17423. Designado 12/Mar/2021. Bloqueado por vínculos con narcotráfico." },
      { nombre: "Listas ONU – Terrorismo / Proliferación",  estado: "limpio",  obs: "Sin coincidencias" },
      { nombre: "Boletín Responsables Fiscales (Contraloría)", estado: "alerta", obs: "Boletín Responsabilidad Fiscal No. 2022-0178 — proceso activo." },
      { nombre: "Antecedentes Procuraduría",                estado: "limpio",  obs: "Sin registros disciplinarios" },
      { nombre: "Antecedentes Policiales / SIJIN",          estado: "alerta",  obs: "Anotaciones por actividades sospechosas (2019, 2020)" },
      { nombre: "PEP – Personas Expuestas Políticamente",   estado: "limpio",  obs: "Sin coincidencias en base PEP" },
    ],
  },
};

const PROVEEDORES_SAMPLES = [
  { id: "p1", empresa: "INVERSIONES ANDINA S.A.S.",        nit: "900.123.456-7", categoria: "Servicios Financieros", kybStatus: "revisado",   riesgo: "medio", fecha: "2025-02-14", contacto: "Carlos Eduardo Ríos Montoya"       },
  { id: "p2", empresa: "COMERCIALIZADORA PACÍFICO S.A.",   nit: "800.456.789-1", categoria: "Comercio",              kybStatus: "aprobado",   riesgo: "bajo",  fecha: "2025-01-28", contacto: "María Fernanda López Cárdenas"   },
  { id: "p3", empresa: "IMPORTACIONES CARIBE TRADE S.A.S.",nit: "830.123.456-2", categoria: "Importaciones",         kybStatus: "rechazado",  riesgo: "alto",  fecha: "2025-03-01", contacto: "Jorge Alirio Mendoza Suárez"     },
  { id: "p4", empresa: "TECH CONSULTING GROUP S.A.S.",     nit: "901.234.567-3", categoria: "Tecnología",            kybStatus: "pendiente",  riesgo: null,    fecha: null,         contacto: "Diana Paola Vargas Torres"       },
  { id: "p5", empresa: "CONSTRUCTORA HORIZONTE S.A.",      nit: "890.567.234-4", categoria: "Construcción",          kybStatus: "aprobado",   riesgo: "bajo",  fecha: "2025-01-10", contacto: "Rafael Andrés Guzmán Pérez"      },
  { id: "p6", empresa: "LOGÍSTICA ANDINA LTDA.",           nit: "860.789.012-5", categoria: "Logística",             kybStatus: "en_revision",riesgo: null,    fecha: null,         contacto: "Claudia Marcela Pedraza Luna"    },
];

const SAGRILAFT_ITEMS = [
  { id: "s1",  cat: "Gestión de Riesgos", label: "Matriz de Riesgo ML/FT actualizada (metodología SARLAFT 4.0)",            norma: "Art. 4, Circ. 100-000003" },
  { id: "s2",  cat: "Gestión de Riesgos", label: "Segmentación de factores de riesgo (productos, clientes, canales, zonas)",norma: "Art. 4.1, Circ. 100-000003" },
  { id: "s3",  cat: "Gestión de Riesgos", label: "Metodología de evaluación y medición del riesgo documentada",             norma: "Art. 4.3, Circ. 100-000003" },
  { id: "s4",  cat: "Debida Diligencia",  label: "Procedimiento de vinculación de clientes (formularios SARLAFT 2.0)",      norma: "Art. 5, Circ. 100-000003" },
  { id: "s5",  cat: "Debida Diligencia",  label: "Formularios de vinculación actualizados con datos de beneficiario final", norma: "Circ. 100-000005 de 2021" },
  { id: "s6",  cat: "Debida Diligencia",  label: "Base de datos de PEPs y procedimiento de Enhanced Due Diligence",         norma: "Art. 5.4, Circ. 100-000003" },
  { id: "s7",  cat: "Controles Internos", label: "Canal de Denuncias anónimo activo y documentado",                         norma: "Art. 8, Circ. 100-000003" },
  { id: "s8",  cat: "Controles Internos", label: "Manual de Procedimientos Anti-Lavado actualizado (año en curso)",         norma: "Art. 3.2, Circ. 100-000003" },
  { id: "s9",  cat: "Controles Internos", label: "Oficial de Cumplimiento designado e inscrito ante Supersociedades",       norma: "Art. 9, Circ. 100-000003" },
  { id: "s10", cat: "Capacitación",       label: "Programa de capacitación anual ejecutado (≥80% del personal)",            norma: "Art. 7, Circ. 100-000003" },
  { id: "s11", cat: "Reportes UIAF",      label: "Reportes de Operaciones Sospechosas (ROS) enviados a UIAF en plazo",      norma: "Art. 10, Circ. 100-000003" },
  { id: "s12", cat: "Reportes UIAF",      label: "Informe semestral de cumplimiento presentado a Junta Directiva",          norma: "Art. 11, Circ. 100-000003" },
  { id: "s13", cat: "PTEE",               label: "Código de Ética Empresarial publicado y socializado",                     norma: "Res. 100-002657 de 2015" },
  { id: "s14", cat: "PTEE",               label: "Programa de Transparencia y Ética Empresarial (PTEE) implementado",       norma: "Res. 100-002657 de 2015" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const riskCfg = (r) => ({
  alto:  { bg: "rgba(239,68,68,0.14)",  color: "#f87171", border: "rgba(239,68,68,0.4)"  },
  medio: { bg: "rgba(245,158,11,0.14)", color: "#fbbf24", border: "rgba(245,158,11,0.4)" },
  bajo:  { bg: "rgba(34,197,94,0.14)",  color: "#4ade80", border: "rgba(34,197,94,0.4)"  },
}[r]);

// ─── MICRO-COMPONENTS ─────────────────────────────────────────────────────────

const ChartTip = ({ active, payload }) =>
  active && payload?.length ? (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#fff" }}>
      {(payload[0].name || payload[0].payload?.module)}: <b>{payload[0].value}</b>
    </div>
  ) : null;

const RiskBadge = ({ level }) => {
  const s = riskCfg(level);
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0">
      {level}
    </span>
  );
};

const KPICard = ({ Icon, label, value, sub, color, onClick }) => (
  <button onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left w-full transition-all"
    style={{ borderColor: undefined }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#6446E5"}
    onMouseLeave={e => e.currentTarget.style.borderColor = ""}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
        {sub && <p className="text-xs mt-1.5" style={{ color }}>{sub}</p>}
      </div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: color + "28" }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </button>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

const Dashboard = ({ onNav }) => {
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  return (
    <div className="p-8 space-y-6">

      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Legal</h1>
          <p className="text-slate-400 text-sm mt-0.5 capitalize">Resumen ejecutivo · {today}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
            style={{ background: "#6446E5" }}>
            <Zap size={14} /> Legal-to-Simple
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
            <Star size={14} style={{ color: "#fbbf24" }} /> Biblioteca de Oro
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard Icon={FileText}      label="Contratos Activos"  value="24"  sub="↑ 3 este mes"          color="#6446E5" onClick={() => onNav("contratos")}   />
        <KPICard Icon={AlertTriangle} label="Riesgo Alto"        value="8"   sub="⚠ Requieren atención"  color="#ef4444" onClick={() => onNav("contratos")}   />
        <KPICard Icon={PenTool}       label="Firmas Pendientes"  value="12"  sub="4 vencen hoy"          color="#FFB510" onClick={() => onNav("firmas")}       />
        <KPICard Icon={Shield}        label="Compliance Score"   value="78%" sub="↑ 5% vs mes anterior"  color="#10B991" onClick={() => onNav("compliance")}  />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6">

        {/* Donut */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold">Distribución de Riesgo</h3>
          <p className="text-slate-400 text-xs mb-4">46 contratos en revisión activa</p>
          <div className="flex items-center gap-6">
            <div style={{ width: 150, height: 150, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RISK_DATA} cx="50%" cy="50%" innerRadius={44} outerRadius={68}
                    paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {RISK_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1">
              {RISK_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300 text-sm">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ backgroundColor: d.color, width: `${(d.value / 46) * 100}%` }} />
                    </div>
                    <span className="text-white text-sm font-bold" style={{ minWidth: 16 }}>{d.value}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400">Promedio: <span className="font-semibold" style={{ color: "#f59e0b" }}>Medio</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold">Tareas Pendientes por Módulo</h3>
          <p className="text-slate-400 text-xs mb-4">Carga de trabajo actual del equipo</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={TASK_DATA} margin={{ left: -22, bottom: 0 }}>
              <XAxis dataKey="module" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                {TASK_DATA.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-6">

        {/* Activity feed */}
        <div className="col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Actividad Reciente</h3>
            <button className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300 transition-colors">
              Ver todo <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-1">
            {ACTIVITY.map(({ id, Icon, text, time, risk }) => (
              <div key={id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                <div className="p-2 bg-slate-700 rounded-lg flex-shrink-0">
                  <Icon size={14} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm truncate">{text}</p>
                  <p className="text-slate-500 text-xs">{time}</p>
                </div>
                <RiskBadge level={risk} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-2">
            {[
              { label: "Revisar Contrato",     Icon: FileText,  id: "contratos",      color: "#3b82f6" },
              { label: "Consultar Ley",        Icon: Scale,     id: "jurisprudencia", color: "#8b5cf6" },
              { label: "Verificar Compliance", Icon: Shield,    id: "compliance",     color: "#09C8D4" },
              { label: "KYB Proveedor",        Icon: Building2, id: "proveedores",    color: "#f59e0b" },
              { label: "Solicitar Firma",      Icon: PenTool,   id: "firmas",         color: "#22c55e" },
            ].map(({ label, Icon, id, color }) => (
              <button key={id} onClick={() => onNav(id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 transition-all text-left">
                <Icon size={14} style={{ color }} />
                <span className="text-slate-200 text-sm flex-1">{label}</span>
                <ArrowRight size={13} className="text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MODULE PLACEHOLDER ───────────────────────────────────────────────────────

const ModulePlaceholder = ({ id }) => {
  const m = MODULES[id];
  if (!m) return null;
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-16 text-center">
      <div className="w-28 h-28 rounded-3xl flex items-center justify-center mb-7 relative"
        style={{ backgroundColor: m.color + "22", boxShadow: `0 0 60px ${m.color}30` }}>
        <m.Icon size={52} style={{ color: m.color }} />
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#6446E5" }}>
          <Zap size={13} className="text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">{m.title}</h2>
      <p className="text-slate-400 max-w-lg mb-8 leading-relaxed text-sm">{m.desc}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm border"
          style={{ borderColor: m.color + "70", color: m.color, backgroundColor: m.color + "14", borderStyle: "dashed" }}>
          <Zap size={14} /> Módulo listo para ser inyectado
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 text-slate-400 text-sm hover:bg-slate-800 transition-colors">
          <Star size={14} style={{ color: "#fbbf24" }} /> Solicitar activación
        </button>
      </div>
    </div>
  );
};

// ─── SIGN MODAL ───────────────────────────────────────────────────────────────

const SignModal = ({ onClose, docType }) => {
  const [signee, setSignee] = useState({ name: "", email: "", priority: "Normal" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!signee.name.trim() || !signee.email.trim()) return;
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.72)" }}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full shadow-2xl overflow-hidden"
        style={{ maxWidth: 440 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "#6446E5" }}>
              <Send size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Solicitar Firma – DocuSign</p>
              <p className="text-slate-400 text-xs truncate" style={{ maxWidth: 220 }}>{docType}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(34,197,94,0.14)" }}>
                <CheckCircle size={36} style={{ color: "#22c55e" }} />
              </div>
              <h4 className="text-white font-bold text-lg mb-1">¡Enviado con éxito!</h4>
              <p className="text-slate-400 text-sm mb-3">Solicitud de firma enviada vía DocuSign a:</p>
              <p className="text-white font-semibold">{signee.name}</p>
              <p className="text-slate-400 text-sm">{signee.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                DocuSign procesando · Prioridad {signee.priority}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1.5">Nombre del firmante</label>
                <input
                  value={signee.name}
                  onChange={e => setSignee({ ...signee, name: e.target.value })}
                  placeholder="Ej: María García"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                  style={{ caretColor: "#3b82f6" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#475569"}
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  value={signee.email}
                  onChange={e => setSignee({ ...signee, email: e.target.value })}
                  placeholder="firmante@empresa.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors"
                  style={{ caretColor: "#3b82f6" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#475569"}
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1.5">Prioridad</label>
                <select
                  value={signee.priority}
                  onChange={e => setSignee({ ...signee, priority: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm outline-none"
                  style={{ color: "#e2e8f0" }}>
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Confidencial">Confidencial</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!sent ? (
          <div className="px-6 py-4 border-t border-slate-700 flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-700 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!signee.name.trim() || !signee.email.trim()}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: signee.name.trim() && signee.email.trim() ? "#3b82f6" : "#1e3a5f",
                color: signee.name.trim() && signee.email.trim() ? "#fff" : "#4d7ab5",
                cursor: signee.name.trim() && signee.email.trim() ? "pointer" : "not-allowed",
              }}>
              <Send size={13} /> Enviar Solicitud
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-slate-700">
            <button onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CONTRATOS MODULE (UPGRADED) ─────────────────────────────────────────────

const ContratosModule = () => {
  const [docType,    setDocType]    = useState("NDA");
  const [text,       setText]       = useState(SAMPLE_TEXT["NDA"]);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [loadMsg,    setLoadMsg]    = useState("");
  const [results,    setResults]    = useState(null);
  const [tab,        setTab]        = useState("matrix");
  const [showSimple, setShowSimple] = useState(false);
  const [showModal,  setShowModal]  = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver,     setDragOver]     = useState(false);
  const [redlineView, setRedlineView] = useState("sideBySide");
  const [compareText, setCompareText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [expandedRedline, setExpandedRedline] = useState(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const docIcons = {
    "NDA": Shield,
    "Contrato Mercantil": Briefcase,
    "Contrato de Arrendamiento": Building2,
    "Contrato Laboral": Users,
    "Contrato de Servicios": FileText,
  };

  const handleDocTypeChange = (t) => {
    setDocType(t);
    setText(SAMPLE_TEXT[t]);
    setResults(null);
    setShowSimple(false);
    setUploadedFile(null);
    setCompareText("");
  };

  const handleFile = (file) => {
    if (!file) return;
    setUploadedFile({ name: file.name, size: file.size, type: file.type });
    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target.result;
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        setText(raw);
      } else {
        const cleaned = raw.replace(/[^\x20-\x7E\xC0-\xFF\n\r]/g, " ").replace(/ {3,}/g, "\n").trim();
        setText(cleaned.length > 100
          ? cleaned.substring(0, 4000)
          : `[Contenido extraído de: ${file.name}]\n\n${SAMPLE_TEXT[docType]}`);
      }
    };
    reader.readAsText(file);
    showToast(`${file.name} cargado exitosamente`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer?.files?.[0]);
  };

  const handleFileInput = (e) => {
    handleFile(e.target?.files?.[0]);
    e.target.value = "";
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setText(SAMPLE_TEXT[docType]);
    showToast("Documento removido", "info");
  };

  const analyze = () => {
    if (analyzing || !text.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setShowSimple(false);
    setAnalyzeProgress(0);
    let i = 0;
    setLoadMsg(LOAD_MSGS[0]);
    const iv = setInterval(() => {
      i++;
      setAnalyzeProgress(Math.min((i / LOAD_MSGS.length) * 100, 100));
      if (i < LOAD_MSGS.length) {
        setLoadMsg(LOAD_MSGS[i]);
      } else {
        clearInterval(iv);
        setResults(ANALYSIS[docType] || ANALYSIS["Contrato de Servicios"]);
        setAnalyzing(false);
        setTab("matrix");
        setAnalyzeProgress(100);
        showToast("Análisis completado");
      }
    }, 520);
  };

  const handleExport = () => {
    if (!results) return;
    setExporting(true);
    setTimeout(() => {
      const html = generateExportReport(docType, results, text);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LexFlow_Analisis_${docType.replace(/\s/g, "_")}_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExporting(false);
      showToast("Informe exportado exitosamente");
    }, 600);
  };

  const scoreColor = (s) => s >= 71 ? "#22c55e" : s >= 41 ? "#f59e0b" : "#ef4444";
  const scoreLabel = (s) => s >= 71 ? "Riesgo Bajo" : s >= 41 ? "Riesgo Medio" : "Riesgo Alto";
  const scoreEmoji = (s) => s >= 71 ? "✅" : s >= 41 ? "⚠️" : "🚨";

  const tabs = results ? [
    { id: "matrix",  label: "Matriz de Riesgos", icon: BarChart3, count: results.matrix.length },
    { id: "redline", label: "Redline",           icon: ArrowLeftRight, count: results.redlines.length },
    ...(results.ndaCheck ? [{ id: "nda", label: "Checklist NDA", icon: CheckCircle, count: results.ndaCheck.length }] : []),
    { id: "compare", label: "Comparar",          icon: Eye, count: null },
  ] : [];

  const diff = (tab === "compare" && compareText.trim()) ? computeTextDiff(text, compareText) : null;

  /* ── Animated CSS keyframes injected once ── */
  const styleId = "lexflow-contratos-styles";
  if (typeof document !== "undefined" && !document.getElementById(styleId)) {
    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = `
      @keyframes lf-fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes lf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      @keyframes lf-slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes lf-scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      @keyframes lf-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes lf-toast { 0% { opacity:0; transform:translateY(16px) scale(.95); } 10% { opacity:1; transform:translateY(0) scale(1); } 90% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-8px) scale(.95); } }
      .lf-fadeUp { animation: lf-fadeUp 0.4s ease-out both; }
      .lf-slideIn { animation: lf-slideIn 0.3s ease-out both; }
      .lf-scaleIn { animation: lf-scaleIn 0.35s ease-out both; }
      .lf-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .lf-hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
      .lf-hover-glow:hover { box-shadow: 0 0 20px rgba(59,130,246,0.15); }
      .lf-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.06) 50%, transparent 100%); background-size: 200% 100%; animation: lf-shimmer 2s infinite; }
      .lf-toast { animation: lf-toast 2.8s ease both; }
    `;
    document.head.appendChild(styleEl);
  }

  const DocIcon = docIcons[docType] || FileText;

  return (
    <div className="flex flex-col flex-1" style={{ minHeight: 0, position: "relative" }}>

      {/* ── Toast notification ── */}
      {toast && (
        <div className="lf-toast" style={{
          position: "absolute", bottom: 24, right: 24, zIndex: 50,
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 20px", borderRadius: 14,
          backgroundColor: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
          border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        }}>
          <CheckCircle size={15} style={{ color: toast.type === "success" ? "#4ade80" : "#60a5fa" }} />
          <span style={{ color: toast.type === "success" ? "#86efac" : "#93c5fd", fontSize: 13, fontWeight: 500 }}>{toast.msg}</span>
        </div>
      )}

      {/* ── Module Header — glass effect with gradient accent ── */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(12,20,34,0.97) 0%, rgba(15,23,42,0.97) 100%)",
          borderBottom: "1px solid rgba(59,130,246,0.12)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.2) 100%)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}>
            <DocIcon size={18} style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h2 className="text-white font-semibold" style={{ fontSize: 15 }}>Revisión de Contratos & NDA</h2>
            <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 2 }}>
              Motor de análisis IA · {docType}
              {results && <span style={{ color: scoreColor(results.score), marginLeft: 8, fontWeight: 600 }}>
                {scoreEmoji(results.score)} {results.score}/100
              </span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={!results || exporting}
            className="lf-hover-lift flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{
              background: results ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(34,197,94,0.1) 100%)" : "#1a2535",
              color: results ? "#34d399" : "#475569",
              border: results ? "1px solid rgba(16,185,129,0.25)" : "1px solid #263345",
              cursor: results ? "pointer" : "not-allowed",
            }}>
            {exporting
              ? <><div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> Exportando...</>
              : <><FileDown size={13} /> Exportar</>
            }
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={!results}
            className="lf-hover-lift flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            style={{
              background: results ? "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" : "#1a2535",
              color: results ? "#fff" : "#475569",
              border: results ? "none" : "1px solid #263345",
              cursor: results ? "pointer" : "not-allowed",
              boxShadow: results ? "0 4px 15px rgba(59,130,246,0.25)" : "none",
            }}>
            <Send size={13} /> Solicitar Firma
          </button>
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1" style={{ minHeight: 0 }}>

        {/* ── LEFT: Input panel with collapse toggle ── */}
        <div className="flex flex-col border-r flex-shrink-0 overflow-y-auto"
          style={{
            width: leftPanelCollapsed ? 52 : 310,
            backgroundColor: "#080e18",
            borderColor: "rgba(30,41,59,0.6)",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>

          {/* Collapse toggle */}
          <button onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="flex items-center justify-center py-3 border-b"
            style={{ borderColor: "rgba(30,41,59,0.5)", color: "#475569", cursor: "pointer", backgroundColor: "transparent" }}>
            {leftPanelCollapsed
              ? <ChevronRight size={16} />
              : <div className="flex items-center gap-2 px-4 w-full">
                  <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flex: 1 }}>Configuración</span>
                  <ChevronLeft size={14} style={{ color: "#475569" }} />
                </div>
            }
          </button>

          {!leftPanelCollapsed && (
            <div className="p-5 space-y-5" style={{ animation: "lf-fadeUp 0.3s ease-out" }}>

              {/* Doc type selector — card style */}
              <div>
                <p style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 }}>Tipo de Documento</p>
                <div className="space-y-1.5">
                  {DOC_TYPES.map((t, idx) => {
                    const Icon = docIcons[t] || FileText;
                    const active = docType === t;
                    return (
                      <button key={t} onClick={() => handleDocTypeChange(t)}
                        className="w-full text-left px-3.5 py-3 rounded-xl text-sm transition-all flex items-center gap-3 lf-hover-glow"
                        style={{
                          backgroundColor: active ? "rgba(59,130,246,0.12)" : "transparent",
                          color: active ? "#93c5fd" : "#64748b",
                          border: active ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                          animationDelay: `${idx * 50}ms`,
                        }}>
                        <Icon size={14} style={{ color: active ? "#60a5fa" : "#475569", flexShrink: 0 }} />
                        <span style={{ fontWeight: active ? 600 : 400, fontSize: 13 }}>{t}</span>
                        {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#3b82f6" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Upload — improved visual */}
              <div>
                <p style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10 }}>Cargar Documento</p>
                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className="relative rounded-xl p-5 text-center transition-all cursor-pointer lf-hover-lift"
                    style={{
                      border: `2px dashed ${dragOver ? "#3b82f6" : "rgba(30,41,59,0.8)"}`,
                      backgroundColor: dragOver ? "rgba(59,130,246,0.06)" : "rgba(15,23,42,0.3)",
                      borderRadius: 16,
                    }}
                    onClick={() => document.getElementById("lexflow-file-input").click()}>
                    <input id="lexflow-file-input" type="file" className="hidden"
                      accept=".pdf,.docx,.doc,.txt,.rtf"
                      onChange={handleFileInput} />
                    <div className="mx-auto mb-3 w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: dragOver ? "rgba(59,130,246,0.15)" : "rgba(30,41,59,0.5)" }}>
                      <Upload size={18} style={{ color: dragOver ? "#60a5fa" : "#475569" }} />
                    </div>
                    <p style={{ color: dragOver ? "#93c5fd" : "#94a3b8", fontSize: 12, fontWeight: 500 }}>
                      Arrastra un archivo aquí
                    </p>
                    <p style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>
                      o <span style={{ color: "#60a5fa" }}>selecciona</span> · PDF, DOCX, TXT
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl p-3.5 flex items-center gap-3 lf-scaleIn"
                    style={{
                      background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.06) 100%)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}>
                    <div className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                      <FileText size={14} style={{ color: "#60a5fa" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }} className="truncate">{uploadedFile.name}</p>
                      <p style={{ color: "#64748b", fontSize: 11, marginTop: 1 }}>{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={clearUpload}
                      className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                      style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <Trash2 size={12} style={{ color: "#f87171" }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Textarea — improved */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <p style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Texto del Contrato</p>
                  <span style={{ color: "#475569", fontSize: 10 }}>{text.length.toLocaleString()} chars</span>
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl p-3.5 text-xs leading-relaxed outline-none resize-none transition-all"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(30,41,59,0.8)",
                    color: "#cbd5e1",
                    caretColor: "#3b82f6",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11.5,
                    lineHeight: 1.7,
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(59,130,246,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(30,41,59,0.8)"; e.target.style.boxShadow = "none"; }}
                />
                {uploadedFile && (
                  <p style={{ color: "#60a5fa", fontSize: 10.5, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle size={10} /> Extraído de archivo
                  </p>
                )}
              </div>

              {/* Analyze button — premium gradient */}
              <button
                onClick={analyze}
                disabled={analyzing || !text.trim()}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2.5 lf-hover-lift"
                style={{
                  background: analyzing || !text.trim()
                    ? "#1a2535"
                    : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #6366f1 100%)",
                  color: analyzing || !text.trim() ? "#475569" : "#fff",
                  cursor: analyzing || !text.trim() ? "not-allowed" : "pointer",
                  boxShadow: analyzing || !text.trim() ? "none" : "0 6px 24px rgba(59,130,246,0.35), 0 2px 8px rgba(139,92,246,0.2)",
                  letterSpacing: "0.02em",
                  fontSize: 13,
                  position: "relative",
                  overflow: "hidden",
                }}>
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                    <span>Analizando...</span>
                    {/* Progress bar inside button */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, height: 3,
                      width: `${analyzeProgress}%`,
                      background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                      borderRadius: "0 2px 0 0",
                      transition: "width 0.4s ease",
                    }} />
                  </>
                ) : (
                  <><Zap size={15} /> Analizar con IA</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Results panel ── */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#0a1120" }}>

          {/* Loading — improved with steps visualization */}
          {analyzing && (
            <div className="flex flex-col items-center justify-center h-full gap-6 lf-fadeUp" style={{ padding: "0 48px" }}>
              <div style={{ position: "relative", width: 80, height: 80 }}>
                <div className="w-20 h-20 border-4 rounded-full animate-spin"
                  style={{ borderColor: "rgba(59,130,246,0.15)", borderTopColor: "#3b82f6" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ color: "#60a5fa", fontSize: 14, fontWeight: 700 }}>{Math.round(analyzeProgress)}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{loadMsg}</p>
                <p style={{ color: "#475569", fontSize: 12.5, marginTop: 6 }}>Motor de análisis legal IA · Colombia</p>
              </div>
              {/* Step dots with progress bar */}
              <div style={{ width: "100%", maxWidth: 320 }}>
                <div style={{
                  height: 4, borderRadius: 4,
                  backgroundColor: "rgba(30,41,59,0.6)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${analyzeProgress}%`,
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <div className="flex justify-between" style={{ marginTop: 8 }}>
                  {LOAD_MSGS.map((m, i) => (
                    <div key={i} className="w-2 h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: m === loadMsg ? "#3b82f6" : (LOAD_MSGS.indexOf(loadMsg) > i ? "#6366f1" : "#1e293b"),
                        transform: m === loadMsg ? "scale(1.4)" : "scale(1)",
                        boxShadow: m === loadMsg ? "0 0 8px rgba(59,130,246,0.5)" : "none",
                      }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty state — polished */}
          {!analyzing && !results && (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-16 lf-fadeUp">
              <div style={{
                width: 88, height: 88, borderRadius: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 100%)",
                border: "1.5px dashed rgba(59,130,246,0.2)",
              }}>
                <DocIcon size={38} style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <h3 className="text-white font-bold" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>
                  Listo para analizar
                </h3>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
                  Carga un documento o selecciona un tipo de ejemplo, luego presiona{" "}
                  <span style={{ color: "#60a5fa", fontWeight: 600 }}>Analizar con IA</span> para obtener el análisis completo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center" style={{ marginTop: 4 }}>
                {[
                  { label: "Upload PDF/DOCX", icon: Upload },
                  { label: "Matriz de Riesgos", icon: BarChart3 },
                  { label: "Redline", icon: ArrowLeftRight },
                  { label: "Comparar", icon: Eye },
                  { label: "Exportar", icon: FileDown },
                ].map(f => (
                  <span key={f.label} className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(59,130,246,0.07)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.15)",
                      fontWeight: 500,
                    }}>
                    <f.icon size={11} /> {f.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {!analyzing && results && (
            <div className="p-6 space-y-5">

              {/* Score card — enhanced with gradient and glow */}
              <div className="lf-fadeUp lf-hover-lift rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.7) 100%)",
                  border: `1px solid ${scoreColor(results.score)}22`,
                  boxShadow: `0 0 40px ${scoreColor(results.score)}08`,
                }}>
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 90, height: 90 }}>
                    <svg width="90" height="90" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                      <circle cx="45" cy="45" r="37" fill="none" stroke="rgba(30,41,59,0.5)" strokeWidth="6" />
                      <circle cx="45" cy="45" r="37" fill="none"
                        stroke={scoreColor(results.score)} strokeWidth="6"
                        strokeDasharray={`${(results.score / 100) * 232.5} 232.5`}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${scoreColor(results.score)}66)` }} />
                    </svg>
                    <div className="text-center" style={{ position: "relative", zIndex: 1 }}>
                      <span className="font-bold text-white" style={{ fontSize: 26, lineHeight: 1 }}>{results.score}</span>
                      <p style={{ color: "#64748b", fontSize: 9, marginTop: 2 }}>/ 100</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: scoreColor(results.score), fontSize: 18 }}>
                        {scoreLabel(results.score)}
                      </p>
                    </div>
                    <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 3 }}>Puntaje de salud jurídica · {docType}</p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {(() => {
                        const counts = results.matrix.reduce((a, r) => { a[r.risk] = (a[r.risk] || 0) + 1; return a; }, {});
                        return Object.entries(counts).map(([r, n]) => {
                          const s = riskCfg(r);
                          return (
                            <span key={r} className="text-xs px-3 py-1 rounded-full capitalize font-medium"
                              style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                              {n} {r}
                            </span>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSimple(!showSimple)}
                    className="lf-hover-lift flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
                    style={{
                      backgroundColor: showSimple ? "rgba(245,158,11,0.12)" : "rgba(30,41,59,0.6)",
                      color: showSimple ? "#fbbf24" : "#94a3b8",
                      border: `1px solid ${showSimple ? "rgba(245,158,11,0.3)" : "rgba(51,65,85,0.6)"}`,
                    }}>
                    <BookOpen size={14} /> {showSimple ? "Ocultar" : "Explicación Simple"}
                  </button>
                </div>
              </div>

              {/* Explicación Simple — improved */}
              {showSimple && (
                <div className="lf-scaleIn p-5 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.04) 100%)",
                    border: "1px solid rgba(245,158,11,0.18)",
                    color: "#fde68a",
                  }}>
                  <p className="font-semibold mb-2.5 flex items-center gap-2" style={{ color: "#fbbf24", fontSize: 13 }}>
                    <Lightbulb size={15} /> Explicación en lenguaje simple
                  </p>
                  <p style={{ lineHeight: 1.7, fontSize: 13.5 }}>{results.simple}</p>
                </div>
              )}

              {/* Tab bar — glass pill style */}
              <div className="flex gap-1 p-1.5 rounded-2xl"
                style={{
                  backgroundColor: "rgba(15,23,42,0.7)",
                  border: "1px solid rgba(30,41,59,0.6)",
                  backdropFilter: "blur(8px)",
                }}>
                {tabs.map(t => {
                  const TabIcon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex-1 justify-center"
                      style={{
                        backgroundColor: tab === t.id ? "rgba(59,130,246,0.12)" : "transparent",
                        color: tab === t.id ? "#93c5fd" : "#64748b",
                        border: tab === t.id ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                        boxShadow: tab === t.id ? "0 2px 8px rgba(59,130,246,0.1)" : "none",
                      }}>
                      <TabIcon size={13} style={{ opacity: tab === t.id ? 1 : 0.5 }} />
                      {t.label}
                      {t.count !== null && (
                        <span className="px-2 py-0.5 rounded-full" style={{
                          backgroundColor: tab === t.id ? "rgba(59,130,246,0.2)" : "rgba(100,116,139,0.12)",
                          color: tab === t.id ? "#60a5fa" : "#64748b",
                          fontSize: 10.5, fontWeight: 700,
                        }}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Tab: Matriz de Riesgos — card rows with hover ── */}
              {tab === "matrix" && (
                <div className="space-y-2">
                  {results.matrix.map((row, i) => (
                    <div key={i} className="lf-slideIn lf-hover-lift flex items-start gap-4 p-4 rounded-xl"
                      style={{
                        backgroundColor: "rgba(15,23,42,0.5)",
                        border: "1px solid rgba(30,41,59,0.5)",
                        animationDelay: `${i * 60}ms`,
                      }}>
                      <div style={{ minWidth: 140 }}>
                        <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{row.clause}</p>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <RiskBadge level={row.risk} />
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, flex: 1 }}>{row.obs}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Tab: Redline — improved with expand/collapse per item ── */}
              {tab === "redline" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, flex: 1 }}>
                      {results.redlines.length} sugerencias Redline
                    </p>
                    <div className="flex gap-1 p-0.5 rounded-xl" style={{ backgroundColor: "rgba(15,23,42,0.7)", border: "1px solid rgba(30,41,59,0.6)" }}>
                      <button onClick={() => setRedlineView("sideBySide")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: redlineView === "sideBySide" ? "rgba(59,130,246,0.12)" : "transparent",
                          color: redlineView === "sideBySide" ? "#93c5fd" : "#64748b",
                        }}>
                        <ArrowLeftRight size={11} /> Side-by-Side
                      </button>
                      <button onClick={() => setRedlineView("stacked")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: redlineView === "stacked" ? "rgba(59,130,246,0.12)" : "transparent",
                          color: redlineView === "stacked" ? "#93c5fd" : "#64748b",
                        }}>
                        <ListChecks size={11} /> Apilado
                      </button>
                    </div>
                  </div>

                  {results.redlines.map((r, i) => {
                    const isExpanded = expandedRedline === i || expandedRedline === null;
                    return (
                      <div key={i} className="lf-slideIn rounded-xl overflow-hidden lf-hover-glow"
                        style={{ border: "1px solid rgba(30,41,59,0.5)", animationDelay: `${i * 80}ms` }}>
                        <div className="flex items-center justify-between px-4 py-3 cursor-pointer border-b"
                          onClick={() => setExpandedRedline(expandedRedline === i ? null : i)}
                          style={{ backgroundColor: "rgba(15,23,42,0.6)", borderColor: "rgba(30,41,59,0.5)" }}>
                          <div className="flex items-center gap-3">
                            <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, opacity: 0.5 }}>#{i + 1}</span>
                            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{r.clause}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RiskBadge level={r.risk} />
                            <ChevronRight size={14} style={{
                              color: "#475569",
                              transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                              transition: "transform 0.2s ease",
                            }} />
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ animation: "lf-fadeUp 0.25s ease-out" }}>
                            {redlineView === "sideBySide" ? (
                              <div className="flex" style={{ minHeight: 0 }}>
                                <div className="flex-1 px-4 py-4 border-r"
                                  style={{ borderColor: "rgba(30,41,59,0.4)", backgroundColor: "rgba(239,68,68,0.03)" }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: "#f87171", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Texto Actual</p>
                                  <p className="line-through" style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7, textDecorationColor: "rgba(248,113,113,0.4)" }}>{r.original}</p>
                                </div>
                                <div className="flex-1 px-4 py-4"
                                  style={{ backgroundColor: "rgba(34,197,94,0.03)" }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Texto Sugerido</p>
                                  <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.7 }}>{r.suggested}</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(30,41,59,0.4)", backgroundColor: "rgba(239,68,68,0.03)" }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: "#f87171", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Texto Actual</p>
                                  <p className="line-through" style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7, textDecorationColor: "rgba(248,113,113,0.4)" }}>{r.original}</p>
                                </div>
                                <div className="px-4 py-4" style={{ backgroundColor: "rgba(34,197,94,0.03)" }}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Texto Sugerido</p>
                                  <p style={{ color: "#86efac", fontSize: 13, lineHeight: 1.7 }}>{r.suggested}</p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Tab: Checklist NDA — enhanced cards ── */}
              {tab === "nda" && results.ndaCheck && (
                <div className="space-y-2.5">
                  {results.ndaCheck.map((item, idx) => {
                    const cfg = {
                      pass: { Icon: CheckCircle, color: "#4ade80", bg: "rgba(34,197,94,0.06)",   border: "rgba(34,197,94,0.18)", label: "Cumple" },
                      fail: { Icon: XCircle,     color: "#f87171", bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.18)", label: "No cumple" },
                      warn: { Icon: AlertCircle, color: "#fbbf24", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.18)", label: "Revisar" },
                    }[item.status];
                    return (
                      <div key={item.id} className="lf-slideIn lf-hover-lift flex items-start gap-3.5 p-4 rounded-xl"
                        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, animationDelay: `${idx * 60}ms` }}>
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${cfg.color}15` }}>
                          <cfg.Icon size={16} style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{item.label}</p>
                            <span style={{ color: cfg.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>
                          </div>
                          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 3, lineHeight: 1.6 }}>{item.obs}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Tab: Comparar Versiones — refined ── */}
              {tab === "compare" && (
                <div className="space-y-4">
                  <div className="lf-fadeUp p-5 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.6) 100%)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(139,92,246,0.12)" }}>
                        <ArrowLeftRight size={15} style={{ color: "#a78bfa" }} />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "#e2e8f0", fontSize: 14 }}>Comparar Versiones</p>
                        <p style={{ color: "#64748b", fontSize: 11.5, marginTop: 1 }}>Pega la segunda versión para ver diferencias línea por línea.</p>
                      </div>
                    </div>
                    <textarea
                      value={compareText}
                      onChange={e => setCompareText(e.target.value)}
                      placeholder="Pega aquí la segunda versión del contrato..."
                      rows={7}
                      className="w-full rounded-xl p-3.5 text-xs leading-relaxed outline-none resize-none transition-all"
                      style={{
                        backgroundColor: "rgba(15,23,42,0.5)",
                        border: "1px solid rgba(139,92,246,0.15)",
                        color: "#cbd5e1",
                        caretColor: "#a78bfa",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: 11.5,
                      }}
                      onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.06)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(139,92,246,0.15)"; e.target.style.boxShadow = "none"; }}
                    />
                    {compareText.trim() && (
                      <p style={{ color: "#a78bfa", fontSize: 10.5, marginTop: 6 }}>{compareText.length.toLocaleString()} caracteres en versión B</p>
                    )}
                  </div>

                  {diff && (
                    <div className="space-y-3 lf-fadeUp" style={{ animationDelay: "100ms" }}>
                      <div className="flex gap-3">
                        {[
                          { n: diff.removed.length, label: "Eliminadas", color: "#f87171", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" },
                          { n: diff.added.length,   label: "Agregadas",  color: "#4ade80", bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.15)" },
                          { n: diff.unchanged.length, label: "Sin cambios", color: "#94a3b8", bg: "rgba(100,116,139,0.06)", border: "rgba(100,116,139,0.15)" },
                        ].map(s => (
                          <div key={s.label} className="flex-1 p-4 rounded-xl text-center lf-hover-lift"
                            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
                            <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.n}</p>
                            <p style={{ fontSize: 10.5, color: s.color, marginTop: 4, fontWeight: 500, opacity: 0.8 }}>{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(30,41,59,0.5)" }}>
                        <div className="flex border-b" style={{ borderColor: "rgba(30,41,59,0.5)", backgroundColor: "rgba(15,23,42,0.6)" }}>
                          <div className="flex-1 px-4 py-2.5 border-r flex items-center gap-2" style={{ borderColor: "rgba(30,41,59,0.5)" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#f87171" }} />
                            <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Versión A (Original)</p>
                          </div>
                          <div className="flex-1 px-4 py-2.5 flex items-center gap-2">
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80" }} />
                            <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Versión B (Nueva)</p>
                          </div>
                        </div>
                        <div className="flex" style={{ minHeight: 0 }}>
                          <div className="flex-1 p-4 border-r overflow-y-auto"
                            style={{ borderColor: "rgba(30,41,59,0.4)", maxHeight: 400 }}>
                            {text.split("\n").filter(Boolean).map((line, i) => {
                              const isRemoved = diff.removed.includes(line.trim());
                              return (
                                <p key={i} className="py-0.5 px-2 rounded"
                                  style={{
                                    backgroundColor: isRemoved ? "rgba(239,68,68,0.08)" : "transparent",
                                    color: isRemoved ? "#fca5a5" : "#64748b",
                                    textDecoration: isRemoved ? "line-through" : "none",
                                    textDecorationColor: "rgba(239,68,68,0.5)",
                                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                    fontSize: 11.5, lineHeight: 1.7,
                                  }}>
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                          <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 400 }}>
                            {compareText.split("\n").filter(Boolean).map((line, i) => {
                              const isAdded = diff.added.includes(line.trim());
                              return (
                                <p key={i} className="py-0.5 px-2 rounded"
                                  style={{
                                    backgroundColor: isAdded ? "rgba(34,197,94,0.08)" : "transparent",
                                    color: isAdded ? "#86efac" : "#64748b",
                                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                                    fontSize: 11.5, lineHeight: 1.7,
                                  }}>
                                  {isAdded && <span style={{ color: "#22c55e", marginRight: 4, fontWeight: 700 }}>+</span>}
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!compareText.trim() && (
                    <div className="flex flex-col items-center justify-center py-14 gap-4 text-center lf-fadeUp">
                      <div style={{
                        width: 64, height: 64, borderRadius: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.06) 100%)",
                        border: "1.5px dashed rgba(139,92,246,0.2)",
                      }}>
                        <FilePlus2 size={28} style={{ color: "#a78bfa" }} />
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Pega la segunda versión arriba</p>
                      <p style={{ color: "#475569", fontSize: 12, maxWidth: 300, lineHeight: 1.6 }}>
                        LexFlow comparará ambas versiones línea por línea y destacará los cambios.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {showModal && <SignModal onClose={() => setShowModal(false)} docType={docType} />}
    </div>
  );
};

// ─── JURISPRUDENCIA MODULE ────────────────────────────────────────────────────

const JurisprudenciaModule = () => {
  const [query,      setQuery]      = useState("");
  const [corte,      setCorte]      = useState("Todos");
  const [año,        setAño]        = useState("Todos");
  const [magistrado, setMagistrado] = useState("Todos");
  const [expanded,   setExpanded]   = useState(null);
  const [copiedKey,  setCopiedKey]  = useState(null);
  const [activeTab,  setActiveTab]  = useState("resultados");
  const [openFilter, setOpenFilter] = useState(null);

  /* ── helpers ── */
  const tipoCfg = (tipo) => ({
    "T":  { label: "Tutela",             bg: "rgba(59,130,246,0.13)",  color: "#60a5fa", border: "rgba(59,130,246,0.35)"  },
    "C":  { label: "Constitucionalidad", bg: "rgba(139,92,246,0.13)",  color: "#a78bfa", border: "rgba(139,92,246,0.35)"  },
    "SU": { label: "Unificación",        bg: "rgba(245,158,11,0.13)",  color: "#fbbf24", border: "rgba(245,158,11,0.35)"  },
  }[tipo] || { label: tipo, bg: "rgba(100,116,139,0.13)", color: "#94a3b8", border: "rgba(100,116,139,0.35)" });

  const copyText = (text, key) => {
    try { navigator.clipboard.writeText(text); } catch (_) {}
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const filtered = SENTENCIAS.filter(s => {
    const q = query.toLowerCase();
    const matchQ = !q
      || s.tema.toLowerCase().includes(q)
      || s.id.toLowerCase().includes(q)
      || s.magistrado.toLowerCase().includes(q);
    const matchC = corte === "Todos" || s.corte === corte;
    const yr = parseInt(s.fecha.slice(0, 4));
    const matchA = año === "Todos"
      || s.fecha.startsWith(año)
      || (año === "2010–2019" && yr >= 2010 && yr <= 2019)
      || (año === "2000–2009" && yr >= 2000 && yr <= 2009);
    const matchM = magistrado === "Todos"
      || s.magistrado.toLowerCase().includes(magistrado.toLowerCase().replace(".", "").split(" ").slice(-1)[0]);
    return matchQ && matchC && matchA && matchM;
  });

  const activeFilters = [corte, año, magistrado].filter(v => v !== "Todos").length;

  /* ── sub-component: filter dropdown ── */
  const FilterDropdown = ({ label, value, options, onChange, field }) => {
    const isOpen = openFilter === field;
    const active = value !== "Todos";
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpenFilter(isOpen ? null : field)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
          style={{
            backgroundColor: active ? "rgba(59,130,246,0.13)" : "rgba(30,41,59,0.9)",
            border: `1px solid ${active ? "rgba(59,130,246,0.4)" : "rgba(71,85,105,0.7)"}`,
            color: active ? "#60a5fa" : "#94a3b8",
          }}>
          <Filter size={11} />
          <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {active ? value : label}
          </span>
          <ChevronDown size={11} style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {isOpen && (
          <div
            className="absolute top-full mt-1.5 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
            style={{ zIndex: 30, minWidth: 200 }}>
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpenFilter(null); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                style={{
                  color: value === opt ? "#60a5fa" : "#cbd5e1",
                  backgroundColor: value === opt ? "rgba(59,130,246,0.1)" : "transparent",
                  borderBottom: "1px solid rgba(51,65,85,0.4)",
                }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.backgroundColor = "rgba(59,130,246,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = value === opt ? "rgba(59,130,246,0.1)" : "transparent"; }}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── main render ── */
  return (
    <div
      className="flex flex-col flex-1"
      style={{ minHeight: 0 }}
      onClick={() => openFilter && setOpenFilter(null)}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-8 pt-7 pb-5 border-b border-slate-800"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
                <Scale size={16} style={{ color: "#a78bfa" }} />
              </div>
              <h2 className="text-xl font-bold text-white">Consulta de Jurisprudencia</h2>
            </div>
            <p className="text-slate-500 text-sm">
              Corte Constitucional · Corte Suprema de Justicia · Consejo de Estado
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 flex-shrink-0">
            {[
              { id: "resultados", label: "Resultados",          Icon: FileSearch },
              { id: "linea",      label: "Línea Jurisprudencial", Icon: GitMerge  },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? "#3b82f6" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#64748b",
                }}>
                <tab.Icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4"
          style={{ backgroundColor: "rgba(15,23,42,0.7)", border: "1.5px solid rgba(71,85,105,0.7)" }}
          onClick={e => e.stopPropagation()}>
          <Search size={17} className="text-slate-500 flex-shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por tema, número de providencia o magistrado ponente…"
            className="flex-1 bg-transparent text-sm text-slate-200 outline-none"
            style={{ caretColor: "#8b5cf6" }}
            onFocus={e => e.currentTarget.parentElement.style.borderColor = "#8b5cf6"}
            onBlur={e => e.currentTarget.parentElement.style.borderColor = "rgba(71,85,105,0.7)"}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-0.5 hover:text-slate-300 text-slate-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
          <span className="text-slate-600 text-xs font-medium">Filtros:</span>
          <FilterDropdown label="Corte"     value={corte}      options={CORTES_FILTER} onChange={setCorte}      field="corte" />
          <FilterDropdown label="Año"       value={año}        options={ANOS_FILTER}   onChange={setAño}        field="año"   />
          <FilterDropdown label="M. Ponente" value={magistrado} options={MAGS_FILTER}  onChange={setMagistrado} field="mag"   />
          {activeFilters > 0 && (
            <button
              onClick={() => { setCorte("Todos"); setAño("Todos"); setMagistrado("Todos"); }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs transition-colors"
              style={{ color: "#f87171", backgroundColor: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <X size={10} /> Limpiar ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* ── Body (scrollable) ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-6" onClick={() => openFilter && setOpenFilter(null)}>

        {/* ── TAB: RESULTADOS ── */}
        {activeTab === "resultados" && (
          <div>
            {/* Count badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{filtered.length}</span> resultado{filtered.length !== 1 ? "s" : ""}
              </span>
              {(query || activeFilters > 0) && (
                <span className="text-xs px-2 py-0.5 rounded-full text-slate-500"
                  style={{ backgroundColor: "rgba(51,65,85,0.5)", border: "1px solid rgba(71,85,105,0.4)" }}>
                  Filtrado
                </span>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(139,92,246,0.1)" }}>
                  <Scale size={26} style={{ color: "#8b5cf6" }} />
                </div>
                <p className="text-white font-semibold mb-1">Sin resultados</p>
                <p className="text-slate-500 text-sm">Intenta con otros términos o limpia los filtros activos.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map(s => {
                  const tc   = tipoCfg(s.tipo);
                  const isEx = expanded === s.id;

                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl transition-all"
                      style={{
                        backgroundColor: isEx ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.6)",
                        border: `1px solid ${isEx ? "rgba(139,92,246,0.35)" : "rgba(51,65,85,0.7)"}`,
                      }}>

                      {/* Card header row */}
                      <div className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          {/* Tipo badge */}
                          <div
                            className="flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide"
                            style={{ backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                            {s.tipo}
                          </div>

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-white font-bold text-sm">{s.id}</span>
                              <span className="text-slate-500 text-xs">·</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.22)" }}>
                                Corte {s.corte}
                              </span>
                            </div>
                            <p className="text-slate-200 text-sm font-medium leading-snug mb-2">{s.tema}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                <User size={11} />
                                <span>{s.magistrado}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                <Clock size={11} />
                                <span>{new Date(s.fecha + "T12:00:00").toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={e => { e.stopPropagation(); copyText(s.cita_legal, s.id + "-legal"); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                              title="Insertar en concepto/memorial"
                              style={{
                                backgroundColor: copiedKey === s.id + "-legal" ? "rgba(34,197,94,0.12)" : "rgba(51,65,85,0.5)",
                                color: copiedKey === s.id + "-legal" ? "#4ade80" : "#94a3b8",
                                border: `1px solid ${copiedKey === s.id + "-legal" ? "rgba(34,197,94,0.3)" : "rgba(71,85,105,0.4)"}`,
                              }}>
                              {copiedKey === s.id + "-legal"
                                ? <><CheckCircle size={11} /> ¡Copiado!</>
                                : <><Copy size={11} /> Insertar en memorial</>}
                            </button>
                            <button
                              onClick={() => setExpanded(isEx ? null : s.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                              style={{
                                backgroundColor: isEx ? "rgba(139,92,246,0.13)" : "rgba(51,65,85,0.5)",
                                color: isEx ? "#a78bfa" : "#94a3b8",
                                border: `1px solid ${isEx ? "rgba(139,92,246,0.35)" : "rgba(71,85,105,0.4)"}`,
                              }}>
                              <BookOpen size={11} />
                              {isEx ? "Ocultar" : "Ver Ratio Decidendi"}
                              <ChevronRight size={11} style={{ transform: isEx ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded: Ratio decidendi */}
                      {isEx && (
                        <div
                          className="mx-5 mb-5 rounded-xl p-5"
                          style={{ backgroundColor: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)" }}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 rounded-md" style={{ backgroundColor: "rgba(139,92,246,0.18)" }}>
                              <Scale size={12} style={{ color: "#a78bfa" }} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
                              Subregla / Ratio Decidendi
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed mb-5">{s.ratio}</p>

                          {/* Citation formats */}
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { key: "apa",   label: "Formato APA",        text: s.cita_apa,   color: "#60a5fa", borderC: "rgba(59,130,246,0.3)", bgC: "rgba(59,130,246,0.08)" },
                              { key: "legal", label: "Cita en memorial",   text: s.cita_legal, color: "#a78bfa", borderC: "rgba(139,92,246,0.3)", bgC: "rgba(139,92,246,0.08)" },
                            ].map(({ key, label, text, color, borderC, bgC }) => (
                              <div key={key} className="rounded-xl p-3.5" style={{ backgroundColor: bgC, border: `1px solid ${borderC}` }}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                                  <button
                                    onClick={() => copyText(text, s.id + "-" + key)}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all"
                                    style={{
                                      backgroundColor: copiedKey === s.id + "-" + key ? "rgba(34,197,94,0.14)" : "rgba(51,65,85,0.5)",
                                      color: copiedKey === s.id + "-" + key ? "#4ade80" : "#64748b",
                                    }}>
                                    {copiedKey === s.id + "-" + key
                                      ? <><CheckCircle size={10} /> Copiado</>
                                      : <><Copy size={10} /> Copiar</>}
                                  </button>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "monospace" }}>{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: LÍNEA JURISPRUDENCIAL ── */}
        {activeTab === "linea" && (
          <div style={{ maxWidth: 720 }}>
            <div className="mb-6">
              <h3 className="text-white font-bold text-base mb-1">Línea Jurisprudencial</h3>
              <p className="text-slate-500 text-sm">
                Evolución del precedente sobre <span className="text-slate-300">Estabilidad Laboral Reforzada por Salud</span> — Corte Constitucional de Colombia
              </p>
            </div>

            <div style={{ position: "relative" }}>
              {/* Vertical connector line */}
              <div
                style={{
                  position: "absolute",
                  left: 19,
                  top: 40,
                  bottom: 40,
                  width: 2,
                  background: "linear-gradient(to bottom, #8b5cf6, #3b82f6, #22c55e)",
                  borderRadius: 9999,
                  opacity: 0.45,
                }}
              />

              <div className="flex flex-col gap-0">
                {LINEA_JURISPRUDENCIAL.map((node, idx) => (
                  <div key={node.id} className="flex gap-5 items-start" style={{ paddingBottom: idx < LINEA_JURISPRUDENCIAL.length - 1 ? 36 : 0 }}>

                    {/* Node circle */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm relative"
                      style={{
                        backgroundColor: node.color + "22",
                        border: `2px solid ${node.color}55`,
                        color: node.color,
                        zIndex: 1,
                      }}>
                      {idx + 1}
                    </div>

                    {/* Node content */}
                    <div
                      className="flex-1 rounded-2xl p-5 transition-all"
                      style={{
                        backgroundColor: "rgba(15,23,42,0.7)",
                        border: `1px solid ${node.color}30`,
                      }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                              style={{ backgroundColor: node.color + "1a", color: node.color, border: `1px solid ${node.color}40` }}>
                              {node.label}
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1">
                              <Clock size={10} /> {node.year}
                            </span>
                          </div>
                          <p className="text-white font-semibold text-sm">{node.id}</p>
                        </div>
                        <button
                          onClick={() => copyText(`Corte Constitucional, Sentencia ${node.id.replace("/", " de 20")}`, "linea-" + node.id)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            backgroundColor: copiedKey === "linea-" + node.id ? "rgba(34,197,94,0.1)" : "rgba(51,65,85,0.5)",
                            color: copiedKey === "linea-" + node.id ? "#4ade80" : "#64748b",
                            border: `1px solid ${copiedKey === "linea-" + node.id ? "rgba(34,197,94,0.25)" : "rgba(71,85,105,0.4)"}`,
                          }}>
                          {copiedKey === "linea-" + node.id
                            ? <><CheckCircle size={10} /> Copiado</>
                            : <><Copy size={10} /> Insertar cita</>}
                        </button>
                      </div>

                      <p className="text-blue-400 font-semibold text-sm mb-2">{node.titulo}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{node.desc}</p>

                      {/* Arrow connector label (between nodes) */}
                      {idx < LINEA_JURISPRUDENCIAL.length - 1 && (
                        <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px dashed rgba(71,85,105,0.4)" }}>
                          <GitMerge size={12} className="text-slate-600" />
                          <span className="text-slate-600 text-xs">
                            {idx === 0 ? "Adoptado y ampliado por →" : "Unificado y consolidado en →"}
                          </span>
                          <span className="text-slate-500 text-xs font-semibold">{LINEA_JURISPRUDENCIAL[idx + 1].id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PROVEEDORES MODULE ───────────────────────────────────────────────────────

const ProveedoresModule = () => {
  const [search,        setSearch]        = useState("");
  const [selectedVendor,setSelectedVendor]= useState(null);
  const [kybResult,     setKybResult]     = useState(null);
  const [kybLoading,    setKybLoading]    = useState(false);
  const [certSent,      setCertSent]      = useState(false);
  const [showRos,       setShowRos]       = useState(false);
  const [rosForm,       setRosForm]       = useState({ tipo: "Fraccionamiento", monto: "", desc: "" });
  const [rosSent,       setRosSent]       = useState(false);

  const kybStatusCfg = {
    aprobado:    { color: "#10B991", label: "Aprobado",    Icon: CheckCircle   },
    revisado:    { color: "#09C8D4", label: "Revisado",    Icon: AlertCircle   },
    rechazado:   { color: "#ef4444", label: "Rechazado",   Icon: XCircle       },
    pendiente:   { color: "#64748b", label: "Pendiente",   Icon: Clock         },
    en_revision: { color: "#FFB510", label: "En Revisión", Icon: AlertTriangle },
  };

  const riskCfg = {
    bajo:  { color: "#10B991", label: "Bajo"  },
    medio: { color: "#FFB510", label: "Medio" },
    alto:  { color: "#ef4444", label: "Alto"  },
  };

  const fullRiskCfg = {
    bajo:  { label: "RIESGO BAJO",  color: "#10B991", bg: "rgba(16,185,145,0.12)",  Icon: CheckCircle,   semaforo: ["#10B991","#94a3b8","#94a3b8"] },
    medio: { label: "RIESGO MEDIO", color: "#FFB510", bg: "rgba(255,181,16,0.12)",  Icon: AlertTriangle, semaforo: ["#94a3b8","#FFB510","#94a3b8"] },
    alto:  { label: "RIESGO ALTO",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",   Icon: XCircle,       semaforo: ["#94a3b8","#94a3b8","#ef4444"] },
  };

  const listaCfgProv = {
    limpio:  { color: "#10B991", label: "Limpio",  Icon: CheckCircle  },
    alerta:  { color: "#FFB510", label: "Alerta",  Icon: AlertTriangle },
    critico: { color: "#ef4444", label: "Crítico", Icon: XCircle      },
  };

  const filtered = PROVEEDORES_SAMPLES.filter(v =>
    v.empresa.toLowerCase().includes(search.toLowerCase()) ||
    v.nit.includes(search) ||
    v.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:      PROVEEDORES_SAMPLES.length,
    aprobados:  PROVEEDORES_SAMPLES.filter(v => v.kybStatus === "aprobado").length,
    enRevision: PROVEEDORES_SAMPLES.filter(v => v.kybStatus === "en_revision" || v.kybStatus === "revisado").length,
    rechazados: PROVEEDORES_SAMPLES.filter(v => v.kybStatus === "rechazado").length,
  };

  const openKYB = (vendor) => {
    setSelectedVendor(vendor);
    setKybResult(null);
    setCertSent(false);
    if (KYB_SAMPLES[vendor.nit]) {
      setKybLoading(true);
      setTimeout(() => { setKybResult(KYB_SAMPLES[vendor.nit]); setKybLoading(false); }, 700);
    } else {
      setKybLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>

      {/* ── HEADER ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
            <Building2 size={20} style={{ color: "#09C8D4" }} />
            Gestión de Proveedores
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Registro de terceros · Debida Diligencia KYB · Cruce de Listas Restrictivas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#6446E5" }}>
          <Upload size={14} />Nuevo Proveedor
        </button>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-hidden flex" style={{ minHeight: 0 }}>

        {/* LEFT: vendor table */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0"
          style={{ width: selectedVendor ? 380 : "100%", minWidth: 0 }}>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 p-4 border-b border-slate-800 flex-shrink-0">
            {[
              { label: "Total",       value: stats.total,      color: "#09C8D4" },
              { label: "Aprobados",   value: stats.aprobados,  color: "#10B991" },
              { label: "En Revisión", value: stats.enRevision, color: "#FFB510" },
              { label: "Rechazados",  value: stats.rechazados, color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-slate-700 px-3 py-2.5 text-center"
                style={{ background: "rgba(30,41,59,0.5)" }}>
                <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="px-4 py-3 border-b border-slate-800 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-slate-800 text-slate-100 rounded-lg pl-9 pr-4 py-2 text-sm border border-slate-700 focus:outline-none placeholder-slate-500"
                placeholder="Buscar empresa, NIT o categoría…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10" style={{ background: "#0f172a" }}>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-2.5 text-slate-500 text-xs font-medium">Empresa</th>
                  {!selectedVendor && <th className="text-left px-4 py-2.5 text-slate-500 text-xs font-medium">Categoría</th>}
                  {!selectedVendor && <th className="text-left px-4 py-2.5 text-slate-500 text-xs font-medium">Contacto</th>}
                  <th className="text-center px-3 py-2.5 text-slate-500 text-xs font-medium">KYB</th>
                  {!selectedVendor && <th className="text-center px-3 py-2.5 text-slate-500 text-xs font-medium">Riesgo</th>}
                  {!selectedVendor && <th className="text-center px-3 py-2.5 text-slate-500 text-xs font-medium">Última Revisión</th>}
                  <th className="text-center px-3 py-2.5 text-slate-500 text-xs font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const sc = kybStatusCfg[v.kybStatus];
                  const SI = sc.Icon;
                  const isSelected = selectedVendor?.id === v.id;
                  return (
                    <tr key={v.id}
                      className="border-b border-slate-800 last:border-0 transition-colors cursor-pointer"
                      style={{ background: isSelected ? "rgba(100,70,229,0.1)" : i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}
                      onClick={() => openKYB(v)}>
                      <td className="px-4 py-3">
                        <p className="text-slate-200 text-xs font-semibold" style={{ maxWidth: 180 }}>{v.empresa}</p>
                        <p className="text-slate-500 text-xs font-mono mt-0.5">{v.nit}</p>
                      </td>
                      {!selectedVendor && <td className="px-4 py-3 text-slate-400 text-xs">{v.categoria}</td>}
                      {!selectedVendor && <td className="px-4 py-3 text-slate-400 text-xs">{v.contacto}</td>}
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: sc.color + "1a", color: sc.color }}>
                          <SI size={10} />{sc.label}
                        </span>
                      </td>
                      {!selectedVendor && (
                        <td className="px-3 py-3 text-center">
                          {v.riesgo
                            ? <span className="text-xs font-semibold" style={{ color: riskCfg[v.riesgo].color }}>{riskCfg[v.riesgo].label}</span>
                            : <span className="text-slate-600 text-xs">—</span>}
                        </td>
                      )}
                      {!selectedVendor && (
                        <td className="px-3 py-3 text-center text-slate-500 text-xs">
                          {v.fecha ? v.fecha : "—"}
                        </td>
                      )}
                      <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                          style={{
                            background: isSelected ? "rgba(100,70,229,0.25)" : "rgba(100,70,229,0.1)",
                            color: "#a78bfa",
                            border: "1px solid rgba(100,70,229,0.25)",
                          }}
                          onClick={() => openKYB(v)}>
                          Ver KYB
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: KYB detail panel */}
        {selectedVendor && (
          <div className="flex-1 border-l border-slate-800 overflow-y-auto flex flex-col" style={{ minWidth: 0 }}>
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0"
              style={{ background: "rgba(15,23,42,0.6)" }}>
              <div>
                <p className="text-slate-100 font-semibold text-sm truncate">{selectedVendor.empresa}</p>
                <p className="text-slate-500 text-xs font-mono">NIT {selectedVendor.nit} · {selectedVendor.categoria}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800 flex-shrink-0 ml-3">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Loading */}
              {kybLoading && (
                <div className="flex flex-col items-center py-16 gap-4">
                  <div className="w-10 h-10 border-2 rounded-full animate-spin"
                    style={{ borderColor: "#09C8D4", borderTopColor: "transparent" }} />
                  <p className="text-slate-400 text-sm">Cruzando listas restrictivas…</p>
                </div>
              )}

              {/* No KYB data yet */}
              {!kybLoading && !kybResult && (
                <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
                  <ShieldCheck size={32} className="mx-auto mb-3" style={{ color: "#1e293b" }} />
                  <p className="text-slate-400 font-medium text-sm">KYB no disponible</p>
                  <p className="text-slate-600 text-xs mt-1.5">Este proveedor aún no tiene verificación KYB completada.</p>
                  <button className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: "#6446E5" }}>
                    Iniciar Verificación KYB
                  </button>
                </div>
              )}

              {/* KYB Result */}
              {!kybLoading && kybResult && (() => {
                const cfg = fullRiskCfg[kybResult.riesgo];
                const [sGreen, sAmber, sRed] = cfg.semaforo;
                return (
                  <>
                    {/* Company + Semaphore */}
                    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr auto" }}>
                      <div className="rounded-xl border border-slate-700 p-4" style={{ background: "rgba(30,41,59,0.7)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(100,70,229,0.15)" }}>
                            <Briefcase size={18} style={{ color: "#a78bfa" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-100 font-bold text-sm">{kybResult.nombre}</p>
                            <div className="grid gap-1.5 mt-2">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400"><User size={11} /><span>{kybResult.representante}</span></div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={11} /><span>{kybResult.ciudad}</span></div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400"><Tag size={11} /><span>{kybResult.actividad}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Semaphore */}
                      <div className="rounded-xl border p-4 flex flex-col items-center justify-center gap-2.5"
                        style={{ minWidth: 126, background: cfg.bg, borderColor: cfg.color + "60" }}>
                        <div className="flex flex-col gap-2 items-center p-2 rounded-xl" style={{ background: "rgba(0,0,0,0.25)" }}>
                          <div className="w-9 h-9 rounded-full border-2 border-slate-700" style={{ background: sRed,   boxShadow: sRed   !== "#94a3b8" ? `0 0 14px ${sRed}90`   : "none" }} />
                          <div className="w-9 h-9 rounded-full border-2 border-slate-700" style={{ background: sAmber, boxShadow: sAmber !== "#94a3b8" ? `0 0 14px ${sAmber}90` : "none" }} />
                          <div className="w-9 h-9 rounded-full border-2 border-slate-700" style={{ background: sGreen, boxShadow: sGreen !== "#94a3b8" ? `0 0 14px ${sGreen}90` : "none" }} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-xs" style={{ color: cfg.color }}>{cfg.label}</p>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {kybResult.riesgo === "bajo"  && "Estándar"}
                            {kybResult.riesgo === "medio" && "Enhanced DD"}
                            {kybResult.riesgo === "alto"  && "No vincular"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* List screening table */}
                    <div className="rounded-xl border border-slate-700 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2"
                        style={{ background: "rgba(15,23,42,0.7)" }}>
                        <ShieldCheck size={14} style={{ color: "#09C8D4" }} />
                        <span className="text-slate-200 font-semibold text-xs">Cruce de Listas Restrictivas</span>
                        <span className="ml-auto text-xs text-slate-600">{new Date().toLocaleDateString("es-CO")}</span>
                      </div>
                      <table className="w-full text-xs">
                        <tbody>
                          {kybResult.listas.map((l, i) => {
                            const lc = listaCfgProv[l.estado];
                            const LI = lc.Icon;
                            return (
                              <tr key={i} className="border-b border-slate-800 last:border-0"
                                style={{ background: i % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)" }}>
                                <td className="px-4 py-2.5 text-slate-300 font-medium" style={{ width: "38%" }}>{l.nombre}</td>
                                <td className="px-3 py-2.5 text-center" style={{ width: "22%" }}>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                                    style={{ background: lc.color + "22", color: lc.color }}>
                                    <LI size={9} />{lc.label}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-slate-400 leading-snug">{l.obs}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5 flex-wrap">
                      <button
                        onClick={() => { setCertSent(true); setTimeout(() => setCertSent(false), 2500); }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: certSent ? "rgba(16,185,145,0.18)" : "rgba(9,200,212,0.13)",
                          color:      certSent ? "#10B991"               : "#22d3ee",
                          border:     `1px solid ${certSent ? "#10B99150" : "#09C8D450"}`,
                        }}>
                        {certSent ? <CheckCircle size={13} /> : <Download size={13} />}
                        {certSent ? "Certificado Generado ✓" : "Descargar Certificado"}
                      </button>
                      {kybResult.riesgo !== "bajo" && (
                        <button
                          onClick={() => { setShowRos(true); setRosSent(false); }}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold"
                          style={{ background: "rgba(239,68,68,0.13)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                          <Send size={13} />Generar ROS – UIAF
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── ROS MODAL ── */}
      {showRos && (
        <div className="flex items-center justify-center"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 50 }}
          onClick={e => e.target === e.currentTarget && setShowRos(false)}>
          <div className="rounded-2xl border border-slate-700 w-full max-w-lg mx-4 overflow-hidden"
            style={{ background: "#0f172a" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-slate-100 font-semibold flex items-center gap-2">
                <Send size={16} style={{ color: "#f87171" }} />
                Reporte de Operación Sospechosa — UIAF
              </h3>
              <button onClick={() => setShowRos(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {rosSent ? (
                <div className="flex flex-col items-center py-8 gap-3 text-center">
                  <CheckCircle size={44} style={{ color: "#10B991" }} />
                  <p className="text-slate-100 font-semibold text-lg">ROS Enviado a UIAF</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    El reporte fue remitido al sistema SIREL de la UIAF.<br />
                    Radicado: <span style={{ color: "#a78bfa" }} className="font-mono font-bold">
                      ROS-2025-{String(Math.floor(Math.random() * 90000 + 10000))}
                    </span>
                  </p>
                  <button onClick={() => setShowRos(false)}
                    className="mt-2 px-6 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: "#6446E5" }}>
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Tipo de Operación Sospechosa</label>
                    <select className="w-full bg-slate-800 text-slate-200 rounded-lg px-3 py-2.5 text-sm border border-slate-700 focus:outline-none"
                      value={rosForm.tipo} onChange={e => setRosForm(p => ({ ...p, tipo: e.target.value }))}>
                      {["Fraccionamiento","Estructuración","Lavado de Activos","Financiación del Terrorismo","Corrupción / Cohecho","Otra"]
                        .map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Monto Involucrado (COP)</label>
                    <input className="w-full bg-slate-800 text-slate-200 rounded-lg px-3 py-2.5 text-sm border border-slate-700 focus:outline-none placeholder-slate-600"
                      placeholder="ej. 150.000.000" value={rosForm.monto}
                      onChange={e => setRosForm(p => ({ ...p, monto: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Descripción de la Operación</label>
                    <textarea rows={4}
                      className="w-full bg-slate-800 text-slate-200 rounded-lg px-3 py-2.5 text-sm border border-slate-700 focus:outline-none placeholder-slate-600 resize-none"
                      placeholder="Describa la naturaleza, las partes involucradas y los elementos que generan sospecha…"
                      value={rosForm.desc} onChange={e => setRosForm(p => ({ ...p, desc: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-3 pt-1">
                    <button onClick={() => setShowRos(false)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => setRosSent(true)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white"
                      style={{ background: "#dc2626" }}>
                      <Send size={14} />Enviar a UIAF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── COMPLIANCE MODULE (SAGRILAFT / PTEE) ─────────────────────────────────────

const ComplianceModule = () => {
  const [checked, setChecked] = useState({
    s1: true, s2: true,  s3: false, s4: true,  s5: false,
    s6: false, s7: true, s8: true,  s9: true,  s10: false,
    s11: false, s12: false, s13: true, s14: false,
  });

  const cats         = [...new Set(SAGRILAFT_ITEMS.map((i) => i.cat))];
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress     = Math.round((checkedCount / SAGRILAFT_ITEMS.length) * 100);
  const progressColor = progress < 40 ? "#ef4444" : progress < 70 ? "#FFB510" : "#10B991";

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>

      {/* ── HEADER ── */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-slate-100 font-semibold text-lg flex items-center gap-2">
            <ShieldCheck size={20} style={{ color: "#09C8D4" }} />
            Compliance · SAGRILAFT / PTEE
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">Sistema de Autocontrol y Gestión del Riesgo LA/FT/FPADM · Programa de Transparencia y Ética Empresarial</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#6446E5" }}>
          <Download size={14} />Exportar Reporte
        </button>
      </div>

      {/* ══════════════════ SAGRILAFT CONTENT ══════════════════ */}
      {(
        <div className="flex-1 overflow-y-auto p-6">

          {/* Progress banner */}
          <div className="rounded-xl border border-slate-700 p-5 mb-6" style={{ background: "rgba(30,41,59,0.6)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-slate-200 font-semibold text-sm">Progreso de Cumplimiento SAGRILAFT</h3>
                <p className="text-slate-500 text-xs mt-0.5">LEXFLOW ABOGADOS S.A.S. · NIT 901.555.888-0 · Vigencia 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-3xl leading-none" style={{ color: progressColor }}>{progress}%</p>
                <p className="text-slate-500 text-xs mt-1">{checkedCount} / {SAGRILAFT_ITEMS.length} controles</p>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progressColor, boxShadow: `0 0 10px ${progressColor}60` }}
              />
            </div>
            <div className="flex gap-5 mt-2.5 text-xs">
              <span style={{ color: "#ef4444" }}>● &lt;40% Crítico</span>
              <span style={{ color: "#f59e0b" }}>● 40–69% En proceso</span>
              <span style={{ color: "#22c55e" }}>● ≥70% Adecuado</span>
            </div>
          </div>

          {/* Checklist grouped by category */}
          {cats.map((cat) => {
            const items   = SAGRILAFT_ITEMS.filter((i) => i.cat === cat);
            const catDone = items.filter((i) => checked[i.id]).length;
            return (
              <div key={cat} className="rounded-xl border border-slate-700 overflow-hidden mb-4">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700"
                  style={{ background: "rgba(15,23,42,0.65)" }}>
                  <h4 className="text-slate-200 font-semibold text-sm flex items-center gap-2">
                    <ListChecks size={14} style={{ color: "#09C8D4" }} />{cat}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: catDone === items.length ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)",
                      color:      catDone === items.length ? "#22c55e" : "#94a3b8",
                    }}>
                    {catDone}/{items.length}
                  </span>
                </div>
                <div>
                  {items.map((item, idx) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3.5 px-5 py-3.5 cursor-pointer"
                      style={{
                        background:   idx % 2 === 0 ? "transparent" : "rgba(15,23,42,0.3)",
                        borderBottom: idx < items.length - 1 ? "1px solid rgba(30,41,59,0.9)" : "none",
                      }}
                    >
                      {/* Custom checkbox */}
                      <div className="mt-0.5 flex-shrink-0">
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!checked[item.id]}
                          onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                        />
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
                          style={checked[item.id]
                            ? { background: "#22c55e", borderColor: "#22c55e" }
                            : { background: "transparent", borderColor: "#475569" }}
                        >
                          {checked[item.id] && (
                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                              <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug"
                          style={{
                            color:          checked[item.id] ? "#64748b" : "#cbd5e1",
                            textDecoration: checked[item.id] ? "line-through" : "none",
                          }}>
                          {item.label}
                        </p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: "#475569" }}>{item.norma}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function LexFlowColombia() {
  const [module,    setModule]    = useState("dashboard");
  const [jur,       setJur]       = useState(JURISDICTIONS[0]);
  const [showJur,   setShowJur]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [openConn,  setOpenConn]  = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(_) {} };
  }, []);

  return (
    <div className="flex w-full h-screen text-white overflow-hidden"
      style={{ fontFamily: "'Manrope', system-ui, -apple-system, sans-serif", background: "#080C1A" }}>

      {/* ── SIDEBAR ── */}
      <aside className="border-r border-slate-800 flex flex-col transition-all duration-300 flex-shrink-0"
        style={{ width: collapsed ? 64 : 224, background: "linear-gradient(180deg, #0A0F2E 0%, #0d1424 60%, #0f172a 100%)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          {/* LexFlow brand icon — 3-wave flowing ribbon */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(145deg, #0B1240 0%, #1a1060 100%)",
              border: "1px solid rgba(9,200,212,0.4)",
              boxShadow: "0 0 18px rgba(100,70,229,0.55), 0 0 6px rgba(9,200,212,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
            }}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lxGrad1" x1="0" y1="0" x2="21" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#09C8D4"/>
                  <stop offset="100%" stopColor="#c4b5fd"/>
                </linearGradient>
              </defs>
              {/* Wave 1 — top, full opacity */}
              <path d="M1.5 5 C4.5 5 4.5 2 8.5 2 C12.5 2 13 5 16 5 C17.5 5 18.5 4.2 19.5 3.5"
                stroke="url(#lxGrad1)" strokeWidth="2" strokeLinecap="round" fill="none"/>
              {/* Wave 2 — middle, 65% */}
              <path d="M1.5 10.5 C4.5 10.5 4.5 7.5 8.5 7.5 C12.5 7.5 13 10.5 16 10.5 C17.5 10.5 18.5 9.7 19.5 9"
                stroke="url(#lxGrad1)" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.65"/>
              {/* Wave 3 — bottom, 35% */}
              <path d="M1.5 16 C4.5 16 4.5 13 8.5 13 C12.5 13 13 16 16 16 C17.5 16 18.5 15.2 19.5 14.5"
                stroke="url(#lxGrad1)" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.35"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <p className="font-extrabold text-sm leading-tight tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em" }}>
                <span style={{ color: "#6446E5" }}>{"{"}</span>
                <span style={{ color: "#ffffff" }}>LexFlow</span>
                <span style={{ color: "#09C8D4" }}>{"}"}</span>
              </p>
              <p className="text-xs font-medium" style={{ color: "#09C8D4", opacity: 0.75, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.01em" }}>
                Run Smarter with AI
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setModule(id)} title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                module === id
                  ? "text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              style={module === id ? { background: "linear-gradient(90deg, #6446E5 0%, #0E1EAB 100%)", boxShadow: "0 0 12px rgba(100,70,229,0.4)" } : {}}>
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Connectors */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-slate-800">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2.5">Conectores</p>
            {CONNECTORS.map(c => (
              <div key={c.name} className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 text-xs">{c.name}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.online ? "#4ade80" : "#f87171" }} />
                  <span className="text-xs"
                    style={{ color: c.online ? "#4ade80" : "#f87171" }}>
                    {c.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t border-slate-800 text-slate-500 hover:text-white transition-colors flex justify-center">
          <Menu size={17} />
        </button>
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* HEADER */}
        <header className="border-b border-slate-800 px-6 py-3 flex items-center gap-4 flex-shrink-0"
          style={{
            background: "#0d1117",
            borderTop: "2px solid transparent",
            borderImage: "linear-gradient(90deg, #6446E5, #09C8D4, #10B991) 1"
          }}>

          {/* Jurisdiction selector */}
          <div className="relative">
            <button onClick={() => setShowJur(!showJur)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-sm transition-colors">
              <span className="text-lg leading-none">{jur.flag}</span>
              <span className="text-slate-300">{jur.name}</span>
              <ChevronDown size={13} className="text-slate-500"
                style={{ transform: showJur ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showJur && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowJur(false)} />
                <div className="absolute top-full mt-1 left-0 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {JURISDICTIONS.map(j => (
                    <button key={j.code} onClick={() => { setJur(j); setShowJur(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-700 transition-colors text-left"
                      style={{ color: j.code === jur.code ? "#09C8D4" : "#cbd5e1" }}>
                      <span className="text-base leading-none">{j.flag}</span>
                      {j.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Global search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <Search size={14} className="text-slate-500 flex-shrink-0" />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Buscar contratos, NIT, sentencias…"
                className="bg-transparent text-sm text-slate-300 outline-none flex-1"
                style={{ minWidth: 0, caretColor: "#3b82f6" }} />
              <kbd className="text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded hidden xl:block">⌘K</kbd>
            </div>
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3">
              {CONNECTORS.map(c => (
                <div key={c.name} className="relative">
                  <button
                    onClick={() => setOpenConn(openConn === c.name ? null : c.name)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.online ? "#4ade80" : "#f87171" }} />
                    <span className="text-slate-400 text-xs">{c.name}</span>
                  </button>
                  {openConn === c.name && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenConn(null)} />
                      <div className="absolute top-full mt-2 right-0 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-4">
                        <div className="flex items-center gap-2 mb-2.5">
                          {c.online
                            ? <Wifi size={14} style={{ color: "#4ade80" }} />
                            : <WifiOff size={14} style={{ color: "#f87171" }} />}
                          <span className="text-sm font-semibold text-slate-100">{c.name}</span>
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: c.online ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
                              color: c.online ? "#4ade80" : "#f87171"
                            }}>
                            {c.online ? "Conectado" : "Desconectado"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2.5">{c.desc}</p>
                        {c.online && c.sync && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-700 pt-2.5">
                            <Clock size={11} />
                            <span>Sincronizado hace {c.sync}</span>
                          </div>
                        )}
                        {!c.online && (
                          <div className="flex items-center gap-1.5 text-xs pt-2.5 border-t border-slate-700"
                            style={{ color: "#f87171" }}>
                            <AlertTriangle size={11} />
                            <span>Verificar configuración de red</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell size={17} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4444" }} />
            </button>
            <div className="flex items-center gap-2.5 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6446E5 0%, #09C8D4 100%)" }}>
                A
              </div>
              <div className="hidden lg:block">
                <p className="text-slate-200 text-sm font-medium leading-tight">Andres S.</p>
                <p className="text-slate-500 text-xs">Socio Senior</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {module === "dashboard"
            ? <div className="flex-1 overflow-y-auto"><Dashboard onNav={setModule} /></div>
            : module === "contratos"
            ? <ContratosModule />
            : module === "jurisprudencia"
            ? <JurisprudenciaModule />
            : module === "proveedores"
            ? <ProveedoresModule />
            : module === "compliance"
            ? <ComplianceModule />
            : module === "firmas"
            ? <FirmasModule />
            : <div className="flex-1 overflow-y-auto"><ModulePlaceholder id={module} /></div>
          }
        </main>
      </div>
    </div>
  );
}
