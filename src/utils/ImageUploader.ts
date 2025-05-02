import cloudinary from "./cloudinaryConfig";


export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'simeon'); // Remplacez 'ml_default' par votre preset si nécessaire

  const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

  try {
    const response = await fetch(
        `http://192.168.200.223:8181/api/v1/uploads/tracking`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    console.log("data",data);
    
    if (data.secure_url) {
      console.log('Image URL:', data.secure_url);
      return data.secure_url; // Renvoie l'URL de l'image téléchargée
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return null; // Renvoie `null` en cas d'échec
  }
};
