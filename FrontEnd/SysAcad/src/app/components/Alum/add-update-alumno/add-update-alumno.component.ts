import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-update-alumno',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-alumno.component.html',
  styleUrl: './add-update-alumno.component.css'
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';

  constructor(private fb: FormBuilder, private alumnosService: AlumnosService, private router: Router, private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['',Validators.required],
      mail: ['',Validators.required],
      direccion: ['',Validators.required],
      fechaN: ['',Validators.required],
      plan: ['',Validators.required]
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    if(this.id !== 0){
      this.operacion = 'Editar '
      this.getAlumno(this.id);
    }
  }

  getAlumno(id: number){
    this.alumnosService.getAlumno(id).subscribe((data: Alumno) => {
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fechaN: data.fechaN,
        plan: data.plan
      })
    })
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
    this.router.navigate(['/alumnos']);
  })
}

}
