

StructureJS  = function(options) {

	this.options = options;
	this.structureFlatJson();
	return this;
}

/**
	For each object in the flat json object array, structure it,
	then merge it with the new structured object
**/
StructureJS.prototype.structureFlatJson = function() {
	var flat_json = this.options.json_string;
	this.structured_json = {};

	for (var property in flat_json) {
		if (typeof(flat_json[property]) == "object"){
			this.structured_json = $.extend(
				true,
				{}, 
				this.structured_json, 
				this.structureObject(flat_json[property], $.extend(true, {}, {}, this.options.template)));
		}
	}

}

/** 
	For a template of arbitrary depth, go through each property.
	If it's an object, 
**/
StructureJS.prototype.structureObject = function (obj, branch) {

	var ret = {};
	for (var property in branch){
		if (typeof(branch[property]) == "object"){
			// create branch with value as name
			if (obj.hasOwnProperty(property)) {
				ret[obj[property]] = $.extend(true, {}, {}, this.structureObject(obj, branch[property]));
				//branch[obj[property]] = $.extend({}, {}, this.structureObject(obj, branch[property]));
			}
			else {
				continue;
			}
		}
		else {
			//console.log("value: " + property);
			if (obj.hasOwnProperty(property) && obj[property] !=""){
				ret[property] = obj[property];
				branch[property] = obj[property];
			}
			else {
				continue;
			}
		}
	}

	//console.log("------");
	return ret;//branch;

}
