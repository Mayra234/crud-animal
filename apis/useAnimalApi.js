const useAnimalApi = () => {
  //Hace referencia al dominio
  const baseUrl = 'http://localhost:3000';

  const list = async () => {
    //GET -> http://localhost:3000/animals
    const response = await fetch(`${baseUrl}/animals`, { method: 'GET' });
    return response.json();
  };

  return {
    list,
  };
};
