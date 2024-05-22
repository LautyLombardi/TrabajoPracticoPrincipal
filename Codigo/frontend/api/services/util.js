import { URL } from '@/api/constantes'

export const sendImageToBackend = async (dni, photoUri) => {
    try {
      const formData = new FormData();
      formData.append("user_dni", dni)
      formData.append("image", {
        uri: photoUri,
        name: "photoTEST.jpg",
        type: "image/jpeg",
      });
      console.log("URL CORrECTA: "+ `${URL}/image/user` )
      const response = await fetch(`${URL}/image/user`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData.error);
      }
    } catch (error) {
      console.error("Error al enviar la imagen al backend:", error);
    }
  };