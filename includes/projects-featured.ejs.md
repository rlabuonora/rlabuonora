```{=html}
<%
function normalizeImagePath(value) {
  if (!value) return "/assets/processed/raster/emblems/palacio-salvo.png";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const match = value.match(/assets\/.+$/);
  if (match) {
    return `../${match[0]}`;
  }
  if (value.startsWith("/")) {
    return value;
  }
  return value.replace(/^\.?\//, "../");
}

const maxItems = templateParams?.max_items || 2;
%>
<div class="projects-featured-list">
<% if (!items.length) { %>
  <p class="writing-listing-empty"><%- templateParams?.empty_message || "No public featured projects yet." %></p>
<% } %>
<% for (const item of items.slice(0, maxItems)) { %>
  <% const imagePath = normalizeImagePath(item.image); %>
  <% const imageIsEmblem = /\/emblems\//.test(imagePath); %>
  <article class="projects-featured-card">
    <div class="projects-featured-body">
      <% if (item.year) { %>
      <p class="projects-featured-date"><%- item.year %></p>
      <% } %>
      <div class="content-heading-with-badge">
        <h3 class="projects-featured-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
        <% if (item.lang === "es" || item.lang === "en") { %>
        <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
        <% } %>
      </div>
      <% if (item.summary) { %>
      <p class="projects-featured-summary"><%- item.summary %></p>
      <% } %>
      <% if (item.tags && item.tags.length) { %>
      <ul class="projects-featured-tags">
        <% for (const tag of item.tags.slice(0, 3)) { %>
        <li><%- tag %></li>
        <% } %>
      </ul>
      <% } %>
    </div>
    <div class="projects-featured-art site-illustration-paper <%- imageIsEmblem ? "site-illustration-paper--square" : "site-illustration-paper--landscape" %>">
      <img src="<%- imagePath %>" alt="" class="projects-featured-image site-illustration-image <%- imageIsEmblem ? "site-illustration-image--emblem" : "site-illustration-image--hero" %>">
    </div>
  </article>
<% } %>
</div>
```
