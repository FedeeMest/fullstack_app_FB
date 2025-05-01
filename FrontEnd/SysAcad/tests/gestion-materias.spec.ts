import { test, expect, Page } from '@playwright/test';

test.describe('Gestión de materias - Admin', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200');

    // Login como admin
    await page.fill('#usuario', 'pedroadmin');
    await page.fill('#password', 'pedro123admin');

    // Esperar a que el botón esté visible y habilitado
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeEnabled();

    // Hacer clic en el botón de inicio de sesión
    await page.click('#iniciarSesion');

    // Esperar a que redirija a /admin/alumnos
    await page.waitForURL('http://localhost:4200/admin/alumnos');
  });

  test('crear nueva materia desde la vista de lista', async () => {
    // Ir a sección "Materias"
    await page.getByRole('button', { name: 'Materias' }).click();
    await page.waitForURL('http://localhost:4200/materias');

    // Verificar que el botón "Agregar Materia" esté visible y habilitado
    await expect(page.locator('#btnAgregarMateria')).toBeVisible();
    await expect(page.locator('#btnAgregarMateria')).toBeEnabled();

    // Clic en "Agregar materia"
    await page.click('#btnAgregarMateria');

    // Esperar a que el formulario de nueva materia esté presente

    await expect(page.locator('div.card-header:has-text("Agregar Materia")')).toBeVisible({ timeout: 10000 });

    // Llenar los campos del formulario
    await page.fill('#nombre', 'Introducción a Playwright');
    await page.fill('#horas_anuales', '120');
    await page.selectOption('#modalidad', { label: 'Cuatrimestral' });

    // Aceptar y guardar
    await page.click('button:has-text("Aceptar")');

    // Verificar que se muestra la nueva materia en la tabla
    const row = page.locator('table tr:has-text("Introducción a Playwright")');
    await expect(row).toBeVisible();
  });

  test.afterAll(async () => {
    await page.close();
  });
});