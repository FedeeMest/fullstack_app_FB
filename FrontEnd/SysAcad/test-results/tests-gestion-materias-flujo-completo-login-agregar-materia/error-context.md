# Test info

- Name: flujo completo: login, agregar materia
- Location: C:\Users\belen\Desktop\fullstack_app_FB\FrontEnd\SysAcad\tests\gestion-materias.spec.ts:3:5

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Ingresar' })

    at C:\Users\belen\Desktop\fullstack_app_FB\FrontEnd\SysAcad\tests\gestion-materias.spec.ts:12:56
```

# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - list
- heading "Inicio de Sesión" [level=4]
- text: Usuario
- textbox "Usuario": admin
- text: Contraseña
- textbox "Contraseña": admin123
- button ""
- button "Iniciar Sesión"
- contentinfo:
  - paragraph: "© 2024 Sistema de Gestion Estudiantil - Created by: Guastoni Belen - Mestre Federico"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('flujo completo: login, agregar materia', async ({ page }) => {
   4 |   // 1. Ir a la página de login
   5 |   await page.goto('http://localhost:4200');
   6 |
   7 |   // 2. Ingresar usuario y contraseña
   8 |   await page.getByPlaceholder('Usuario').fill('admin');
   9 |   await page.getByPlaceholder('Contraseña').fill('admin123');
  10 |
  11 |   // 3. Hacer login
> 12 |   await page.getByRole('button', { name: 'Ingresar' }).click();
     |                                                        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  13 |
  14 |   // 4. Esperar a que redirija a /admin/alumnos
  15 |   await expect(page).toHaveURL(/.*\/admin\/alumnos/);
  16 |
  17 |   // 5. Hacer clic en el botón "Materias" del navbar
  18 |   await page.getByRole('button', { name: 'Materias' }).click();
  19 |
  20 |   // 6. Verificar que estamos en /materias
  21 |   await expect(page).toHaveURL(/.*\/materias/);
  22 |
  23 |   // 7. Clic en el botón "Agregar materia"
  24 |   await page.getByRole('button', { name: 'Agregar materia' }).click();
  25 |
  26 |   // 8. Verificar redirección a /admin/add_materia
  27 |   await expect(page).toHaveURL(/.*\/admin\/add_materia/);
  28 |
  29 |   // 9. Completar el formulario
  30 |   await page.getByLabel('Nombre:').fill('Matemática Avanzada');
  31 |   await page.getByLabel('Horas Anuales:').fill('160');
  32 |   await page.getByLabel('Modalidad:').selectOption({ label: 'Anual' });
  33 |
  34 |   // 10. Hacer clic en "Aceptar"
  35 |   await page.getByRole('button', { name: 'Aceptar' }).click();
  36 | });
  37 |
```