import ReactPaginateModule from 'react-paginate';
import css from './Pagination.module.css';

type ReactPaginateComponent = typeof ReactPaginateModule;

const reactPaginateExport = ReactPaginateModule as unknown as
  | ReactPaginateComponent
  | { default: ReactPaginateComponent };

const ReactPaginate =
  typeof reactPaginateExport === 'object' && 'default' in reactPaginateExport
    ? reactPaginateExport.default
    : reactPaginateExport;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
      ariaLabelBuilder={(pageNumber) => `Go to page ${pageNumber}`}
      previousAriaLabel="Go to previous page"
      nextAriaLabel="Go to next page"
    />
  );
}

export default Pagination;
