```{=html}
<div class="projects-recent-list">
<% if (!items.length) { %>
  <p class="writing-listing-empty"><%- templateParams?.empty_message || "No public projects published yet." %></p>
<% } %>
<% for (const item of items) { %>
  <article class="projects-recent-item">
    <div class="projects-recent-date">
      <% if (item.year) { %>
      <time><%- item.year %></time>
      <% } %>
    </div>
    <div class="projects-recent-copy">
      <h3 class="projects-recent-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.summary) { %>
      <p class="projects-recent-summary"><%- item.summary %></p>
      <% } %>
    </div>
    <div class="projects-recent-meta">
      <% if (item.tags && item.tags.length) { %>
      <ul class="projects-recent-tags">
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
