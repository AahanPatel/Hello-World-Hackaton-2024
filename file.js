function saveFile(name, choice) {
    const svgNode = document.getElementById("whiteboard");
    switch(choice) {
        case "svg": 
            svgExport.downloadSvg(svgNode,name, { width: svgNode.width, height: svgNode.height } );
            break;
        case "png": 
            svgExport.downloadPng("<svg id=\"mysvg\"></svg>", name, {width: svgNode.width, height: svgNode.height});
            break;
        case "jpeg": 
            svgExport.downloadJpeg(svgNode, name);
            break;
        default: 
            svgExport.downloadSvg(svgNode,name, { width: svgNode.width, height: svgNode.height } );
    }
}
