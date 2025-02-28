export async function fetchUserData(username: string, forceRefresh = false) {
  const cachedData = localStorage.getItem("userData");
  
  if (cachedData && !forceRefresh) {
    return JSON.parse(cachedData);
  }
  
  try {
    const response = await fetch(`/api/fetch-data/${username}`);
    const resData = await response.json();
    if (response.ok && resData.success) {
      localStorage.setItem("userData", JSON.stringify(resData.data));
      return resData.data;
    } else {
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      throw new Error(resData.error || "Failed to fetch user data");
    }
  } catch (error) {
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    console.error(error);
    throw error;
  }
}