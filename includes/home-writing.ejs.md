```{=html}
<%
function formatMonthYear(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}
%>
<div class="home-writing-list">
<% if (!items.length) { %>
  <p class="home-listing-empty">No flagship public writing yet.</p>
<% } %>
<% for (const item of items) { %>
  <article class="home-writing-item">
    <div class="home-writing-date"><%- formatMonthYear(item.date) %></div>
    <div class="content-heading-with-badge">
      <h3 class="home-writing-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.lang === "es" || item.lang === "en") { %>
      <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
      <% } %>
    </div>
    <% if (item.summary) { %>
    <p class="home-writing-summary"><%- item.summary %></p>
    <% } %>
    <div class="home-writing-meta">
      <% if (item.tags && item.tags.length) { %>
        <% for (const tag of item.tags.slice(0, 2)) { %>
      <span><%- tag %></span>
        <% } %>
      <% } %>
    </div>
  </article>
<% } %>
</div>
```
