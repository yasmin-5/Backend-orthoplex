const millToSec = 0.001;
const millToMin = 1.66667e-5;
const millToHour = 2.7777777777778e-7;
const millToDay = 1.1574074074074e-8;
const millToWeek = 1.6534391534392e-9;
const millToMonth = 3.80225980226e-10;
const millToYear = 3.1709791709792e-11;

const calculateTimeDiff = (createdTime, currentTime = new Date().getTime()) => {
  const timeDiffInMs = currentTime - createdTime;
  const timeDiff = {
    years: Math.floor(timeDiffInMs * millToYear),
    months: Math.floor(timeDiffInMs * millToMonth),
    weeks: Math.floor(timeDiffInMs * millToWeek),
    days: Math.floor(timeDiffInMs * millToDay),
    hours: Math.floor(timeDiffInMs * millToHour),
    minutes: Math.floor(timeDiffInMs * millToMin),
    seconds: Math.floor(timeDiffInMs * millToSec),
  };
  let finalDiffResult = "";
  for (let [key, value] of Object.entries(timeDiff)) {
    if (value > 0) {
      finalDiffResult = `${value} ${key} ago`;
      break;
    }
  }
  return finalDiffResult;
};
module.exports = {
  calculateTimeDiff,
};
