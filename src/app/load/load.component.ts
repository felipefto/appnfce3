import { Component, AfterViewChecked, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService } from 'ngx-electron';
import { delay } from 'q';
import { tick, fakeAsync } from '@angular/core/testing';
import { timer } from 'rxjs';


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

  async ngAfterViewInit () {
    console.time('teste');
    await delay(3000);
    var Online = false;
    var localIP = this.electronService.ipcRenderer.sendSync('getLocalIP', this.electronService.remote.getCurrentWindow().id);
    let isLoad = false;
    const checkDB = this.electronService.ipcRenderer.sendSync('checkDB', this.electronService.remote.getCurrentWindow().id);
    if ( !checkDB ) {
      console.log('6');
      this.message = 'Criando arquivos de banco de dados...';
      await delay(3000);
      this.cdr.detectChanges();
    } else {
      console.log('7');
      for (let index = 1; index <= 3; index++) {
        this.message = 'Tentativa de conexão ' + index.toString() + '/3 .';
        Online = navigator.onLine;
        this.electronService.ipcRenderer.send('setOnline', navigator);
        await delay(1000);
        if ( Online ) {
          this.message = 'Aplicativo conectado com o servidor local.';
          this.cdr.detectChanges();
          break;
        }
      }
      if ( Online ) {
        this.message = 'Verificando atualizações de banco de dados no servidor...';
        await delay(3000);
        this.cdr.detectChanges();
        let hasUpdate = true;

        // var hasUpdate = db.checkUpdate();
        if ( hasUpdate ) {

          this.message = 'Atualizando banco de dados local com ip (' + localIP.toString()  + ')...';
          await delay(3000);
          this.cdr.detectChanges();
          isLoad = true;
        }
      }
      if ( isLoad ) {
        this.electronService.ipcRenderer.send('createWindowLogin', this.electronService.remote.getCurrentWindow().id);
      }
    }

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

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}

