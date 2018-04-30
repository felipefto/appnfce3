import { Component, AfterViewChecked, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements AfterViewInit {
  message: String;
  router: Router;
  electronService: ElectronService;
  constructor(private _router: Router, private _electronService: ElectronService, private cdr: ChangeDetectorRef) {
    this.router = _router;
    this.electronService = _electronService;
    this.message = 'Iniciando aplicativo....';
  }

  ngAfterViewInit () {

    alert(this.electronService.remote.process.plataform);

    var localIP = this.electronService.ipcRenderer.sendSync('getLocalIP', this.electronService.remote.getCurrentWindow().id);

    let isLoad = false;
    const checkDB = this.electronService.ipcRenderer.sendSync('checkDB', this.electronService.remote.getCurrentWindow().id);
    if ( !checkDB ) {
      this.message = 'Criando arquivos de banco de dados...';
      this.cdr.detectChanges();
    } else {
        this.message = 'Verificando atualizações de banco de dados no servidor...';
        this.cdr.detectChanges();
      
      let hasUpdate = true;
      //var hasUpdate = db.checkUpdate();
      if ( hasUpdate ) {
        this.message = 'Atualizando banco de dados local com ip (' + localIP.toString()  + ')...';
        this.cdr.detectChanges();
        isLoad = true;
        }
    }

    if ( isLoad ) {
      // this.electronService.ipcRenderer.send('createWindowLogin', this.electronService.remote.getCurrentWindow().id);
    }
    console.log('Teste2' +  checkDB);
    /*
    setTimeout(() => {
    }, 2000);*/


/*
    localStorage.setItem('loaded', 'true');
    if(localStorage.getItem('logado')==="true"){
      this.electronService.ipcRenderer.send('createWindowMain', this.electronService.remote.getCurrentWindow())
    }else{
      this.electronService.ipcRenderer.send('createWindowLogin', this.electronService.remote.getCurrentWindow())
    }*/
  }

  updateProgressBar() {

  }

}

