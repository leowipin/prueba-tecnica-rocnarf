export const formatDateToLocal = (utcDateString: string): string => {
  try {
    const date = new Date(utcDateString);
    
    // Formatear fecha como "DD/MM/YYYY HH:mm"
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcDateString;
  }
};

export const formatDateOnly = (utcDateString: string): string => {
  try {
    const date = new Date(utcDateString);
    
    // Formatear solo fecha como "DD/MM/YYYY"
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcDateString;
  }
};

export const formatTimeOnly = (utcDateString: string): string => {
  try {
    const date = new Date(utcDateString);
    
    // Formatear solo hora como "HH:mm"
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return utcDateString;
  }
};
