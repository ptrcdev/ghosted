import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { STATUS_OPTIONS, SORT_OPTIONS, type ApplicationStatus, type SortOption } from '../../types/application';

interface ApplicationFiltersProps {
  statusFilter: ApplicationStatus | 'all';
  onStatusFilterChange: (value: ApplicationStatus | 'all') => void;
  sortOption: SortOption;
  onSortOptionChange: (value: SortOption) => void;
}

export function ApplicationFilters({
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Statuses</SelectItem>
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortOption} onValueChange={onSortOptionChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {SORT_OPTIONS.map((sort) => (
            <SelectItem key={sort.value} value={sort.value}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
