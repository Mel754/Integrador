<?php
$servername = "10.154.12.186"; 
$username = "automat";        
$password = "oki31xdc!#automat"; 
$database = "mydb"; 


$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
} else {
    echo "✅ Conexión exitosa a la base de datos";
}
?>
