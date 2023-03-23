export const csvFileHeaderAndRows = (string, csvDelimiter) => {
  const header = string.slice(0, string.indexOf('\n')).split(csvDelimiter);
  const rows = string.slice(string.indexOf('\n') + 1).split('\n').map(r => r.split(csvDelimiter));

  return [header, rows];
};

export const stringToDate = (string) => {
  const [dd, mm, yyyy] = string.split('.');
  return new Date(yyyy, Number(mm) - 1, dd);
};

export const dateDiffInDays = (dateDiffInMs) => Math.ceil(dateDiffInMs / (1000 * 60 * 60 * 24));

export const pairCommonDays = (DateFrom, DateTo, jDateFrom, jDateTo) => {
  let commonDays = 0;

  if (jDateFrom <= DateFrom && DateFrom <= jDateTo && jDateTo <= DateTo) {
      commonDays = dateDiffInDays(jDateTo - DateFrom) + 1;
  } else if (DateFrom <= jDateFrom && jDateFrom <= DateTo && DateTo <= jDateTo) {
      commonDays = dateDiffInDays(DateTo - jDateFrom) + 1;
  } else if (DateFrom <= jDateFrom && jDateTo <= DateTo ) {
      commonDays = dateDiffInDays(jDateTo - jDateFrom) + 1;
  } else if (jDateFrom <= DateFrom && DateTo <= jDateTo) {
      commonDays = dateDiffInDays(DateTo - DateFrom) + 1;
  }

  return commonDays;
};
