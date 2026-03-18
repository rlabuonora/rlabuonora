local function stringify(value)
  if not value then
    return nil
  end
  return pandoc.utils.stringify(value)
end

local function meta_list(meta_value)
  if not meta_value then
    return {}
  end

  if meta_value.t == "MetaList" then
    local items = {}
    for _, item in ipairs(meta_value) do
      table.insert(items, stringify(item))
    end
    return items
  end

  local single = stringify(meta_value)
  if single and single ~= "" then
    return { single }
  end

  return {}
end

local function is_project_page()
  local input = PANDOC_STATE.input_files[1] or ""
  return input:match("^projects/") ~= nil
end

local function is_writing_page()
  local input = PANDOC_STATE.input_files[1] or ""
  return input:match("^writing/") ~= nil and not input:match("^writing/index%.qmd$")
end

local function meta_value(meta, key)
  return meta[key]
end

local function make_section_heading(text)
  return pandoc.Header(2, text)
end

local function make_paragraph(text, class_name)
  return pandoc.Div({ pandoc.Para({ pandoc.Str(text) }) }, pandoc.Attr("", { class_name }))
end

local function inline_text(text)
  return { pandoc.Str(text) }
end

local function blocks_for_project(meta)
  local blocks = pandoc.List()
  local summary = stringify(meta_value(meta, "summary"))
  local year = stringify(meta_value(meta, "year"))
  local content_type = stringify(meta_value(meta, "content_type"))
  local access = stringify(meta_value(meta, "access"))
  local tier = stringify(meta_value(meta, "tier"))
  local tags = meta_list(meta_value(meta, "tags"))
  local image = stringify(meta_value(meta, "image"))
  local links = meta_value(meta, "links")

  if summary and summary ~= "" then
    blocks:insert(pandoc.Div({ pandoc.Para({ pandoc.Str(summary) }) }, pandoc.Attr("", { "project-summary" })))
  end

  local meta_items = pandoc.List()
  if year and year ~= "" then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Year") }),
        pandoc.Para({ pandoc.Str(year) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end
  if content_type and content_type ~= "" then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Type") }),
        pandoc.Para({ pandoc.Str(content_type) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end
  if access and access ~= "" then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Access") }),
        pandoc.Para({ pandoc.Str(access) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end
  if tier and tier ~= "" then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Tier") }),
        pandoc.Para({ pandoc.Str(tier) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end
  if #tags > 0 then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Tags") }),
        pandoc.Para({ pandoc.Str(table.concat(tags, " / ")) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end
  if image and image ~= "" then
    meta_items:insert(
      pandoc.Div({
        pandoc.Para({ pandoc.Str("Image") }),
        pandoc.Para({ pandoc.Str(image) })
      }, pandoc.Attr("", { "project-meta-item" }))
    )
  end

  if #meta_items > 0 then
    blocks:insert(pandoc.Div(meta_items, pandoc.Attr("", { "project-meta-grid" })))
  end

  if links and links.t == "MetaMap" then
    local link_items = pandoc.List()
    local link_order = { "demo", "repo", "blog", "video" }
    local link_labels = {
      demo = "Demo",
      repo = "Repo",
      blog = "Blog",
      video = "Video"
    }

    for _, key in ipairs(link_order) do
      local href = stringify(links[key])
      if href and href ~= "" then
        link_items:insert(
          pandoc.Plain({
            pandoc.Link(inline_text(link_labels[key]), href)
          })
        )
      end
    end

    if #link_items > 0 then
      blocks:insert(make_section_heading("Links"))
      blocks:insert(pandoc.Div({ pandoc.BulletList(link_items) }, pandoc.Attr("", { "project-links-block" })))
    end
  end

  return blocks
end

local function related_blocks(meta)
  local blocks = pandoc.List()
  local related_project = meta_value(meta, "related_project")
  local related_writing = meta_value(meta, "related_writing")

  local function make_related_list(items)
    local list_items = pandoc.List()
    for _, item in ipairs(items) do
      if item.t == "MetaMap" then
        local title = stringify(item.title) or "Untitled"
        local href = stringify(item.href) or "#"
        list_items:insert(pandoc.Plain({ pandoc.Link(inline_text(title), href) }))
      end
    end
    return list_items
  end

  local has_any = false
  local section_blocks = pandoc.List()

  if related_project then
    local items = related_project.t == "MetaList" and related_project or pandoc.MetaList({ related_project })
    local list_items = make_related_list(items)
    if #list_items > 0 then
      has_any = true
      section_blocks:insert(pandoc.Para({ pandoc.Strong(inline_text("Related project")) }))
      section_blocks:insert(pandoc.BulletList(list_items))
    end
  end

  if related_writing then
    local items = related_writing.t == "MetaList" and related_writing or pandoc.MetaList({ related_writing })
    local list_items = make_related_list(items)
    if #list_items > 0 then
      has_any = true
      section_blocks:insert(pandoc.Para({ pandoc.Strong(inline_text("Related writing")) }))
      section_blocks:insert(pandoc.BulletList(list_items))
    end
  end

  if has_any then
    blocks:insert(make_section_heading("Related"))
    blocks:insert(pandoc.Div(section_blocks, pandoc.Attr("", { "writing-related" })))
  end

  return blocks
end

local function blocks_for_writing(meta)
  local blocks = pandoc.List()
  local summary = stringify(meta_value(meta, "summary"))
  local date = stringify(meta_value(meta, "date"))
  local content_type = stringify(meta_value(meta, "content_type"))
  local tags = meta_list(meta_value(meta, "tags"))

  if summary and summary ~= "" then
    blocks:insert(pandoc.Div({ pandoc.Para({ pandoc.Str(summary) }) }, pandoc.Attr("", { "writing-summary" })))
  end

  local meta_line = pandoc.List()
  if date and date ~= "" then
    meta_line:insert(pandoc.Span({ pandoc.Str(date) }, pandoc.Attr("", { "writing-meta-date" })))
  end
  if content_type and content_type ~= "" then
    meta_line:insert(pandoc.Span({ pandoc.Str(content_type) }, pandoc.Attr("", { "writing-meta-type" })))
  end
  if #tags > 0 then
    meta_line:insert(pandoc.Span({ pandoc.Str(table.concat(tags, " / ")) }, pandoc.Attr("", { "writing-meta-tags" })))
  end

  if #meta_line > 0 then
    local inlines = pandoc.List()
    for i, item in ipairs(meta_line) do
      if i > 1 then
        inlines:insert(pandoc.Str(" "))
        inlines:insert(pandoc.Str("·"))
        inlines:insert(pandoc.Str(" "))
      end
      inlines:extend(item.content)
    end
    blocks:insert(pandoc.Div({ pandoc.Para(inlines) }, pandoc.Attr("", { "writing-meta-line" })))
  end

  return blocks
end

function Pandoc(doc)
  if is_project_page() then
    local intro = blocks_for_project(doc.meta)
    intro:extend(doc.blocks)
    doc.blocks = intro
    return doc
  end

  if is_writing_page() then
    local intro = blocks_for_writing(doc.meta)
    local tail = related_blocks(doc.meta)
    intro:extend(doc.blocks)
    intro:extend(tail)
    doc.blocks = intro
    return doc
  end

  return doc
end
