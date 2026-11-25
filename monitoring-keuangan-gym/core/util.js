// Dasar bersama: state S, penyimpanan, format uang dan tanggal, notifikasi.
const KEY = "mkg-v1";
const $ = s => document.querySelector(s);
const rp = n => (n < 0 ? "-" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const iso = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const DEF = {uang:1500000, nabung:200000, goal:0, bk:{}, hb:{}, tx:[], p:{h:170,w:60,t:70,a:20,g:"m",f:1.55}, wt:[], done:{}, pin:""};
let S; try { S = {...JSON.parse(JSON.stringify(DEF)), ...JSON.parse(localStorage.getItem(KEY) || "{}")}; } catch (e) { S = JSON.parse(JSON.stringify(DEF)); }
let tab = "home", sel = (new Date().getDay() + 6) % 7, ok = false;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200); };
const bar = (a, b, w) => `<div class="bar${w && a > b ? " bad" : ""}"><i style="width:${b > 0 ? Math.min(100, Math.max(0, a / b * 100)) : 0}%"></i></div>`;
const num = id => parseFloat($(id).value);
