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
  Select,
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
  const [sortBy, setSortBy] = React.useState('cvss_score');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [autoSort, setAutoSort] = React.useState(true);

  React.useEffect(() => {
    if (!autoSort) return;

    const sortedFindings = sortFindings(findings, sortBy);

    onSort(sortedFindings);
  }, [findings, sortBy, sortDirection, autoSort, onSort]);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const parseCVSSVector = (vector: string | undefined): Record<string, string> => {
    if (!vector) return {};
    const metrics = vector.split('/').reduce((acc, metric) => {
      const [key, value] = metric.split(':');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    return metrics;
  };

  const sortFindings = (findings: Finding[], sortBy: string): Finding[] => {
    return [...findings].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, informational: 0 };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;

        case 'cvss_score':
          aValue = a.cvss_score;
          bValue = b.cvss_score;
          break;

        case 'exploit_maturity': {
          const aMetrics = parseCVSSVector(a.cvss_vector);
          const bMetrics = parseCVSSVector(b.cvss_vector);
          aValue = aMetrics['E'] === 'X' ? 0 : 1;
          bValue = bMetrics['E'] === 'X' ? 0 : 1;
          break;
        }

        case 'confidentiality_requirement': {
          const aMetrics = parseCVSSVector(a.cvss_vector);
          const bMetrics = parseCVSSVector(b.cvss_vector);
          aValue = aMetrics['CR'] === 'X' ? 0 : 1;
          bValue = bMetrics['CR'] === 'X' ? 0 : 1;
          break;
        }

        case 'remediation_level': {
          const aMetrics = parseCVSSVector(a.cvss_vector);
          const bMetrics = parseCVSSVector(b.cvss_vector);
          aValue = aMetrics['RL'] === 'X' ? 0 : 1;
          bValue = bMetrics['RL'] === 'X' ? 0 : 1;
          break;
        }

        default:
          return 0;
      }

      return bValue - aValue;
    });
  };

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
            <Select onChange={handleSort} placeholder="Sort by...">
              <option value="severity">Severity</option>
              <option value="cvss_score">CVSS Score</option>
              <option value="exploit_maturity">Exploit Maturity</option>
              <option value="confidentiality_requirement">Confidentiality Requirement</option>
              <option value="remediation_level">Remediation Level</option>
            </Select>

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