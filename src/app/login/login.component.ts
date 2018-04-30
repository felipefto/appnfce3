import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Router } from '@angular/router';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {

  electronService: ElectronService;
  constructor(private _electronService: ElectronService, private router: Router, private _ipc: ElectronService) {
    this.electronService = _electronService;
  }
  ngOnInit() {
   /*const config: any = {
      user: 'sa',
      password: 'admin',
      server: 'P000167\\SQLEXPRESS',
      port: 1433
    };

    const connection = new SqlClient.ConnectionPool( config, (error) => {
      console.log(error);
    });
    /*
    const request = new Request(connection);
    request.query('SELECT name, database_id FROM [master].[sys].[databases]', ( error, rows ) => {
      console.log(rows);
    });*/

    // this.electronService.ipcRenderer.send('testeConnection', this.electronService.remote.getCurrentWindow().id);
  }
  loginInit() {
    this.electronService.ipcRenderer.send('createWindowMain', this.electronService.remote.getCurrentWindow().id);
  }


}
