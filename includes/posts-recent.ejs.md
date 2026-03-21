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
%>
<div class="posts-recent-list">
<% if (!items.length) { %>
  <p class="writing-listing-empty"><%- templateParams?.empty_message || "No published posts yet." %></p>
<% } %>
<% for (const item of items) { %>
  <article class="posts-recent-item">
    <div class="posts-recent-date">
      <% if (item.date) { %>
      <time><%- formatDisplayDate(item.date) %></time>
      <% } %>
    </div>
    <div class="posts-recent-copy">
      <h3 class="posts-recent-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.summary) { %>
      <p class="posts-recent-summary"><%- item.summary %></p>
      <% } %>
    </div>
    <div class="posts-recent-meta">
      <% if (item.tags && item.tags.length) { %>
      <ul class="posts-recent-tags">
        <% for (const tag of item.tags.slice(0, 2)) { %>
        <li><%- tag %></li>
        <% } %>
      </ul>
      <% } %>
    </div>
  </article>
<% } %>
</div>
```
