import hashlib

def hashPassword(password):
    # Convertimos la contraseña a bytes
    password_bytes = password.encode('utf-8')
    # Creamos un objeto hash SHA-256
    sha256 = hashlib.sha256()
    # Actualizamos el objeto hash con la contraseña en bytes
    sha256.update(password_bytes)
    # Obtenemos el hash en formato hexadecimal
    hashed_password = sha256.hexdigest()
    return hashed_password