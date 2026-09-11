# Source: https://github.com/cran/Horsekicks/blob/master/data/hkdeaths.rda
# Run from the repository root: Rscript scripts/render-horse-kick-plots.R
library(ggplot2)
data <- read.csv("assets/posts/horse-kick-data/data/horse-kicks.csv")
counts <- as.data.frame(table(factor(data$kick, levels = 0:4)))
names(counts) <- c("muertes", "n")
counts$muertes <- as.integer(as.character(counts$muertes))
stopifnot(sum(counts$n) == 280, sum(data$kick) == 196)
transparent_theme <- theme_minimal(base_family = "serif") + theme(
  axis.title = element_text(size = 16),
  axis.text = element_text(size = 14),
  legend.title = element_text(size = 14),
  legend.text = element_text(size = 13),
  plot.background = element_rect(fill = "transparent", colour = NA),
  panel.background = element_rect(fill = "transparent", colour = NA),
  legend.background = element_rect(fill = "transparent", colour = NA),
  legend.key = element_rect(fill = "transparent", colour = NA)
)
observed <- ggplot(counts, aes(muertes, n)) +
  geom_col(fill = "#1E1C1A") +
  labs(x = "Muertes por patada", y = "N") + transparent_theme
comparison <- rbind(
  data.frame(muertes = counts$muertes, value = counts$n, name = "n"),
  data.frame(muertes = counts$muertes,
             value = dpois(counts$muertes, mean(data$kick)) * sum(counts$n), name = "pred")
)
fitted <- ggplot(comparison, aes(muertes, value, fill = name)) +
  geom_col(position = "dodge") +
  scale_fill_manual("", values = c("#1E1C1A", "#6E6B68")) +
  labs(x = "Muertes por patada", y = "N") + transparent_theme
for (name in c("observed", "fitted")) {
  ggsave(paste0("assets/posts/horse-kick-data/", name, "-transparent.png"),
         plot = get(name), width = 7, height = 5, dpi = 192,
         bg = "transparent")
}
