define([],function(){var d=Backbone.Model.extend(LoggableMixin).extend({defaults:{history_id:null,model_class:"HistoryDatasetAssociation",hid:0,id:null,name:"(unnamed dataset)",state:"new",deleted:false,visible:true,accessible:true,purged:false,data_type:null,file_size:0,file_ext:"",meta_files:[],misc_blurb:"",misc_info:"",tags:null},urlRoot:"api/histories/",url:function(){return this.urlRoot+this.get("history_id")+"/contents/"+this.get("id")},urls:function(){var i=this.get("id");if(!i){return{}}var h={purge:galaxy_config.root+"datasets/"+i+"/purge_async",display:galaxy_config.root+"datasets/"+i+"/display/?preview=True",edit:galaxy_config.root+"datasets/"+i+"/edit",download:galaxy_config.root+"datasets/"+i+"/display?to_ext="+this.get("file_ext"),report_error:galaxy_config.root+"dataset/errors?id="+i,rerun:galaxy_config.root+"tool_runner/rerun?id="+i,show_params:galaxy_config.root+"datasets/"+i+"/show_params",visualization:galaxy_config.root+"visualization",annotation:{get:galaxy_config.root+"dataset/get_annotation_async?id="+i,set:galaxy_config.root+"dataset/annotate_async?id="+i},tags:{get:galaxy_config.root+"tag/get_tagging_elt_async?item_id="+i+"&item_class=HistoryDatasetAssociation",set:galaxy_config.root+"tag/retag?item_id="+i+"&item_class=HistoryDatasetAssociation"},meta_download:galaxy_config.root+"dataset/get_metadata_file?hda_id="+i+"&metadata_name="};return h},initialize:function(h){this.log(this+".initialize",this.attributes);this.log("\tparent history_id: "+this.get("history_id"));if(!this.get("accessible")){this.set("state",d.STATES.NOT_VIEWABLE)}this._setUpListeners()},_setUpListeners:function(){this.on("change:state",function(i,h){this.log(this+" has changed state:",i,h);if(this.inReadyState()){this.trigger("state:ready",i,h,this.previous("state"))}})},toJSON:function(){var h=Backbone.Model.prototype.toJSON.call(this);h.misc_info=jQuery.trim(h.misc_info);return h},isDeletedOrPurged:function(){return(this.get("deleted")||this.get("purged"))},isVisible:function(i,j){var h=true;if((!i)&&(this.get("deleted")||this.get("purged"))){h=false}if((!j)&&(!this.get("visible"))){h=false}return h},hidden:function(){return !this.get("visible")},inReadyState:function(){var h=_.contains(d.READY_STATES,this.get("state"));return(this.isDeletedOrPurged()||h)},hasDetails:function(){return _.has(this.attributes,"genome_build")},hasData:function(){return(this.get("file_size")>0)},"delete":function c(h){return this.save({deleted:true},h)},undelete:function a(h){return this.save({deleted:false},h)},hide:function b(h){return this.save({visible:false},h)},unhide:function g(h){return this.save({visible:true},h)},purge:function f(h){h=h||{};h.url=galaxy_config.root+"datasets/"+this.get("id")+"/purge_async";var i=this,j=jQuery.ajax(h);j.done(function(m,k,l){i.set("purged",true)});j.fail(function(o,k,n){var l=_l("Unable to purge this dataset");var m=("Removal of datasets by users is not allowed in this Galaxy instance");if(o.responseJSON&&o.responseJSON.error){l=o.responseJSON.error}else{if(o.responseText.indexOf(m)!==-1){l=m}}o.responseText=l;i.trigger("error",i,o,h,_l(l),{error:l})})},searchKeys:["name","file_ext","genome_build","misc_blurb","misc_info","annotation","tags"],search:function(h){var i=this;h=h.toLowerCase();return _.filter(this.searchKeys,function(k){var j=i.get(k);return(_.isString(j)&&j.toLowerCase().indexOf(h)!==-1)})},matches:function(h){return !!this.search(h).length},toString:function(){var h=this.get("id")||"";if(this.get("name")){h=this.get("hid")+' :"'+this.get("name")+'",'+h}return"HDA("+h+")"}});d.STATES={UPLOAD:"upload",QUEUED:"queued",RUNNING:"running",SETTING_METADATA:"setting_metadata",NEW:"new",EMPTY:"empty",OK:"ok",PAUSED:"paused",FAILED_METADATA:"failed_metadata",NOT_VIEWABLE:"noPermission",DISCARDED:"discarded",ERROR:"error"};d.READY_STATES=[d.STATES.NEW,d.STATES.OK,d.STATES.EMPTY,d.STATES.PAUSED,d.STATES.FAILED_METADATA,d.STATES.NOT_VIEWABLE,d.STATES.DISCARDED,d.STATES.ERROR];d.NOT_READY_STATES=[d.STATES.UPLOAD,d.STATES.QUEUED,d.STATES.RUNNING,d.STATES.SETTING_METADATA];var e=Backbone.Collection.extend(LoggableMixin).extend({model:d,urlRoot:galaxy_config.root+"api/histories",url:function(){return this.urlRoot+"/"+this.historyId+"/contents"},initialize:function(i,h){h=h||{};this.historyId=h.historyId},ids:function(){return this.map(function(h){return h.id})},notReady:function(){return this.filter(function(h){return !h.inReadyState()})},running:function(){var h=[];this.each(function(i){if(!i.inReadyState()){h.push(i.get("id"))}});return h},getByHid:function(h){return _.first(this.filter(function(i){return i.get("hid")===h}))},getVisible:function(h,i){return this.filter(function(j){return j.isVisible(h,i)})},fetchAllDetails:function(){return this.fetch({data:{details:"all"}})},matches:function(h){return this.filter(function(i){return i.matches(h)})},set:function(j,h){var i=this;j=_.map(j,function(l){var m=i.get(l.id);if(!m){return l}var k=m.toJSON();_.extend(k,l);return k});Backbone.Collection.prototype.set.call(this,j,h)},toString:function(){return("HDACollection()")}});return{HistoryDatasetAssociation:d,HDACollection:e}});