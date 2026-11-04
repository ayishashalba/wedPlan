export const generateBookingId = () => {
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `BK-${randomPart}`;
};

