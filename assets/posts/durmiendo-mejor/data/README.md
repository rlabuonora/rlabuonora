# Sleep chart data

`sleeps.rds` contains the 302 non-nap nights used in the post, from
2025-11-04 through 2026-09-11. It is a base R data frame with three columns:

- `date`: wake date (`Date`).
- `wake`: local wake clock time in decimal hours, including seconds.
- `duration`: asleep duration in hours.

Source: `../whoop/data/raw/my_whoop_data_2026_09_11/sleeps.csv`, transformed
using `../whoop/scripts/11_sleep_combined_plot.R`. Rows with `Nap` equal to
`false` (case insensitive) are sorted by wake date. The date and clock time
are extracted directly from `Wake onset`, without timezone conversion;
`Asleep duration (min)` is divided by 60. Only these three fields are retained.

From the repository root, with R and ggplot2 installed:

```sh
Rscript scripts/render-durmiendo-mejor-plots.R
```

This regenerates `hora_despertar_tiempo_dormido.png` and the corresponding PDF
in the parent directory using only the local RDS. Each trend is the mean of
available nights in `(date - 14, date]`, a calendar-day window rather than
the last 14 observations.
