export const generateAcademicYears = (yearsBack: number = 5) => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  // Loop backwards from 0 to n
  for (let i = 0; i <= yearsBack; i++) {
    const Year = currentYear - i;
    years.push((Year).toString());
  }

  return years;
};
