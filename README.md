# Evaluación Técnica - Visualización de datos de Energía Eléctrica

## Dependencias
- [Docker](https://docs.docker.com/get-started/introduction/get-docker-desktop/) o alternativamente  [Node.js v21+](https://nodejs.org/en/download)

## Ejecución
### Usando Docker (desde la carpeta raíz):
```bash
docker compose up -d
```
- Para ejecutar tests:  
```bash
docker compose run data_viz-web-1 npm tests
```
- Para ejecutar linter:  
```bash
docker compose run data_viz-web-1 npm run lint
```

### Usando npm (desde la carpeta `front`):
```bash
npm install && npm start
```
- Para ejecutar tests: `npm run tests`
- Para ejecutar linter: `npm run lint`

## Objetivos Clave
- [x] **Ser funcional**  
  Funciona correctamente, implementado con principios de programación funcional (inmutabilidad, sin efectos secundarios, evitación de objetos, etc).
- [x] **Estado de carga durante la obtención de datos**  
  Implementado mediante programación asíncrona y gestión de estados.
- [x] **Diseño intuitivo y agradable**  
  Se utilizó un sistema de diseño consolidado (Ant Design). Nota: Se priorizó mantener la información privada limitando contenido adicional.

## Extras
- [x] **Código limpio**  
  Uso de ESLint + lógica separada entre peticiones HTTP/transformaciones de datos y componentes visuales.  
  *Sugerencia: Mayor división de componentes podría mejorar mantenibilidad.*
- [x] **Manejo de errores**  
  Implementación de try/catch en rutas críticas.
- [ ] **Accesibilidad y Usabilidad**  
  UI intuitiva pero con accesibilidad no priorizada (puntuación actual: [77%](https://www.accessibilitychecker.org/audit/?website=https%3A%2F%2Fpaulossa2.github.io%2Fdata_viz_example%2F&flag=us)).
- [ ] **Mejora de rendimiento**  
  No priorizado. *Sugerencia: React Query (TanStack Query) mejoraría rendimiento mediante caching.*
- [x] **Pruebas unitarias**  
  Implementadas para transformación de datos. Nota: Dificultades con Highcharts + React en pruebas de UI.
- [ ] **Refinamiento UX/UI**  
  Responsividad no implementada por restricciones de tiempo.
- [x] **Uso de Docker**
- [ ] **Maqueta de UI**  
  Enfoque MVP iterativo sin mockups previos. *Sugerencia: Crear mockups en futuras iteraciones.*