main();
function main() {
    var myDoc = app.activeDocument;
    var myDocPath = myDoc.filePath;
    var myfileName = myDoc.name;
    var pdfName = myfileName.slice(0, myfileName.lastIndexOf("."));

    var ripFolder = makeDir(myDocPath, "出力用PDF");
    var proofFolder = makeDir(myDocPath, "校正用PDF");

    myDoc.exportFile(ExportFormat.pdfType, File(ripFolder + "/" + pdfName + "_X-4.pdf"), false, "[PDF/X-4:2008 (日本)]");
    myDoc.exportFile(ExportFormat.pdfType, File(proofFolder + "/" + pdfName + "_proof.pdf"), false, "[高品質印刷]");

    myDoc.close(SaveOptions.NO);
}

function makeDir(docPath, folderName) {
    var folderObj = new Folder(docPath + "/" + folderName);
    if (!folderObj.exists) {
        folderObj.create();
    }
    return folderObj.fsName;
}