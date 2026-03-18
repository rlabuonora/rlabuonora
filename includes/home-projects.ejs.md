```{=html}
<div class="home-project-grid">
<% if (!items.length) { %>
  <p class="home-listing-empty">No flagship public projects yet.</p>
<% } %>
<% for (const item of items.slice(0, 3)) { %>
  <article class="home-project-card">
    <div class="home-project-content">
      <h3 class="home-project-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.summary) { %>
      <p class="home-project-summary"><%- item.summary %></p>
      <% } %>
      <div class="home-project-meta">
        <% if (item.content_type) { %>
        <span class="home-project-type"><%- item.content_type %></span>
        <% } %>
        <% if (item.tags && item.tags.length) { %>
          <% for (const tag of item.tags.slice(0, 3)) { %>
        <span class="home-project-tag"><%- tag %></span>
          <% } %>
        <% } %>
        <% if (item.year) { %>
        <span class="home-project-year"><%- item.year %></span>
        <% } %>
      </div>
    </div>
  </article>
<% } %>
</div>
```
