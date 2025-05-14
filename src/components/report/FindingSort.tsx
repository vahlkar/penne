import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  IconButton,
  VStack,
  HStack,
  Text,
  Switch,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';
import { FiArrowUp, FiArrowDown, FiBarChart2 } from 'react-icons/fi';
import { Finding } from '../../utils/db';

interface FindingSortProps {
  findings: Finding[];
  onSort: React.Dispatch<React.SetStateAction<Finding[]>>;
}

const FindingSort: React.FC<FindingSortProps> = ({
  findings,
  onSort,
}) => {
  const [sortBy, setSortBy] = React.useState('cvss');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [autoSort, setAutoSort] = React.useState(true);

  React.useEffect(() => {
    if (!autoSort) return;

    const sortedFindings = [...findings].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'cvss':
          aValue = a.cvssScore;
          bValue = b.cvssScore;
          break;
        case 'cvss-temporal':
          aValue = a.cvssVector.exploitCodeMaturity === 'not-defined' ? 0 : 1;
          bValue = b.cvssVector.exploitCodeMaturity === 'not-defined' ? 0 : 1;
          break;
        case 'cvss-environmental':
          aValue = a.cvssVector.confidentialityRequirement === 'not-defined' ? 0 : 1;
          bValue = b.cvssVector.confidentialityRequirement === 'not-defined' ? 0 : 1;
          break;
        case 'priority':
          aValue = a.cvssScore;
          bValue = b.cvssScore;
          break;
        case 'remediation':
          aValue = a.cvssVector.remediationLevel === 'not-defined' ? 0 : 1;
          bValue = b.cvssVector.remediationLevel === 'not-defined' ? 0 : 1;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    onSort(sortedFindings);
  }, [findings, sortBy, sortDirection, autoSort, onSort]);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          aria-label="Sort findings"
          icon={<FiBarChart2 />}
          size="sm"
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent width="300px">
        <PopoverBody p={4}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text>Automatic Sorting</Text>
              <Switch
                isChecked={autoSort}
                onChange={(e) => setAutoSort(e.target.checked)}
              />
            </HStack>

            <Text fontWeight="bold">Sort By</Text>
            <RadioGroup value={sortBy} onChange={setSortBy}>
              <VStack align="stretch" spacing={2}>
                <Radio value="cvss">CVSS Score</Radio>
                <Radio value="cvss-temporal">CVSS Temporal Score</Radio>
                <Radio value="cvss-environmental">CVSS Environmental Score</Radio>
                <Radio value="priority">Priority</Radio>
                <Radio value="remediation">Remediation Difficulty</Radio>
              </VStack>
            </RadioGroup>

            <HStack justify="space-between">
              <Text>Direction</Text>
              <HStack>
                <IconButton
                  aria-label="Sort ascending"
                  icon={<FiArrowUp />}
                  size="sm"
                  variant={sortDirection === 'asc' ? 'solid' : 'ghost'}
                  onClick={() => setSortDirection('asc')}
                />
                <IconButton
                  aria-label="Sort descending"
                  icon={<FiArrowDown />}
                  size="sm"
                  variant={sortDirection === 'desc' ? 'solid' : 'ghost'}
                  colorScheme={sortDirection === 'desc' ? 'green' : undefined}
                  onClick={() => setSortDirection('desc')}
                />
              </HStack>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FindingSort; 