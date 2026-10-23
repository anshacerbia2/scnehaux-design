# Table

Table presents records in rows for comparison; it lives in the flat material.

## Usage

- Provide `columns` (header, alignment — `end` for numbers, `shrink` for checkbox and action columns) and `rows`; optional selection, sorting and a row action menu.
- The frame is the flat material (raised fill, radius container 16, ring). Headers are eyebrows (mono, uppercase, +0.12em, subtle text) on `ds-color-neutral-surface-subtle-default`, 36px. Body rows are 44px (`ds-dimension-size-row-table`), data-compact, hairlines between rows, hover `ds-color-neutral-surface-subtle-hover`, selected `ds-color-primary-surface-subtle-default`.
- Numbers: end-aligned, tabular figures. Status: a Badge with a dot and a word.

## Status

Planned (intentional addition). Build it to this card: a `Table` (native table semantics; APG grid only when cells are interactive).
