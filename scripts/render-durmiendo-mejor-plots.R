# Adapted from ../whoop/scripts/11_sleep_combined_plot.R
# Run from the repository root: Rscript scripts/render-durmiendo-mejor-plots.R
library(ggplot2)
s <- readRDS("assets/posts/durmiendo-mejor/data/sleeps.rds")
stopifnot(inherits(s$date, "Date"), !anyDuplicated(s$date),
          !is.unsorted(s$date), all(is.finite(s$wake)),
          all(is.finite(s$duration)))
plot_data <- rbind(
  data.frame(date=s$date, value=s$wake, metric="Hora de despertar"),
  data.frame(date=s$date, value=s$duration, metric="Tiempo dormido"))
plot_data$metric <- factor(plot_data$metric, levels=c("Hora de despertar", "Tiempo dormido"))
plot_data$trend <- NA_real_
for (metric in levels(plot_data$metric)) {
  idx <- which(plot_data$metric == metric)
  x <- plot_data[idx, ]
  plot_data$trend[idx] <- vapply(seq_len(nrow(x)), function(i)
    mean(x$value[x$date <= x$date[i] & x$date > x$date[i]-14]), numeric(1))
}
clock_labels <- function(x) {
  minutes <- round(x*60)
  sprintf("%d:%02d", minutes %/% 60, minutes %% 60)
}
month_labels <- function(x) {
  months <- c("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic")
  paste(months[as.integer(format(x, "%m"))], format(x, "%y"))
}
p <- ggplot(plot_data, aes(date, value, colour=metric)) +
  geom_point(alpha=.26, size=1.25) +
  geom_line(aes(y=trend), linewidth=1.1) +
  facet_wrap(~metric, ncol=1, scales="free_y") +
  scale_colour_manual(values=c("Hora de despertar"="#16758a", "Tiempo dormido"="#7855a4"), guide="none") +
  scale_y_continuous(labels=clock_labels) +
  scale_x_date(date_breaks="1 month", labels=month_labels) +
  labs(title="Hora de despertar y tiempo dormido",
    subtitle="Cada punto representa una noche · Líneas: promedio móvil de 14 días",
    x=NULL, y=NULL) +
  theme_minimal(base_size=12) +
  theme(plot.title=element_text(face="bold", size=19),
    strip.text=element_text(face="bold", hjust=0, size=12),
    panel.grid.minor=element_blank(), plot.caption=element_text(hjust=0, colour="grey40"),
    panel.spacing=grid::unit(1.2, "lines"),
    plot.background=element_rect(fill="transparent", colour=NA),
    panel.background=element_rect(fill="transparent", colour=NA))
dir.create("assets/posts/durmiendo-mejor", recursive=TRUE, showWarnings=FALSE)
ggsave("assets/posts/durmiendo-mejor/hora_despertar_tiempo_dormido.png", p, width=11, height=7, dpi=180, bg="transparent")
ggsave("assets/posts/durmiendo-mejor/hora_despertar_tiempo_dormido.pdf", p, width=11, height=7, bg="transparent")
