// 開いているinddファイルと同じ階層に「old」フォルダを作成し、その中にスクリプトを実行した日付のフォルダを作成する
// 日付フォルダ内にファイル名の末尾にタイムスタンプを付けてコピーを作成する
// 参考：http://blog.livedoor.jp/dtp_ausbildung/archives/69133524.html

main();
function main() {
  if (app.documents.length == 0) {
    alert("ドキュメントが開かれていません");
    exit();
  }
  var myDoc = app.activeDocument;
  var myDocPath = myDoc.filePath;
  var myDocName = myDoc.name;

  var oldFolder = makeDir(myDocPath, "old");
  if (!oldFolder) {
    "oldフォルダがありません";
    exit();
  }

  var folderList = new Folder(oldFolder).getFiles();
  var today = getTimeStamp_s(2);
  var flag = false;
  for (var i = 0; i < folderList.length; i++) {
    if (folderList[i].constructor.name !== "Folder") continue;
    else if (decodeURI(folderList[i].name == today)) {
      flag = true;
      oldFolder += "/" + folderList[i].name + "/";
      break;
    }
  }

  var newFileName = myDocName.slice(0, myDocName.lastIndexOf('.'));
  var tgtFile;
  if (!flag) {
    var dateFolder = oldFolder + "/" + today;
    var newFolder = new Folder(dateFolder).create();
    tgtFile = makeNewFile(dateFolder + "/", newFileName);
  } else {
    tgtFile = makeNewFile(oldFolder, newFileName);
  }

  myDoc.saveACopy(tgtFile);
  alert("バックアップファイルを作成しました");
}

function makeDir(destDir, folderName) {
  var folderObj = new Folder(destDir + "/" + folderName);
  if (!folderObj.extsts) {
    folderObj.create();
  }

  return folderObj;
}

function makeNewFile (folderObj, fileName) {
  var fileObj = new File(folderObj + fileName + "_" + getTimeStamp_s(3) + ".indd");
  return fileObj;
}

function getTimeStamp_s(type) {
  var myDate = new Date();
  var result = "";
  var year = myDate.getFullYear().toString();
  var month = setZero((myDate.getMonth()+1).toString());
  var date = setZero(myDate.getDate().toString());
  var hour = setZero(myDate.getHours().toString());
  var min = setZero(myDate.getMinutes().toString());
  var sec = setZero(myDate.getSeconds().toString());
  switch (type) {
    case 1: result += month + date; break;
    case 2: result += year + month + date; break;
    case 3: result += year + month + date + hour + min; break;
    default: result += year + month + date + hour + min + sec;
  }
  return result;

  function setZero(str) {
    if (str.length === 1) return "0" + str;
    else return str;
  }
}
