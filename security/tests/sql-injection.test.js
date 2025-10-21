const request = require('supertest');
const app = require('././server.js');

describe('🔒 Protección contra SQL Injection', () => {
  
 describe('Tests automáticos básicos', () => {
    
    test('Debe bloquear inyección con OR 1=1', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: "' OR '1'='1",
          password: "cualquiera"
        });
      
      expect(response.status).toBe(400);
      expect(response.body.codigo).toBe('SQL_INJECTION_DETECTED');
    });

    test('Debe bloquear UNION SELECT', async () => {
      const response = await request(app)
        .post('/api/postulaciones')
        .send({
          razonSocial: "Empresa' UNION SELECT * FROM users--"
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Debe bloquear comentarios SQL (--)', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: "admin'--",
          password: ""
        });
      
      expect(response.status).toBe(400);
    });

    test('Debe bloquear DROP TABLE', async () => {
      const response = await request(app)
        .post('/api/proyectos')
        .send({
          nombreProyecto: "'; DROP TABLE proyectos; --"
        });
      
      expect(response.status).toBe(400);
    });

    test('Debe permitir entradas legítimas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: "usuario@ejemplo.com",
          password: "password123"
        });
      
      expect(response.status).not.toBe(400);
      expect(response.body.codigo).not.toBe('SQL_INJECTION_DETECTED');
    });

    test('Debe permitir texto con comillas legítimas', async () => {
      const response = await request(app)
        .post('/api/proyectos')
        .send({
          nombreProyecto: "Proyecto 'Innovación'",
          descripcionProyecto: "Este es un proyecto legítimo"
        });
      
      expect(response.body.codigo).not.toBe('SQL_INJECTION_DETECTED');
    });
  });

  describe('US-131.04: Payloads de ataque comunes', () => {
    
    const payloadsAutenticacion = [
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "admin' #",
      "' OR 'x'='x",
      "') OR ('1'='1",
    ];

    payloadsAutenticacion.forEach(payload => {
      test(`Debe bloquear payload de bypass: ${payload}`, async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: payload,
            password: "test"
          });
        
        expect(response.status).toBe(400);
      });
    });

    const payloadsUnion = [
      "' UNION SELECT NULL--",
      "' UNION SELECT NULL, NULL--",
      "' UNION SELECT username, password FROM users--",
      "' UNION ALL SELECT NULL--",
    ];

    payloadsUnion.forEach(payload => {
      test(`Debe bloquear UNION attack: ${payload}`, async () => {
        const response = await request(app)
          .post('/api/postulaciones')
          .send({
            razonSocial: payload
          });
        
        expect(response.status).toBe(400);
      });
    });

    const payloadsTimeBased = [
      "' OR SLEEP(5)--",
      "' AND SLEEP(5)--",
      "'; WAITFOR DELAY '00:00:05'--",
      "' OR BENCHMARK(1000000,MD5('A'))--",
    ];

    payloadsTimeBased.forEach(payload => {
      test(`Debe bloquear time-based blind: ${payload}`, async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: payload,
            password: "test"
          });
        
        expect(response.status).toBe(400);
      });
    });

    const payloadsDestructivos = [
      "'; DROP TABLE users--",
      "'; DELETE FROM postulaciones WHERE '1'='1",
      "'; TRUNCATE TABLE proyectos--",
      "'; UPDATE users SET password='hacked'--",
    ];

    payloadsDestructivos.forEach(payload => {
      test(`Debe bloquear payload destructivo: ${payload}`, async () => {
        const response = await request(app)
          .post('/api/proyectos')
          .send({
            nombreProyecto: payload
          });
        
        expect(response.status).toBe(400);
      });
    });
  });

  describe('US-131.05: Verificación de implementación segura', () => {
    
    test('El servidor debe estar usando el middleware de protección', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: "' OR 1=1--", password: "x" });
      
      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('no válid');
    });

    test('Las rutas protegidas deben rechazar inyecciones', async () => {
      const rutasProtegidas = [
        { url: '/login', data: { email: "admin'--", password: "" } },
        { url: '/api/postulaciones', data: { razonSocial: "' OR '1'='1" } },
        { url: '/api/proyectos', data: { nombreProyecto: "'; DROP TABLE--" } },
      ];

      for (const ruta of rutasProtegidas) {
        const response = await request(app)
          .post(ruta.url)
          .send(ruta.data);
        
        expect(response.status).toBe(400);
      }
    });
  });

  describe('Tests de regresión: Funcionalidad normal', () => {
    
    test('Usuarios legítimos pueden enviar datos normales', async () => {
      const response = await request(app)
        .post('/api/proyectos')
        .send({
          nombreProyecto: "Proyecto de Robótica",
          descripcionProyecto: "Un proyecto innovador en automatización",
          sector: "Robótica",
          presupuesto: 50000000
        });
      
      expect(response.status).not.toBe(400);
      expect(response.body.codigo).not.toBe('SQL_INJECTION_DETECTED');
    });

    test('Emails válidos son aceptados', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: "usuario.valido@ejemplo.com",
          password: "contraseña123"
        });
       expect(response.status).not.toBe(400);
    });
  });
});


describe('Performance del middleware', () => {
  
  test('El middleware no debe agregar latencia significativa', async () => {
    const inicio = Date.now();
    
    await request(app)
      .post('/login')
      .send({
        email: "test@ejemplo.com",
        password: "password"
      });
    
    const duracion = Date.now() - inicio;
        expect(duracion).toBeLessThan(100);
  });
});
