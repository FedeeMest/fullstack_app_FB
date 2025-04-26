import { Component, OnInit } from '@angular/core';
import { Materia } from '../../../../interfaces/materia'; // Interfaz para el modelo de Materia
import { MateriaService } from '../../../../services/materia.service'; // Servicio para interactuar con la API de materias
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Formularios reactivos
import { CommonModule, NgFor, NgIf } from '@angular/common'; // Módulos comunes de Angular
import { Router, RouterModule } from '@angular/router'; // Servicios para redirigir y manejar rutas
import { ToastrService } from 'ngx-toastr'; // Servicio para mostrar notificaciones

@Component({
  selector: 'app-materias', // Selector del componente
  standalone: true, // Indica que este componente es independiente
  imports: [NgFor, CommonModule, RouterModule, ReactiveFormsModule, NgIf], // Módulos necesarios para el componente
  templateUrl: './materias.component.html', // Ruta al archivo HTML del componente
  styleUrls: ['./materias.component.css'] // Ruta al archivo CSS del componente
})
export class MateriasComponent implements OnInit {
  listaMaterias: Materia[] = []; // Lista completa de materias obtenidas desde la API
  materiasFiltradas: Materia[] = []; // Lista de materias filtradas según la modalidad seleccionada
  modalidadesDisponibles: string[] = []; // Lista de modalidades disponibles
  filtroForm: FormGroup; // Formulario reactivo para manejar el filtro por modalidad
  errorMessage: string | null = null; // Mensaje de error para mostrar al usuario

  constructor(
    private _materiaService: MateriaService, // Servicio para interactuar con la API
    private fb: FormBuilder, // Constructor de formularios reactivos
    private router: Router, // Servicio para redirigir
    private toastr: ToastrService // Servicio para mostrar notificaciones
  ) {
    // Inicializar el formulario de filtro
    this.filtroForm = this.fb.group({
      modalidad: [''] // Campo para seleccionar una modalidad
    });
  }

  ngOnInit(): void {
    // Eliminar datos de alumno del localStorage si existen
    if (typeof localStorage !== 'undefined') {
      const storedAlumno = localStorage.getItem('alumno');
      if (storedAlumno) {
        localStorage.removeItem('alumno');
        console.log('Alumno eliminado del localStorage');
      }
    }

    this.getMaterias(); // Obtener la lista de materias al inicializar el componente

    // Escuchar cambios en el filtro de modalidad
    this.filtroForm.get('modalidad')?.valueChanges.subscribe((modalidadSeleccionada) => {
      this.filtrarMaterias(modalidadSeleccionada); // Filtrar materias según la modalidad seleccionada
    });
  }

  // Método para obtener la lista de materias desde la API
  getMaterias(): void {
    this._materiaService.getMaterias().subscribe({
      next: (response) => {
        this.listaMaterias = response; // Asignar la lista de materias obtenida
        this.materiasFiltradas = [...this.listaMaterias]; // Inicializar la lista filtrada
        this.extraerModalidadesDisponibles(); // Extraer las modalidades disponibles
        this.errorMessage = null; // Limpiar el mensaje de error
      },
      error: (err) => {
        this.errorMessage = `Error al cargar las materias: ${err.message}`; // Mostrar mensaje de error
        console.error('Error fetching data', err); // Loguear errores en la consola
      }
    });
  }

  // Método para extraer las modalidades disponibles de la lista de materias
  extraerModalidadesDisponibles(): void {
    const modalidades = this.listaMaterias.map((materia) => materia.modalidad); // Obtener las modalidades de las materias
    this.modalidadesDisponibles = Array.from(new Set(modalidades.filter(Boolean))); // Eliminar duplicados y valores nulos
  }

  // Método para filtrar materias según la modalidad seleccionada
  filtrarMaterias(modalidadSeleccionada: string): void {
    if (modalidadSeleccionada) {
      this.materiasFiltradas = this.listaMaterias.filter(
        (materia) => materia.modalidad === modalidadSeleccionada
      );
    } else {
      this.materiasFiltradas = [...this.listaMaterias]; // Mostrar todas las materias si no hay filtro
    }
  }

  // Método para eliminar una materia
  deleteMateria(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
      this._materiaService.deleteMateria(id).subscribe({
        next: () => {
          console.log('Materia eliminada');
          this.toastr.error('La materia fue eliminada con éxito', 'Materia eliminada', {
            progressBar: true,
            progressAnimation: 'decreasing'
          });
          this.getMaterias(); // Actualizar la lista de materias
        },
        error: (err) => {
          this.errorMessage = `Error al eliminar la materia: ${err.message}`; // Mostrar mensaje de error
          console.error('Error al eliminar la materia', err); // Loguear errores en la consola
        }
      });
    }
  }

  // Método para redirigir al formulario de agregar una nueva materia
  goadd(): void {
    this.router.navigate(['/admin/add_materia']); // Redirigir al formulario de agregar materia
  }
}