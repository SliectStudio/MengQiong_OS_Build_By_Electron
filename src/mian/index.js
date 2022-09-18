const { app, BrowserWindow, shell, dialog } = require('electron');
const { NsisUpdater } = require("electron-updater");
const path = require('path');
const { autoUpdater } = require('electron-updater')
function update() {
  
        const options = {
            provider: 'generic',
            url: `http://mengqiongos.sliect.top/${process.platform}`
        }

  const autoUpdater = new NsisUpdater(options)
  console.log(options)
  //检测更新
  autoUpdater.checkForUpdatesAndNotify()
        
  autoDownload = true
  autoUpdater.on('update-available', () => {
    console.log('find a new pak'),
    dialog.showMessageBox({
      message: '找到了新的版本'
    })
  })

  autoUpdater.on('update-not-available', () =>
    dialog.showMessageBox({
    message:'您已是最新版'
  })
  )

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否立即更新？若选择否则在关闭程序后自动更新！应用将在关闭程序后更新！',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if(buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
        autoUpdater.quitAndInstall() 
        app.quit()
      }else{
        
      }
    })
  })

}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
/*if (require('electron-squirrel-startup')) {
  app.quit();
}*/

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1124,
    height: 620,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    minWidth: 1124,
    minHeight:620,
  });

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../render/index.html'));

  // Open the DevTools.
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  //每次启动程序，就检查更新
  update()
});

app.on('ready', createWindow)
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
