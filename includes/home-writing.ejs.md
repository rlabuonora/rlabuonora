```{=html}
<div class="home-writing-list">
<% if (!items.length) { %>
  <p class="home-listing-empty">No hay publicaciones todavía.</p>
<% } %>
<% for (const item of items.slice(0, 3)) { %>
  <article class="home-writing-item">
    <div class="home-writing-body">
      <div class="home-writing-topline">
        <% if (item.lang === "es" || item.lang === "en") { %>
        <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
        <% } %>
      </div>
      <h3 class="home-writing-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
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
    </div>
  </article>
<% } %>
</div>
```
