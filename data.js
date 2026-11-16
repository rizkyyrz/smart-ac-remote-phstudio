export const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
export const SHORT_DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
export const ROOMS = [
  ['A301','Kelas A301',3,36,false,.0],['A302','Kelas A302',3,42,false,.2],['A303','Aula',3,125,false,.4],
  ['A201','Kelas A201',2,36,false,.1],['A202','Kelas A202',2,40,false,.2],['A203','Kelas A203',2,35,false,.1],['A204','Ruang Dosen',2,20,false,.2],['A205','Ruang Server',2,0,true,1.1],
  ['A101','Kelas A101',1,38,false,.4],['A102','Kelas A102',1,40,false,.6],['A103','Kelas A103',1,36,false,.0],['A104','Lab Komputer',1,36,false,.7]
].map(([code,name,floor,capacity,is_24h,heat_offset])=>({code,name,floor,capacity,is_24h,heat_offset}));
export const UNITS = ROOMS.flatMap(room => Array.from({length:['A303','A104'].includes(room.code)?2:1},(_,i)=>({id:`${room.code}-${i+1}`,room_code:room.code,label:`AC-${i+1}`,power_on:room.is_24h,control_mode:'AUTO',target_temp:room.is_24h?23:24,fan_mode:'AUTO',hvac_mode:'COOL',swing_on:false,manual_override_until:null,updated_at:new Date().toISOString(),power_kw:room.code==='A303'?2.1:room.code==='A205'?1.8:1.55})));
const offerings = [
  ['A101','07:00','09:00','Matematika Diskrit',31],['A302','07:00','09:00','Bahasa Inggris',28],['A104','08:00','10:00','Pemrograman Web',33],
  ['A201','09:00','11:00','Pengantar Informatika',30],['A303','10:00','12:00','Seminar Teknologi',78],['A102','10:00','12:00','Sistem Basis Data',32],
  ['A202','13:00','15:00','Statistika',29],['A104','13:00','15:00','Praktikum Jaringan',34],['A103','14:00','16:00','Sistem Operasi',29],
  ['A301','15:00','17:00','Interaksi Manusia Komputer',24],['A203','16:00','18:00','Manajemen Proyek',25],['A101','19:00','20:30','Kelas Malam',21]
];
export const SCHEDULES = Array.from({length:6},(_,day)=>offerings.filter((_,idx)=>[0,1,2,3,4,5,6,7,8,9,10,11].filter((x)=>((x+day)%6)!==5).includes(idx)).slice(0,day===5?7:9).map(([room_code,starts_at,ends_at,course,attendees],i)=>({id:`demo-${day+1}-${i}`,room_code,day_of_week:day+1,starts_at,ends_at,course:day===5?course+' (Sabtu)':course,attendees,target_temp:24,active:true}))).flat();
export const DEFAULT_SETTINGS = {id:1,automation_enabled:true,prestart_minutes:10,postend_minutes:15,override_minutes:60,default_setpoint:24,opening_time:'07:00',closing_time:'21:30',operating_days:[1,2,3,4,5,6],adaptive_weather:true};
export const INITIAL_LOGS = [
  {id:'demo-log-1',created_at:new Date(Date.now()-8*60_000).toISOString(),source:'Sistem',message:'Sistem monitoring siap digunakan.',kind:'Sistem'},
  {id:'demo-log-2',created_at:new Date(Date.now()-19*60_000).toISOString(),source:'Otomasi',message:'Jadwal kuliah Senin–Sabtu telah dimuat.',kind:'Otomasi'},
  {id:'demo-log-3',created_at:new Date(Date.now()-42*60_000).toISOString(),source:'Cuaca',message:'Pemantauan cuaca Serang melalui Open-Meteo (jika jaringan tersedia).',kind:'Sistem'}
];
export function defaultState(){return {units:structuredClone(UNITS),rooms:structuredClone(ROOMS),schedules:structuredClone(SCHEDULES),settings:{...DEFAULT_SETTINGS},logs:structuredClone(INITIAL_LOGS),alerts:[]}};
