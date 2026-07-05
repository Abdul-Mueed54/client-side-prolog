export const generateAcademicYears = (yearsBack: number = 10) => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  // Loop backwards from 0 to n
  for (let i = 4; i <= yearsBack; i++) {
    const Year = currentYear - i;
    years.push(Year.toString());
  }

  return years;
};
