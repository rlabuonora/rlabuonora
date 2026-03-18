```{=html}
<div class="home-listing home-listing-projects">
<% if (!items.length) { %>
  <p class="home-listing-empty">No flagship public projects yet.</p>
<% } %>
<% for (const item of items) { %>
  <article class="home-card home-card-project">
    <div class="home-card-meta">
      <span class="home-card-kicker">Project</span>
      <% if (item.year) { %>
      <span class="home-card-year"><%- item.year %></span>
      <% } %>
    </div>
    <h3 class="home-card-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
    <% if (item.summary) { %>
    <p class="home-card-summary"><%- item.summary %></p>
    <% } %>
    <% if (item.tags && item.tags.length) { %>
    <ul class="home-card-tags">
      <% for (const tag of item.tags) { %>
      <li><%- tag %></li>
      <% } %>
    </ul>
    <% } %>
    <% if (item.links) { %>
    <p class="home-card-links">
      <% if (item.links.demo) { %><a href="<%- item.links.demo %>">Demo</a><% } %>
      <% if (item.links.repo) { %><a href="<%- item.links.repo %>">Repo</a><% } %>
      <% if (item.links.blog) { %><a href="<%- item.links.blog %>">Process</a><% } %>
      <% if (item.links.video) { %><a href="<%- item.links.video %>">Video</a><% } %>
    </p>
    <% } %>
  </article>
<% } %>
</div>
```
