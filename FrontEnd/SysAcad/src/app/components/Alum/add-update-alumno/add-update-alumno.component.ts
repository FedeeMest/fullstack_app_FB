import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '../../../interfaces/alumno';

@Component({
  selector: 'app-add-update-alumno',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-alumno.component.html',
  styleUrl: './add-update-alumno.component.css'
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form= this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      plan: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      fechaN: ['', Validators.required]

    })
   }

  ngOnInit(): void {
  }

  addAlumno(){
    console.log(this.form);
    }
}


