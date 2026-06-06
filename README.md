# PC-BUILDER

Versión modificada desde EXTREMIS Final Fusion.

## Cambios aplicados

- El nombre visible del proyecto ahora es **PC-BUILDER**.
- La sección de registro/login ya no muestra consola JSON ni token.
- El usuario solo ve si se registró, inició sesión o cerró sesión.
- Se agregaron tres pre-creaciones de computadora:
  - Baja gama.
  - Media gama.
  - Alta gama.
- Se mantiene el PC Builder con análisis de compatibilidad.
- Se mantiene autenticación JWT, dashboard protegido y guardado de armados.

## Cómo ejecutar

```powershell
npm.cmd install
npm.cmd start
```

Abrir:

```text
http://localhost:3000
```

## Pre-creaciones

- **Baja gama:** i5-12400F, H610 DDR4, 16 GB DDR4, RX 6600, 500W, gabinete mATX.
- **Media gama:** Ryzen 5 5600, B550M, 32 GB DDR4, RTX 4060, 550W.
- **Alta gama:** Ryzen 7 7800X3D, B650, 32 GB DDR5, RTX 4080 Super, 850W.


## Arreglo funcional aplicado

- Los selectores se rellenan desde la API `/api/pc/parts`.
- Si la API no responde, se carga un catálogo local de emergencia para que las opciones no queden vacías.
- Los botones se enlazan con `document.getElementById`, evitando fallos por variables globales del navegador.
- Se agregaron botones de baja, media y alta gama también dentro del panel del configurador.
