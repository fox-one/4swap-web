import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh";

dayjs.extend(relativeTime);

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    s: "%d sec ago",
    m: "1 min ago",
    mm: "%d min ago",
    h: "1 hr ago",
    hh: "%d hr ago",
    d: "1 D ago",
    dd: "%d D ago",
    M: "1 M ago",
    MM: "%d M ago",
    y: "1 Y ago",
    yy: "%d Y ago",
  },
});

dayjs.updateLocale("zh", {
  relativeTime: {
    s: "%d 秒前",
    m: "1 分钟前",
    mm: "%d 分钟前",
    h: "1 小时前",
    hh: "%d 小时前",
    d: "1 天前",
    dd: "%d 天前",
    M: "1 月前",
    MM: "%d 月前",
    y: "1 年前",
    yy: "%d 年前",
  },
});

export function toRelative(t) {
  return dayjs().to(t, true);
}

export function relativeFormat(t) {
  const date = dayjs(t);
  const today = "HH:mm";
  const this_year = "MM/DD HH:mm";
  const full = "YYYY/MM/DD";
  const p = date.isBefore(dayjs(), "day")
    ? date.isBefore(dayjs(), "year")
      ? full
      : this_year
    : today;
  return date.format(p);
}

export function format(t, p = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(t).format(p);
}
