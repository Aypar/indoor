/*! geolib 2.0.21 by Manuel Bieh
* Library to provide geo functions like distance calculation,
* conversion of decimal coordinates to sexagesimal and vice versa, etc.
* WGS 84 (World Geodetic System 1984)
* 
* @author Manuel Bieh
* @url http://www.manuelbieh.com/
* @version 2.0.21
* @license MIT 
**/
!function(a,b){"use strict";function c(){}c.TO_RAD=Math.PI/180,c.TO_DEG=180/Math.PI,c.PI_X2=2*Math.PI,c.PI_DIV4=Math.PI/4;var d=Object.create(c.prototype,{version:{value:"2.0.21"},radius:{value:6378137},minLat:{value:-90},maxLat:{value:90},minLon:{value:-180},maxLon:{value:180},sexagesimalPattern:{value:/^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,2}))?)'\s*(([0-9]{1,3}(\.([0-9]{1,4}))?)"\s*)?([NEOSW]?)$/},measures:{value:Object.create(Object.prototype,{m:{value:1},km:{value:.001},cm:{value:100},mm:{value:1e3},mi:{value:1/1609.344},sm:{value:1/1852.216},ft:{value:100/30.48},"in":{value:100/2.54},yd:{value:1/.9144}})},prototype:{value:c.prototype},extend:{value:function(a,b){for(var c in a)("undefined"==typeof d.prototype[c]||b===!0)&&("function"==typeof a[c]&&"function"==typeof a[c].bind?d.prototype[c]=a[c].bind(d):d.prototype[c]=a[c])}}});"undefined"==typeof Number.prototype.toRad&&(Number.prototype.toRad=function(){return this*c.TO_RAD}),"undefined"==typeof Number.prototype.toDeg&&(Number.prototype.toDeg=function(){return this*c.TO_DEG}),d.extend({decimal:{},sexagesimal:{},distance:null,getKeys:function(a){if("[object Array]"==Object.prototype.toString.call(a))return{longitude:a.length>=1?0:b,latitude:a.length>=2?1:b,elevation:a.length>=3?2:b};var c=function(b){var c;return b.every(function(b){return"object"!=typeof a?!0:a.hasOwnProperty(b)?function(){return c=b,!1}():!0}),c},d=c(["lng","lon","longitude"]),e=c(["lat","latitude"]),f=c(["alt","altitude","elevation","elev"]);return"undefined"==typeof e&&"undefined"==typeof d&&"undefined"==typeof f?b:{latitude:e,longitude:d,elevation:f}},getLat:function(a,b){return b===!0?a[this.getKeys(a).latitude]:this.useDecimal(a[this.getKeys(a).latitude])},latitude:function(a){return this.getLat.call(this,a)},getLon:function(a,b){return b===!0?a[this.getKeys(a).longitude]:this.useDecimal(a[this.getKeys(a).longitude])},longitude:function(a){return this.getLon.call(this,a)},getElev:function(a){return a[this.getKeys(a).elevation]},elevation:function(a){return this.getElev.call(this,a)},coords:function(a,b){var c={latitude:b===!0?a[this.getKeys(a).latitude]:this.useDecimal(a[this.getKeys(a).latitude]),longitude:b===!0?a[this.getKeys(a).longitude]:this.useDecimal(a[this.getKeys(a).longitude])},d=a[this.getKeys(a).elevation];return"undefined"!=typeof d&&(c.elevation=d),c},ll:function(a,b){return this.coords.call(this,a,b)},validate:function(a){var b=this.getKeys(a);if("undefined"==typeof b||"undefined"==typeof b.latitude||"undefined"===b.longitude)return!1;var c=a[b.latitude],d=a[b.longitude];return"undefined"==typeof c||!this.isDecimal(c)&&!this.isSexagesimal(c)?!1:"undefined"==typeof d||!this.isDecimal(d)&&!this.isSexagesimal(d)?!1:(c=this.useDecimal(c),d=this.useDecimal(d),c<this.minLat||c>this.maxLat||d<this.minLon||d>this.maxLon?!1:!0)},getDistance:function(a,b,c,e){c=Math.floor(c)||1,e=Math.floor(e)||0;var f,g,h,i,j,k,l,m=this.coords(a),n=this.coords(b),o=6378137,p=6356752.314245,q=1/298.257223563,r=(n.longitude-m.longitude).toRad(),s=Math.atan((1-q)*Math.tan(parseFloat(m.latitude).toRad())),t=Math.atan((1-q)*Math.tan(parseFloat(n.latitude).toRad())),u=Math.sin(s),v=Math.cos(s),w=Math.sin(t),x=Math.cos(t),y=r,z=100;do{var A=Math.sin(y),B=Math.cos(y);if(k=Math.sqrt(x*A*(x*A)+(v*w-u*x*B)*(v*w-u*x*B)),0===k)return d.distance=0;f=u*w+v*x*B,g=Math.atan2(k,f),h=v*x*A/k,i=1-h*h,j=f-2*u*w/i,isNaN(j)&&(j=0);var C=q/16*i*(4+q*(4-3*i));l=y,y=r+(1-C)*q*h*(g+C*k*(j+C*f*(-1+2*j*j)))}while(Math.abs(y-l)>1e-12&&--z>0);if(0===z)return NaN;var D=i*(o*o-p*p)/(p*p),E=1+D/16384*(4096+D*(-768+D*(320-175*D))),F=D/1024*(256+D*(-128+D*(74-47*D))),G=F*k*(j+F/4*(f*(-1+2*j*j)-F/6*j*(-3+4*k*k)*(-3+4*j*j))),H=p*E*(g-G);if(H=H.toFixed(e),"undefined"!=typeof this.elevation(a)&&"undefined"!=typeof this.elevation(b)){var I=Math.abs(this.elevation(a)-this.elevation(b));H=Math.sqrt(H*H+I*I)}return this.distance=Math.round(H*Math.pow(10,e)/c)*c/Math.pow(10,e)},getDistanceSimple:function(a,b,c){c=Math.floor(c)||1;var e=Math.round(Math.acos(Math.sin(this.latitude(b).toRad())*Math.sin(this.latitude(a).toRad())+Math.cos(this.latitude(b).toRad())*Math.cos(this.latitude(a).toRad())*Math.cos(this.longitude(a).toRad()-this.longitude(b).toRad()))*this.radius);return d.distance=Math.floor(Math.round(e/c)*c)},getCenter:function(a){var b=a;if("object"==typeof a&&!(a instanceof Array)){b=[];for(var d in a)b.push(this.coords(a[d]))}if(!b.length)return!1;var e,f,g,h=0,i=0,j=0;b.forEach(function(a){e=this.latitude(a).toRad(),f=this.longitude(a).toRad(),h+=Math.cos(e)*Math.cos(f),i+=Math.cos(e)*Math.sin(f),j+=Math.sin(e)},this);var k=b.length;return h/=k,i/=k,j/=k,f=Math.atan2(i,h),g=Math.sqrt(h*h+i*i),e=Math.atan2(j,g),{latitude:(e*c.TO_DEG).toFixed(6),longitude:(f*c.TO_DEG).toFixed(6)}},getBounds:function(a){if(!a.length)return!1;var b=this.elevation(a[0]),c={maxLat:-(1/0),minLat:1/0,maxLng:-(1/0),minLng:1/0};"undefined"!=typeof b&&(c.maxElev=0,c.minElev=1/0);for(var d=0,e=a.length;e>d;++d)c.maxLat=Math.max(this.latitude(a[d]),c.maxLat),c.minLat=Math.min(this.latitude(a[d]),c.minLat),c.maxLng=Math.max(this.longitude(a[d]),c.maxLng),c.minLng=Math.min(this.longitude(a[d]),c.minLng),b&&(c.maxElev=Math.max(this.elevation(a[d]),c.maxElev),c.minElev=Math.min(this.elevation(a[d]),c.minElev));return c},getCenterOfBounds:function(a){var b=this.getBounds(a),c=b.minLat+(b.maxLat-b.minLat)/2,d=b.minLng+(b.maxLng-b.minLng)/2;return{latitude:parseFloat(c.toFixed(6)),longitude:parseFloat(d.toFixed(6))}},getBoundsOfDistance:function(a,b){var d,e,f=this.latitude(a),g=this.longitude(a),h=f.toRad(),i=g.toRad(),j=b/this.radius,k=h-j,l=h+j,m=this.maxLat.toRad(),n=this.minLat.toRad(),o=this.maxLon.toRad(),p=this.minLon.toRad();if(k>n&&m>l){var q=Math.asin(Math.sin(j)/Math.cos(h));d=i-q,p>d&&(d+=c.PI_X2),e=i+q,e>o&&(e-=c.PI_X2)}else k=Math.max(k,n),l=Math.min(l,m),d=p,e=o;return[{latitude:k.toDeg(),longitude:d.toDeg()},{latitude:l.toDeg(),longitude:e.toDeg()}]},isPointInside:function(a,b){for(var c=!1,d=-1,e=b.length,f=e-1;++d<e;f=d)(this.longitude(b[d])<=this.longitude(a)&&this.longitude(a)<this.longitude(b[f])||this.longitude(b[f])<=this.longitude(a)&&this.longitude(a)<this.longitude(b[d]))&&this.latitude(a)<(this.latitude(b[f])-this.latitude(b[d]))*(this.longitude(a)-this.longitude(b[d]))/(this.longitude(b[f])-this.longitude(b[d]))+this.latitude(b[d])&&(c=!c);return c},preparePolygonForIsPointInsideOptimized:function(a){for(var b=0,c=a.length-1;b<a.length;b++)this.longitude(a[c])===this.longitude(a[b])?(a[b].constant=this.latitude(a[b]),a[b].multiple=0):(a[b].constant=this.latitude(a[b])-this.longitude(a[b])*this.latitude(a[c])/(this.longitude(a[c])-this.longitude(a[b]))+this.longitude(a[b])*this.latitude(a[b])/(this.longitude(a[c])-this.longitude(a[b])),a[b].multiple=(this.latitude(a[c])-this.latitude(a[b]))/(this.longitude(a[c])-this.longitude(a[b]))),c=b},isPointInsideWithPreparedPolygon:function(a,b){for(var c=!1,d=this.longitude(a),e=this.latitude(a),f=0,g=b.length-1;f<b.length;f++)(this.longitude(b[f])<d&&this.longitude(b[g])>=d||this.longitude(b[g])<d&&this.longitude(b[f])>=d)&&(c^=d*b[f].multiple+b[f].constant<e),g=f;return c},isInside:function(){return this.isPointInside.apply(this,arguments)},isPointInCircle:function(a,b,c){return this.getDistance(a,b)<c},withinRadius:function(){return this.isPointInCircle.apply(this,arguments)},getRhumbLineBearing:function(a,b){var d=this.longitude(b).toRad()-this.longitude(a).toRad(),e=Math.log(Math.tan(this.latitude(b).toRad()/2+c.PI_DIV4)/Math.tan(this.latitude(a).toRad()/2+c.PI_DIV4));return Math.abs(d)>Math.PI&&(d=d>0?-1*(c.PI_X2-d):c.PI_X2+d),(Math.atan2(d,e).toDeg()+360)%360},getBearing:function(a,b){b.latitude=this.latitude(b),b.longitude=this.longitude(b),a.latitude=this.latitude(a),a.longitude=this.longitude(a);var c=(Math.atan2(Math.sin(b.longitude.toRad()-a.longitude.toRad())*Math.cos(b.latitude.toRad()),Math.cos(a.latitude.toRad())*Math.sin(b.latitude.toRad())-Math.sin(a.latitude.toRad())*Math.cos(b.latitude.toRad())*Math.cos(b.longitude.toRad()-a.longitude.toRad())).toDeg()+360)%360;return c},getCompassDirection:function(a,b,c){var d,e;switch(e="circle"==c?this.getBearing(a,b):this.getRhumbLineBearing(a,b),Math.round(e/22.5)){case 1:d={exact:"NNE",rough:"N"};break;case 2:d={exact:"NE",rough:"N"};break;case 3:d={exact:"ENE",rough:"E"};break;case 4:d={exact:"E",rough:"E"};break;case 5:d={exact:"ESE",rough:"E"};break;case 6:d={exact:"SE",rough:"E"};break;case 7:d={exact:"SSE",rough:"S"};break;case 8:d={exact:"S",rough:"S"};break;case 9:d={exact:"SSW",rough:"S"};break;case 10:d={exact:"SW",rough:"S"};break;case 11:d={exact:"WSW",rough:"W"};break;case 12:d={exact:"W",rough:"W"};break;case 13:d={exact:"WNW",rough:"W"};break;case 14:d={exact:"NW",rough:"W"};break;case 15:d={exact:"NNW",rough:"N"};break;default:d={exact:"N",rough:"N"}}return d.bearing=e,d},getDirection:function(a,b,c){return this.getCompassDirection.apply(this,arguments)},orderByDistance:function(a,b){var c=[];for(var d in b){var e=this.getDistance(a,b[d]),f=Object.create(b[d]);f.distance=e,f.key=d,c.push(f)}return c.sort(function(a,b){return a.distance-b.distance})},isPointInLine:function(a,b,c){return(this.getDistance(b,a,1,3)+this.getDistance(a,c,1,3)).toFixed(3)==this.getDistance(b,c,1,3)},isPointNearLine:function(a,b,c,d){return this.getDistanceFromLine(a,b,c)<d},getDistanceFromLine:function(a,b,c){var d=this.getDistance(b,a,1,3),e=this.getDistance(a,c,1,3),f=this.getDistance(b,c,1,3),g=0,h=Math.acos((d*d+f*f-e*e)/(2*d*f)),i=Math.acos((e*e+f*f-d*d)/(2*e*f));return g=h>Math.PI/2?d:i>Math.PI/2?e:Math.sin(h)*d},findNearest:function(a,b,c,d){c=c||0,d=d||1;var e=this.orderByDistance(a,b);return 1===d?e[c]:e.splice(c,d)},getPathLength:function(a){for(var b,c=0,d=0,e=a.length;e>d;++d)b&&(c+=this.getDistance(this.coords(a[d]),b)),b=this.coords(a[d]);return c},getSpeed:function(a,b,c){var e=c&&c.unit||"km";"mph"==e?e="mi":"kmh"==e&&(e="km");var f=d.getDistance(a,b),g=1*b.time/1e3-1*a.time/1e3,h=f/g*3600,i=Math.round(h*this.measures[e]*1e4)/1e4;return i},computeDestinationPoint:function(a,b,c,d){var e=this.latitude(a),f=this.longitude(a);d="undefined"==typeof d?this.radius:Number(d);var g=Number(b)/d,h=Number(c).toRad(),i=Number(e).toRad(),j=Number(f).toRad(),k=Math.asin(Math.sin(i)*Math.cos(g)+Math.cos(i)*Math.sin(g)*Math.cos(h)),l=j+Math.atan2(Math.sin(h)*Math.sin(g)*Math.cos(i),Math.cos(g)-Math.sin(i)*Math.sin(k));return l=(l+3*Math.PI)%(2*Math.PI)-Math.PI,{latitude:k.toDeg(),longitude:l.toDeg()}},convertUnit:function(a,b,c){if(0===b)return 0;if("undefined"==typeof b){if(null===this.distance)throw new Error("No distance was given");if(0===this.distance)return 0;b=this.distance}if(a=a||"m",c=null==c?4:c,"undefined"!=typeof this.measures[a])return this.round(b*this.measures[a],c);throw new Error("Unknown unit for conversion.")},useDecimal:function(a){if("[object Array]"===Object.prototype.toString.call(a)){var b=this;return a=a.map(function(a){if(b.isDecimal(a))return b.useDecimal(a);if("object"==typeof a){if(b.validate(a))return b.coords(a);for(var c in a)a[c]=b.useDecimal(a[c]);return a}return b.isSexagesimal(a)?b.sexagesimal2decimal(a):a})}if("object"==typeof a&&this.validate(a))return this.coords(a);if("object"==typeof a){for(var c in a)a[c]=this.useDecimal(a[c]);return a}if(this.isDecimal(a))return parseFloat(a);if(this.isSexagesimal(a)===!0)return parseFloat(this.sexagesimal2decimal(a));throw new Error("Unknown format.")},decimal2sexagesimal:function(a){if(a in this.sexagesimal)return this.sexagesimal[a];var b=a.toString().split("."),c=Math.abs(b[0]),d=60*("0."+(b[1]||0)),e=d.toString().split(".");return d=Math.floor(d),e=(60*("0."+(e[1]||0))).toFixed(2),this.sexagesimal[a]=c+"° "+d+"' "+e+'"',this.sexagesimal[a]},sexagesimal2decimal:function(a){if(a in this.decimal)return this.decimal[a];var b=new RegExp(this.sexagesimalPattern),c=b.exec(a),d=0,e=0;c&&(d=parseFloat(c[2]/60),e=parseFloat(c[4]/3600)||0);var f=(parseFloat(c[1])+d+e).toFixed(8);return f="S"==c[7]||"W"==c[7]?parseFloat(-f):parseFloat(f),this.decimal[a]=f,f},isDecimal:function(a){return a=a.toString().replace(/\s*/,""),!isNaN(parseFloat(a))&&parseFloat(a)==a},isSexagesimal:function(a){return a=a.toString().replace(/\s*/,""),this.sexagesimalPattern.test(a)},round:function(a,b){var c=Math.pow(10,b);return Math.round(a*c)/c}}),"undefined"!=typeof module&&"undefined"!=typeof module.exports?(module.exports=d,"object"==typeof a&&(a.geolib=d)):"function"==typeof define&&define.amd?define("geolib",[],function(){return d}):a.geolib=d}(this);