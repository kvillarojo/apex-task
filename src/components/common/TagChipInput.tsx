import React, { useRef } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { normalizeTagName, filterTagSuggestions } from '../../utils/tagUtils';

export interface TagChipInputProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  getTagColor: (tag: string) => string;
  placeholder?: string;
  inputClassName?: string;
}

export const TagChipInput: React.FC<TagChipInputProps> = ({
  tags,
  tagInput,
  onTagInputChange,
  onTagsChange,
  availableTags,
  getTagColor,
  placeholder = 'Type tag and press Enter...',
  inputClassName = 'form-input form-input-tag'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = filterTagSuggestions(availableTags, tagInput, tags);
  const cleanInput = normalizeTagName(tagInput);

  // Position the fixed dropdown flush below the input regardless of overflow context
  const getDropdownStyle = (): React.CSSProperties => {
    if (!inputRef.current) return {};
    const rect = inputRef.current.getBoundingClientRect();
    return { top: rect.bottom + 4, left: rect.left, width: rect.width };
  };

  const selectSuggestion = (tagToSelect: string) => {
    if (!tags.includes(tagToSelect)) {
      onTagsChange([...tags, tagToSelect]);
    }
    onTagInputChange('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0]);
      return;
    }
    if (cleanInput && !tags.includes(cleanInput)) {
      onTagsChange([...tags, cleanInput]);
    }
    onTagInputChange('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="tags-container">
      <div className="tags-list">
        {tags.map(tag => {
          const color = getTagColor(tag);
          return (
            <span
              key={tag}
              className="badge"
              style={{
                color,
                backgroundColor: `${color}18`,
                borderColor: `${color}40`
              }}
            >
              <TagIcon size={12} /> #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="badge-close-btn"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={tagInput}
          onChange={event => onTagInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClassName}
        />
        {suggestions.length > 0 && (
          <div className="tag-suggestions" style={getDropdownStyle()}>
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={event => {
                  // Prevent the input from losing focus before the click registers,
                  // which would collapse the dropdown before selectSuggestion fires.
                  event.preventDefault();
                  selectSuggestion(suggestion);
                }}
                className="suggestion-item"
              >
                <TagIcon size={12} />
                <span>#{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
