```{=html}
<div class="home-project-grid">
<% if (!items.length) { %>
  <p class="home-listing-empty">No flagship public projects yet.</p>
<% } %>
<% for (const item of items.slice(0, 3)) { %>
  <article class="home-project-card">
    <div class="home-project-card-body">
      <div class="home-project-topline">
        <% if (item.lang === "es" || item.lang === "en") { %>
        <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
        <% } %>
      </div>
      <h3 class="home-project-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.summary) { %>
      <p class="home-project-summary"><%- item.summary %></p>
      <% } %>
      <div class="home-project-meta">
        <% if (item.tags && item.tags.length) { %>
          <% for (const tag of item.tags.slice(0, 3)) { %>
        <span class="home-project-tag"><%- tag %></span>
          <% } %>
        <% } %>
      </div>
    </div>
  </article>
<% } %>
</div>
```
