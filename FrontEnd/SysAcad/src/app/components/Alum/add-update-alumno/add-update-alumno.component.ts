import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno } from '../../../interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-update-alumno',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-update-alumno.component.html',
  styleUrl: './add-update-alumno.component.css'
})
export class AddUpdateAlumnoComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';
  errorMessage: string = '';
  origen: string; // Declara la propiedad 'origen'

  constructor(private fb: FormBuilder, private alumnosService: AlumnosService, private router: Router, private aRouter: ActivatedRoute,private location: Location) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['',Validators.required],
      mail: ['',Validators.required],
      direccion: ['',Validators.required],
      fechaN: ['',Validators.required],
      plan: ['',Validators.required]
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
    this.origen = navigation.extras.state['from'];// Detecta el origen
    } else {
      this.origen = ''; // Inicializa 'origen' si no se establece
    }
    
   }

  ngOnInit(): void {
    if(this.id !== 0){
      this.operacion = 'Editar '
      this.getAlumno(this.id);
    }
    this.origen = localStorage.getItem('origen') || 'default';
  }

  getAlumno(id: number){
    this.alumnosService.getAlumno(id).subscribe((data: Alumno) => {
      const fechaFormateada = new Date(data.fechaN).toISOString().split('T')[0];
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        mail: data.mail,
        direccion: data.direccion,
        fechaN: fechaFormateada,
        plan: data.plan
      })
    })
  }

  addAlumno() {
    const alumno: Alumno = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      mail: this.form.value.mail,
      direccion: this.form.value.direccion,
      fechaN: this.form.value.fechaN,
      plan: this.form.value.plan
    };
  
    if (this.id !== 0) {
      // Actualización de un alumno existente
      alumno.id = this.id;
      this.alumnosService.updateAlumno(this.id, alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno actualizado', response.data);
          this.errorMessage = '';
          // Si es una edición, actualiza también en el localStorage
          localStorage.setItem('alumno', JSON.stringify(response.data));
          this.volver();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al actualizar el alumno:', error);
        }
      });
    } else {
      // Creación de un nuevo alumno
      this.alumnosService.saveAlumno(alumno).subscribe({
        next: (response: any) => {
          console.log('Alumno creado', response.data);
          this.errorMessage = '';
          // Guarda el nuevo alumno en localStorage
          localStorage.setItem('alumno', JSON.stringify(response.data));
          this.volver();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error desconocido';
          console.error('Error al crear el alumno:', error);
        }
      });
    }
  }

  volver() {
    this.location.back();  // Navega hacia atrás en el historial
  }
  


}
