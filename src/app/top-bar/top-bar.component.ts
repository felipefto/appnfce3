import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  

  constructor(public electronService: ElectronService) { }

  ngOnInit() {
    //alert(this.electronService.remote.process.plataform);
  }

}
