require=function t(e,n,s){function o(a,c){if(!n[a]){if(!e[a]){var r="function"==typeof require&&require;if(!c&&r)return r(a,!0);if(i)return i(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return o(n?n:t)},u,u.exports,t,e,n,s)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<s.length;a++)o(s[a]);return o}({controlItemDaysNum:[function(t,e,n){"use strict";cc._RFpush(e,"98366vtxqVJXbzd4IE2UgmN","controlItemDaysNum"),cc.Class({"extends":cc.Component,properties:{_index:null,_text:""},onClick:function(){cc.find("Canvas");cc.find("Canvas").getComponent("main").clickButtonItemDaysNum(this.node)}}),cc._RFpop()},{}],controlItemDaysReturn:[function(t,e,n){"use strict";cc._RFpush(e,"fb101I2C+FH+pER9cveuDmS","controlItemDaysReturn"),cc.Class({"extends":cc.Component,properties:{_index:null,_text:""},onClick:function(){cc.find("Canvas");cc.find("Canvas").getComponent("main").clickButtonItemDaysReturn()}}),cc._RFpop()},{}],controlItemGet1:[function(t,e,n){"use strict";cc._RFpush(e,"4ecb7nXgMJNabQ7iv+qIbgj","controlItemGet1"),cc.Class({"extends":cc.Component,properties:{_index:null,_text:""},onClick:function(){cc.find("Canvas");cc.find("Canvas").getComponent("main").clickButtonItemGet1(this.node)}}),cc._RFpop()},{}],controlItemResult:[function(t,e,n){"use strict";cc._RFpush(e,"15476k0nExA16YPcLaXu2Oz","controlItemResult"),cc.Class({"extends":cc.Component,properties:{_index:null},onClick:function(){cc.find("Canvas").getComponent("main").clickItem(this.node)}}),cc._RFpop()},{}],main:[function(t,e,n){"use strict";cc._RFpush(e,"280c3rsZJJKnZ9RqbALVwtK","main"),cc.Class({"extends":cc.Component,properties:{itemTemplateResult:{"default":null,type:cc.Prefab},scrollViewResult:{"default":null,type:cc.ScrollView},itemTemplateGet1:{"default":null,type:cc.Prefab},scrollViewGet1:{"default":null,type:cc.ScrollView},buttonResetGet1:{"default":null,type:cc.Button},labelResetGet1:{"default":null,type:cc.Label},buttonItemDaysNum:{"default":null,type:cc.Prefab},buttonItemDaysReturn:{"default":null,type:cc.Prefab},spriteDays:{"default":null,type:cc.Node},buttonResetDays:{"default":null,type:cc.Button},labelResetDays:{"default":null,type:cc.Label},spriteLoading:{"default":null,type:cc.Sprite},labelLoading:{"default":null,type:cc.Label},_dataJson:null,_msecToDay:{"default":864e5,type:Number,readonly:!0},_daysReturnFlg:!1,_currentGet1:"",_currentDays:"",_setItemSeq:0,_noselectedRows:0,_resultItems:[]},onLoad:function(){cc.loader.load(cc.url.raw("resources/challenge.json"),function(t,e){if(null===t){this._dataJson=e,this._resultItems=[];var n=4,s="",o=new Date;o=new Date(o.getFullYear(),o.getMonth(),o.getDate(),0,0,0);for(var i=0;i<this._dataJson.length;i++){var a=Math.floor((o.getTime()-new Date(e[i].Start).getTime())/this._msecToDay),c=Math.floor((o.getTime()-new Date(e[i].End).getTime())/this._msecToDay);this._dataJson[i].Start=a.toString(),this._dataJson[i].End=c.toString(),this._dataJson[i].Days=String(c)+"〜"+String(a)+"日前",n>0&&s!==a.toString()&&(n--,s=a.toString(),0===n&&(this._noselectedRows=i))}this._dataResult=this._dataJson,this.setItemResult();for(var i=0;i<this._dataJson.length&&""!==this._dataJson[i].Get1Sort;i++){var r=cc.instantiate(this.itemTemplateGet1);r.getChildByName("labelGet1").getComponent(cc.Label).string=this._dataJson[i].Get1Sort,r.getComponent("controlItemGet1")._index=i,r.getComponent("controlItemGet1")._text=this._dataJson[i].Get1Sort,r.setPosition(0,0),this.scrollViewGet1.content.addChild(r)}for(var i=7;9>=i;i++){var r=cc.instantiate(this.buttonItemDaysNum);r.getChildByName("labelDaysNum").getComponent(cc.Label).string=i,r.getComponent("controlItemDaysNum")._index=i,r.getComponent("controlItemDaysNum")._text=i.toString(),r.setPosition(0,0),this.spriteDays.addChild(r)}for(var i=4;6>=i;i++){var r=cc.instantiate(this.buttonItemDaysNum);r.getChildByName("labelDaysNum").getComponent(cc.Label).string=i,r.getComponent("controlItemDaysNum")._index=i,r.getComponent("controlItemDaysNum")._text=i.toString(),r.setPosition(0,0),this.spriteDays.addChild(r)}for(var i=1;3>=i;i++){var r=cc.instantiate(this.buttonItemDaysNum);r.getChildByName("labelDaysNum").getComponent(cc.Label).string=i,r.getComponent("controlItemDaysNum")._index=i,r.getComponent("controlItemDaysNum")._text=i.toString(),r.setPosition(0,0),this.spriteDays.addChild(r)}var r=cc.instantiate(this.buttonItemDaysNum);r.getChildByName("labelDaysNum").getComponent(cc.Label).string=0,r.getComponent("controlItemDaysNum")._index=0,r.getComponent("controlItemDaysNum")._text="0",r.setPosition(0,0),this.spriteDays.addChild(r);var r=cc.instantiate(this.buttonItemDaysReturn);r.setPosition(0,0),this.spriteDays.addChild(r)}}.bind(this))},setItemResult:function(){this.scrollViewResult.content.removeAllChildren(),this.scrollViewResult.content.setContentSize(this.scrollViewResult.content.getContentSize().width,0);for(var t=0,e=0;e<this._dataJson.length;e++){var n=!1;""===this._currentGet1?n=!0:this._dataJson[e].Get1===this._currentGet1&&(n=!0);var s=!1;""===this._currentDays?s=!0:Number(this._dataJson[e].End)<=Number(this._currentDays)&&Number(this._currentDays)<=Number(this._dataJson[e].Start)&&(s=!0);var o=!1;if(""===this._currentGet1&&""===this._currentDays?e<this._noselectedRows&&(o=!0):o=!0,n&&s&&o){t++;for(var i=this._resultItems.length;t>i;i++){var a=cc.instantiate(this.itemTemplateResult);a.setPosition(0,0),this._resultItems.push(a)}var c=this._resultItems[t-1];c.getChildByName("labelName").getComponent(cc.Label).string=this._dataJson[e].Name,c.getChildByName("labelStage").getComponent(cc.Label).string=this._dataJson[e].Stage,c.getChildByName("labelDays").getComponent(cc.Label).string=this._dataJson[e].Days;var r=this._dataJson[e].Get1;""!==this._dataJson[e].Get2&&(r=r+"\n"+this._dataJson[e].Get2),c.getChildByName("labelGet1").getComponent(cc.Label).string=r,c.getComponent("controlItemResult")._index=e,this.scrollViewResult.content.addChild(c)}}this.spriteLoading.node.opacity=0},clickButtonItemResult:function(t){cc.log("text")},clickButtonItemGet1:function(t){this._currentGet1=t.getComponent("controlItemGet1")._text,this.labelResetGet1.string=this._currentGet1,this._daysReturnFlg=!0,0===this._setItemSeq&&(this._setItemSeq=1)},clickButtonItemDaysNum:function(t){this._daysReturnFlg&&(this._daysReturnFlg=!1,this._currentDays=""),this._currentDays+=t.getComponent("controlItemDaysNum")._text,this.labelResetDays.string=this._currentDays},clickButtonItemDaysReturn:function(){""!==this._currentDays&&(this._daysReturnFlg=!0,0===this._setItemSeq&&(this._setItemSeq=1))},clickButtonResetGet1:function(){""!==this._currentGet1&&(this._currentGet1="",0===this._setItemSeq&&(this._setItemSeq=1),this.labelResetGet1.string=this._currentGet1)},clickButtonResetDays:function(){""!==this._currentDays&&(this._currentDays="",this.labelResetDays.string=this._currentDays,this._daysReturnFlg&&(0===this._setItemSeq&&(this._setItemSeq=1),this._daysReturnFlg=!1))},update:function(t){switch(this._setItemSeq){case 1:this.spriteLoading.node.opacity=172,this._setItemSeq++;break;case 2:this.setItemResult(),this._setItemSeq=0}}}),cc._RFpop()},{}]},{},["controlItemResult","main","controlItemGet1","controlItemDaysNum","controlItemDaysReturn"]);
//# sourceMappingURL=project.js.map