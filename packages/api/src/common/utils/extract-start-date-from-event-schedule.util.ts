export const extractStartDateFromEventSchedule = (schedule: Record<string, any>) => {
  if (Object.keys(schedule).includes('intervals') && schedule.intervals.length > 0) {
    const [start_datetime] = schedule.intervals[0].split('/');
    const [start_date] = start_datetime.split('T');

    return start_date;
  }
  if (Object.keys(schedule).includes('recurring_schedules') && schedule.recurring_schedules.length > 0) {
    const { start_date } = schedule.recurring_schedules[0];
    return start_date;
  }

  return null;
};
