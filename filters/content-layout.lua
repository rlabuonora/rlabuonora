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

  if (meta_value.t == "MetaList" or pandoc.utils.type(meta_value) == "List") then
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

local function meta_value(meta, key)
  return meta[key]
end

local function has_meta_value(meta, key, expected)
  local value = stringify(meta_value(meta, key))
  return value == expected
end

local function is_project_page(meta)
  return has_meta_value(meta, "content_type", "build")
end

local function is_writing_page(meta)
  local content_type = stringify(meta_value(meta, "content_type"))
  return content_type == "learn" or content_type == "reflect"
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

local function inline_list_with_separator(items, separator)
  local inlines = pandoc.List()

  for i, item in ipairs(items) do
    if i > 1 then
      inlines:insert(pandoc.Space())
      inlines:insert(pandoc.Str(separator))
      inlines:insert(pandoc.Space())
    end
    inlines:insert(pandoc.Str(item))
  end

  return inlines
end

local function lang_badge_value(lang)
  if lang == "es" then
    return "ES"
  end

  if lang == "en" then
    return "EN"
  end

  return nil
end

local function lang_badge(lang)
  local label = lang_badge_value(lang)
  if not label then
    return nil
  end

  return pandoc.Span(
    { pandoc.Str(label) },
    pandoc.Attr("", { "lang-badge", "lang-badge--" .. lang })
  )
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
  local date = stringify(meta_value(meta, "date")) or stringify(meta_value(meta, "year"))
  local lang = stringify(meta_value(meta, "lang"))
  local content_type = stringify(meta_value(meta, "content_type"))
  local tags = meta_list(meta_value(meta, "tags"))

  if summary and summary ~= "" then
    blocks:insert(pandoc.Div({ pandoc.Para({ pandoc.Str(summary) }) }, pandoc.Attr("", { "writing-summary" })))
  end

  local meta_line = pandoc.List()
  if date and date ~= "" then
    meta_line:insert(pandoc.Span({ pandoc.Str(date) }, pandoc.Attr("", { "writing-meta-date" })))
  end

  local language_badge = lang_badge(lang)
  if language_badge then
    meta_line:insert(language_badge)
  end
  if #tags > 0 then
    meta_line:insert(pandoc.Span(inline_list_with_separator(tags, "/"), pandoc.Attr("", { "writing-meta-tags" })))
  end

  if #meta_line > 0 then
    local inlines = pandoc.List()
    for i, item in ipairs(meta_line) do
      if i > 1 then
        inlines:insert(pandoc.Str(" "))
        inlines:insert(pandoc.Str("·"))
        inlines:insert(pandoc.Str(" "))
      end
      inlines:insert(item)
    end
    blocks:insert(pandoc.Div({ pandoc.Para(inlines) }, pandoc.Attr("", { "writing-meta-line" })))
  end

  return blocks
end

function Pandoc(doc)
  if is_project_page(doc.meta) or is_writing_page(doc.meta) then
    local intro = blocks_for_writing(doc.meta)
    local tail = related_blocks(doc.meta)
    intro:extend(doc.blocks)
    intro:extend(tail)
    doc.blocks = intro
    return doc
  end

  return doc
end
