# frozen_string_literal: true

# Pure transforms for the Hardcover reading shelf. Kept free of network and
# filesystem access so script/fetch-reading stays a thin wrapper around it.
module Reading
  CURRENTLY_READING = 2
  READ = 3

  # Carried through the pipeline for grouping and ordering, then dropped so the
  # committed JSON holds only what the page renders.
  SORT_ONLY_KEYS = %w[status_id owned].freeze

  # The shelves we pull; anything else on the account is ignored entirely.
  TRACKED_STATUSES = [CURRENTLY_READING, READ].freeze

  module_function

  # Turns raw Hardcover `user_books` rows into the shape _data/reading.json
  # holds. Rows with no book attached are dropped rather than half-rendered.
  def build(rows, updated: nil)
    entries = Array(rows).filter_map { |row| entry(row) }

    {
      'updated' => updated,
      'current' => entries.select { |e| e['status_id'] == CURRENTLY_READING }
                          .map { |e| present(e) },
      'read' => newest_first(entries.select { |e| e['status_id'] == READ })
                .map { |e| present(e) },
      'owned' => newest_first(entries.select { |e| e['owned'] && TRACKED_STATUSES.include?(e['status_id']) })
                 .map { |e| present(e) }
    }
  end

  # Most recently finished first; books with no finish date trail behind in the
  # order Hardcover gave us.
  def newest_first(entries)
    dated, undated = entries.partition { |e| e['finished'] }
    dated.sort_by { |e| e['finished'].to_s }.reverse + undated
  end

  def entry(row)
    book = row && row['book']
    return nil if book.nil?

    title = book['title']
    return nil if title.to_s.empty?

    {
      'status_id' => row['status_id'],
      'owned' => row['owned'] == true,
      'title' => title,
      'authors' => authors(book['contributions']),
      'cover' => book.dig('image', 'url'),
      'url' => book['slug'] && "https://hardcover.app/books/#{book['slug']}",
      'finished' => row['last_read_date']
    }
  end

  def authors(contributions)
    names = Array(contributions).filter_map { |c| c.dig('author', 'name') }.uniq
    names.empty? ? nil : names.join(', ')
  end

  # Drops the sort-only key so the committed JSON stays minimal.
  def present(entry)
    entry.reject { |key, value| SORT_ONLY_KEYS.include?(key) || value.nil? }
  end

  # Renders a GraphQL introspection type reference as a readable name.
  def type_label(type)
    return nil if type.nil?

    type['name'] || type_label(type['ofType'])
  end
end
