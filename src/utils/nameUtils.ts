const STORAGE_KEY = 'letsgo3-username';

export const nameUtils = {
  // Get the stored username from localStorage
  getStoredName(): string {
    return localStorage.getItem(STORAGE_KEY) || '';
  },

  // Save the username to localStorage
  saveName(name: string): void {
    if (name.trim()) {
      localStorage.setItem(STORAGE_KEY, name.trim());
    }
  },

  // Remove the username from localStorage
  clearName(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Generate a random default username
  generateDefaultName(): string {
    return `User_${Math.random().toString(36).substr(2, 8)}`;
  },

  // Get the current name from URL params or localStorage
  getCurrentName(searchParams: URLSearchParams): string {
    const urlName = searchParams.get('name');
    if (urlName) return urlName;
    
    const storedName = this.getStoredName();
    if (storedName) return storedName;
    
    // Return empty string instead of generating a default
    // The component will handle prompting the user
    return '';
  }
};
