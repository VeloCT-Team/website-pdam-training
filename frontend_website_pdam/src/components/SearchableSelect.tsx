import Select, { type StylesConfig } from 'react-select';
import { Text } from '@chakra-ui/react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const SearchableSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  isLoading = false,
}: SearchableSelectProps) => {
  // Custom styles untuk match dengan Chakra UI theme
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderRadius: '6px',
      borderColor: state.isFocused ? '#2A4D88' : '#D1D5DB',
      backgroundColor: isDisabled ? '#E5E7EB' : '#F9FAFB',
      boxShadow: state.isFocused ? '0 0 0 1px #2A4D88' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#2A4D88' : '#9CA3AF',
      },
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1F2937',
      fontSize: '16px',
    }),
    input: (provided) => ({
      ...provided,
      color: '#1F2937',
      fontSize: '16px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      zIndex: 10,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#2A4D88'
        : state.isFocused
        ? '#E5E7EB'
        : 'white',
      color: state.isSelected ? 'white' : '#1F2937',
      cursor: 'pointer',
      fontSize: '16px',
      '&:active': {
        backgroundColor: '#2A4D88',
      },
    }),
    loadingMessage: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: '#6B7280',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: '#6B7280',
    }),
  };

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div>
      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
        {label}{' '}
        {isRequired && (
          <Text as="span" color="red.500">
            *
          </Text>
        )}
      </Text>
      <Select
        styles={customStyles}
        options={options}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || '')}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable
        isSearchable
        noOptionsMessage={() => 'Tidak ada data'}
        loadingMessage={() => 'Memuat data...'}
      />
    </div>
  );
};

export default SearchableSelect;
