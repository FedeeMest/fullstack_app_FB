import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent implements OnInit {
  form: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      busqueda: ['', Validators.required]
    })
   }

   ngOnInit(): void {
    
   }

}
