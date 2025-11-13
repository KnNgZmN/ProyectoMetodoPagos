# 💳 Interfaz de Pagos — Proyecto Académico en Angular

![Angular](https://img.shields.io/badge/Angular-20.2.0-DD0031?style=for-the-badge&logo=angular)
![MongoDB](https://img.shields.io/badge/MongoDB-Connected-47A248?style=for-the-badge&logo=mongodb)
![Render](https://img.shields.io/badge/Deployed%20on-Render-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

## 🧩 Descripción

**InterfazPagos** es una aplicación web desarrollada con **Angular** que **simula el flujo completo de pagos en línea** a través de diferentes pasarelas, incluyendo:

- 💰 **PayPal**
- 💳 **Tarjeta de Crédito**
- 💳 **Tarjeta de Débito**

El sistema se conecta con **MongoDB** para registrar y consultar toda la actividad de las transacciones, manteniendo trazabilidad de cada pago realizado.  
El proyecto fue **desplegado en Render** como parte de un **proyecto académico**, enfocándose en la integración front-end con bases de datos y servicios simulados.

---

## 🚀 Tecnologías utilizadas

- **Angular 20.2.0**
- **Node.js / Express (API simulada)**
- **MongoDB (base de datos para registro de transacciones)**
- **TypeScript**
- **HTML5 / CSS3 / Bootstrap**
- **Render (despliegue en la nube)**

---

## ⚙️ Instalación y ejecución

1️⃣ Clonar el repositorio
git clone https://github.com/tuusuario/InterfazPagos.git
cd InterfazPagos

2️⃣ Instalar dependencias
npm install

3️⃣ Ejecutar el servidor de desarrollo
ng serve
Luego abre tu navegador en 👉 http://localhost:4200
La aplicación se recargará automáticamente al detectar cambios en el código fuente.

🧠 Funcionalidades principales

💵 Simulación de pagos
Procesamiento de pagos con PayPal, tarjeta de crédito y tarjeta de débito.
Validación de datos del usuario y del método de pago.
Confirmación y resumen de la transacción.

📊 Gestión de transacciones
Registro automático de cada pago en MongoDB.
Listado de historial de transacciones.
Búsqueda y filtrado por tipo de pago o estado.

☁️ Despliegue
Aplicación desplegada en Render con configuración optimizada para producción.
Conexión persistente a base de datos MongoDB en la nube.

🧪 Testing

Unit Tests
Ejecuta las pruebas unitarias con Karma:
ng test

End-to-End Tests
Ejecuta pruebas de integración (e2e):
ng e2e


📦 InterfazPagos/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── components/       # Componentes de la interfaz (pago, resumen, historial, etc.)
│   │   ├── services/         # Servicios HTTP y conexión con MongoDB
│   │   └── models/           # Modelos de datos (Transacción, Usuario, Método de pago)
│   ├── assets/               # Recursos estáticos
│   └── environments/         # Configuraciones (dev / prod)
├── angular.json
├── package.json
└── README.md

🎯 Objetivos Académicos

✔️ Comprender la integración de front-end Angular con bases de datos no relacionales (MongoDB).
✔️ Simular flujos de pago reales mediante pasarelas digitales.
✔️ Implementar un flujo de transacciones con almacenamiento persistente.
✔️ Desplegar una aplicación Angular funcional en Render.

👩‍💻 Autores

Alejandra Toro - Kevin Guzman
📚 Proyecto académico — Universitaria de Colombia / Ingenieria de Software / 2025

📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.
Consulta el archivo LICENSE para más información.
