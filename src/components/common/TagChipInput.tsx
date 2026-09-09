import React from 'react';
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
  const suggestions = filterTagSuggestions(availableTags, tagInput, tags);
  const cleanInput = normalizeTagName(tagInput);

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

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={tagInput}
          onChange={event => onTagInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClassName}
        />
        {suggestions.length > 0 && (
          <div className="tag-suggestions">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
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
