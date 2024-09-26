import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-add-update-alumno',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-alumno.component.html',
  styleUrl: './add-update-alumno.component.css'
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup

  constructor(private fb: FormBuilder, private alumnosService: AlumnosService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['',Validators.required],
      mail: ['',Validators.required],
      direccion: ['',Validators.required],
      fechaN: ['',Validators.required],
      plan: ['',Validators.required]
    })
   }
  ngOnInit(): void {
  }

  addAlumno(){
    const alumno: Alumno = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      mail: this.form.value.mail,
      direccion: this.form.value.direccion,
      fechaN: this.form.value.fechaN,
      plan: this.form.value.plan
  }

  this.alumnosService.saveAlumno(alumno).subscribe(data => {
    console.log('Alumno creado');
  })
}

}
