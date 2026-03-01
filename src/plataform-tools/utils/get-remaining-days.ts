export function GetDaysCount(item: any) {
  //   const testDate = '2026-02-25';

  const today = new Date();
  const dueDate = new Date(item);

  let remainingDays;
  let tv1 = today.valueOf();
  let tv2 = dueDate.valueOf();

  remainingDays = (tv2 - tv1) / 1000 / 86400;
  remainingDays = Math.round(remainingDays + 1);

  return remainingDays;
}
