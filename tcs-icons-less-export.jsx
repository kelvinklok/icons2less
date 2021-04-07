//export folders to LESS and xls

var tcsIconsList = [];
var tcsTargetFolder = new Folder(app.activeDocument.path + "/../styles");

tcsCollectLayers(app.activeDocument, []);
tcsLESSExport();
tcsXLSExport();
tcsAlert();

//create list of icons from collected layers
function tcsCollectLayers (tcsPSD, tcsAllLayers){
    if (!tcsAllLayers) {var tcsAllLayers = new Array}
    else {}
	
	// count top level folders
	var tcsNumberOfLayers = tcsPSD.layerSets.length - 1;
	var tcsY = 0;
	
	//for every top level folder
	for (var i = tcsNumberOfLayers; i >= 0; i--) {
		var tcsLayer = tcsPSD.layerSets[i];
		var tcsX = 0;
		
		//count nested folders
		var tcsNumberOfNestedLayers = tcsLayer.layerSets.length - 1;
		
		//for every nested folder
		for (var n = tcsNumberOfNestedLayers; n >= 0; n--) {
			var tcsNestedLayer = tcsPSD.layerSets[i].layerSets[n];
			
			//define icon object properties
			var tcsIconObject = {
				tcsLayerName: tcsLayer.name,
				tcsNestedLayerName: tcsNestedLayer.name,
				tcsXCoordinate: tcsX,
				tcsYCoordinate: tcsY
			};
			
			//add icon object to list
			tcsIconsList.push(tcsIconObject);
			
			//add 2 to X for every nested folder i.e. levels
			tcsX = tcsX + 2;
		}
		
		//ignore folders without nested folders
		if (tcsNumberOfNestedLayers >= 0) {
			//add 2 to Y for every top level folder i.e. attributes
			tcsY = tcsY + 2;
		}
	}
}

//write list of icons to LESS file
function tcsLESSExport(){
	var tcsLogFile = new File(tcsTargetFolder + "/icons.less");
	
	//create folder
	if (tcsTargetFolder.exists == false){
		tcsTargetFolder.create();
	}

	tcsLogFile.open("w"); //"w" for overwrite; "a" for append
	
	//for each icon
	for (var n = 0; n < tcsIconsList.length; n ++){
		//remove level name if it is "--"
		if (tcsIconsList[n].tcsNestedLayerName === "--") {
			var tcsContent = [".GenerateIconSprite(icon-" + tcsIconsList[n].tcsLayerName + ", " + tcsIconsList[n].tcsXCoordinate + ", " + tcsIconsList[n].tcsYCoordinate + ");"];
		}
		else {
			var tcsContent = [".GenerateIconSprite(icon-" + tcsIconsList[n].tcsLayerName + "-" + tcsIconsList[n].tcsNestedLayerName + ", " + tcsIconsList[n].tcsXCoordinate + ", " + tcsIconsList[n].tcsYCoordinate + ");"];
		}
		
		//write title for each attribute
		if (tcsIconsList[n].tcsXCoordinate === 0) {
			tcsLogFile.write("\n" + "//" + tcsIconsList[n].tcsLayerName + "\n");
		}
		
		//write icon
		tcsLogFile.writeln(tcsContent);
	}
}

//write list of icons to EXCEL file
function tcsXLSExport(){
	var tcsLogFile = new File(tcsTargetFolder + "/icons.xls");

	//create folder
	if (tcsTargetFolder.exists == false){
		tcsTargetFolder.create()
	}
	
	tcsLogFile.open("w"); //"w" for overwrite; "a" for append

	//prepare column names
	tcsLogFile.write("attribute", "\t", "level", "\t", "name\n");

	//for each icon
	for (var n = 0; n < tcsIconsList.length; n ++){
		//remove level name if it is "--"
		if (tcsIconsList[n].tcsNestedLayerName === "--") {
			var tcsContent = [tcsIconsList[n].tcsLayerName, "\t", "\t", "icon-" + tcsIconsList[n].tcsLayerName];
		}
		else {
			var tcsContent = [tcsIconsList[n].tcsLayerName, "\t", tcsIconsList[n].tcsNestedLayerName, "\t", "icon-" + tcsIconsList[n].tcsLayerName + "-" + tcsIconsList[n].tcsNestedLayerName];
		}

		//space out each attribute
		if (tcsIconsList[n].tcsXCoordinate === 0) {
			tcsLogFile.write("\n");
		}
		
		//write icon
		tcsLogFile.writeln(tcsContent.join(""));
	}
	
}

//alert message
function tcsAlert(){
	alert (
		"DONE :)\n\"icons.less\" and \"icons.xls\" successfully exported to path:\n\n" +  decodeURI(app.activeDocument.path.parent) + "/styles"
	)
}