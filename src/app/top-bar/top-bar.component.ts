import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {
  maximized: boolean;
  d: any;
  iconMax: string;
  iconRest: string;
  userName: string;
  constructor(public electronService: ElectronService) {
    this.iconMax = 'm 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z';
    this.iconRest = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z';
    this.maximized = this.electronService.remote.getCurrentWindow().isMaximized();
    this.d = this.iconMax;
    this.userName = this.electronService.remote.getGlobal('userName');
    this.electronService.ipcRenderer.on('updateD', (event, args) => {
      this.maximized = this.electronService.remote.getCurrentWindow().isMaximized();
      if  (this.maximized ) {
        this.d = this.iconMax;
      } else {
        this.d = this.iconRest;
      }
    });
  }

  ngOnInit() {
    //alert(this.electronService.remote.process.plataform);
  }
  restoreOrMaximize() {
    this.maximized = this.electronService.remote.getCurrentWindow().isMaximized();
    if ( this.maximized ) {
      this.restore();
    } else {
      this.maximize();
    }
  }
  restore() {
    this.electronService.ipcRenderer.send('restore', this.electronService.remote.getCurrentWindow().id);
  }
  maximize() {
    this.electronService.ipcRenderer.send('maximize', this.electronService.remote.getCurrentWindow().id);
  }
  close() {
    this.electronService.ipcRenderer.send('showDialogCloseApp', this.electronService.remote.getCurrentWindow().id);
  }
  changeUser(): void {
    this.electronService.ipcRenderer.send('showDialogChangeUser', this.electronService.remote.getCurrentWindow().id);
  }
  minimize() {
    this.electronService.ipcRenderer.send('minimize', this.electronService.remote.getCurrentWindow().id);
  }

}
