(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["auth-redirect"],{"386d":function(t,e,n){"use strict";var a=n("cb7c"),c=n("83a1"),r=n("5f1b");n("214f")("search",1,(function(t,e,n,i){return[function(n){var a=t(this),c=void 0==n?void 0:n[e];return void 0!==c?c.call(n,a):new RegExp(n)[e](String(a))},function(t){var e=i(n,t,this);if(e.done)return e.value;var o=a(t),u=String(this),d=o.lastIndex;c(d,0)||(o.lastIndex=0);var l=r(o,u);return c(o.lastIndex,d)||(o.lastIndex=d),null===l?-1:l.index}]}))},"83a1":function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t===1/e:t!=t&&e!=e}},b829:function(t,e,n){"use strict";n.r(e);n("386d");var a=n("d225"),c=n("b0b4"),r=n("308d"),i=n("6bb5"),o=n("4e2b"),u=n("9ab4"),d=n("60a3"),l=function(t){function e(){return Object(a["a"])(this,e),Object(r["a"])(this,Object(i["a"])(e).apply(this,arguments))}return Object(o["a"])(e,t),Object(c["a"])(e,[{key:"created",value:function(){var t=window.location.search.slice(1);window.localStorage&&(window.localStorage.setItem("x-admin-oauth-code",t),window.close())}},{key:"render",value:function(){}}]),e}(d["c"]);l=Object(u["a"])([Object(d["a"])({name:"AuthRedirect"})],l);var s,b,f=l,w=f,v=n("2877"),h=Object(v["a"])(w,s,b,!1,null,null,null);e["default"]=h.exports}}]);
//# sourceMappingURL=auth-redirect.a68e0f68.js.map