const fs = require("fs");
const path = require("path");

// Ruta del archivo de configuración de seguridad de red
const networkSecurityConfigPath = path.join(
  __dirname,
  "..",
  "res",
  "xml",
  "network_security_config.xml"
);

// Ruta del directorio de Android en el proyecto de Expo
const androidDir = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "res",
  "xml"
);

// Crear el directorio de destino si no existe
fs.mkdirSync(androidDir, { recursive: true });

// Copiar el archivo de configuración de seguridad de red
fs.copyFileSync(
  networkSecurityConfigPath,
  path.join(androidDir, "network_security_config.xml")
);

// Modificar AndroidManifest.xml
const manifestPath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "AndroidManifest.xml"
);
const manifest = fs.readFileSync(manifestPath, "utf8");

if (
  !manifest.includes(
    'android:networkSecurityConfig="@xml/network_security_config"'
  )
) {
  const updatedManifest = manifest.replace(
    "<application",
    '<application android:networkSecurityConfig="@xml/network_security_config"'
  );
  fs.writeFileSync(manifestPath, updatedManifest, "utf8");
}
