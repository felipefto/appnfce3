const electron = require('electron')
const {app, BrowserWindow, Menu} = electron
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipcMain = require('electron').ipcMain;


const db = require('./db');


// Mantenha uma referencia global do objeto da janela, se você não fizer isso, a janela será
// fechada automaticamente quando o objeto JavaScript for coletado.
let win;
let largura;
let altura;

global.pagina = 'load';

function createWindowLoad(){
    debugger;
    //db.select('select name , database_id FROM master.sys.databases');
    global.pagina = 'load';
    win = new BrowserWindow({width: 500, height: 170, frame: false, resizable: false, show : true})
    win.center();
    
    /*
    win.once('ready-to-show', () =>
    {
        //win.show()

       
    });*/
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
        
    }))    
    win.on('closed', () => {win = null;});
    
}

function createWindowLogin () {
// Criar uma janela de navegação.
    global.pagina = 'login';
    win = new BrowserWindow({width: 800, height: 540, frame: false, resizable: false})    
    win.center();    
    //if(localStorage.getItem('logado') === "true"){
        //win.close();
    //createWindowMain();        
    //}else{
        // e carrega index.html do app.
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }))
      

        // Abre o DevTools.
        //win.webContents.openDevTools()

        // Emitido quando a janela é fechada.
        win.on('closed', () => {
            // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
            // em um array, se seu app suporta várias janelas, este é o momento
            // quando você deve excluir o elemento correspondente.
            win = null
        })
        
    //} 
}
function createWindowMain () {
    global.pagina = 'main';
    // Criar uma janela de navegação.
    win = new BrowserWindow({width : largura, height : altura,frame: true})
    // e carrega index.html do app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))   
    //win.setMenu(null) ;
    // Abre o DevTools.
    //win.webContents.openDevTools()    
    // Emitido quando a janela é fechada.
    win.on('closed', () => {
        // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
        // em um array, se seu app suporta várias janelas, este é o momento
        // quando você deve excluir o elemento correspondente.
        win = null
    })       
        /*
    var menu = Menu.buildFromTemplate([
        {
            label:'Menu',
            submenu:[
                {label : 'Adjust Notification Value'},
                {
                    label : 'CoinMarketCap',
                    click(){
                        shell.openExternal('http://coinmarketcap.com')
                    }
                },
                {type: 'separator'},
                {label : 'Exit', click(){
                    app.quit()
                }}
            
            ]
        },
        {
            label : "Info"

        }            
    ])
    Menu.setApplicationMenu(menu);*/
}
function createWindow(){
    //var db = openDatabase('dbTips', '1.0', 'Meu Primeiro banco', 2 *1024 *1024);    
    createWindowLoad();       
}
// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on('ready', () => {
    
    largura = electron.screen.getPrimaryDisplay().workAreaSize.width;
    altura = electron.screen.getPrimaryDisplay().workAreaSize.height;
    createWindow();

});
app.on('before-quit', () => {

})
// Finaliza quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
    // No macOS é comum para aplicativos e sua barra de menu 
    // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q    
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('createWindowMain', (event, arg) => {    
    
    createWindowMain();
    electron.BrowserWindow.fromId(arg).close();
    
});
ipcMain.on('createWindowLogin', (event, arg) => {
    createWindowLogin();
    electron.BrowserWindow.fromId(arg).close();
})
ipcMain.on('closeApp', (event, arg) => {
    electron.BrowserWindow.fromId(arg).close();
})
ipcMain.on('showDialogCloseApp', (event, arg) =>{
    electron.dialog.showMessageBox(electron.BrowserWindow.fromId(arg), 
    {
        type: 'question', 
        title : "Sair", 
        message: 'Deseja sair do sistema?', 
        buttons: ['Cancel', 'Ok'] 
    },
    (response) => {
        console.log(response);
        if(response === 1){
            electron.BrowserWindow.fromId(arg).close();            
        }
    }    
    );
});

ipcMain.on('showDialogChangeUser', (event, arg) =>{
    electron.dialog.showMessageBox(electron.BrowserWindow.fromId(arg), 
    {
        type: 'question', 
        title : "Sair", 
        message: 'Deseja sair do sistema?', 
        buttons: ['Cancel', 'Ok'] 
    },
    (response) => {
        console.log(response);
        if(response === 1){
            createWindowLogin();
            electron.BrowserWindow.fromId(arg).close();            
        }
    }    
    );
});

ipcMain.on('checkDB', (event, arg) =>{
    db.check().then( (a) => {
        event.returnValue = a;        
    });
    
});


ipcMain.on('loadProgram', (event, arg) => {

    var isLoad = false;
    
    var checkUpdate = false;
    event.sender.send('updateProgressBar', "Procurando atualização de sistema...");    
    //checkUpdate = checkHasUpdate();

    if(checkUpdate){
        event.sender.send('updateProgressBar', "Atualizando sistema...");    
    };
    event.sender.send('updateProgressBar', "Verificando arquivos de banco de dados...");
    var dbcheck = db.check();
    if(!dbcheck){
        event.sender.send('updateProgressBar', "Criando arquivos de banco de dados...");
        var created = db.create();
        if(created){
            event.sender.send('updateProgressBar', "Verificando dados no servidor...");
            var hasUpdate = true;
            //var hasUpdate = db.checkUpdate();
            if(hasUpdate){
                event.sender.send('updateProgressBar', "Carregando banco de dados local...");
                isLoad = true;
            }
        }
    }else{
        event.sender.send('updateProgressBar', "Verificando atualizações de banco de dados no servidor...");
        var hasUpdate = true;
        //var hasUpdate = db.checkUpdate();
        if(hasUpdate){
            event.sender.send('updateProgressBar', "Atualizando banco de dados local...");
            isLoad = true;
        }
    }
    if(isLoad){
        createWindowLogin();
        electron.BrowserWindow.fromId(arg).close();
    }


});
ipcMain.on('getLocalIP', (event, arg) =>{
    event.returnValue = db.localIp;        
});

// Neste arquivo, você pode incluir o resto do seu aplicativo especifico do processo
// principal. Você também pode colocar eles em arquivos separados e requeridos-as aqui.