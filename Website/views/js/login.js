console.log("✅ login.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("❌ No se encontró el formulario con id='loginForm'");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        // 👈 Este endpoint lo maneja tu server.js
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Login exitoso:", data);
        alert("Inicio de sesión exitoso");
        window.location.href = "../index.html";
      } else {
        alert("❌ Error en login: " + (data.message || "Usuario o contraseña incorrectos"));
      }
    } catch (error) {
      console.error("❌ Error al conectar con backend:", error);
      alert("No se pudo conectar con el servidor local.");
    }
  });
});
