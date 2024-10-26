function saveFile(name, choice) {
    const svgNode = document.getElementById("whiteboard");
    switch(choice) {
        case "png": 
            svgExport.downloadPng(svgNode, name, {width: svgNode.width, height: svgNode.height});
            break;
        case "jpeg": 
            svgExport.downloadJpeg(svgNode, name);
            break;
        default: 
            svgExport.downloadSvg(svgNode,name, { width: svgNode.width, height: svgNode.height } );
            break;
    }
}
