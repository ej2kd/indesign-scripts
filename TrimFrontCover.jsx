/*
ダイアログから下記を入力し、カバーの表1・表4をトリミングする
単ページPDFとして出力する
綴じ方向：左開き or 右開き（Boolean）→どちらが表1か判定
展開サイズ：カバーの展開サイズ（仕上がり幅*2 + 背幅 + 折り返し*2）
背幅
*/

var myDoc = app.activeDocument;
var docWidth = myDoc.documentPreferences.pageWidth;
var docHeight = myDoc.documentPreferences.pageHeight;

var dlg = app.dialogs.add({name: "綴じ方向、展開サイズ、背幅の入力", canCancel: true});
with (dlg) {
    with (dialogColumns.add()) {
        with (borderPanels.add()) {
            staticTexts.add({staticLabel: "綴じ方向"});
            var bindingButtons = radiobuttonGroups.add();
            with (bindingButtons) {
                var leftRadioButton = radiobuttonControls.add({staticLabel: "左", checkedState: true});
                var rightRadioButton = radiobuttonControls.add({staticLabel: "右"});
            }
        }

        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({staticLabel: "左右の展開サイズを入力"});
            }
            with (dialogColumns.add()) {
                var widthSizeField = measurementEditboxes.add({editValue: 0, editUnits: MeasurementUnits.millimeters});
            }
        }

        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({staticLabel: "背幅を入力"});
            }
            with (dialogColumns.add()) {
                var spineSizeField = measurementEditboxes.add({editValue: 0, editUnits: MeasurementUnits.millimeters});
            }
        }
    }
}

if (dlg.show()) {
    // PDFを配置する位置を算出
    var widthSize = new UnitValue(widthSizeField.editValue, "pt").as("mm");
    var spineSize = new UnitValue(spineSizeField.editValue, "pt").as("mm");
    var myX1 = (widthSize + spineSize) / 2;
    var myX2 = (widthSize - spineSize) / 2 - docWidth;
    // カバーのPDFを選択、トリムボックス基準でトリミング
    var myPDFFile = File.openDialog("PDFを選択");
    app.pdfPlacePreferences.pdfCrop = PDFCrop.cropTrim;

    if (leftRadioButton.checkedState) {
        // 表1を配置
        placePDF(myX1, myPDFFile);

        // ページを追加して表4を配置
        myDoc.pages.add();
        placePDF(myX2, myPDFFile);
    } else {
        // 右開きの場合、x座標の位置を反転
        placePDF(myX2, myPDFFile);
        myDoc.pages.add();
        placePDF(myX1, myPDFFile);
    }
    dlg.destroy();

    exportPDF("1");
    exportPDF("2");
} else {
    dlg.destroy();
}

function placePDF(x, myPDFFile) {
    var myFrame = app.activeWindow.activePage.rectangles.add();
    myFrame.visibleBounds = ["0mm", "0mm", docHeight, docWidth];
    if ((myPDFFile != "") && (myPDFFile != null)) {
        myFrame.place(myPDFFile);
        var content = app.activeWindow.activePage.allGraphics[0];
        content.move(["-" + x + "mm","0mm"]);
    }
}

function exportPDF(myPage) {
    with (app.pdfExportPreferences) {
        pageRange = myPage;
    }
    var docPath = myDoc.filePath;
    var docName = myDoc.name.split('.')[0];

    var side = "";
    switch (myPage) {
        case "1":
            side = "_front";
            break;
        case "2":
            side = "_back";
            break;
    }
    myDoc.exportFile(ExportFormat.pdfType, File(docPath + "/" + docName + side + ".pdf"), false, '[高品質印刷]');
}