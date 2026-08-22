# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../lib/reading'

class ReadingTest < Minitest::Test
  def book(title, slug: nil, authors: ['A. Author'], cover: 'https://cdn/x.jpg')
    {
      'book' => {
        'title' => title,
        'slug' => slug || title.downcase.gsub(' ', '-'),
        'image' => cover && { 'url' => cover },
        'contributions' => authors.map { |n| { 'author' => { 'name' => n } } }
      }
    }
  end

  def test_splits_shelves_by_status_id
    rows = [
      book('Now One').merge('status_id' => 2, 'last_read_date' => nil),
      book('Done One').merge('status_id' => 3, 'last_read_date' => '2026-07-14')
    ]
    result = Reading.build(rows, updated: '2026-08-21')

    assert_equal ['Now One'], result['current'].map { |b| b['title'] }
    assert_equal ['Done One'], result['read'].map { |b| b['title'] }
    assert_equal '2026-08-21', result['updated']
  end

  def test_maps_fields_and_builds_book_url
    rows = [book('The Hindus', slug: 'the-hindus', authors: ['Wendy Doniger'],
                 cover: 'https://cdn/h.jpg').merge('status_id' => 2)]
    entry = Reading.build(rows)['current'].first

    assert_equal 'The Hindus', entry['title']
    assert_equal 'Wendy Doniger', entry['authors']
    assert_equal 'https://cdn/h.jpg', entry['cover']
    assert_equal 'https://hardcover.app/books/the-hindus', entry['url']
  end

  def test_joins_multiple_authors_and_dedupes
    rows = [book('Two', authors: ['Ann Lee', 'Bo Ray', 'Ann Lee']).merge('status_id' => 2)]
    assert_equal 'Ann Lee, Bo Ray', Reading.build(rows)['current'].first['authors']
  end

  def test_read_shelf_sorts_newest_finished_first
    rows = [
      book('Older').merge('status_id' => 3, 'last_read_date' => '2025-01-02'),
      book('Newer').merge('status_id' => 3, 'last_read_date' => '2026-05-09'),
      book('Undated').merge('status_id' => 3, 'last_read_date' => nil)
    ]
    assert_equal %w[Newer Older Undated], Reading.build(rows)['read'].map { |b| b['title'] }
  end

  def test_survives_missing_cover_author_and_book
    rows = [
      { 'status_id' => 2, 'book' => { 'title' => 'Bare', 'slug' => 'bare' } },
      { 'status_id' => 2, 'book' => nil }
    ]
    entries = Reading.build(rows)['current']

    assert_equal 1, entries.length
    assert_equal 'Bare', entries.first['title']
    assert_nil entries.first['cover']
    assert_nil entries.first['authors']
  end

  def test_owned_shelf_collects_owned_books_across_statuses
    rows = [
      book('Reading And Owned').merge('status_id' => 2, 'owned' => true),
      book('Read And Owned').merge('status_id' => 3, 'owned' => true, 'last_read_date' => '2026-03-01'),
      book('Borrowed').merge('status_id' => 2, 'owned' => false),
      book('Wishlisted But Owned').merge('status_id' => 1, 'owned' => true)
    ]
    result = Reading.build(rows)
    owned = result['owned'].map { |b| b['title'] }

    assert_includes owned, 'Reading And Owned'
    assert_includes owned, 'Read And Owned'
    refute_includes owned, 'Borrowed'
    refute_includes owned, 'Wishlisted But Owned', 'owned shelf should still respect tracked statuses'
  end

  def test_owned_books_still_appear_on_their_own_shelf
    rows = [book('Both Places').merge('status_id' => 2, 'owned' => true)]
    result = Reading.build(rows)

    assert_equal ['Both Places'], result['current'].map { |b| b['title'] }
    assert_equal ['Both Places'], result['owned'].map { |b| b['title'] }
  end

  def test_owned_flag_is_not_written_into_entries
    rows = [book('Mine').merge('status_id' => 2, 'owned' => true)]
    refute_includes Reading.build(rows)['owned'].first.keys, 'owned'
  end

  def test_owned_is_empty_when_nothing_is_owned
    rows = [book('None').merge('status_id' => 2, 'owned' => false)]
    assert_empty Reading.build(rows)['owned']
  end

  def test_ignores_other_statuses
    rows = [book('Someday').merge('status_id' => 1)]
    result = Reading.build(rows)
    assert_empty result['current']
    assert_empty result['read']
  end
end
