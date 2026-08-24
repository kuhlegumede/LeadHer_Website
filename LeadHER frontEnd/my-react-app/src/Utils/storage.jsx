export const getBlogs = async () => {
  try {
    const result = await window.storage.get('blogs');
    return result ? JSON.parse(result.value) : [];
  } catch (error) {
    console.error('Error loading blogs:', error);
    return [];
  }
};

export const saveBlogs = async (blogs) => {
  try {
    await window.storage.set('blogs', JSON.stringify(blogs));
    return true;
  } catch (error) {
    console.error('Error saving blogs:', error);
    return false;
  }
};