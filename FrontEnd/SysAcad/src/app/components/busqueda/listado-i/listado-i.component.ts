import { Component } from '@angular/core';

@Component({
  selector: 'app-listado-i',
  standalone: true,
  imports: [],
  templateUrl: './listado-i.component.html',
  styleUrl: './listado-i.component.css'
})
export class ListadoIComponent implements OnInit {

  ngOnInit():void{
    //aca se realiza el query para obtener las incsripciones del alumn
  }

}
