```{=html}
<div class="writing-listing writing-listing-curated">
<% if (!items.length) { %>
  <p class="writing-listing-empty"><%- templateParams?.empty_message || "No flagship public writing yet." %></p>
<% } %>
<% for (const item of items) { %>
  <article class="writing-card writing-card-curated">
    <div class="writing-card-meta">
      <% if (item.content_type) { %>
      <span class="writing-card-type"><%- item.content_type %></span>
      <% } %>
      <% if (item.date) { %>
      <time class="writing-card-date"><%- item.date %></time>
      <% } %>
    </div>
    <div class="content-heading-with-badge">
      <h3 class="writing-card-title"><a href="<%- item.path %>"><%- item.title %></a></h3>
      <% if (item.lang === "es" || item.lang === "en") { %>
      <span class="lang-badge lang-badge--<%- item.lang %>"><%- item.lang.toUpperCase() %></span>
      <% } %>
    </div>
    <% if (item.summary) { %>
    <p class="writing-card-summary"><%- item.summary %></p>
    <% } %>
  </article>
<% } %>
</div>
```
