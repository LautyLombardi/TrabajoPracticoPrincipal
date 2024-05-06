# Recomendacion de desarrollo

Para evitar conflictos entre librerias instaladas y llevar buenas practicas , se recomienda tener un 
entorno virtual en Python.

## 1. Crear el entorno virtual
```
  python -m venv env
```

## 2. Ejecutar el entorno virtual
Dentro de una terminal

```
  env\Scripts\activate
```

ó 


```
  ./env/Scripts/activate
```

> Deberia salir un (env) al inicio de la linea de comandos Ej: (env) C:/home 
> Una vez hecho esto, cualquier instalacion hecha con pip se guardara en una carpeta dentro de env, llamada Include

## Instalacion de los paquetes necesarios de Python


El archivo requeriments.txt contiene todas las librerias necesarias para la ejecucion
```
  pip install -r requeriments.txt
```

## Ejecutar el backend-offline

#### Moverse de una carpeta a otra en la terminal:
```bash
  cd nombreCarpeta
```

Por linea de comandos --> moverse a la carpeta offline --> moverse a api --> dentro ejecutar el siguiente comando:

``` 
  python app.py
```

## Añadir/Actualizar el archivo requeriments.txt

A medida que se desarrolle, tal vez haya que agregar/actualizar alguna libreria para ello.
Nos situamos en la carpeta donde este nuestro archivo requeriments.txt y corremos el siguiente comando:
```
  pip freeze > requeriments.txt
```
Esto creara el archivo si no existe, y si existe lo sobrescribira `pip freeze` devuelve TODAS las librerias instaladas en la computadora (Por eso es importante usar entornos virtuales), y con `> requeriments.txt` estamos diciendole que pegue eso en un archivo .txt
