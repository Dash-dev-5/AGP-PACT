export const translateRole = (role?: string) => {
  switch (role) {
    case 'Administrator':
      return 'Administrateur';
    case 'Manager':
      return 'Manageur';
    case 'Complainant':
      return 'Plaignant';
    default:
      return '';
  }
};
