```{=html}
<div class="writing-listing writing-listing-archive">
<% if (!items.length) { %>
  <p class="writing-listing-empty">No archived public writing yet.</p>
<% } %>
<% for (const item of items) { %>
  <article class="writing-card writing-card-archive">
    <div class="writing-card-archive-date">
      <% if (item.date) { %>
      <time><%- item.date %></time>
      <% } %>
    </div>
    <div class="writing-card-archive-body">
      <h3 class="writing-card-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.summary) { %>
      <p class="writing-card-summary"><%- item.summary %></p>
      <% } %>
      <% if (item.content_type) { %>
      <p class="writing-card-type-line"><%- item.content_type %></p>
      <% } %>
    </div>
  </article>
<% } %>
</div>
```
