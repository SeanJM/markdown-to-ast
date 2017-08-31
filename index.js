module.exports=function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,n){"use strict";var r=/^\[([^\]]+)\]\(([^\]]+)\)/,i=/^\[([^\]]+)\]\[([^\]]+)\]/,h=/^(?:\s+|)\[([^\]]+)\]: ((?:http(?:s|):\/\/|)[a-zA-Z0-9%\-_?=.#]+)$/,l=/^!\[([^\]]+)\]\(([^\]]+)\)/,s=/^~~([^\]]+?)~~/,c=/^(?:\s+|)```([a-zA-Z]+|)/,d=/^`([^`]+)`/;e.exports={MATCH_CODE:c,MATCH_INLINE_CODE:d,MATCH_LINK:r,MATCH_PICTURE:l,MATCH_REFERENCE:h,MATCH_RLINK:i,MATCH_STRIKETHROUGH:s}},function(e,t,n){e.exports=n(2)},function(e,t,n){"use strict";var r=n(3);e.exports=function(e){return r(e.split("\n"))}},function(e,t,n){"use strict";function r(e){var t=e.match(/^([ ]+)/m);return t?Math.floor(t[1].length/2):0}function i(e){var t=e.children[0].match(u);return{type:e.type,depth:e.depth,href:t[2],link:t[1].toLowerCase()}}function h(e){for(var t=[],n=0,r=e.length;n<r;n++)[].push.apply(t,e[n].children);for(var i=0,h=t.length;i<h;i++)"string"==typeof t[i]&&(t[i]=t[i].trim());return{type:"quote",depth:e[0].depth,children:c(t)}}function l(e){for(var t=[],n=0,r=e[0].depth,i=e.length,h={type:"ol li"===e[0].type?"ol":"ul",depth:r,children:[]};n<i;){for(;e[n]&&e[n].depth>r;)t.push({type:e[n].type,children:e[n].children,depth:e[n].depth+1}),n+=1;t.length?(n--,h.children.slice(-1)[0].children.push(l(t))):"ul li"===e[n].type||"ol li"===e[n].type?h.children.push({type:"li",children:e[n].children,depth:e[n].depth+1}):h.children.slice(-1)[0].children.push({type:e[n].type,children:e[n].children,depth:e[n].depth+1}),t=[],n+=1}return h}function s(e){for(var t=p(e),n=[],r=0,s=t.length;r<s;r++)"ul li"===t[r].type||"ol li"===t[r].type?n.push(l(t[r].children)):"quote"===t[r].type?n.push(h(t[r].children)):"ref"===t[r].type?n.push(i(t[r])):"newline"!==t[r].type&&n.push(t[r]);return n}function c(e){for(var t=0,n=e.length;t<n;t++)e[t].trim().length?e[t]={type:d(e[t]),depth:r(e[t]),children:o({str:e[t],index:0,length:e[t].length})}:e[t]={type:"newline",depth:0};return s(e)}var d=n(4),o=n(5),p=n(6),u=n(0).MATCH_REFERENCE;e.exports=c},function(e,t,n){"use strict";var r=n(0).MATCH_REFERENCE,i=n(0).MATCH_CODE;e.exports=function(e){return i.test(e)?"code":/^(\s+|)([-]{3}|[*]{3}|[_]{3})/.test(e)?"hr":/^(\s+|)>/.test(e)?"quote":/^(\s+|)#/.test(e)?"h"+Math.min(6,e.match(/^(?:\s+|)([#]+)/)[0].length):/^(\s+|)(-|\*|\+)\s/.test(e)?"ul li":/^(\s+|)[0-9]/.test(e)?"ol li":r.test(e)?"ref":"p"}},function(e,t,n){"use strict";function r(e){var t=e.match(p);return{type:"a",href:t[2],children:s({index:0,str:t[1],length:t[1].length})}}function i(e){var t=e.match(f);return{type:"rlink",href:t[2].toLowerCase(),children:s({index:0,str:t[1],length:t[1].length})}}function h(e){var t=e.match(u);return{type:"img",src:t[2],alt:t[1]}}function l(e){for(var t=e.index,n="",r=void 0;"*"===e.str[e.index];)n+=e.str[e.index],e.index+=1;for(;e.str[e.index]&&!r;)e.index+=1,r=e.str.substring(e.index,e.index+n.length)===n;return e.index+=n.length-1,r?c(n.length%2?{type:"emphasis",children:[e.str.substring(t+1,e.index)]}:{type:"strong",children:[e.str.substring(t+2,e.index-1)]}):e.str.slice(t)}function s(e){var t=!1,n={str:e.str,length:e.length,index:e.index||0,children:[]},s=0,x=void 0,g=void 0;if(/^(\s+|)[0-9]+\./.test(n.str)?(n.index+=n.str.match(/^(\s+|)[0-9]+\./)[0].length,t=!0):/^(\s+|)([-]{3}|[_]{3}|[*]{3})/.test(n.str)?n.index+=n.str.match(/^(\s+|)([-]{3}|[_]{3}|[*]{3})/)[0].length:/^(\s+|)([#]+)/.test(n.str)?(n.index+=n.str.match(/^(?:\s+|)([#]+)/)[1].length,t=!0):/^(\s+|)(\*|-|\+)\s/.test(n.str)&&(n.index+=n.str.match(/(\s+|)(\*|-|\+)\s/)[0].length,t=!0),">"===n.str[n.index]&&(n.index+=1),t)for(;[" "].indexOf(n.str[n.index])>-1;)n.index+=1;for(;n.index<n.length;)x=n.str.slice(n.index),"*"===x[0]?(n.children.push(l(n)),g=n.children.slice(-2),"string"==typeof g[0]&&"string"==typeof g[1]&&n.children.splice(n.children.length-2,2,g[0]+g[1])):a.test(x)?(n.children.push(c({type:"strikethrough",children:[x.match(a)[1]]})),n.index+=x.match(a)[0].length-1):u.test(x)?(n.children.push(h(x)),n.index+=x.match(u)[0].length-1):p.test(x)?(n.children.push(r(x)),n.index+=x.match(p)[0].length-1):f.test(x)?(n.children.push(i(x)),n.index+=x.match(f)[0].length-1):y.test(x)?(n.children.push({type:"inline-code",children:[x.match(y)[1]]}),n.index+=x.match(y)[0].length-1):("object"===d(n.children[s])?(n.children.push(""),s+=1):void 0===n.children[s]&&(n.children[s]=""),g=n.str.slice(n.index+1,n.index+3),"\\"===n.str[n.index]&&o.indexOf(g)>-1?(n.children[s]+=g,n.index+=3):n.children[s]+=n.str[n.index]),s=n.children.length-1,n.index=n.index+1;return n.children}function c(e){return{type:e.type,children:s({index:0,str:e.children[0],length:e.children[0].length})}}var d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=["*","**","~~","__","_"],p=n(0).MATCH_LINK,u=n(0).MATCH_PICTURE,f=n(0).MATCH_RLINK,a=n(0).MATCH_STRIKETHROUGH,y=n(0).MATCH_INLINE_CODE;e.exports=s},function(e,t,n){"use strict";function r(e){var t=e.match(i)[1];return t||!1}var i=n(0).MATCH_CODE;e.exports=function(e){for(var t=["quote","ul li","ol li"],n=[],i=void 0,h=0,l=e.length,s=void 0;h<l;){if(i={},t.indexOf(e[h].type)>-1){for(i.type=e[h].type,i.children=[];h<l&&"newline"!==e[h].type;)i.children.push(e[h]),h+=1;n.push(i)}else if("code"===e[h].type){for(s=h,h+=1;h<l&&"code"!==e[h].type;)h+=1;e[h]&&"code"===e[h].type?n.push({type:"code",depth:e[h].depth,language:r(e[s].children[0]),children:[].concat.apply([],e.slice(s+1,h).map(function(e){return"newline"===e.type?"":e.children}))}):(e[s].type="p",n.push(e[s]),h=s)}else n.push(e[h]);h+=1}return n}}]);