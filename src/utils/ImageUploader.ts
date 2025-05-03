import cloudinary from "./cloudinaryConfig";

export const uploadImageToCloudinary = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);  

  try {
    const response = await fetch(
        `http://192.168.200.223:8181/api/v1/uploads/traking/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
      }
    );
    const data = await response.json();
    console.log("data", data);
    
    if (data.secure_url) {
      console.log('Image URL:', data.secure_url);
      return data.secure_url; // Return the uploaded image URL
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return null; // Return `null` in case of failure
  }
};
