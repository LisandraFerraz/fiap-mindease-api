export function GetDaysCount(item: any, isRemaining: boolean) {
  const testDate = '2026-03-04';

  const today = new Date(testDate);
  const dueDate = new Date(item);

  let remainingDays;
  let tv1 = today.valueOf();
  let tv2 = dueDate.valueOf();

  // PARA CHECKLIST
  // remainingDays = (tv2 - tv1) / 1000 / 86400;
  // remainingDays = Math.round(remainingDays - 1);

  if (isRemaining) {
    remainingDays = (tv2 - tv1) / 1000 / 86400;
    remainingDays = Math.round(remainingDays + 1);
  } else {
    remainingDays = (tv2 - tv1) / 1000 / 86400;
    remainingDays = Math.round(remainingDays - 1);
  }

  return remainingDays;
}
