```{=html}
<%
function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).toUpperCase();
}

function normalizeImagePath(value) {
  if (!value) return "/assets/processed/raster/posts/hamlet.png";
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
%>
<div class="posts-featured-list">
<% if (!items.length) { %>
  <p class="writing-listing-empty">No featured public writing yet.</p>
<% } %>
<% for (const item of items.slice(0, 1)) { %>
  <article class="posts-featured-card">
    <div class="posts-featured-art site-illustration-paper site-illustration-paper--square site-illustration-paper--post">
      <img src="<%- normalizeImagePath(item.image) %>" alt="" class="posts-featured-image site-illustration-image site-illustration-image--post">
    </div>
    <div class="posts-featured-body">
      <% if (item.date) { %>
      <p class="posts-featured-date"><%- formatDisplayDate(item.date) %></p>
      <% } %>
      <div class="content-heading-with-badge">
        <h3 class="posts-featured-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
        <% if (item.lang === "es" || item.lang === "en") { %>
        <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
        <% } %>
      </div>
      <% if (item.summary) { %>
      <p class="posts-featured-summary"><%- item.summary %></p>
      <% } %>
      <% if (item.tags && item.tags.length) { %>
      <ul class="posts-featured-tags">
        <% for (const tag of item.tags.slice(0, 3)) { %>
        <li><%- tag %></li>
        <% } %>
      </ul>
      <% } %>
    </div>
  </article>
<% } %>
</div>
```
