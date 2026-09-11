```{=html}
<%
function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-UY", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).toUpperCase();
}

const metaField = templateParams?.meta_field || "date";
const fallbackImage = templateParams?.fallback_image || "";
const maxTags = templateParams?.max_tags || 3;
%>
<div class="editorial-archive-list">
<% if (!items.length) { %>
  <p class="editorial-archive-empty"><%- templateParams?.empty_message || "No published entries yet." %></p>
<% } %>
<% for (const item of items) { %>
  <% const metaValue = item[metaField]; %>
  <article class="editorial-archive-item">
    <div class="editorial-archive-topline">
      <% if (metaValue) { %>
      <p class="editorial-archive-date">
        <time><%- metaField === "date" ? formatDisplayDate(metaValue) : metaValue %></time>
      </p>
      <% } %>
      <% if (item.lang === "es" || item.lang === "en") { %>
      <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
      <% } %>
    </div>
    <h2 class="editorial-archive-title"><a href="<%- item.path %>"><%- item.title %></a></h2>
    <% if (item.summary) { %>
    <p class="editorial-archive-summary"><%- item.summary %></p>
    <% } %>
    <% if (item.tags && item.tags.length) { %>
    <ul class="editorial-archive-tags">
      <% for (const tag of item.tags.slice(0, maxTags)) { %>
      <li><%- tag %></li>
      <% } %>
    </ul>
    <% } %>
  </article>
<% } %>
</div>
```
