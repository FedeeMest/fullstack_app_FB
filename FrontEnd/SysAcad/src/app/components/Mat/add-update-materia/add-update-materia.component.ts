import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MateriaService } from '../../../services/materia.service.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Materia } from '../../../interfaces/materia.js';

@Component({
  selector: 'app-add-update-materia',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-materia.component.html',
  styleUrl: './add-update-materia.component.css'
})
export class AddUpdateMateriaComponent implements OnInit {
  form: FormGroup
  id: number;
  operacion: string = 'Agregar ';

  constructor(private fb: FormBuilder, private materiasService: MateriaService, private router: Router, private aRouter: ActivatedRoute) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      horas_anuales: [0,Validators.required],
      modalidad: ['',Validators.required],
    })
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
   }

   ngOnInit(): void {
    if(this.id !== 0){
      this.operacion = 'Editar '
      this.getMateria(this.id);
    }
   }

   getMateria(id: number){
    this.materiasService.getMateria(id).subscribe((data: Materia) => {
      console.log(data);
      this.form.setValue({
        nombre: data.nombre,
        horas_anuales: data.horas_anuales,
        modalidad: data.modalidad,
      })
    })
   }

    addMateria(){
      console.log(this.form.value);
      const materia: Materia = {
        nombre: this.form.value.nombre,
        horas_anuales: this.form.value.horas_anuales,
        modalidad: this.form.value.modalidad,
      }
  
      if(this.id !== 0){
        materia.id = this.id;
        this.materiasService.updateMateria(this.id,materia).subscribe(() => {
          console.log('Materia actualizada');
          this.router.navigate(['/materias']);
        })
      }else{
        this.materiasService.saveMateria(materia).subscribe(() => {
          console.log('Materia creada');
          this.router.navigate(['/materias']);
        })
      }
    }

}
